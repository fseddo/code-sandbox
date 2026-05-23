import { cn } from "@/lib/utils";

type UnderlineTabsProps<T extends string> = {
  tabs: readonly T[];
  labelOf: Record<T, string>;
  active: T;
  /** Omit to render static, non-interactive labels (a single styled header that matches an active tab). */
  onSelect?: (tab: T) => void;
  /** Extra classes for the tablist container, merged over the default `flex items-stretch`. */
  className?: string;
  /** Per-tab padding/size, replacing the default `px-3 pb-2 text-sm`. */
  tabClassName?: string;
};

/** A row of tabs with an underline on the active one. Interactive when `onSelect` is given, static otherwise. */
export const UnderlineTabs = <T extends string>({
  tabs,
  labelOf,
  active,
  onSelect,
  className,
  tabClassName,
}: UnderlineTabsProps<T>) => (
  <div role={onSelect ? "tablist" : undefined} className={cn("flex items-stretch", className)}>
    {tabs.map((id) => {
      const isActive = id === active;
      const classes = cn(
        "relative font-medium transition-colors",
        tabClassName ?? "px-3 pb-2 text-sm",
        isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
      );
      const underline = isActive ? (
        <span aria-hidden className="absolute right-0 bottom-0 left-0 h-0.5 bg-primary" />
      ) : null;

      if (!onSelect) {
        return (
          <span key={id} className={classes}>
            {labelOf[id]}
            {underline}
          </span>
        );
      }
      return (
        <button key={id} role="tab" aria-selected={isActive} onClick={() => onSelect(id)} className={classes}>
          {labelOf[id]}
          {underline}
        </button>
      );
    })}
  </div>
);
