import type { Metadata, Viewport } from "next";
import "@fontsource/roboto/latin-400.css";
import "@fontsource/roboto/latin-500.css";
import "@fontsource/roboto/latin-700.css";
import "./globals.css";

const description =
  "Sentinel detects relevant events and directs your team’s attention where it is needed most.";

// Runs in the head before content can paint, independently of hydration.
const motionStartup = `(() => {
  const root = document.documentElement;
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  if (!('IntersectionObserver' in window) || !Element.prototype.animate || !document.fonts) return;
  const restored = performance.getEntriesByType('navigation')[0]?.type === 'back_forward';
  root.dataset.motionStartup = preference.matches || location.hash || restored || scrollY > 0 ? 'bypass' : 'pending';
  const bypass = () => {
    if (root.dataset.motionStartup === 'pending') root.dataset.motionStartup = 'bypass';
  };
  const focus = (event) => {
    if (event.target instanceof Element && event.target.matches(':focus-visible')) bypass();
  };
  const pageShow = (event) => { if (event.persisted || scrollY > 0) bypass(); };
  const change = () => { if (preference.matches) bypass(); };
  const stop = () => {
    clearTimeout(watchdog);
    preference.removeEventListener('change', change);
    document.removeEventListener('focusin', focus);
    window.removeEventListener('hashchange', bypass);
    window.removeEventListener('pageshow', pageShow);
    window.removeEventListener('sentinel-motion-ready', stop);
    window.removeEventListener('sentinel-motion-failed', fail);
  };
  const fail = () => { root.dataset.motionStartup = 'static'; stop(); };
  const watchdog = setTimeout(() => {
    fail();
    window.dispatchEvent(new Event('sentinel-motion-failed'));
  }, 4000);
  preference.addEventListener('change', change);
  document.addEventListener('focusin', focus);
  window.addEventListener('hashchange', bypass);
  window.addEventListener('pageshow', pageShow);
  window.addEventListener('sentinel-motion-ready', stop);
  window.addEventListener('sentinel-motion-failed', fail);
})();`;

export const metadata: Metadata = {
  title: "Sentinel | Operational intelligence",
  description,
};

export const viewport: Viewport = {
  themeColor: "#050B16",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionStartup }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
