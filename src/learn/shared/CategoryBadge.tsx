import { CATEGORY_LABELS, type LearnCategory } from "@/learn/data/topic";
import { CATEGORY_ACCENT } from "./categoryTheme";
import { cn } from "@/lib/utils";

/** A small colored pill for a topic's category — distinguishes data-structure vs technology rows at a glance. */
export const CategoryBadge = ({ category, className }: { category: LearnCategory; className?: string }) => (
  <span
    className={cn(
      "inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium",
      CATEGORY_ACCENT[category].badge,
      className,
    )}
  >
    {CATEGORY_LABELS[category]}
  </span>
);
