import type { Metadata, Viewport } from "next";
import "@fontsource/roboto/latin-400.css";
import "./globals.css";

const description =
  "Sentinel detects relevant events and directs your team’s attention where it is needed most.";

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
