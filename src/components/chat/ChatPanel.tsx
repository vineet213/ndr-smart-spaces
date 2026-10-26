"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent, ReactNode } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui";
import { ENQUIRY_MARKER, chatErrorText, streamChat } from "@/lib/chat";
import type { ChatMessage } from "@/lib/chat";
import { officeDirectory } from "@/lib/data/contact";
import { contact } from "@/lib/data/homepage";
import { jumpToSection } from "@/lib/lenis";
import { canonicalHref, siteRoutes } from "@/lib/routes";
import { ChatEnquiryCard } from "./ChatEnquiryCard";
import styles from "./ChatPanel.module.css";

/**
 * "Ask NDR": the chat panel. A floating card on wider screens, a full-screen
 * sheet on phones. Replies stream in from /api/chat.php (see src/lib/chat.ts);
 * the conversation is kept in sessionStorage so it survives a reload.
 */

const STORAGE_KEY = "ndr-chat-v1";
const MAX_INPUT = 1000;
const STARTERS = [
  "Where are your warehouses?",
  "What does NDR Smart Spaces do?",
  "I'm looking for warehouse space",
  "How do I contact the team?",
];
/* Reaching a person without chatting first. Phone numbers stay hidden until the
   client confirms them (the same switch as the Contact page's office directory). */
const ENQUIRY_ID = "business-enquiry";
const ENQUIRY_HREF = canonicalHref(`/contact#${ENQUIRY_ID}`);
const CONTACT_EMAIL = contact.form.route.default;
const CONTACT_PHONE = officeDirectory.detailsConfirmed ? (officeDirectory.offices[0]?.phone ?? "") : "";
const GREETING =
  "Hello! I'm the NDR Smart Spaces assistant. Ask me about our warehouses and industrial parks, locations, ESG work or how to reach the team.";

type Entry = ChatMessage & { error?: boolean };

function loadHistory(): Entry[] {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(saved) ? saved.filter((m) => m && typeof m.text === "string") : [];
  } catch {
    return [];
  }
}

function saveHistory(entries: Entry[]) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(-30)));
  } catch {
    // Private mode or storage blocked: the chat still works for this page view.
  }
}

/* --- minimal, safe Markdown: paragraphs, "- " lists, **bold**, [links](/path/) --- */

/** Only real pages of this site become links; anything else the AI writes stays plain text. */
function isSitePage(href: string): boolean {
  if (!href.startsWith("/") || href.startsWith("//")) return false;
  const path = href.split(/[?#]/)[0].replace(/(.)\/$/, "$1");
  return siteRoutes.includes(path);
}

/** Hides the enquiry marker, including a half-arrived "[[ENQ…" while a reply streams. */
function visibleText(text: string): string {
  return text.replace(ENQUIRY_MARKER, "").replace(/\[\[?[A-Z]*\]?$/, "");
}

function inline(text: string, onNavigate: () => void, key: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let index = 0;
  while ((match = pattern.exec(text))) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const id = `${key}-${index++}`;
    if (match[1]) {
      nodes.push(<strong key={id}>{match[1]}</strong>);
    } else if (isSitePage(match[3]) || isSitePage(match[2])) {
      // Some models write the path as the link text, e.g. [/contact/](#).
      const href = isSitePage(match[3]) ? match[3] : match[2];
      nodes.push(
        <Link key={id} href={canonicalHref(href)} className={styles.link} onClick={onNavigate}>
          {match[2]}
        </Link>,
      );
    } else if (/^(mailto:|tel:)/.test(match[3])) {
      nodes.push(
        <a key={id} href={match[3]} className={styles.link}>
          {match[2]}
        </a>,
      );
    } else {
      nodes.push(match[2]);
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function Rich({ text, onNavigate }: { text: string; onNavigate: () => void }) {
  const blocks = text.trim().split(/\n{2,}/);
  return (
    <>
      {blocks.map((block, b) => {
        const lines = block.split("\n").filter((line) => line.trim());
        if (lines.length && lines.every((line) => /^\s*([-*•]|\d+\.)\s+/.test(line))) {
          return (
            <ul key={b} className={styles.list}>
              {lines.map((line, l) => (
                <li key={l}>
                  {inline(line.replace(/^\s*([-*•]|\d+\.)\s+/, ""), onNavigate, `${b}-${l}`)}
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={b}>
            {lines.map((line, l) => (
              <span key={l}>
                {l > 0 ? <br /> : null}
                {inline(
                  line.replace(/^#+\s*/, "").replace(/^\s*([-*•])\s+/, "• "),
                  onNavigate,
                  `${b}-${l}`,
                )}
              </span>
            ))}
          </p>
        );
      })}
    </>
  );
}

type ChatPanelProps = { open: boolean; onClose: () => void };

export function ChatPanel({ open, onClose }: ChatPanelProps) {
  // Client-only component (loaded with ssr: false), so storage can be read during render.
  const [entries, setEntries] = useState<Entry[]>(loadHistory);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [enquiryAt, setEnquiryAt] = useState<number | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const stickRef = useRef(true);
  // Bumped by "New chat", so a reply still streaming for the old chat is dropped.
  const runRef = useRef(0);

  const isSheet = () => window.matchMedia("(max-width: 599px)").matches;

  // Phones: the sheet covers the page, so lock page scroll like the site's other drawers.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const sheet = isSheet();
    if (sheet) root.classList.add("drawer-open", "chat-open");
    const timer = window.setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 60);
    return () => {
      window.clearTimeout(timer);
      if (sheet) root.classList.remove("drawer-open", "chat-open");
    };
  }, [open]);

  // Keep the newest text in view while it streams, unless the reader scrolled up.
  useEffect(() => {
    const list = listRef.current;
    if (list && stickRef.current) list.scrollTop = list.scrollHeight;
  }, [entries, enquiryAt, open]);

  const close = useCallback(() => {
    onClose();
    // After the re-render, once the launcher is visible and focusable again.
    window.requestAnimationFrame(() =>
      document
        .querySelector<HTMLElement>("[aria-controls='ask-ndr']")
        ?.focus({ preventScroll: true }),
    );
  }, [onClose]);

  // A link in a reply: on phones the sheet hides the page, so get out of the way.
  const onNavigate = useCallback(() => {
    if (isSheet()) onClose();
  }, [onClose]);

  async function send(text: string) {
    const question = text.trim().slice(0, MAX_INPUT);
    if (!question || streaming) return;
    const history: Entry[] = [
      ...entries.filter((entry) => !entry.error),
      { role: "user", text: question },
    ];
    setEntries([...history, { role: "model", text: "" }]);
    setInput("");
    setEnquiryAt(null);
    setStreaming(true);
    stickRef.current = true;

    const run = ++runRef.current;
    const controller = new AbortController();
    abortRef.current = controller;
    let reply = "";
    const result = await streamChat(
      history.map(({ role, text: body }) => ({
        role,
        text: body.replace(ENQUIRY_MARKER, "").trim(),
      })),
      (chunk) => {
        if (run !== runRef.current) return;
        reply += chunk;
        setEntries([...history, { role: "model", text: reply }]);
      },
      controller.signal,
    );
    if (run !== runRef.current) return;
    abortRef.current = null;
    setStreaming(false);
    // Stopped before any words arrived: keep the question, drop the empty reply.
    const final: Entry[] = !result.ok
      ? [...history, { role: "model", text: chatErrorText[result.error], error: true }]
      : reply.trim()
        ? [...history, { role: "model", text: reply.trim() }]
        : history;
    setEntries(final);
    saveHistory(final.filter((entry) => !entry.error));
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void send(input);
  }

  function onInputKey(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      void send(input);
    }
  }

  function onPanelKey(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.stopPropagation();
      close();
      return;
    }
    // Full-screen sheet: keep Tab inside it.
    if (event.key !== "Tab" || !isSheet() || !panelRef.current) return;
    const focusable = [
      ...panelRef.current.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled]), textarea, input:not([type=hidden]), select",
      ),
    ].filter((el) => el.offsetParent !== null && el.tabIndex >= 0);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  function reset() {
    runRef.current++;
    abortRef.current?.abort();
    abortRef.current = null;
    setStreaming(false);
    setEntries([]);
    setEnquiryAt(null);
    saveHistory([]);
    inputRef.current?.focus();
  }

  const lastModel = entries.length - 1;
  const showEnquiryOffer = (index: number) =>
    !streaming &&
    index === lastModel &&
    entries[index].role === "model" &&
    (entries[index].text.includes(ENQUIRY_MARKER) || Boolean(entries[index].error));

  return (
    <div
      id="ask-ndr"
      ref={panelRef}
      className={`${styles.panel} ${open ? styles.open : ""}`}
      role="dialog"
      aria-label="Ask NDR chat"
      aria-hidden={!open}
      inert={!open}
      onKeyDown={onPanelKey}
    >
      <header className={styles.header}>
        <div>
          <p className={styles.title}>Ask NDR</p>
          <p className={styles.subtitle}>AI assistant</p>
        </div>
        <div className={styles.actions}>
          {entries.length ? (
            <button type="button" className={styles.textButton} onClick={reset}>
              New chat
            </button>
          ) : null}
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Close chat"
            onClick={close}
          >
            <Icon name="close" />
          </button>
        </div>
      </header>

      <div className={styles.quick} role="group" aria-label="Contact the team">
        {/* The panel would cover the form, so it closes on the way there. */}
        <Link
          className={styles.starter}
          href={ENQUIRY_HREF}
          onClick={(event) => {
            onClose();
            // Already on the Contact page: no page change to scroll after, so jump now.
            if (window.location.pathname === ENQUIRY_HREF.split("#")[0]) {
              event.preventDefault();
              window.history.replaceState(window.history.state, "", ENQUIRY_HREF);
              jumpToSection(ENQUIRY_ID);
            }
          }}
        >
          Send an enquiry
        </Link>
        <a className={styles.starter} href={`mailto:${CONTACT_EMAIL}`}>
          Email us
        </a>
        {CONTACT_PHONE ? (
          <a className={styles.starter} href={`tel:${CONTACT_PHONE.replace(/\s+/g, "")}`}>
            Call us
          </a>
        ) : null}
      </div>

      <div
        ref={listRef}
        className={styles.messages}
        data-lenis-prevent
        onScroll={(event) => {
          const list = event.currentTarget;
          stickRef.current = list.scrollHeight - list.scrollTop - list.clientHeight < 40;
        }}
      >
        <div className={`${styles.bubble} ${styles.model}`}>
          <p>{GREETING}</p>
        </div>

        {entries.length === 0 ? (
          <div className={styles.starters}>
            {STARTERS.map((starter) => (
              <button
                key={starter}
                type="button"
                className={styles.starter}
                onClick={() => void send(starter)}
              >
                {starter}
              </button>
            ))}
          </div>
        ) : null}

        <div aria-live="polite" aria-busy={streaming} className={styles.thread}>
          {entries.map((entry, index) => (
            <div key={index} className={styles.turn}>
              <div
                className={`${styles.bubble} ${entry.role === "user" ? styles.user : styles.model} ${entry.error ? styles.errorBubble : ""}`}
              >
                {entry.role === "user" ? (
                  <p>{entry.text}</p>
                ) : entry.text ? (
                  <Rich text={visibleText(entry.text)} onNavigate={onNavigate} />
                ) : (
                  <span className={styles.typing} aria-label="Assistant is typing">
                    <span />
                    <span />
                    <span />
                  </span>
                )}
              </div>
              {showEnquiryOffer(index) && enquiryAt !== index ? (
                <button
                  type="button"
                  className={styles.enquiryOffer}
                  onClick={() => setEnquiryAt(index)}
                >
                  Talk to the team
                  <Icon name="arrow-right" size="sm" />
                </button>
              ) : null}
              {enquiryAt === index ? (
                <ChatEnquiryCard
                  summary={entries
                    .filter((e) => e.role === "user")
                    .map((e) => `- ${e.text}`)
                    .slice(-4)
                    .join("\n")}
                />
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <form className={styles.composer} onSubmit={onSubmit}>
        <label htmlFor="ask-ndr-input" className="visually-hidden">
          Your question
        </label>
        <textarea
          id="ask-ndr-input"
          ref={inputRef}
          className={styles.input}
          rows={1}
          maxLength={MAX_INPUT}
          placeholder="Ask a question…"
          enterKeyHint="send"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={onInputKey}
        />
        {streaming ? (
          <button
            type="button"
            className={styles.send}
            aria-label="Stop answering"
            onClick={() => abortRef.current?.abort()}
          >
            <span className={styles.stop} />
          </button>
        ) : (
          <button type="submit" className={styles.send} aria-label="Send" disabled={!input.trim()}>
            <Icon name="arrow-right" />
          </button>
        )}
      </form>
      <p className={styles.disclaimer}>
        AI can make mistakes. Please confirm details with our team.
      </p>
    </div>
  );
}
