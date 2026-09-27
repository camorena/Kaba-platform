"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Extra delay in ms after entering viewport */
  delay?: number;
  /** as="section" | "div" | "li" | "article" etc. */
  as?: ElementType;
  /** Subtle horizontal offset instead of vertical */
  from?: "up" | "left" | "right" | "none";
};

/**
 * Scroll-triggered fade/rise reveal. Respects prefers-reduced-motion
 * (shows content immediately, no animation).
 */
export default function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
  from = "up",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduceMotion]);

  const style: CSSProperties = delay
    ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties)
    : {};

  return (
    <Tag
      ref={ref as never}
      className={`reveal reveal-${from} ${visible ? "reveal-in" : ""} ${className}`}
      style={style}
    >
      {children}
    </Tag>
  );
}
