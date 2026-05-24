import type { LearnCategory, Priority } from "@/learn/data/topic";

/**
 * Per-category and per-priority accent classes — the single source for the catalog's colored bubbles, the
 * article header's badges / underlines, and nested-section borders. The app is forced-dark, so only
 * dark-appropriate shades. Classes are written out in full (not built dynamically) so Tailwind keeps them.
 */
export const CATEGORY_ACCENT: Record<
  LearnCategory,
  { badge: string; underline: string; border: string }
> = {
  "data-structures": { badge: "bg-sky-500/15 text-sky-300", underline: "border-sky-500/70", border: "border-sky-500/40" },
  algorithms: { badge: "bg-violet-500/15 text-violet-300", underline: "border-violet-500/70", border: "border-violet-500/40" },
  complexity: { badge: "bg-amber-500/15 text-amber-300", underline: "border-amber-500/70", border: "border-amber-500/40" },
  databases: { badge: "bg-emerald-500/15 text-emerald-300", underline: "border-emerald-500/70", border: "border-emerald-500/40" },
  web: { badge: "bg-rose-500/15 text-rose-300", underline: "border-rose-500/70", border: "border-rose-500/40" },
  systems: { badge: "bg-orange-500/15 text-orange-300", underline: "border-orange-500/70", border: "border-orange-500/40" },
};

/** Priority pill classes (dark shades). High = warm/urgent, mid = amber, low = cool/neutral. */
export const PRIORITY_ACCENT: Record<Priority, { badge: string; label: string }> = {
  high: { badge: "bg-rose-500/15 text-rose-300", label: "High priority" },
  mid: { badge: "bg-amber-500/15 text-amber-300", label: "Mid priority" },
  low: { badge: "bg-slate-500/15 text-slate-300", label: "Low priority" },
};
