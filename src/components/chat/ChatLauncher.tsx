"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import styles from "./ChatLauncher.module.css";

/**
 * The always-present "Ask NDR" button. Only this tiny button ships with every
 * page: the chat panel's code is fetched when the browser is idle (so the first
 * click opens instantly) or on the first click, whichever comes first. Once
 * opened, the panel stays mounted (hidden when closed) so a reply that is still
 * streaming, or a half-typed message, survives closing and page navigation.
 */

const loadPanel = () => import("./ChatPanel");
const ChatPanel = dynamic(() => loadPanel().then((module) => module.ChatPanel), { ssr: false });

export function ChatLauncher() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const idle =
      window.requestIdleCallback ?? ((callback: () => void) => window.setTimeout(callback, 3000));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;
    const id = idle(() => void loadPanel(), { timeout: 8000 });
    return () => cancel(id);
  }, []);

  const toggle = () => {
    setMounted(true);
    setOpen((current) => !current);
  };

  return (
    <>
      <button
        type="button"
        className={`${styles.launcher} ${open ? styles.hidden : ""}`}
        aria-label="Ask NDR: chat with our assistant"
        aria-expanded={open}
        aria-controls="ask-ndr"
        tabIndex={open ? -1 : 0}
        onClick={toggle}
        onPointerEnter={() => void loadPanel()}
      >
        <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4h0A1.5 1.5 0 0 1 4 14.5Z" />
          <path d="M8.5 8.5h7M8.5 11.5h4.5" />
        </svg>
        <span className={styles.label}>Ask NDR</span>
      </button>
      {mounted ? <ChatPanel open={open} onClose={() => setOpen(false)} /> : null}
    </>
  );
}
