"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { siteConfig } from "@/lib/site";

type FormState = {
  name: string;
  phone: string;
  email: string;
  serviceType: string;
  address: string;
  description: string;
  preferredContact: string;
};

const initial: FormState = {
  name: "",
  phone: "",
  email: "",
  serviceType: "",
  address: "",
  description: "",
  preferredContact: "phone",
};

const serviceOptions = [
  "Wood Fence",
  "Vinyl Fence",
  "Chain-Link Fence",
  "Aluminum / Ornamental Fence",
  "Privacy Fence",
  "Deck Repair",
  "Deck Rebuild",
  "New Deck Build",
  "Railings & Stairs",
  "Not sure / Other",
];

const fieldLabels: Record<keyof FormState, string> = {
  name: "Full name",
  phone: "Phone",
  email: "Email",
  serviceType: "Service type",
  address: "Project address / city",
  description: "Brief description",
  preferredContact: "Preferred contact method",
};

const steps = [
  {
    id: 1,
    title: "Contact",
    blurb: "How we can reach you",
    fields: ["name", "phone", "email", "preferredContact"] as (keyof FormState)[],
  },
  {
    id: 2,
    title: "Project",
    blurb: "What and where",
    fields: ["serviceType", "address"] as (keyof FormState)[],
  },
  {
    id: 3,
    title: "Details",
    blurb: "A few notes for your estimate",
    fields: ["description"] as (keyof FormState)[],
  },
] as const;

export default function QuoteForm() {
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(0);
  const [attempted, setAttempted] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);

  const errorEntries = Object.entries(errors) as [keyof FormState, string][];
  const current = steps[step];
  const progress = ((step + 1) / steps.length) * 100;

  useEffect(() => {
    if (attempted && errorEntries.length > 0) {
      summaryRef.current?.focus();
    }
  }, [attempted, errorEntries.length]);

  useEffect(() => {
    // Announce step changes to keyboard users without stealing focus on first mount
    if (step > 0 || attempted) {
      stepHeadingRef.current?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  }

  function validateFields(keys: (keyof FormState)[]): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    for (const key of keys) {
      if (key === "name" && !form.name.trim())
        next.name = "Please enter your full name.";
      if (key === "phone") {
        if (!form.phone.trim())
          next.phone = "Please enter a phone number so we can reach you.";
        else if (!/^[\d\s().+-]{7,}$/.test(form.phone.trim()))
          next.phone = "Enter a valid phone number (at least 7 digits).";
      }
      if (key === "email") {
        if (!form.email.trim()) next.email = "Please enter your email address.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
          next.email = "Enter a valid email address (for example, name@email.com).";
      }
      if (key === "serviceType" && !form.serviceType)
        next.serviceType = "Please select a service type from the list.";
      if (key === "address" && !form.address.trim())
        next.address = "Please enter the project street address or city.";
      if (key === "description") {
        if (!form.description.trim())
          next.description = "Please describe your fence or deck project.";
        else if (form.description.trim().length < 10)
          next.description =
            "Add a few more details—at least 10 characters—so we can prepare a better estimate.";
      }
      if (key === "preferredContact" && !form.preferredContact)
        next.preferredContact = "Choose how you’d like us to contact you.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function goNext() {
    setAttempted(true);
    if (!validateFields([...current.fields])) return;
    setAttempted(false);
    setErrors({});
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }

  function goBack() {
    setErrors({});
    setAttempted(false);
    setStep((s) => Math.max(s - 1, 0));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setAttempted(true);
    if (!validateFields([...current.fields])) return;
    // Final safety: validate everything
    const allKeys = steps.flatMap((s) => s.fields);
    if (!validateFields([...allKeys])) {
      // Jump to first step with errors
      for (let i = 0; i < steps.length; i++) {
        const bad = steps[i].fields.some((f) => {
          // re-check lightly
          if (f === "name") return !form.name.trim();
          if (f === "phone")
            return !form.phone.trim() || !/^[\d\s().+-]{7,}$/.test(form.phone.trim());
          if (f === "email")
            return !form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
          if (f === "serviceType") return !form.serviceType;
          if (f === "address") return !form.address.trim();
          if (f === "description")
            return !form.description.trim() || form.description.trim().length < 10;
          return false;
        });
        if (bad) {
          setStep(i);
          return;
        }
      }
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div
        className="card-static min-w-0 p-6 text-center sm:p-8 md:p-10"
        role="status"
        aria-live="polite"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-bronze/20 to-bronze/10 text-bronze-dark shadow-[inset_0_1px_0_color-mix(in_srgb,#fff_50%,transparent),0_4px_14px_color-mix(in_srgb,var(--bronze)_18%,transparent)] dark:text-bronze-light">
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="mt-5 font-display text-2xl font-semibold tracking-tight text-ink">
          Request received
        </h2>
        <p className="mx-auto mt-3 max-w-md leading-relaxed text-muted">
          Thanks, {form.name.split(" ")[0]}! We&apos;ll review your{" "}
          {form.serviceType.toLowerCase()} project in {form.address} and get
          back to you by {form.preferredContact === "email" ? "email" : form.preferredContact === "text" ? "text" : "phone"}{" "}
          soon. For faster help, call{" "}
          <a href={siteConfig.phoneHref} className="focus-ring rounded font-semibold text-ink underline-offset-2 hover:underline">
            {siteConfig.phone}
          </a>
          .
        </p>
        <dl className="mx-auto mt-6 max-w-sm rounded-xl border border-ink/[0.08] bg-ivory-muted/60 px-4 py-3 text-left text-sm dark:border-cream/10">
          <div className="flex justify-between gap-3 py-1.5">
            <dt className="text-muted">Service</dt>
            <dd className="font-medium text-ink">{form.serviceType}</dd>
          </div>
          <div className="flex justify-between gap-3 border-t border-ink/[0.06] py-1.5 dark:border-cream/10">
            <dt className="text-muted">Location</dt>
            <dd className="font-medium text-ink text-right">{form.address}</dd>
          </div>
          <div className="flex justify-between gap-3 border-t border-ink/[0.06] py-1.5 dark:border-cream/10">
            <dt className="text-muted">Contact via</dt>
            <dd className="font-medium capitalize text-ink">{form.preferredContact}</dd>
          </div>
        </dl>
        <button
          type="button"
          onClick={() => {
            setForm(initial);
            setSubmitted(false);
            setErrors({});
            setAttempted(false);
            setStep(0);
          }}
          className="focus-ring btn-secondary-light mt-7 w-full sm:w-auto"
        >
          Submit another request
        </button>
      </div>
    );
  }

  const labelClass = "block text-sm font-medium text-ink";
  const errorClass = "mt-1.5 text-sm font-medium text-danger";

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="card-static min-w-0 overflow-hidden"
      aria-describedby={errorEntries.length ? "form-error-summary" : undefined}
    >
      {/* Progress */}
      <div className="border-b border-ink/[0.07] bg-ivory-muted/40 px-4 py-4 sm:px-6 md:px-8 dark:border-cream/10">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-bronze-dark dark:text-bronze-light">
            Step {step + 1} of {steps.length}
          </p>
          <p className="text-xs text-muted">{current.blurb}</p>
        </div>
        <div
          className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink/[0.08] dark:bg-cream/10"
          role="progressbar"
          aria-valuenow={step + 1}
          aria-valuemin={1}
          aria-valuemax={steps.length}
          aria-label="Quote form progress"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-bronze-dark via-bronze to-bronze-light transition-[width] duration-400 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <ol className="mt-4 flex gap-2 sm:gap-3" aria-label="Form steps">
          {steps.map((s, i) => (
            <li key={s.id} className="flex min-w-0 flex-1 items-center gap-2">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition ${
                  i < step
                    ? "bg-bronze text-navy"
                    : i === step
                      ? "bg-navy text-cream dark:bg-cream dark:text-navy"
                      : "bg-ink/[0.06] text-muted dark:bg-cream/10"
                }`}
                aria-current={i === step ? "step" : undefined}
              >
                {i < step ? (
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  s.id
                )}
              </span>
              <span
                className={`hidden truncate text-xs font-semibold sm:inline ${
                  i === step ? "text-ink" : "text-muted"
                }`}
              >
                {s.title}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="p-4 sm:p-6 md:p-8">
        <h2
          ref={stepHeadingRef}
          tabIndex={-1}
          className="font-display text-xl font-semibold tracking-tight text-ink outline-none sm:text-2xl"
        >
          {current.title}
        </h2>
        <p className="mt-1.5 text-sm text-muted">{current.blurb}</p>

        {errorEntries.length > 0 && (
          <div
            ref={summaryRef}
            id="form-error-summary"
            tabIndex={-1}
            role="alert"
            aria-live="assertive"
            className="mt-5 rounded-xl border border-danger/30 bg-danger-bg px-4 py-3.5 outline-none"
          >
            <p className="text-sm font-semibold text-danger">
              Please fix {errorEntries.length}{" "}
              {errorEntries.length === 1 ? "item" : "items"} below before continuing.
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-danger">
              {errorEntries.map(([key, message]) => (
                <li key={key}>
                  <a
                    href={`#${key}`}
                    className="focus-ring rounded underline-offset-2 hover:underline"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(key)?.focus();
                    }}
                  >
                    {fieldLabels[key]}: {message}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {step === 0 && (
            <>
              <div className="sm:col-span-1">
                <label htmlFor="name" className={labelClass}>
                  Full name <span className="text-bronze" aria-hidden>*</span>
                  <span className="sr-only">(required)</span>
                </label>
                <input
                  id="name"
                  name="name"
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className="field-input"
                  aria-required="true"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
                {errors.name && (
                  <p id="name-error" className={errorClass} role="alert">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className={labelClass}>
                  Phone <span className="text-bronze" aria-hidden>*</span>
                  <span className="sr-only">(required)</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  className="field-input"
                  placeholder="(919) 555-0123"
                  aria-required="true"
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                />
                {errors.phone && (
                  <p id="phone-error" className={errorClass} role="alert">
                    {errors.phone}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="email" className={labelClass}>
                  Email <span className="text-bronze" aria-hidden>*</span>
                  <span className="sr-only">(required)</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className="field-input"
                  placeholder="you@email.com"
                  aria-required="true"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <p id="email-error" className={errorClass} role="alert">
                    {errors.email}
                  </p>
                )}
              </div>

              <fieldset className="sm:col-span-2">
                <legend className={labelClass}>
                  Preferred contact method{" "}
                  <span className="text-bronze" aria-hidden>*</span>
                  <span className="sr-only">(required)</span>
                </legend>
                <div className="mt-2.5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-3">
                  {[
                    { value: "phone", label: "Phone call" },
                    { value: "text", label: "Text message" },
                    { value: "email", label: "Email" },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className={`inline-flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-lg border px-3.5 py-2.5 text-sm transition sm:w-auto ${
                        form.preferredContact === opt.value
                          ? "border-bronze bg-bronze/8 text-ink"
                          : "border-ink/12 text-muted hover:border-ink/20 hover:bg-ivory-muted"
                      }`}
                    >
                      <input
                        type="radio"
                        id={opt.value === "phone" ? "preferredContact" : undefined}
                        name="preferredContact"
                        value={opt.value}
                        checked={form.preferredContact === opt.value}
                        onChange={(e) => update("preferredContact", e.target.value)}
                        className="h-5 w-5 shrink-0 border-ink/20 text-ink accent-bronze focus:ring-2 focus:ring-bronze focus:ring-offset-2 focus:ring-offset-background"
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
                {errors.preferredContact && (
                  <p id="preferredContact-error" className={errorClass} role="alert">
                    {errors.preferredContact}
                  </p>
                )}
              </fieldset>
            </>
          )}

          {step === 1 && (
            <>
              <div className="sm:col-span-2">
                <label htmlFor="serviceType" className={labelClass}>
                  Service type <span className="text-bronze" aria-hidden>*</span>
                  <span className="sr-only">(required)</span>
                </label>
                <select
                  id="serviceType"
                  name="serviceType"
                  value={form.serviceType}
                  onChange={(e) => update("serviceType", e.target.value)}
                  className="field-input"
                  aria-required="true"
                  aria-invalid={!!errors.serviceType}
                  aria-describedby={errors.serviceType ? "serviceType-error" : undefined}
                >
                  <option value="">Select a service…</option>
                  {serviceOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                {errors.serviceType && (
                  <p id="serviceType-error" className={errorClass} role="alert">
                    {errors.serviceType}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="address" className={labelClass}>
                  Project address / city{" "}
                  <span className="text-bronze" aria-hidden>*</span>
                  <span className="sr-only">(required)</span>
                </label>
                <input
                  id="address"
                  name="address"
                  autoComplete="street-address"
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                  className="field-input"
                  placeholder="e.g. 123 Oak St, Angier NC"
                  aria-required="true"
                  aria-invalid={!!errors.address}
                  aria-describedby={errors.address ? "address-error" : undefined}
                />
                {errors.address && (
                  <p id="address-error" className={errorClass} role="alert">
                    {errors.address}
                  </p>
                )}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="sm:col-span-2">
                <label htmlFor="description" className={labelClass}>
                  Brief description <span className="text-bronze" aria-hidden>*</span>
                  <span className="sr-only">(required)</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  className="field-input min-h-[8rem] resize-y"
                  placeholder="What needs repair or installation? Approximate length, material preferences, timeline…"
                  aria-required="true"
                  aria-invalid={!!errors.description}
                  aria-describedby={
                    errors.description
                      ? "description-error description-hint"
                      : "description-hint"
                  }
                />
                <p id="description-hint" className="mt-1.5 text-xs text-muted-light">
                  A short note about size, material, and timing helps us prepare an accurate quote.
                </p>
                {errors.description && (
                  <p id="description-error" className={errorClass} role="alert">
                    {errors.description}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2 rounded-xl border border-ink/[0.08] bg-ivory-muted/50 px-4 py-3.5 text-sm dark:border-cream/10">
                <p className="text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-bronze-dark dark:text-bronze-light">
                  Quick review
                </p>
                <ul className="mt-2 space-y-1 text-muted">
                  <li>
                    <span className="font-medium text-ink">{form.name}</span>
                    {" · "}
                    {form.phone}
                    {" · "}
                    {form.email}
                  </li>
                  <li>
                    {form.serviceType || "—"} at {form.address || "—"}
                  </li>
                  <li className="capitalize">Prefer: {form.preferredContact}</li>
                </ul>
              </div>
            </>
          )}
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            {step > 0 ? (
              <button
                type="button"
                onClick={goBack}
                className="focus-ring btn-secondary-light w-full sm:w-auto"
              >
                Back
              </button>
            ) : (
              <p className="text-xs leading-relaxed text-muted-light">
                Fields marked with * are required. Demo validates in-browser.
              </p>
            )}
          </div>
          {step < steps.length - 1 ? (
            <button
              type="button"
              onClick={goNext}
              className="focus-ring btn-primary w-full shrink-0 sm:w-auto"
            >
              Continue
            </button>
          ) : (
            <button
              type="submit"
              className="focus-ring btn-primary w-full shrink-0 sm:w-auto"
            >
              Request Free Quote
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
