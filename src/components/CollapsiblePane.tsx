"use client";

import type { ReactNode } from "react";
import type { IconType } from "react-icons";
import { LuChevronDown, LuChevronLeft, LuChevronRight, LuChevronUp } from "react-icons/lu";
import { Panel } from "react-resizable-panels";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCollapsiblePanel } from "@/components/useCollapsiblePanel";

/** Direction the body grows on expand — sets the chevron and (via the Group's orientation) the collapse axis. */
type ExpandToward = "up" | "down" | "left" | "right";

const COLLAPSED_ICON: Record<ExpandToward, IconType> = {
  up: LuChevronUp,
  down: LuChevronDown,
  left: LuChevronLeft,
  right: LuChevronRight,
};
const EXPANDED_ICON: Record<ExpandToward, IconType> = {
  up: LuChevronDown,
  down: LuChevronUp,
  left: LuChevronRight,
  right: LuChevronLeft,
};

type CollapsiblePaneProps = {
  id: string;
  /** Left side of the header strip — a label or tabs. */
  header: ReactNode;
  /** Optional right-side action cluster, rendered before the collapse chevron. */
  actions?: ReactNode;
  expandToward: ExpandToward;
  defaultSize: string;
  minSize: string;
  /** Panel size when collapsed; keep it tall/wide enough to show the header strip so the chevron stays reachable. */
  collapsedSize: string;
  /** Classes for the pane surface (e.g. `bg-sidebar`), merged over the flex column. */
  className?: string;
  children: ReactNode;
};

/** The size/axis knobs a caller forwards when it owns the surrounding Group's orientation. */
export type CollapsiblePaneLayout = Pick<
  CollapsiblePaneProps,
  "expandToward" | "defaultSize" | "minSize" | "collapsedSize"
>;

/**
 * A resizable Panel that collapses to its header strip (not to zero), with an axis-aware chevron and
 * a slide animation. The header is a slot so each caller keeps its own label/tabs/actions; the
 * collapse mechanics live in {@link useCollapsiblePanel}.
 */
export const CollapsiblePane = ({
  id,
  header,
  actions,
  expandToward,
  defaultSize,
  minSize,
  collapsedSize,
  className,
  children,
}: CollapsiblePaneProps) => {
  const { panelRef, elementRef, isCollapsed, toggle, onResize } = useCollapsiblePanel();
  const isHorizontal = expandToward === "left" || expandToward === "right";
  // Vertical panes share one disclosure convention (collapsed ▲ / open ▼) regardless of which edge
  // they're anchored to, so two stacked panes don't show mirror-image chevrons; only the horizontal
  // axis keeps a left/right distinction.
  const Chevron = isHorizontal
    ? isCollapsed
      ? COLLAPSED_ICON[expandToward]
      : EXPANDED_ICON[expandToward]
    : isCollapsed
      ? LuChevronUp
      : LuChevronDown;

  const chevronButton = (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label={isCollapsed ? "Expand" : "Collapse"}
      title={isCollapsed ? "Expand" : "Collapse"}
      onClick={toggle}
    >
      <Chevron className="size-4" />
    </Button>
  );

  return (
    <Panel
      id={id}
      className="min-h-0 min-w-0"
      panelRef={panelRef}
      elementRef={elementRef}
      defaultSize={defaultSize}
      minSize={minSize}
      collapsible
      collapsedSize={collapsedSize}
      onResize={onResize}
    >
      {isHorizontal && isCollapsed ? (
        // Collapsed width clips a top header strip, so show a thin vertical rail with only the chevron.
        <div className={cn("flex h-full justify-center pt-1.5", className)}>{chevronButton}</div>
      ) : (
        <div className={cn("flex h-full flex-col", className)}>
          <div className="flex h-9 shrink-0 items-center border-b pr-1.5">
            {header}
            <div className="ml-auto flex items-center gap-1">
              {actions}
              {chevronButton}
            </div>
          </div>
          <div className={cn("min-h-0 flex-1", isCollapsed && "hidden")}>{children}</div>
        </div>
      )}
    </Panel>
  );
};
