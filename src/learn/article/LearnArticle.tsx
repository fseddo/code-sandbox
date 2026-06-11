import { LuArrowLeft } from "react-icons/lu";
import type { ArticlePartDetail, ArticlePartKey, LearnTopic } from "@/learn/data/topic";
import { ARTICLE_PARTS } from "@/learn/data/topic";
import { cn, typedEntries } from "@/lib/utils";
import { FILTER_CACHE_KEY } from "@/lib/filterParams";
import { FilteredBackLink } from "@/components/FilteredBackLink";
import type { ProblemSummary } from "@/problems/data/problems";
import { CATEGORY_ACCENT, PRIORITY_ACCENT } from "@/learn/shared/categoryTheme";
import { CategoryBadge } from "@/learn/shared/CategoryBadge";
import { ArticleSection } from "./ArticleSection";
import { SectionRenderer } from "./SectionRenderer";

const formatDuration = (minutes: number) => (minutes >= 60 ? `~${Math.round(minutes / 60 * 10) / 10} h` : `~${minutes} min`);

export const LearnArticle = ({
  topic,
  problemsById,
}: {
  topic: LearnTopic;
  problemsById: Record<string, ProblemSummary>;
}) => {
  const accent = CATEGORY_ACCENT[topic.category];
  // Top-level parts that have content — the "On this page" jump list (nested subsections are omitted).
  const navParts = typedEntries<ArticlePartKey, ArticlePartDetail>(ARTICLE_PARTS).filter(
    ([key, detail]) => !detail.parent && (topic.parts[key]?.length ?? 0) > 0,
  );

  return (
    <div className="mx-auto flex max-w-5xl gap-10 px-6 py-10">
      <article className="min-w-0 flex-1 space-y-8">
      <header className="space-y-3">
        <FilteredBackLink
          base="/concepts"
          cacheKey={FILTER_CACHE_KEY.learn}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <LuArrowLeft className="size-3.5" />
          Concepts
        </FilteredBackLink>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="mr-1 text-2xl font-semibold tracking-tight">{topic.title}</h1>
          <CategoryBadge category={topic.category} />
          {topic.priority && (
            <span
              className={cn(
                "inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium",
                PRIORITY_ACCENT[topic.priority].badge,
              )}
            >
              {PRIORITY_ACCENT[topic.priority].label}
            </span>
          )}
          {topic.estimatedMinutes && (
            <span className="inline-flex shrink-0 items-center rounded-full bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">
              {formatDuration(topic.estimatedMinutes)}
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{topic.summary}</p>
      </header>

      <div className="space-y-8">
        {typedEntries<ArticlePartKey, ArticlePartDetail>(ARTICLE_PARTS).map(([key, detail]) => {
          const blocks = topic.parts[key];
          if (!blocks?.length) return null;
          const nested = Boolean(detail.parent);
          return (
            <ArticleSection
              key={key}
              label={detail.label}
              accent={accent}
              nested={nested}
              id={nested ? undefined : key}
            >
              {blocks.map((section, index) => (
                <SectionRenderer key={index} section={section} problemsById={problemsById} />
              ))}
            </ArticleSection>
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

      <nav className="hidden w-44 shrink-0 lg:block">
        <div className="sticky top-8 space-y-1">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground/70">
            On this page
          </p>
          {navParts.map(([key, detail]) => (
            <a
              key={key}
              href={`#${key}`}
              className="block rounded px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {detail.label}
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
};
