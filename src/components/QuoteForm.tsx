"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

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

export default function QuoteForm() {
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);

  const errorEntries = Object.entries(errors) as [keyof FormState, string][];

  useEffect(() => {
    if (attempted && errorEntries.length > 0) {
      summaryRef.current?.focus();
    }
  }, [attempted, errorEntries.length]);

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

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) next.name = "Please enter your full name.";
    if (!form.phone.trim()) next.phone = "Please enter a phone number so we can reach you.";
    else if (!/^[\d\s().+-]{7,}$/.test(form.phone.trim()))
      next.phone = "Enter a valid phone number (at least 7 digits).";
    if (!form.email.trim()) next.email = "Please enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      next.email = "Enter a valid email address (for example, name@email.com).";
    if (!form.serviceType) next.serviceType = "Please select a service type from the list.";
    if (!form.address.trim())
      next.address = "Please enter the project street address or city.";
    if (!form.description.trim())
      next.description = "Please describe your fence or deck project.";
    else if (form.description.trim().length < 10)
      next.description =
        "Add a few more details—at least 10 characters—so we can prepare a better estimate.";
    if (!form.preferredContact)
      next.preferredContact = "Choose how you’d like us to contact you.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setAttempted(true);
    if (!validate()) return;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div
        className="card-static p-8 text-center sm:p-10"
        role="status"
        aria-live="polite"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-bronze/20 to-bronze/10 text-bronze-dark shadow-[inset_0_1px_0_color-mix(in_srgb,#fff_50%,transparent),0_4px_14px_color-mix(in_srgb,var(--bronze)_18%,transparent)]">
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
          back to you by {form.preferredContact === "email" ? "email" : "phone"}{" "}
          soon. For faster help, call us anytime.
        </p>
        <button
          type="button"
          onClick={() => {
            setForm(initial);
            setSubmitted(false);
            setErrors({});
            setAttempted(false);
          }}
          className="focus-ring btn-secondary-light mt-7"
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
      className="card-static p-5 sm:p-8"
      aria-describedby={errorEntries.length ? "form-error-summary" : undefined}
    >
      {errorEntries.length > 0 && (
        <div
          ref={summaryRef}
          id="form-error-summary"
          tabIndex={-1}
          role="alert"
          aria-live="assertive"
          className="mb-6 rounded-xl border border-danger/30 bg-danger-bg px-4 py-3.5 outline-none"
        >
          <p className="text-sm font-semibold text-danger">
            Please fix {errorEntries.length}{" "}
            {errorEntries.length === 1 ? "item" : "items"} below before submitting.
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

      <div className="grid gap-5 sm:grid-cols-2">
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

        <div>
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

        <div>
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

        <div className="sm:col-span-2">
          <label htmlFor="description" className={labelClass}>
            Brief description <span className="text-bronze" aria-hidden>*</span>
            <span className="sr-only">(required)</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            className="field-input min-h-[7rem] resize-y"
            placeholder="What needs repair or installation? Approximate length, material preferences, timeline…"
            aria-required="true"
            aria-invalid={!!errors.description}
            aria-describedby={
              errors.description ? "description-error description-hint" : "description-hint"
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

        <fieldset className="sm:col-span-2">
          <legend className={labelClass}>
            Preferred contact method{" "}
            <span className="text-bronze" aria-hidden>*</span>
            <span className="sr-only">(required)</span>
          </legend>
          <div className="mt-2.5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            {[
              { value: "phone", label: "Phone call" },
              { value: "text", label: "Text message" },
              { value: "email", label: "Email" },
            ].map((opt) => (
              <label
                key={opt.value}
                className={`inline-flex cursor-pointer items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-sm transition ${
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
                  className="h-4 w-4 border-ink/20 text-ink accent-bronze focus:ring-2 focus:ring-bronze focus:ring-offset-2"
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
      </div>

      <div className="mt-7 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-muted-light">
          Fields marked with * are required. No backend yet — this demo validates
          in the browser and shows a success message.
        </p>
        <button type="submit" className="focus-ring btn-primary w-full shrink-0 sm:w-auto">
          Request Free Quote
        </button>
      </div>
    </form>
  );
}
