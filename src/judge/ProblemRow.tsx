import Link from "next/link";
import { LuArrowRight, LuBuilding2 } from "react-icons/lu";
import type { CatalogItem } from "./catalogFilters";
import { DifficultyBadge } from "./DifficultyBadge";
import { KindBadge } from "./KindBadge";
import { StatusDot } from "./StatusDot";
import { titleizeSlug } from "./format";

const Chip = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
    {children}
  </span>
);

/** One catalog row: status, title, kind/difficulty badges, and topic + company chips. */
export const ProblemRow = ({ item }: { item: CatalogItem }) => (
  <Link
    href={`/problems/${item.id}`}
    className="group flex flex-col gap-2 rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:border-primary"
  >
    <div className="flex items-center gap-2.5">
      <StatusDot status={item.status} />
      <span className="font-medium">{item.title}</span>
      <KindBadge kind={item.kind} />
      <DifficultyBadge difficulty={item.difficulty} />
      <LuArrowRight className="ml-auto size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
    </div>

    {(item.companies.length > 0 || item.tags.length > 0) && (
      <div className="flex flex-wrap items-center gap-1.5 pl-5">
        {item.companies.map((company) => (
          <Chip key={company}>
            <LuBuilding2 className="size-3" />
            {titleizeSlug(company)}
          </Chip>
        ))}
        {item.tags.map((tag) => (
          <Chip key={tag}>{titleizeSlug(tag)}</Chip>
        ))}
      </div>
    )}
  </Link>
);
