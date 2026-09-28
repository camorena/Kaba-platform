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
  DEFAULT_CHATBOT_CATALOG,
  DEFAULT_CHATBOT_CONTACT,
  formatLeadConfirmation,
  getBotReply,
  WELCOME_REPLY,
  type ChatbotCatalog,
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

const REPLY_DELAY_MS = 420;

function isExternalHref(href: string) {
  return href.startsWith("tel:") || href.startsWith("mailto:") || href.startsWith("http");
}

export default function ChatWidget({
  catalog = DEFAULT_CHATBOT_CATALOG,
}: {
  catalog?: ChatbotCatalog;
}) {
  const contact = catalog.contact ?? DEFAULT_CHATBOT_CONTACT;
  const panelId = useId();
  const titleId = useId();
  const liveId = useId();

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
  const [leadErrors, setLeadErrors] = useState<
    Partial<Record<keyof LeadPayload, string>>
  >({});
  const [leadActive, setLeadActive] = useState(false);
  const [leadSent, setLeadSent] = useState(false);
  const [unread, setUnread] = useState(false);
  const [typing, setTyping] = useState(false);
  const [composerError, setComposerError] = useState<string | null>(null);

  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const replyTimerRef = useRef<number | null>(null);

  const scrollToBottom = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, []);

  // Signal CSS that chat owns the bottom chrome
  useEffect(() => {
    document.documentElement.dataset.chatOpen = open ? "true" : "false";
    return () => {
      delete document.documentElement.dataset.chatOpen;
    };
  }, [open]);


  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 60);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, leadActive, open, typing, scrollToBottom]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        closePanel();
        return;
      }
      // Simple focus trap within the dialog
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    return () => {
      if (replyTimerRef.current) window.clearTimeout(replyTimerRef.current);
    };
  }, []);

  function closePanel() {
    setOpen(false);
    setTyping(false);
    if (replyTimerRef.current) {
      window.clearTimeout(replyTimerRef.current);
      replyTimerRef.current = null;
    }
    openButtonRef.current?.focus();
  }

  function openPanel() {
    setOpen(true);
    setUnread(false);
  }

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
    if (!trimmed) {
      setComposerError("Type a question, or tap a suggestion below.");
      return;
    }
    setComposerError(null);
    setMessages((prev) => [
      ...prev,
      { id: uid(), role: "user", text: trimmed },
    ]);
    setInput("");
    setTyping(true);
    if (replyTimerRef.current) window.clearTimeout(replyTimerRef.current);
    replyTimerRef.current = window.setTimeout(() => {
      setTyping(false);
      pushBot(getBotReply(trimmed, catalog));
      replyTimerRef.current = null;
    }, REPLY_DELAY_MS);
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
    if (
      lead.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email.trim())
    )
      next.email = "Enter a valid email.";
    setLeadErrors(next);
    return Object.keys(next).length === 0;
  }

  function onLeadSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validateLead()) return;
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
        suggestions: ["Fence services", "Materials", "Service area", "Hours & contact"],
      },
    ]);
    setLead(emptyLead);
  }

  function resetConversation() {
    if (replyTimerRef.current) {
      window.clearTimeout(replyTimerRef.current);
      replyTimerRef.current = null;
    }
    setTyping(false);
    setLeadActive(false);
    setLeadSent(false);
    setLead(emptyLead);
    setLeadErrors({});
    setComposerError(null);
    setInput("");
    setMessages([
      {
        id: "welcome",
        role: "bot",
        text: WELCOME_REPLY.text,
        suggestions: WELCOME_REPLY.suggestions,
      },
    ]);
  }

  const latestSuggestions =
    [...messages]
      .reverse()
      .find((m) => m.role === "bot" && m.suggestions?.length)?.suggestions ??
    [];

  function renderCta(cta: NonNullable<ChatReply["cta"]>) {
    const className =
      "focus-ring chat-cta mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-bronze px-3 py-1.5 text-xs font-semibold text-white shadow-[var(--shadow-bronze)] transition hover:bg-bronze-dark";
    if (isExternalHref(cta.href)) {
      return (
        <a href={cta.href} className={className}>
          {cta.label}
          <span aria-hidden>→</span>
        </a>
      );
    }
    return (
      <Link href={cta.href} className={className}>
        {cta.label}
        <span aria-hidden>→</span>
      </Link>
    );
  }

  return (
    <div className="chat-widget-root pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex justify-end p-3 sm:p-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pr-[max(0.75rem,env(safe-area-inset-right))]">
      <div className="pointer-events-auto relative flex flex-col items-end gap-2.5 sm:gap-3">
        {/* Panel */}
        {open && (
          <div
            id={panelId}
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="chat-panel mb-0 flex w-[min(100vw-1.5rem,23rem)] flex-col overflow-hidden rounded-2xl border border-ink/[0.08] bg-surface shadow-[var(--shadow-lg)] dark:border-cream/10 sm:w-[min(100vw-2rem,24rem)]"
          >
            {/* Header */}
            <div className="chat-panel-header relative flex shrink-0 items-center gap-2.5 bg-navy px-3 py-2.5 text-cream sm:gap-3 sm:px-3.5 sm:py-3">
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-bronze/60 to-transparent"
                aria-hidden
              />
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream/10 ring-1 ring-bronze/45">
                <Image
                  src="/brand/kaba-fence-icon.png"
                  alt=""
                  width={32}
                  height={32}
                  className="h-8 w-8 object-contain"
                />
                <span
                  className="chat-online-dot absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-navy"
                  title="Available"
                  aria-hidden
                />
              </div>
              <div className="min-w-0 flex-1">
                <p
                  id={titleId}
                  className="truncate font-display text-sm font-semibold tracking-tight"
                >
                  {siteConfig.name}
                </p>
                <p className="truncate text-[0.6875rem] text-cream/70 sm:text-xs">
                  Online · Fence help
                </p>
              </div>
              <a
                href={contact.phoneHref}
                className="focus-ring hidden h-9 shrink-0 items-center gap-1.5 rounded-lg bg-white/10 px-2.5 text-[0.6875rem] font-semibold text-cream transition hover:bg-white/15 sm:inline-flex"
                aria-label={`Call ${contact.phone}`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2a1 1 0 011-.24c1.1.37 2.3.57 3.5.57a1 1 0 011 1V20a1 1 0 01-1 1C11.4 21 3 12.6 3 2.9A1 1 0 014 1.9h3.5a1 1 0 011 1c0 1.2.2 2.4.57 3.5a1 1 0 01-.25 1l-2.22 2.4z"
                    fill="currentColor"
                  />
                </svg>
                Call
              </a>
              <button
                type="button"
                className="focus-ring inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-cream/75 transition hover:bg-white/10 hover:text-cream"
                aria-label="Restart conversation"
                title="Restart conversation"
                onClick={resetConversation}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M4 12a8 8 0 0113.66-5.66M20 4v5h-5M20 12a8 8 0 01-13.66 5.66M4 20v-5h5"
                    stroke="currentColor"
                    strokeWidth="1.85"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                ref={closeButtonRef}
                type="button"
                className="focus-ring inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-cream/80 transition hover:bg-white/10 hover:text-cream"
                aria-label="Close chat"
                onClick={closePanel}
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
              className="chat-messages flex-1 space-y-3 overflow-y-auto overscroll-contain bg-background px-3 py-3 sm:px-3.5"
              aria-live="polite"
              aria-relevant="additions"
              aria-busy={typing}
              id={liveId}
            >
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`chat-msg flex gap-2 ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {m.role === "bot" && (
                    <div
                      className="mt-0.5 hidden h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy/90 ring-1 ring-bronze/35 sm:flex"
                      aria-hidden
                    >
                      <Image
                        src="/brand/kaba-fence-icon.png"
                        alt=""
                        width={20}
                        height={20}
                        className="h-5 w-5 object-contain"
                      />
                    </div>
                  )}
                  <div
                    className={`max-w-[92%] rounded-2xl px-3.5 py-2.5 text-[0.8125rem] leading-relaxed shadow-[var(--shadow-xs)] sm:max-w-[85%] ${
                      m.role === "user"
                        ? "rounded-br-md bg-navy text-cream"
                        : "rounded-bl-md border border-ink/[0.06] bg-surface text-ink dark:border-cream/10"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{m.text}</p>
                    {m.cta && renderCta(m.cta)}
                  </div>
                </div>
              ))}

              {typing && (
                <div className="chat-msg flex justify-start gap-2" aria-hidden>
                  <div className="hidden h-7 w-7 shrink-0 sm:block" />
                  <div className="inline-flex items-center gap-1 rounded-2xl rounded-bl-md border border-ink/[0.06] bg-surface px-3.5 py-3 dark:border-cream/10">
                    <span className="chat-typing-dot" />
                    <span className="chat-typing-dot" />
                    <span className="chat-typing-dot" />
                  </div>
                </div>
              )}

              {leadActive && !leadSent && (
                <form
                  onSubmit={onLeadSubmit}
                  className="rounded-2xl border border-bronze/35 bg-surface p-3 shadow-[var(--shadow-sm)] dark:border-bronze/40"
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
                        className="w-full rounded-lg border border-ink/10 bg-background px-3 py-2 text-sm text-ink placeholder:text-muted-light focus:border-bronze focus:outline-none focus:ring-2 focus:ring-bronze/40 dark:border-cream/15"
                        aria-invalid={Boolean(leadErrors.name)}
                        aria-describedby={
                          leadErrors.name ? "chat-lead-name-err" : undefined
                        }
                      />
                      {leadErrors.name && (
                        <p
                          id="chat-lead-name-err"
                          className="mt-1 text-xs text-danger"
                          role="alert"
                        >
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
                        className="w-full rounded-lg border border-ink/10 bg-background px-3 py-2 text-sm text-ink placeholder:text-muted-light focus:border-bronze focus:outline-none focus:ring-2 focus:ring-bronze/40 dark:border-cream/15"
                        aria-invalid={Boolean(leadErrors.phone)}
                        aria-describedby={
                          leadErrors.phone ? "chat-lead-phone-err" : undefined
                        }
                      />
                      {leadErrors.phone && (
                        <p
                          id="chat-lead-phone-err"
                          className="mt-1 text-xs text-danger"
                          role="alert"
                        >
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
                        className="w-full rounded-lg border border-ink/10 bg-background px-3 py-2 text-sm text-ink placeholder:text-muted-light focus:border-bronze focus:outline-none focus:ring-2 focus:ring-bronze/40 dark:border-cream/15"
                        aria-invalid={Boolean(leadErrors.email)}
                        aria-describedby={
                          leadErrors.email ? "chat-lead-email-err" : undefined
                        }
                      />
                      {leadErrors.email && (
                        <p
                          id="chat-lead-email-err"
                          className="mt-1 text-xs text-danger"
                          role="alert"
                        >
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
                        className="w-full resize-none rounded-lg border border-ink/10 bg-background px-3 py-2 text-sm text-ink placeholder:text-muted-light focus:border-bronze focus:outline-none focus:ring-2 focus:ring-bronze/40 dark:border-cream/15"
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-2 pt-0.5">
                      <button
                        type="submit"
                        className="focus-ring inline-flex flex-1 items-center justify-center rounded-lg bg-bronze px-3 py-2 text-xs font-semibold text-white shadow-[var(--shadow-bronze)] transition hover:bg-bronze-dark sm:flex-none"
                      >
                        Send contact info
                      </button>
                      <Link
                        href="/contact"
                        className="focus-ring text-xs font-medium text-muted underline-offset-2 hover:text-ink hover:underline"
                      >
                        Or open quote form
                      </Link>
                    </div>
                  </div>
                </form>
              )}
            </div>

            {/* Quick suggestions */}
            {latestSuggestions.length > 0 && !typing && (
              <div
                className="chat-chips flex shrink-0 flex-wrap gap-1.5 border-t border-ink/[0.06] bg-surface px-3 py-2 dark:border-cream/10"
                aria-label="Suggested questions"
              >
                {latestSuggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleUserText(s)}
                    className="focus-ring inline-flex min-h-[1.75rem] items-center rounded-full border border-ink/10 bg-background px-2.5 py-1 text-[0.6875rem] font-medium text-ink transition hover:border-bronze/50 hover:bg-bronze/10 dark:border-cream/15"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Handoff strip */}
            <div className="chat-handoff flex shrink-0 items-stretch gap-px border-t border-ink/[0.06] bg-ink/[0.04] dark:border-cream/10 dark:bg-cream/[0.04]">
              <a
                href={contact.phoneHref}
                className="focus-ring flex flex-1 items-center justify-center gap-1.5 px-2 py-2 text-[0.6875rem] font-semibold text-ink transition hover:bg-bronze/10"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2a1 1 0 011-.24c1.1.37 2.3.57 3.5.57a1 1 0 011 1V20a1 1 0 01-1 1C11.4 21 3 12.6 3 2.9A1 1 0 014 1.9h3.5a1 1 0 011 1c0 1.2.2 2.4.57 3.5a1 1 0 01-.25 1l-2.22 2.4z"
                    fill="currentColor"
                  />
                </svg>
                Call {contact.phone}
              </a>
              <Link
                href="/contact"
                className="focus-ring flex flex-1 items-center justify-center gap-1.5 border-l border-ink/[0.06] px-2 py-2 text-[0.6875rem] font-semibold text-ink transition hover:bg-bronze/10 dark:border-cream/10"
              >
                Free quote
                <span aria-hidden>→</span>
              </Link>
            </div>

            {/* Composer */}
            <form
              onSubmit={onSubmit}
              className="flex shrink-0 flex-col gap-1 border-t border-ink/[0.06] bg-surface px-2.5 py-2.5 dark:border-cream/10"
            >
              {composerError && (
                <p className="px-1 text-[0.6875rem] text-danger" role="alert">
                  {composerError}
                </p>
              )}
              <div className="flex items-center gap-2">
                <label htmlFor="chat-widget-input" className="sr-only">
                  Type your message
                </label>
                <input
                  ref={inputRef}
                  id="chat-widget-input"
                  type="text"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    if (composerError) setComposerError(null);
                  }}
                  placeholder="Ask about fencing, estimates…"
                  autoComplete="off"
                  enterKeyHint="send"
                  className="min-w-0 flex-1 rounded-xl border border-ink/10 bg-background px-3 py-2.5 text-sm text-ink placeholder:text-muted-light focus:border-bronze focus:outline-none focus:ring-2 focus:ring-bronze/40 dark:border-cream/15"
                />
                <button
                  type="submit"
                  className="focus-ring inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy text-bronze transition hover:bg-navy-light disabled:opacity-40"
                  disabled={!input.trim() || typing}
                  aria-label="Send message"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M4 12l16-7-7 16-2.5-6.5L4 12z" fill="currentColor" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Launcher — hidden while open on narrow screens to avoid X-stack collision */}
        <button
          ref={openButtonRef}
          type="button"
          className={`focus-ring chat-launcher group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#0a0c10] text-bronze shadow-[var(--shadow-lg),0_0_0_3px_color-mix(in_srgb,var(--bronze)_35%,transparent)] transition hover:scale-[1.04] hover:bg-navy-light active:scale-[0.98] ${
            open ? "hidden sm:flex" : "flex"
          }`}
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? "Close chat" : "Open chat with Kaba Fence"}
          onClick={() => {
            if (open) closePanel();
            else openPanel();
          }}
        >
          {unread && !open && (
            <span
              className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-bronze ring-2 ring-background"
              aria-hidden
            />
          )}
          {!open && !unread && (
            <span className="chat-launcher-pulse pointer-events-none absolute inset-0 rounded-full" aria-hidden />
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
