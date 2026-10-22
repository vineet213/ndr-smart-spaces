/**
 * Website chatbot client. Posts the conversation to /api/chat.php (or
 * NEXT_PUBLIC_CHAT_ENDPOINT, the local stand-in in development) and reads the
 * streamed reply, handing each text chunk to `onText` as it arrives.
 */

export type ChatRole = "user" | "model";
export type ChatMessage = { role: ChatRole; text: string };

export type ChatError = "network" | "busy" | "rate_limited" | "disabled";

const ENDPOINT = process.env.NEXT_PUBLIC_CHAT_ENDPOINT || "/api/chat.php";

/** Marker the assistant ends a reply with when the enquiry card should be offered. */
export const ENQUIRY_MARKER = "[[ENQUIRY]]";

export async function streamChat(
  messages: ChatMessage[],
  onText: (chunk: string) => void,
  signal: AbortSignal,
): Promise<{ ok: true } | { ok: false; error: ChatError }> {
  let response: Response;
  try {
    response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
      signal,
    });
  } catch {
    return { ok: false, error: "network" };
  }
  if (response.status === 429) return { ok: false, error: "rate_limited" };
  if (response.status === 503) return { ok: false, error: "disabled" };
  if (!response.ok || !response.body) return { ok: false, error: "busy" };

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let received = false;
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let end: number;
      while ((end = buffer.indexOf("\n\n")) !== -1) {
        const event = buffer.slice(0, end);
        buffer = buffer.slice(end + 2);
        const data = event.split("\n").find((line) => line.startsWith("data:"));
        if (!data) continue;
        const payload = JSON.parse(data.slice(5)) as { t?: string; done?: boolean; error?: string };
        if (payload.t) {
          received = true;
          onText(payload.t);
        }
        if (payload.done) return { ok: true };
        if (payload.error)
          return { ok: false, error: payload.error === "rate_limited" ? "rate_limited" : "busy" };
      }
    }
  } catch {
    if (signal.aborted) return { ok: true };
    return received ? { ok: true } : { ok: false, error: "network" };
  }
  return received ? { ok: true } : { ok: false, error: "busy" };
}

export const chatErrorText: Record<ChatError, string> = {
  network: "I couldn't reach the server. Please check your connection and try again.",
  busy: "I can't answer right now. Please try again in a moment, or reach the team on the [Contact](/contact/) page.",
  rate_limited:
    "You've sent a lot of messages in a short time. Please wait a few minutes, or use the [Contact](/contact/) page.",
  disabled:
    "The assistant is offline at the moment. You can reach the team on the [Contact](/contact/) page.",
};
