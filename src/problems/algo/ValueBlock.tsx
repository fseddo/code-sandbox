import { cn } from "@/lib/utils";

type ValueBlockProps = {
  label: string;
  children: React.ReactNode;
  tone?: "default" | "ok" | "danger";
};

/** A small uppercase label over a mono value box — the Input/Stdout/Output/Expected unit. */
export const ValueBlock = ({ label, children, tone = "default" }: ValueBlockProps) => (
  <div className="flex flex-col gap-1.5">
    <span className="text-xs text-muted-foreground">{label}</span>
    <pre
      className={cn(
        "overflow-auto rounded-md border border-border bg-background px-3 py-2 font-mono text-xs",
        tone === "ok" && "text-ok",
        tone === "danger" && "text-danger",
      )}
    >
      {children}
    </pre>
  </div>
);
