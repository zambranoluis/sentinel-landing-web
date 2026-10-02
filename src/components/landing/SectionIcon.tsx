const paths: Record<string, string> = {
  cart: "M3 4h3l3 12h11l3-9H7M10 21h.01M19 21h.01",
  pill: "M9 4a5 5 0 0 1 7 7l-5 5a5 5 0 0 1-7-7l5-5ZM7 6l7 7",
  utensils: "M4 3v6c0 3 6 3 6 0V3M7 3v19M20 22V3c-5 1-6 10-2 11h2",
  factory: "M3 21V9l6 4V8l6 4V3h5l1 18H3ZM7 17h1m4 0h1m4 0h1",
  fuel: "M4 21V4h11v17M2 21h15M7 8h5m4-3 4 4v8a2 2 0 0 0 4 0v-5l-4-4",
  pulse: "M2 12h5l3-8 4 16 3-8h5",
  document: "M6 2h9l5 5v15H6V2Zm9 0v6h5M9 12h8m-8 4h8",
  shield:
    "M12 2c3 3 6 4 9 4 0 8-3 13-9 16C6 19 3 14 3 6c3 0 6-1 9-4Zm-4 9 3 3 5-5",
  camera: "M3 6h13v13H3V6Zm13 5 6-4v11l-6-4",
  layers: "m12 2 10 5-10 5L2 7l10-5ZM2 12l10 5 10-5M2 17l10 5 10-5",
  expand: "M3 12h9v9H3v-9Zm4 2v5m-2-2h5M7 9V3h4m5 0h5v5h-5V3Zm-1 13h6m-3-3v6",
  check: "m5 12 4 4L19 6",
  play: "m9 5 11 7-11 7V5Z",
  pause: "M8 5v14M16 5v14",
  arrow: "M4 12h16m-6-6 6 6-6 6",
};

export function SectionIcon({ name }: { name: string }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 26 26"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name] ?? paths.document} />
    </svg>
  );
}
