"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FormEvent,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import {
  formatLeadConfirmation,
  getBotReply,
  WELCOME_REPLY,
  type ChatReply,
  type LeadPayload,
} from "@/lib/chatbot";
import { siteConfig } from "@/lib/site";

type Message = {
  id: string;
  role: "bot" | "user";
  text: string;
  cta?: ChatReply["cta"];
  suggestions?: string[];
  showLead?: boolean;
};

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const emptyLead: LeadPayload = {
  name: "",
  phone: "",
  email: "",
  message: "",
};

export default function ChatWidget() {
  const panelId = useId();
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: "welcome",
      role: "bot",
      text: WELCOME_REPLY.text,
      suggestions: WELCOME_REPLY.suggestions,
    },
  ]);
  const [input, setInput] = useState("");
  const [lead, setLead] = useState<LeadPayload>(emptyLead);
  const [leadErrors, setLeadErrors] = useState<Partial<Record<keyof LeadPayload, string>>>({});
  const [leadActive, setLeadActive] = useState(false);
  const [leadSent, setLeadSent] = useState(false);
  const [unread, setUnread] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const scrollToBottom = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, []);

  useEffect(() => {
    if (!open) return;
    // Focus close control shortly after open for keyboard users
    const t = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, leadActive, open, scrollToBottom]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        openButtonRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  function pushBot(reply: ChatReply) {
    setMessages((prev) => [
      ...prev,
      {
        id: uid(),
        role: "bot",
        text: reply.text,
        cta: reply.cta,
        suggestions: reply.suggestions,
        showLead: Boolean(reply.collectLead),
      },
    ]);
    if (reply.collectLead) {
      setLeadActive(true);
      setLeadSent(false);
    }
    if (!open) setUnread(true);
  }

  function handleUserText(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((prev) => [
      ...prev,
      { id: uid(), role: "user", text: trimmed },
    ]);
    setInput("");
    // Micro-delay so the user bubble paints before the bot reply
    window.setTimeout(() => {
      pushBot(getBotReply(trimmed));
    }, 180);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    handleUserText(input);
  }

  function validateLead(): boolean {
    const next: Partial<Record<keyof LeadPayload, string>> = {};
    if (!lead.name.trim()) next.name = "Name is required.";
    if (!lead.phone.trim()) next.phone = "Phone is required.";
    else if (!/^[\d\s().+-]{7,}$/.test(lead.phone.trim()))
      next.phone = "Enter a valid phone number.";
    if (lead.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email.trim()))
      next.email = "Enter a valid email.";
    setLeadErrors(next);
    return Object.keys(next).length === 0;
  }

  function onLeadSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validateLead()) return;
    // MVP: client-side only — log for future CRM wiring
    console.info("[chat-lead]", {
      ...lead,
      source: "chat-widget",
      at: new Date().toISOString(),
    });
    setLeadSent(true);
    setLeadActive(false);
    setMessages((prev) => [
      ...prev,
      {
        id: uid(),
        role: "bot",
        text: formatLeadConfirmation(lead),
        cta: { label: "Finish on quote page", href: "/quote" },
        suggestions: ["Fence services", "Deck services", "Hours & contact"],
      },
    ]);
    setLead(emptyLead);
  }

  const latestSuggestions =
    [...messages].reverse().find((m) => m.role === "bot" && m.suggestions?.length)
      ?.suggestions ?? [];

  return (
    <div className="chat-widget-root pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex justify-end p-3 sm:p-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pr-[max(0.75rem,env(safe-area-inset-right))]">
      <div className="pointer-events-auto relative flex flex-col items-end gap-3">
        {/* Panel */}
        {open && (
        <div
          id={panelId}
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="mb-0 flex h-[min(32rem,calc(100dvh-5.5rem))] w-[min(100vw-1.5rem,22.5rem)] flex-col overflow-hidden rounded-2xl border border-ink/[0.08] bg-surface shadow-[var(--shadow-lg)] dark:border-cream/10"
        >
          {/* Header */}
          <div className="relative flex shrink-0 items-center gap-3 bg-navy px-3.5 py-3 text-cream">
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-bronze/60 to-transparent"
              aria-hidden
            />
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream/10 ring-1 ring-bronze/40">
              <Image
                src="/brand/kaba-fence-icon.png"
                alt=""
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p id={titleId} className="truncate font-display text-sm font-semibold tracking-tight">
                {siteConfig.name} Chat
              </p>
              <p className="truncate text-xs text-cream/70">
                Fence &amp; deck help · Free estimates
              </p>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              className="focus-ring inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-cream/80 transition hover:bg-white/10 hover:text-cream"
              aria-label="Close chat"
              onClick={() => {
                setOpen(false);
                openButtonRef.current?.focus();
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div
            ref={listRef}
            className="flex-1 space-y-3 overflow-y-auto overscroll-contain bg-background px-3 py-3 sm:px-3.5"
            aria-live="polite"
            aria-relevant="additions"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[92%] rounded-2xl px-3.5 py-2.5 text-[0.8125rem] leading-relaxed shadow-[var(--shadow-xs)] ${
                    m.role === "user"
                      ? "rounded-br-md bg-navy text-cream"
                      : "rounded-bl-md border border-ink/[0.06] bg-surface text-ink"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
                  {m.cta && (
                    <Link
                      href={m.cta.href}
                      className="focus-ring mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-bronze px-3 py-1.5 text-xs font-semibold text-navy shadow-[var(--shadow-bronze)] transition hover:bg-bronze-dark"
                    >
                      {m.cta.label}
                      <span aria-hidden>→</span>
                    </Link>
                  )}
                </div>
              </div>
            ))}

            {leadActive && !leadSent && (
              <form
                onSubmit={onLeadSubmit}
                className="rounded-2xl border border-bronze/35 bg-surface p-3 shadow-[var(--shadow-sm)]"
                aria-label="Leave your contact information"
              >
                <p className="mb-2.5 text-xs font-semibold text-ink">
                  Leave your details for a callback
                </p>
                <div className="space-y-2">
                  <div>
                    <label htmlFor="chat-lead-name" className="sr-only">
                      Name
                    </label>
                    <input
                      id="chat-lead-name"
                      name="name"
                      autoComplete="name"
                      placeholder="Your name *"
                      value={lead.name}
                      onChange={(e) =>
                        setLead((p) => ({ ...p, name: e.target.value }))
                      }
                      className="w-full rounded-lg border border-ink/10 bg-background px-3 py-2 text-sm text-ink placeholder:text-muted-light focus:border-bronze focus:outline-none focus:ring-2 focus:ring-bronze/40"
                      aria-invalid={Boolean(leadErrors.name)}
                      aria-describedby={leadErrors.name ? "chat-lead-name-err" : undefined}
                    />
                    {leadErrors.name && (
                      <p id="chat-lead-name-err" className="mt-1 text-xs text-danger" role="alert">
                        {leadErrors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="chat-lead-phone" className="sr-only">
                      Phone
                    </label>
                    <input
                      id="chat-lead-phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="Phone *"
                      value={lead.phone}
                      onChange={(e) =>
                        setLead((p) => ({ ...p, phone: e.target.value }))
                      }
                      className="w-full rounded-lg border border-ink/10 bg-background px-3 py-2 text-sm text-ink placeholder:text-muted-light focus:border-bronze focus:outline-none focus:ring-2 focus:ring-bronze/40"
                      aria-invalid={Boolean(leadErrors.phone)}
                      aria-describedby={leadErrors.phone ? "chat-lead-phone-err" : undefined}
                    />
                    {leadErrors.phone && (
                      <p id="chat-lead-phone-err" className="mt-1 text-xs text-danger" role="alert">
                        {leadErrors.phone}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="chat-lead-email" className="sr-only">
                      Email
                    </label>
                    <input
                      id="chat-lead-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="Email (optional)"
                      value={lead.email}
                      onChange={(e) =>
                        setLead((p) => ({ ...p, email: e.target.value }))
                      }
                      className="w-full rounded-lg border border-ink/10 bg-background px-3 py-2 text-sm text-ink placeholder:text-muted-light focus:border-bronze focus:outline-none focus:ring-2 focus:ring-bronze/40"
                      aria-invalid={Boolean(leadErrors.email)}
                      aria-describedby={leadErrors.email ? "chat-lead-email-err" : undefined}
                    />
                    {leadErrors.email && (
                      <p id="chat-lead-email-err" className="mt-1 text-xs text-danger" role="alert">
                        {leadErrors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="chat-lead-message" className="sr-only">
                      Message
                    </label>
                    <textarea
                      id="chat-lead-message"
                      name="message"
                      rows={2}
                      placeholder="Optional message / project notes"
                      value={lead.message}
                      onChange={(e) =>
                        setLead((p) => ({ ...p, message: e.target.value }))
                      }
                      className="w-full resize-none rounded-lg border border-ink/10 bg-background px-3 py-2 text-sm text-ink placeholder:text-muted-light focus:border-bronze focus:outline-none focus:ring-2 focus:ring-bronze/40"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    <button
                      type="submit"
                      className="focus-ring inline-flex flex-1 items-center justify-center rounded-lg bg-bronze px-3 py-2 text-xs font-semibold text-navy shadow-[var(--shadow-bronze)] transition hover:bg-bronze-dark sm:flex-none"
                    >
                      Send contact info
                    </button>
                    <Link
                      href="/quote"
                      className="focus-ring text-xs font-medium text-muted underline-offset-2 hover:text-ink hover:underline"
                    >
                      Or open /quote
                    </Link>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Quick suggestions */}
          {latestSuggestions.length > 0 && (
            <div
              className="flex shrink-0 gap-1.5 overflow-x-auto border-t border-ink/[0.06] bg-surface px-3 py-2 scrollbar-thin"
              aria-label="Suggested questions"
            >
              {latestSuggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleUserText(s)}
                  className="focus-ring shrink-0 rounded-full border border-ink/10 bg-background px-2.5 py-1 text-[0.6875rem] font-medium text-ink transition hover:border-bronze/50 hover:bg-bronze/10"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Composer */}
          <form
            onSubmit={onSubmit}
            className="flex shrink-0 items-center gap-2 border-t border-ink/[0.06] bg-surface px-2.5 py-2.5"
          >
            <label htmlFor="chat-widget-input" className="sr-only">
              Type your message
            </label>
            <input
              ref={inputRef}
              id="chat-widget-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about fences, decks, quotes…"
              autoComplete="off"
              className="min-w-0 flex-1 rounded-xl border border-ink/10 bg-background px-3 py-2.5 text-sm text-ink placeholder:text-muted-light focus:border-bronze focus:outline-none focus:ring-2 focus:ring-bronze/40"
            />
            <button
              type="submit"
              className="focus-ring inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy text-bronze transition hover:bg-navy-light disabled:opacity-40"
              disabled={!input.trim()}
              aria-label="Send message"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M4 12l16-7-7 16-2.5-6.5L4 12z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </form>
        </div>
        )}

        {/* Launcher */}
        <button
          ref={openButtonRef}
          type="button"
          className="focus-ring group relative flex h-14 w-14 items-center justify-center rounded-full bg-navy text-bronze shadow-[var(--shadow-lg),0_0_0_3px_color-mix(in_srgb,var(--bronze)_35%,transparent)] transition hover:scale-[1.04] hover:bg-navy-light active:scale-[0.98]"
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? "Close chat" : "Open chat with Kaba Fence"}
          onClick={() =>
            setOpen((v) => {
              const next = !v;
              if (next) setUnread(false);
              return next;
            })
          }
        >
          {unread && !open && (
            <span
              className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-bronze ring-2 ring-background"
              aria-hidden
            />
          )}
          {open ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2.25"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M5 11.5C5 7.36 8.58 4 13 4s8 3.36 8 7.5-3.58 7.5-8 7.5c-.7 0-1.38-.07-2.02-.2L6.5 20l.9-3.4C6.2 15.4 5 13.57 5 11.5z"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinejoin="round"
              />
            </svg>
          )}
          <span className="sr-only">
            {open ? "Close chat panel" : "Chat with Kaba Fence"}
          </span>
        </button>
      </div>
    </div>
  );
}
