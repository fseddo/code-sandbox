import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * One titled article section — the single source for the heading hierarchy shared by the topic page
 * ([LearnArticle](./LearnArticle.tsx)) and the study-guide problem page ([ProblemGuide](../guide/ProblemGuide.tsx)).
 * Top-level sections get a `text-lg` heading with a category-accent underline; nested ones get a small
 * uppercase label with an accent left-border. `accent` comes from `CATEGORY_ACCENT`.
 */
export const ArticleSection = ({
  label,
  accent,
  nested = false,
  id,
  children,
}: {
  label: string;
  accent: { underline: string; border: string };
  nested?: boolean;
  /** Anchor id for the "On this page" nav (top-level sections only). */
  id?: string;
  children: ReactNode;
}) => {
  const Heading = nested ? "h3" : "h2";
  return (
    <section id={id} className={cn("space-y-4 scroll-mt-6", nested && cn("border-l-2 pl-4", accent.border))}>
      <Heading
        className={cn(
          nested
            ? "text-xs font-semibold uppercase tracking-wide text-muted-foreground"
            : cn("inline-block border-b-2 pb-1 text-lg font-semibold tracking-tight", accent.underline),
        )}
      >
        {label}
      </Heading>
      <div className="space-y-6">{children}</div>
    </section>
  );
};
