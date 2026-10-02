export const destinations = {
  home: { available: true, href: "/" },
  howItWorks: { available: false },
  capabilities: { available: false },
  deployment: { available: false },
  plans: { available: false },
  faq: { available: false },
  assessment: { available: false },
  retail: { available: false },
  shops: { available: false },
  restaurants: { available: false },
  manufacturing: { available: false },
  gasStations: { available: false },
  hotels: { available: false },
  about: { available: false },
  contact: { available: false },
  news: { available: false },
  privacy: { available: false },
  terms: { available: false },
  biometrics: { available: false },
} as const satisfies Record<
  string,
  { available: false } | { available: true; href: `/${string}` }
>;

export type Destination = keyof typeof destinations;
export type NavigationItem = Readonly<{
  label: string;
  destination: Destination;
}>;

export function destinationHref(destination: Destination): string | null {
  const target = destinations[destination];
  return target.available ? target.href : null;
}

export const primaryNavigation = [
  { label: "How it works", destination: "howItWorks" },
  { label: "Capabilities", destination: "capabilities" },
  { label: "Deployment", destination: "deployment" },
  { label: "Plans", destination: "plans" },
  { label: "FAQ", destination: "faq" },
] as const satisfies readonly NavigationItem[];

export const footerGroups = [
  {
    label: "Product",
    items: [
      primaryNavigation[0],
      primaryNavigation[1],
      primaryNavigation[2],
      { label: "Request an assessment", destination: "assessment" },
      primaryNavigation[4],
    ],
  },
  {
    label: "Industries",
    items: [
      { label: "Retail", destination: "retail" },
      { label: "Shops & pharmacies", destination: "shops" },
      { label: "Restaurants & bars", destination: "restaurants" },
      { label: "Manufacturing", destination: "manufacturing" },
      { label: "Gas stations", destination: "gasStations" },
      { label: "Hotels", destination: "hotels" },
    ],
  },
  {
    label: "Company",
    items: [
      { label: "About CrimsonTide AI", destination: "about" },
      { label: "Contact", destination: "contact" },
      { label: "News", destination: "news" },
    ],
  },
  {
    label: "Legal",
    items: [
      { label: "Privacy Policy", destination: "privacy" },
      { label: "Terms of Service", destination: "terms" },
      { label: "Biometric & Consent Policy", destination: "biometrics" },
    ],
  },
] as const satisfies readonly {
  label: string;
  items: readonly NavigationItem[];
}[];
