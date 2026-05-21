import { LuCheck, LuX } from "react-icons/lu";
import { cn } from "@/lib/utils";

/** Per-case status drives the chip icon in the Test Result tab; the Testcase tab passes none. */
type CaseStatus = "pass" | "fail";

type CaseTabsProps = {
  count: number;
  active: number;
  onSelect: (index: number) => void;
  statusAt?: (index: number) => CaseStatus | undefined;
};

/** Case 1 / Case 2 … chips, shared by the Testcase tab and the Test Result tab. */
export const CaseTabs = ({ count, active, onSelect, statusAt }: CaseTabsProps) => (
  <div className="flex flex-wrap items-center gap-2">
    {Array.from({ length: count }, (_, index) => {
      const status = statusAt?.(index);
      const isActive = index === active;
      return (
        <button
          key={index}
          type="button"
          onClick={() => onSelect(index)}
          aria-pressed={isActive}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
            isActive ? "bg-accent text-accent-foreground" : "bg-background text-muted-foreground hover:text-foreground",
          )}
        >
          {status === "pass" && <LuCheck className="size-3 text-ok" />}
          {status === "fail" && <LuX className="size-3 text-danger" />}
          Case {index + 1}
        </button>
      );
    })}
  </div>
);
