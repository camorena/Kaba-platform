export default function StatusBadge({
  label,
  tone,
}: {
  label: string;
  tone: string;
}) {
  return (
    <span
      className={`admin-badge inline-flex items-center rounded-full px-2 py-[0.2rem] text-[0.625rem] font-bold uppercase tracking-[0.06em] ${tone}`}
    >
      {label}
    </span>
  );
}
