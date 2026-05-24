import { LuArrowLeft } from "react-icons/lu";
import type { ArticlePartDetail, ArticlePartKey, LearnTopic } from "@/learn/data/topic";
import { ARTICLE_PARTS } from "@/learn/data/topic";
import { cn, typedEntries } from "@/lib/utils";
import { FILTER_CACHE_KEY } from "@/lib/filterParams";
import { FilteredBackLink } from "@/components/FilteredBackLink";
import type { ProblemSummary } from "@/problems/data/problems";
import { CATEGORY_ACCENT } from "@/learn/shared/categoryTheme";
import { CategoryBadge } from "@/learn/shared/CategoryBadge";
import { SectionRenderer } from "./SectionRenderer";

export const LearnArticle = ({
  topic,
  problemsById,
}: {
  topic: LearnTopic;
  problemsById: Record<string, ProblemSummary>;
}) => {
  const accent = CATEGORY_ACCENT[topic.category];

  return (
    <article className="mx-auto max-w-3xl space-y-8 px-6 py-10">
      <header className="space-y-3">
        <FilteredBackLink
          base="/learn"
          cacheKey={FILTER_CACHE_KEY.learn}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <LuArrowLeft className="size-3.5" />
          Learn
        </FilteredBackLink>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">{topic.title}</h1>
          <CategoryBadge category={topic.category} />
        </div>
        <p className="text-sm text-muted-foreground">{topic.summary}</p>
      </header>

      <div className="space-y-8">
        {typedEntries<ArticlePartKey, ArticlePartDetail>(ARTICLE_PARTS).map(([key, detail]) => {
          const blocks = topic.parts[key];
          if (!blocks?.length) return null;
          const nested = Boolean(detail.parent);
          const Heading = nested ? "h3" : "h2";
          return (
            <section key={key} className={cn("space-y-4", nested && cn("border-l-2 pl-4", accent.border))}>
              <Heading
                className={cn(
                  nested
                    ? "text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                    : cn("inline-block border-b-2 pb-1 text-lg font-semibold tracking-tight", accent.underline),
                )}
              >
                {detail.label}
              </Heading>
              <div className="space-y-6">
                {blocks.map((section, index) => (
                  <SectionRenderer key={index} section={section} problemsById={problemsById} />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {topic.sources && topic.sources.length > 0 && (
        <footer className="space-y-2 border-t border-border pt-6">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Sources</h2>
          <ul className="space-y-1">
            {topic.sources.map((source) => (
              <li key={source.url}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-primary underline-offset-2 hover:underline"
                >
                  {source.label}
                </a>
              </li>
            ))}
          </ul>
        </footer>
      )}
    </article>
  );
};
