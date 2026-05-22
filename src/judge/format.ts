/** Turn a kebab-case slug (`new-york-times`, `binary-tree`) into a Title Case label. */
export const titleizeSlug = (slug: string): string =>
  slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

/** Render a judge value (args, expected, actual) for display, falling back to String() on cyclic data. */
export const stringify = (value: unknown): string => {
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
};
