import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const TAG_SIZE = {
  sm: "text-[0.7rem]",
  md: "text-xs",
} as const;

export type TagSize = keyof typeof TAG_SIZE;

/** A muted rounded pill — topic tags and (composed into `CompanyChip`) company chips. */
export const Tag = ({
  size = "md",
  className,
  children,
}: {
  size?: TagSize;
  className?: string;
  children: ReactNode;
}) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 rounded bg-muted px-1.5 py-0.5 text-muted-foreground",
      TAG_SIZE[size],
      className,
    )}
  >
    {children}
  </span>
);
