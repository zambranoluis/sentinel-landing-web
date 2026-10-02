import { destinationHref, type NavigationItem } from "./navigation";

export function NavigationLabel({ item }: { item: NavigationItem }) {
  const href = destinationHref(item.destination);
  return href ? (
    <a href={href} tabIndex={0}>
      {item.label}
    </a>
  ) : (
    <span>{item.label}</span>
  );
}
