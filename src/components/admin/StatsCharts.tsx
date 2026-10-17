/**
 * Accessible, dependency-free SVG/CSS charts for Estadísticas + Reseñas.
 * Every chart exposes an aria-label and a visually hidden data table so
 * screen readers get the exact numbers. No chart library weight.
 */

import type { ReactNode } from "react";

export const CHART_COLORS = {
  bronze: "var(--bronze)",
  navy: "#1e3a5f",
  emerald: "#0f9f6e",
  slate: "#64748b",
  sand: "#d9b77a",
} as const;

function SrTable({
  caption,
  head,
  rows,
}: {
  caption: string;
  head: string[];
  rows: (string | number)[][];
}) {
  return (
    <table className="sr-only">
      <caption>{caption}</caption>
      <thead>
        <tr>
          {head.map((h) => (
            <th key={h} scope="col">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            {r.map((c, j) => (j === 0 ? <th key={j} scope="row">{c}</th> : <td key={j}>{c}</td>))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function ChartEmpty({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[9rem] items-center justify-center rounded-lg border border-dashed border-ink/12 px-4 py-6 text-center text-xs leading-relaxed text-muted">
      {children}
    </div>
  );
}

export function ChartCard({
  title,
  subtitle,
  children,
  className = "",
  aside,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  aside?: ReactNode;
}) {
  return (
    <section className={`admin-glass-panel admin-gold-rail p-4 sm:p-5 ${className}`}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="admin-card-title">{title}</h2>
          {subtitle ? <p className="mt-1 text-xs text-muted">{subtitle}</p> : null}
        </div>
        {aside}
      </div>
      {children}
    </section>
  );
}

/** Horizontal bars — rankings (cities, sources, ratings). */
export function HBarList({
  items,
  ariaLabel,
  valueHead,
  labelHead,
  color = CHART_COLORS.bronze,
  format = (n: number) => String(n),
}: {
  items: { label: string; value: number; color?: string }[];
  ariaLabel: string;
  labelHead: string;
  valueHead: string;
  color?: string;
  format?: (n: number) => string;
}) {
  const peak = Math.max(1, ...items.map((i) => i.value));
  const total = items.reduce((s, i) => s + i.value, 0);
  return (
    <figure aria-label={ariaLabel} className="m-0">
      <ul className="space-y-2.5" aria-hidden>
        {items.map((it) => {
          const pct = Math.round((it.value / peak) * 100);
          const share = total ? Math.round((it.value / total) * 100) : 0;
          return (
            <li key={it.label}>
              <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
                <span className="min-w-0 truncate font-medium text-ink">{it.label}</span>
                <span className="shrink-0 tabular-nums text-muted">
                  {format(it.value)}
                  {total ? <span className="ml-1.5 text-[0.6875rem]">· {share}%</span> : null}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-ink/[0.06] dark:bg-white/[0.08]">
                <div
                  className="h-full rounded-full transition-[width] duration-500"
                  style={{ width: `${Math.max(it.value > 0 ? 2 : 0, pct)}%`, background: it.color ?? color }}
                />
              </div>
            </li>
          );
        })}
      </ul>
      <SrTable
        caption={ariaLabel}
        head={[labelHead, valueHead]}
        rows={items.map((i) => [i.label, format(i.value)])}
      />
    </figure>
  );
}

export type ChartSize = "wide" | "normal" | "compact";

/** viewBox presets so text stays legible at each card width. */
const DIMS: Record<ChartSize, { W: number; H: number; maxLabels: number }> = {
  wide: { W: 960, H: 260, maxLabels: 12 },
  normal: { W: 560, H: 250, maxLabels: 6 },
  compact: { W: 380, H: 240, maxLabels: 4 },
};
const PAD = { top: 12, right: 10, bottom: 28, left: 50 };

function niceMax(v: number): number {
  if (v <= 0) return 1;
  const exp = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / exp;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  return step * exp;
}

/** Grouped columns over time (e.g. invoiced vs collected per month). */
export function ColumnSeries({
  labels,
  series,
  ariaLabel,
  format = (n: number) => String(n),
  periodHead,
  size = "normal",
}: {
  labels: string[];
  series: { name: string; color: string; values: number[] }[];
  ariaLabel: string;
  format?: (n: number) => string;
  periodHead: string;
  size?: ChartSize;
}) {
  const { W, H, maxLabels } = DIMS[size];
  const max = niceMax(Math.max(0, ...series.flatMap((s) => s.values)));
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const slot = innerW / Math.max(1, labels.length);
  const groupW = slot * 0.68;
  const barW = groupW / Math.max(1, series.length);
  const ticks = [0, 0.25, 0.5, 0.75, 1];
  const every = Math.ceil(labels.length / maxLabels);
  return (
    <figure className="m-0" aria-label={ariaLabel}>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={ariaLabel}>
        {ticks.map((t) => {
          const y = PAD.top + innerH * (1 - t);
          return (
            <g key={t}>
              <line x1={PAD.left} x2={W - PAD.right} y1={y} y2={y} stroke="currentColor" className="text-ink/10" strokeWidth={1} />
              <text x={PAD.left - 6} y={y + 3} textAnchor="end" className="fill-current text-muted" fontSize={12}>
                {format(max * t)}
              </text>
            </g>
          );
        })}
        {labels.map((label, i) => {
          const x0 = PAD.left + slot * i + (slot - groupW) / 2;
          return (
            <g key={label}>
              {series.map((s, j) => {
                const v = s.values[i] ?? 0;
                const h = (v / max) * innerH;
                return (
                  <rect
                    key={s.name}
                    x={x0 + barW * j + 1}
                    y={PAD.top + innerH - h}
                    width={Math.max(1, barW - 2)}
                    height={h}
                    rx={2}
                    fill={s.color}
                  >
                    <title>{`${label} · ${s.name}: ${format(v)}`}</title>
                  </rect>
                );
              })}
              {i % every === 0 ? (
                <text x={PAD.left + slot * i + slot / 2} y={H - 8} textAnchor="middle" className="fill-current text-muted" fontSize={12}>
                  {label}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
      {series.length > 1 ? (
        <figcaption className="mt-2 flex flex-wrap gap-4 text-xs text-muted" aria-hidden>
          {series.map((s) => (
            <span key={s.name} className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-sm" style={{ background: s.color }} />
              {s.name}
            </span>
          ))}
        </figcaption>
      ) : null}
      <SrTable
        caption={ariaLabel}
        head={[periodHead, ...series.map((s) => s.name)]}
        rows={labels.map((l, i) => [l, ...series.map((s) => format(s.values[i] ?? 0))])}
      />
    </figure>
  );
}

/** Line over time with gaps for empty periods (e.g. average rating). */
export function LineSeries({
  labels,
  values,
  ariaLabel,
  min = 0,
  max,
  format = (n: number) => String(n),
  periodHead,
  valueHead,
  size = "normal",
}: {
  size?: ChartSize;
  labels: string[];
  values: (number | null)[];
  ariaLabel: string;
  min?: number;
  max?: number;
  format?: (n: number) => string;
  periodHead: string;
  valueHead: string;
}) {
  const { W, H, maxLabels } = DIMS[size];
  const top = max ?? niceMax(Math.max(0, ...values.filter((v): v is number => v !== null)));
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const xAt = (i: number) =>
    PAD.left + (labels.length <= 1 ? innerW / 2 : (innerW * i) / (labels.length - 1));
  const yAt = (v: number) => PAD.top + innerH * (1 - (v - min) / Math.max(1e-9, top - min));
  const segments: string[] = [];
  let cur: string[] = [];
  values.forEach((v, i) => {
    if (v === null) {
      if (cur.length) segments.push(cur.join(" "));
      cur = [];
    } else cur.push(`${xAt(i)},${yAt(v)}`);
  });
  if (cur.length) segments.push(cur.join(" "));
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => min + (top - min) * t);
  const every = Math.ceil(labels.length / maxLabels);
  return (
    <figure className="m-0" aria-label={ariaLabel}>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={ariaLabel}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.left} x2={W - PAD.right} y1={yAt(t)} y2={yAt(t)} stroke="currentColor" className="text-ink/10" strokeWidth={1} />
            <text x={PAD.left - 6} y={yAt(t) + 3} textAnchor="end" className="fill-current text-muted" fontSize={12}>
              {format(t)}
            </text>
          </g>
        ))}
        {segments.map((pts) => (
          <polyline key={pts} points={pts} fill="none" stroke="var(--bronze)" strokeWidth={2.25} strokeLinejoin="round" strokeLinecap="round" />
        ))}
        {values.map((v, i) =>
          v === null ? null : (
            <circle key={labels[i]} cx={xAt(i)} cy={yAt(v)} r={3.5} fill="var(--bronze)">
              <title>{`${labels[i]}: ${format(v)}`}</title>
            </circle>
          ),
        )}
        {labels.map((l, i) =>
          i % every === 0 ? (
            <text key={l} x={xAt(i)} y={H - 8} textAnchor="middle" className="fill-current text-muted" fontSize={12}>
              {l}
            </text>
          ) : null,
        )}
      </svg>
      <SrTable
        caption={ariaLabel}
        head={[periodHead, valueHead]}
        rows={labels.map((l, i) => [l, values[i] === null ? "—" : format(values[i] as number)])}
      />
    </figure>
  );
}

export function KpiTile({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <li className="admin-stat admin-stat-lift">
      <p className="admin-stat-label">{label}</p>
      <p className="admin-stat-value mt-1 tabular-nums">{value}</p>
      {hint ? <p className="mt-1 text-[0.6875rem] leading-snug text-muted">{hint}</p> : null}
    </li>
  );
}

/** "oct. 2026" style month label for a YYYY-MM key. */
export function formatMonthKey(key: string, locale: string): string {
  const [y, m] = key.split("-").map(Number);
  const month = new Date(Date.UTC(y, m - 1, 15))
    .toLocaleDateString(locale === "es" ? "es-CO" : "en-US", { month: "short", timeZone: "UTC" })
    .replace(".", "");
  return `${month} ${String(y).slice(2)}`;
}
