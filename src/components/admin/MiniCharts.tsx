/** Pure SVG/CSS charts — zero chart library weight. */

export function BarChart({
  values,
  labels,
  max,
}: {
  values: number[];
  labels: string[];
  max?: number;
}) {
  const peak = max ?? Math.max(1, ...values);
  return (
    <div className="admin-bar-chart" role="img" aria-label="Bar chart">
      {values.map((v, i) => {
        const h = Math.round((v / peak) * 100);
        return (
          <div key={labels[i] ?? i} className="admin-bar-col">
            <div className="admin-bar-track">
              <div
                className="admin-bar-fill"
                style={{ height: `${h}%` }}
                title={`${labels[i]}: ${v}`}
              />
            </div>
            <span className="admin-bar-label">{labels[i]}</span>
            <span className="admin-bar-value tabular-nums">{v}</span>
          </div>
        );
      })}
    </div>
  );
}

export function DonutChart({
  segments,
  size = 120,
}: {
  segments: { label: string; value: number; color: string }[];
  size?: number;
}) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const r = 42;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="flex flex-wrap items-center gap-4">
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className="-rotate-90"
        role="img"
        aria-label="Donut chart"
      >
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          className="text-ink/8"
        />
        {segments.map((seg) => {
          const len = (seg.value / total) * c;
          const dash = `${len} ${c - len}`;
          const el = (
            <circle
              key={seg.label}
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth="10"
              strokeDasharray={dash}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
            />
          );
          offset += len;
          return el;
        })}
      </svg>
      <ul className="min-w-0 flex-1 space-y-1.5 text-xs">
        {segments.map((seg) => (
          <li key={seg.label} className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 text-muted">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ background: seg.color }}
                aria-hidden
              />
              {seg.label}
            </span>
            <span className="font-semibold tabular-nums text-ink">{seg.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Sparkline({
  values,
  width = 160,
  height = 40,
}: {
  values: number[];
  width?: number;
  height?: number;
}) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(1, max - min);
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = height - ((v - min) / span) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
      role="img"
      aria-label="Trend sparkline"
    >
      <polyline
        fill="none"
        stroke="var(--bronze)"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={pts}
      />
    </svg>
  );
}
