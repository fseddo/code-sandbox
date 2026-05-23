import { CompanyAvatar } from "@/problems/shared/CompanyAvatar";
import { Tag } from "@/problems/shared/Tag";
import { titleizeSlug } from "@/problems/shared/format";

/** Company avatar + name. `filled` wraps it in a muted `Tag` pill (title bar); bare otherwise (catalog row). */
export const CompanyChip = ({ company, filled = false }: { company: string; filled?: boolean }) => {
  const label = titleizeSlug(company);
  if (filled) {
    return (
      <Tag>
        <CompanyAvatar company={company} className="size-4 text-[0.55rem]" />
        {label}
      </Tag>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <CompanyAvatar company={company} />
      {label}
    </span>
  );
};
