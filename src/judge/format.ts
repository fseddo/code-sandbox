/** Render a judge value (args, expected, actual) for display, falling back to String() on cyclic data. */
export const stringify = (value: unknown): string => {
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
};
