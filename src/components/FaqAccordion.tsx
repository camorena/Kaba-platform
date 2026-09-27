"use client";

import { useId, useState } from "react";
import { faqs } from "@/lib/site";

type FaqItem = (typeof faqs)[number];

export default function FaqAccordion({
  items = faqs,
}: {
  items?: readonly FaqItem[];
}) {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-ink/10 rounded-2xl border border-ink/10 bg-surface shadow-sm">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `${baseId}-panel-${index}`;
        const buttonId = `${baseId}-button-${index}`;

        return (
          <div key={item.question} className="px-5 sm:px-6">
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="focus-ring flex w-full items-center justify-between gap-4 rounded-md py-5 text-left transition-colors"
              >
                <span className="font-display text-base font-semibold text-ink sm:text-lg">
                  {item.question}
                </span>
                <span
                  aria-hidden
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ink/12 bg-ivory text-ink transition-transform duration-200 ${
                    isOpen ? "rotate-45 bg-ink text-ivory" : ""
                  }`}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className={`overflow-hidden transition-[grid-template-rows] duration-200 ${
                isOpen ? "pb-5" : ""
              }`}
            >
              {isOpen && (
                <p className="max-w-3xl text-sm leading-relaxed text-muted sm:text-[0.9375rem]">
                  {item.answer}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
