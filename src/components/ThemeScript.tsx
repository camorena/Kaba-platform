/**
 * Blocking inline script to apply next-themes class before paint (no FOUC).
 * Must stay in sync with ThemeProvider attribute/storageKey/defaultTheme.
 */
export default function ThemeScript() {
  const code = `(function(){try{var d=document.documentElement;var k='theme';var s=localStorage.getItem(k);var t=s||'system';var m=window.matchMedia('(prefers-color-scheme: dark)');var r=t==='system'?(m.matches?'dark':'light'):t;d.classList.remove('light','dark');d.classList.add(r);d.style.colorScheme=r;}catch(e){}})();`;
  return (
    <script
      dangerouslySetInnerHTML={{ __html: code }}
      suppressHydrationWarning
    />
  );
}
