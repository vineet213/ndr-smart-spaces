/**
 * Local stand-in for public/api/chat.php (no PHP needed).
 *
 * Same request and streamed-event contract, the same knowledge selection and
 * system prompt, and the same Gemini → Groq order. With keys in
 * public/api/config.php (the same git-ignored file as on the server, 'chat'
 * block) or in GEMINI_API_KEY / GROQ_API_KEY it calls the real services, read
 * fresh on every message so new keys need no restart; without keys it streams a
 * canned reply naming the site sections it would have sent, so the chat panel
 * can be built and tested offline.
 *
 * Knowledge is read from out/api/chat-knowledge.md (run `npm run build` once).
 *
 *   npm start            → serve-static.mjs routes POST /api/chat.php here
 *   npm run contact:mock → also serves /api/chat.php on http://localhost:3200 for `next dev`
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

const KNOWLEDGE = join(process.cwd(), "out", "api", "chat-knowledge.md");
const MAX_TURNS = 12;
const MAX_CHARS = 1000;
const STOP = new Set(
  "the and for you your are what which with have has how can does any about tell there this that from who where when ndr please want need know give its".split(
    " ",
  ),
);

/** Keys and models: environment first, then the 'chat' block of public/api/config.php. */
function settings() {
  let php = "";
  try {
    php = readFileSync(join(process.cwd(), "public", "api", "config.php"), "utf8");
  } catch {
    // no local config: environment only
  }
  const value = (name) => php.match(new RegExp(`'${name}'\\s*=>\\s*'([^']*)'`))?.[1] ?? "";
  // Each model setting may list several, comma-separated, tried in order (as chat.php).
  const list = (setting) =>
    setting
      .split(",")
      .map((model) => model.trim())
      .filter(Boolean);
  return {
    geminiKey: process.env.GEMINI_API_KEY || value("gemini_key"),
    geminiModels: list(
      process.env.GEMINI_MODEL ||
        value("gemini_model") ||
        "gemini-3.5-flash, gemini-flash-lite-latest",
    ),
    groqKey: process.env.GROQ_API_KEY || value("groq_key"),
    groqModels: list(process.env.GROQ_MODEL || value("groq_model") || "openai/gpt-oss-120b"),
  };
}

function knowledgeChunks() {
  let source = "";
  try {
    source = readFileSync(KNOWLEDGE, "utf8");
  } catch {
    console.warn("chat-mock: out/api/chat-knowledge.md missing, run `npm run build`.");
  }
  const chunks = [];
  for (const page of source.split("\n\n---\n\n")) {
    const head = page.match(/^# PAGE: (.*)\nURL: (.*)\n/);
    if (!head) continue;
    const label = `[${head[1]}](${head[2]})`;
    for (const part of page.slice(head[0].length).split(/\n(?=## )/)) {
      const text = part.trim();
      for (let i = 0; i < text.length; i += 3000)
        chunks.push({ label, text: text.slice(i, i + 3000) });
    }
  }
  return chunks;
}

function selectKnowledge(chunks, messages, budget) {
  const query = messages
    .filter((m) => m.role === "user")
    .slice(-2)
    .map((m) => m.text)
    .join(" ")
    .toLowerCase();
  const words = [...new Set(query.split(/[^\p{L}\p{N}]+/u))].filter(
    (w) => w.length > 2 && !STOP.has(w),
  );
  const size = (c) => c.text.length + c.label.length + 4;
  const total = chunks.reduce((sum, c) => sum + size(c), 0);
  const scored = chunks.map((chunk, i) => {
    const haystack = `${chunk.label} ${chunk.text}`.toLowerCase();
    let score = 0;
    for (const word of words) {
      const count = haystack.split(word).length - 1;
      score += count ? 1 + Math.log(count) : 0;
      if (!count && word.length > 4 && haystack.includes(word.slice(0, -1))) score += 0.5;
    }
    if (chunk.label.includes("(/)") || chunk.label.includes("(/contact/)")) score += 0.3;
    return { i, score };
  });
  if (total > budget) scored.sort((a, b) => b.score - a.score);
  const chosen = [];
  let used = 0;
  for (const { i } of scored) {
    if (used + size(chunks[i]) > budget) continue;
    chosen.push(i);
    used += size(chunks[i]);
  }
  chosen.sort((a, b) => a - b);
  return chosen.map((i) => `From ${chunks[i].label}:\n${chunks[i].text}`).join("\n\n");
}

/** The prompt text is kept in chat.php; read it from there so the two never drift apart. */
function systemPrompt(knowledge) {
  const php = readFileSync(join(process.cwd(), "public", "api", "chat.php"), "utf8");
  const template = php.match(/<<<PROMPT\n([\s\S]*?)\nPROMPT;/)?.[1] ?? "";
  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  return template.replace("{$today}", today).replace("{$knowledge}", knowledge);
}

async function* sseData(response) {
  const decoder = new TextDecoder();
  let buffer = "";
  for await (const chunk of response.body) {
    buffer += decoder.decode(chunk, { stream: true });
    let end;
    while ((end = buffer.indexOf("\n")) !== -1) {
      const line = buffer.slice(0, end).replace(/\r$/, "");
      buffer = buffer.slice(end + 1);
      if (!line.startsWith("data:")) continue;
      try {
        yield JSON.parse(line.slice(5).trim());
      } catch {
        // [DONE] and keep-alives
      }
    }
  }
}

async function streamFrom(url, headers, body, extract, emit, patienceSeconds) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), patienceSeconds * 1000);
  let sent = false;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (response.status !== 200) {
      console.warn(
        `chat-mock: ${new URL(url).host} answered ${response.status}: ${(await response.text()).slice(0, 300)}`,
      );
      return false;
    }
    for await (const payload of sseData(response)) {
      const text = extract(payload);
      if (!text) continue;
      if (!sent) clearTimeout(timer);
      sent = true;
      emit({ t: text });
    }
  } catch (error) {
    console.warn(
      `chat-mock: ${new URL(url).host} failed: ${error instanceof Error ? error.message : error}`,
    );
  } finally {
    clearTimeout(timer);
  }
  return sent;
}

const gemini = (key, model, messages, chunks) => {
  const thinking = model.startsWith("gemini-2.5")
    ? { thinkingBudget: 0 }
    : model.startsWith("gemini-3")
      ? { thinkingLevel: "minimal" }
      : null;
  return (emit) =>
    streamFrom(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:streamGenerateContent?alt=sse`,
      { "x-goog-api-key": key },
      {
        systemInstruction: {
          parts: [{ text: systemPrompt(selectKnowledge(chunks, messages, 60000)) }],
        },
        contents: messages.map((m) => ({ role: m.role, parts: [{ text: m.text }] })),
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 2048,
          ...(thinking ? { thinkingConfig: thinking } : {}),
        },
      },
      (p) =>
        (p.candidates?.[0]?.content?.parts ?? [])
          .map((part) => (part.thought ? "" : (part.text ?? "")))
          .join(""),
      emit,
      8,
    );
};

const groq = (key, model, messages, chunks) => (emit) =>
  streamFrom(
    "https://api.groq.com/openai/v1/chat/completions",
    { Authorization: `Bearer ${key}` },
    {
      model,
      stream: true,
      temperature: 0.3,
      max_tokens: 1500,
      ...(model.includes("gpt-oss") ? { reasoning_effort: "low" } : {}),
      messages: [
        { role: "system", content: systemPrompt(selectKnowledge(chunks, messages, 14000)) },
        ...messages.map((m) => ({
          role: m.role === "model" ? "assistant" : "user",
          content: m.text,
        })),
      ],
    },
    (p) => p.choices?.[0]?.delta?.content ?? "",
    emit,
    15,
  );

/** Offline reply: shows which sections the real model would have been given. */
const canned = (messages, chunks) => async (emit) => {
  const question = messages.at(-1).text;
  const sources = [
    ...new Set(
      selectKnowledge(chunks, messages, 6000).match(/^From (\[[^\]]+\]\([^)]+\)):/gm) ?? [],
    ),
  ]
    .map((line) => line.slice(5, -1))
    .slice(0, 3);
  const wantsContact = /lease|rent|space|visit|call|contact|invest|partner|job|career|enquir/i.test(
    question,
  );
  const reply =
    `This is the **offline test reply** (no AI keys set). For "${question.slice(0, 80)}" the bot would read: ` +
    (sources.length ? sources.join(", ") : "[Home](/)") +
    ".\n\n- Paste your keys into public/api/config.php to get real answers." +
    (wantsContact ? "\n\n[[ENQUIRY]]" : "");
  for (const piece of reply.match(/\S+\s*/g) ?? []) {
    emit({ t: piece });
    await new Promise((resolve) => setTimeout(resolve, 25));
  }
  return true;
};

/** Handles one POST to the chat endpoint. */
export async function handleChat(req, res, { cors = false } = {}) {
  const corsHeaders = cors ? { "Access-Control-Allow-Origin": "*" } : {};
  if (req.method === "OPTIONS" && cors) {
    res.writeHead(204, {
      ...corsHeaders,
      "Access-Control-Allow-Methods": "POST",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    return res.end();
  }
  const json = (status, body) => {
    res.writeHead(status, {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...corsHeaders,
    });
    res.end(JSON.stringify(body));
  };
  if (req.method !== "POST") return json(405, { error: "method" });

  const raw = [];
  for await (const chunk of req) raw.push(chunk);
  let input = {};
  try {
    input = JSON.parse(Buffer.concat(raw).toString("utf8"));
  } catch {
    // falls through to "invalid"
  }
  const messages = [];
  for (const m of (Array.isArray(input.messages) ? input.messages : []).slice(-MAX_TURNS)) {
    const role = m?.role === "model" ? "model" : "user";
    const text = String(m?.text ?? "")
      .slice(0, role === "user" ? MAX_CHARS : 4000)
      .trim();
    if (!text) continue;
    // Same as chat.php: merge back-to-back turns from one side; open with the visitor.
    if (messages.at(-1)?.role === role) messages.at(-1).text += `\n\n${text}`;
    else if (messages.length || role === "user") messages.push({ role, text });
  }
  if (!messages.length || messages.at(-1).role !== "user") return json(422, { error: "invalid" });

  res.writeHead(200, {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-store",
    ...corsHeaders,
  });
  const emit = (event) => res.write(`data: ${JSON.stringify(event)}\n\n`);
  const chunks = knowledgeChunks();
  const { geminiKey, geminiModels, groqKey, groqModels } = settings();
  const providers = [
    ...(geminiKey ? geminiModels.map((model) => gemini(geminiKey, model, messages, chunks)) : []),
    ...(groqKey ? groqModels.map((model) => groq(groqKey, model, messages, chunks)) : []),
  ];
  if (!providers.length) providers.push(canned(messages, chunks));

  for (const provider of providers) {
    if (await provider(emit)) {
      emit({ done: true });
      return res.end();
    }
  }
  emit({ error: "busy" });
  res.end();
}
