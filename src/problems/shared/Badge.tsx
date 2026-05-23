import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** The shared pill shape behind `DifficultyBadge` / `KindBadge`; pass tint (and any extras) via `className`. */
export const Badge = ({ className, children }: { className?: string; children: ReactNode }) => (
  <span className={cn("inline-flex h-5 items-center rounded-full px-2 text-xs font-medium", className)}>
    {children}
  </span>
);
