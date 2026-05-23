"use client";

import { useRef, useState } from "react";
import type { PanelImperativeHandle } from "react-resizable-panels";

/** Below this on-resize percentage the pane reads as collapsed (its header strip only). */
const COLLAPSE_THRESHOLD = 7;
/** Kept in sync with the `.panels-animating` transition in globals.css. */
const ANIMATE_MS = 240;

/**
 * Collapse mechanics for one resizable Panel: the imperative handle, the collapsed flag derived
 * from `onResize`, and a `toggle` that animates by transitioning every sibling panel's flex-grow
 * for the duration of the programmatic collapse/expand (live dragging stays un-animated).
 */
export const useCollapsiblePanel = () => {
  const panelRef = useRef<PanelImperativeHandle>(null);
  const elementRef = useRef<HTMLDivElement>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggle = () => {
    const panel = panelRef.current;
    if (!panel) return;
    const group = elementRef.current?.parentElement;
    if (group) {
      group.classList.add("panels-animating");
      window.setTimeout(() => group.classList.remove("panels-animating"), ANIMATE_MS);
    }
    if (panel.isCollapsed()) panel.expand();
    else panel.collapse();
  };

  const onResize = (size: { asPercentage: number }) =>
    setIsCollapsed(size.asPercentage <= COLLAPSE_THRESHOLD);

  return { panelRef, elementRef, isCollapsed, toggle, onResize };
};
