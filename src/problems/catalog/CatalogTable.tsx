import type { CatalogItem } from "@/problems/catalog/catalogFilters";
import { ProblemRow, ROW_GRID } from "@/problems/catalog/ProblemRow";

const HEADERS = ["#", "Problem", "Companies", "Type", "Difficulty", ""] as const;

/** The problem list: a column header that shares the row grid, then one `ProblemRow` per item. */
export const CatalogTable = ({ items }: { items: CatalogItem[] }) => {
  if (items.length === 0)
    return (
      <p className="rounded-lg border border-dashed border-border px-4 py-12 text-center text-sm text-muted-foreground">
        No problems match these filters.
      </p>
    );

  return (
    <div className="flex flex-col gap-2">
      <div
        className={`${ROW_GRID} px-4 text-[0.7rem] font-medium uppercase tracking-wider text-muted-foreground`}
      >
        {HEADERS.map((header, index) => (
          <span key={header || index} className={index === 2 ? "text-right" : undefined}>
            {header}
          </span>
        ))}
      </div>

      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item.id}>
            <ProblemRow item={item} />
          </li>
        ))}
      </ul>
    </div>
  );
};
