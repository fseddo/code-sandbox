import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";
import type { CatalogItem } from "./catalogFilters";
import { CompanyAvatar } from "./CompanyAvatar";
import { DifficultyBadge } from "./DifficultyBadge";
import { KindBadge } from "./KindBadge";
import { StatusDot } from "./StatusDot";
import { titleizeSlug } from "./format";

/** Shared column track for the table header and every row, so their cells line up. */
export const ROW_GRID = "grid grid-cols-[3.25rem_minmax(0,1fr)_auto_auto_auto_1.25rem] items-center gap-4";

const MAX_TAGS = 3;

const Tag = ({ children }: { children: React.ReactNode }) => (
  <span className="rounded bg-muted px-1.5 py-0.5 text-[0.7rem] text-muted-foreground">{children}</span>
);

/** One catalog row, laid out on the shared column grid: number+status, title+tags, companies, kind, difficulty. */
export const ProblemRow = ({ item }: { item: CatalogItem }) => {
  const extraTags = item.tags.length - MAX_TAGS;

  return (
    <Link
      href={`/problems/${item.id}`}
      className={`${ROW_GRID} group rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:border-primary`}
    >
      <span className="flex items-center gap-2">
        <span className="text-xs tabular-nums text-muted-foreground">{String(item.number).padStart(2, "0")}</span>
        <StatusDot status={item.status} />
      </span>

      <div className="flex min-w-0 flex-col gap-1">
        <span className="truncate font-medium">{item.title}</span>
        {item.tags.length > 0 ? (
          <div className="flex flex-wrap items-center gap-1">
            {item.tags.slice(0, MAX_TAGS).map((tag) => (
              <Tag key={tag}>{titleizeSlug(tag)}</Tag>
            ))}
            {extraTags > 0 ? <span className="text-[0.7rem] text-muted-foreground">+{extraTags}</span> : null}
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2">
        {item.companies.map((company) => (
          <span key={company} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <CompanyAvatar company={company} />
            {titleizeSlug(company)}
          </span>
        ))}
      </div>

      <KindBadge kind={item.kind} />
      <DifficultyBadge difficulty={item.difficulty} />

      <LuArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
    </Link>
  );
};
