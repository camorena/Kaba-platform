import {
  CHAT_MAX_HISTORY_MESSAGES,
  CHAT_MAX_MESSAGE_CHARS,
} from "@/lib/chat/gateway";

export type ChatApiMessage = {
  role: "user" | "assistant";
  content: string;
};

export function normalizeChatMessages(raw: unknown): {
  messages: ChatApiMessage[];
  error?: string;
} {
  if (!Array.isArray(raw)) {
    return { messages: [], error: "messages must be an array." };
  }
  if (raw.length === 0) {
    return { messages: [], error: "messages cannot be empty." };
  }
  if (raw.length > CHAT_MAX_HISTORY_MESSAGES) {
    return {
      messages: [],
      error: `At most ${CHAT_MAX_HISTORY_MESSAGES} messages allowed.`,
    };
  }

  const messages: ChatApiMessage[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") {
      return { messages: [], error: "Each message must be an object." };
    }
    const role = (item as { role?: unknown }).role;
    const content = (item as { content?: unknown }).content;
    if (role !== "user" && role !== "assistant") {
      return { messages: [], error: "role must be user or assistant." };
    }
    if (typeof content !== "string") {
      return { messages: [], error: "content must be a string." };
    }
    const trimmed = content.trim().slice(0, CHAT_MAX_MESSAGE_CHARS);
    if (!trimmed) continue;
    messages.push({ role, content: trimmed });
  }

  if (messages.length === 0) {
    return { messages: [], error: "No usable messages after normalization." };
  }
  if (messages[messages.length - 1]?.role !== "user") {
    return { messages: [], error: "Last message must be from the user." };
  }
  return { messages };
}

export function lastUserText(messages: ChatApiMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "user") return messages[i].content;
  }
  return "";
}
