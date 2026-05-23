import type { Difficulty, ProblemKind } from "@/problems/data/problem";
import { CompanyChip } from "@/problems/shared/CompanyChip";
import { DifficultyBadge } from "@/problems/shared/DifficultyBadge";
import { KindBadge } from "@/problems/shared/KindBadge";
import { Tag } from "@/problems/shared/Tag";
import { titleizeSlug } from "@/problems/shared/format";

type ProblemTitleBarProps = {
  number: number;
  title: string;
  kind: ProblemKind;
  difficulty: Difficulty;
  tags: readonly string[];
  companies: readonly string[];
};

/**
 * Full-width problem identity banner spanning the workspace, between the top bar and the panels:
 * number, title, kind/difficulty badges, topic tags, and (right-aligned) company avatars. Shared by
 * the algo and build workspaces so a problem reads the same on either.
 */
export const ProblemTitleBar = ({
  number,
  title,
  kind,
  difficulty,
  tags,
  companies,
}: ProblemTitleBarProps) => (
  <div className="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-2 border-b border-sidebar-border bg-card px-5 py-3 font-sans tracking-normal">
    <span className="text-sm tabular-nums text-muted-foreground">
      #{String(number).padStart(2, "0")}
    </span>
    <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
    <KindBadge kind={kind} />
    <DifficultyBadge difficulty={difficulty} />
    {tags.map((tag) => (
      <Tag key={tag}>{titleizeSlug(tag)}</Tag>
    ))}
    {companies.length > 0 ? (
      <div className="ml-auto flex flex-wrap items-center gap-2 pl-3">
        {companies.map((company) => (
          <CompanyChip key={company} company={company} filled />
        ))}
      </div>
    ) : null}
  </div>
);
