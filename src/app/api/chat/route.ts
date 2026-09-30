import { streamText } from "ai";
import { NextResponse } from "next/server";
import {
  CHAT_MAX_OUTPUT_TOKENS,
  CHAT_MODEL_ID,
  isAiGatewayConfigured,
} from "@/lib/chat/gateway";
import { chatLog } from "@/lib/chat/log";
import {
  lastUserText,
  normalizeChatMessages,
} from "@/lib/chat/messages";
import {
  checkChatRateLimit,
  clientKeyFromRequest,
} from "@/lib/chat/rate-limit";
import { buildChatSystemPrompt } from "@/lib/chat/system-prompt";
import {
  DEFAULT_CHATBOT_CATALOG,
  DEFAULT_SUGGESTIONS,
  getBotReply,
  type ChatReply,
} from "@/lib/chatbot";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function rulesJsonResponse(reply: ChatReply, reason?: string) {
  return NextResponse.json(
    {
      mode: "rules" as const,
      text: reply.text,
      suggestions: reply.suggestions ?? [...DEFAULT_SUGGESTIONS],
      cta: reply.cta ?? null,
      collectLead: Boolean(reply.collectLead),
      reason: reason ?? null,
    },
    {
      headers: {
        "Cache-Control": "no-store",
        "X-Kaba-Chat-Mode": "rules",
      },
    },
  );
}

export async function POST(request: Request) {
  const rate = checkChatRateLimit(clientKeyFromRequest(request));
  if (!rate.ok) {
    return NextResponse.json(
      {
        error: "Too many chat requests. Please wait a moment and try again.",
        mode: "error",
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rate.retryAfterSec),
          "Cache-Control": "no-store",
        },
      },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body.", mode: "error" },
      { status: 400 },
    );
  }

  const rawMessages =
    body && typeof body === "object"
      ? (body as { messages?: unknown }).messages
      : undefined;
  const { messages, error } = normalizeChatMessages(rawMessages);
  if (error) {
    return NextResponse.json(
      { error, mode: "error" },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  const catalog = DEFAULT_CHATBOT_CATALOG;
  const userText = lastUserText(messages);

  // Graceful no-op / rules path when gateway credentials are missing.
  if (!isAiGatewayConfigured()) {
    chatLog("info", "gateway unavailable — rules fallback");
    return rulesJsonResponse(
      getBotReply(userText, catalog),
      "AI_GATEWAY_API_KEY unset and not on Vercel OIDC; using rules engine.",
    );
  }

  try {
    const result = streamText({
      model: CHAT_MODEL_ID,
      system: buildChatSystemPrompt(catalog),
      messages,
      maxOutputTokens: CHAT_MAX_OUTPUT_TOKENS,
      temperature: 0.4,
      // No tools — never invent quotes via tool calling.
    });

    return result.toTextStreamResponse({
      headers: {
        "Cache-Control": "no-store",
        "X-Kaba-Chat-Mode": "llm",
        "X-Kaba-Chat-Model": CHAT_MODEL_ID,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    chatLog("warn", "LLM stream failed — rules fallback", {
      err: message.slice(0, 200),
    });
    return rulesJsonResponse(
      getBotReply(userText, catalog),
      "LLM unavailable; using rules engine.",
    );
  }
}
