type SiteCreditProps = {
  tone?: "dark" | "admin";
  className?: string;
};

export default function SiteCredit({
  tone = "dark",
  className = "",
}: SiteCreditProps) {
  const textClass = tone === "dark" ? "text-cream/45" : "text-muted";
  const linkClass =
    tone === "dark"
      ? "text-cream/70 hover:text-bronze"
      : "text-ink/75 hover:text-bronze";

  return (
    <p className={`text-xs ${textClass} ${className}`}>
      Website crafted by{" "}
      <a
        href="https://datelica.com"
        target="_blank"
        rel="noopener noreferrer"
        className={`focus-ring rounded font-semibold transition ${linkClass}`}
      >
        Datelica
      </a>
    </p>
  );
}
