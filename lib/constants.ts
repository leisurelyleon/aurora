export interface NavItem {
  id: string;
  label: string;
}

/**
 * Single source of truth for the nav and the scroll-spy. Exported as a stable
 * module-level constant so hooks can depend on it without re-running effects.
 */
export const NAV_ITEMS: NavItem[] = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "features", label: "Features" },
  { id: "showcase", label: "Showcase" },
  { id: "contact", label: "Contact" },
];

export const SECTION_IDS: string[] = NAV_ITEMS.map((item) => item.id);
