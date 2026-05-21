import { Separator } from "react-resizable-panels";
import { cn } from "@/lib/utils";

/** A thin draggable divider for react-resizable-panels Groups. */
export const ResizeBar = ({ axis }: { axis: "x" | "y" }) => (
  <Separator
    className={cn("bg-border transition-colors hover:bg-primary", axis === "x" ? "w-px" : "h-px")}
  />
);
