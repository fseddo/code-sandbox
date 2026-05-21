import { LuCheck, LuX } from "react-icons/lu";
import type { SubmissionOutcome, TestResult } from "./problem";
import { cn } from "@/lib/utils";

const stringify = (value: unknown) => {
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
};

const Banner = ({ tone, children }: { tone: "danger" | "warn"; children: React.ReactNode }) => (
  <div
    className={cn(
      "rounded-md border p-3 text-sm",
      tone === "danger" ? "border-danger/40 bg-danger/8 text-danger" : "border-warn/40 bg-warn/8 text-warn",
    )}
  >
    {children}
  </div>
);

const ResultRow = ({ result }: { result: TestResult }) => (
  <li className="flex flex-col gap-1.5 rounded-md border border-border bg-background p-3">
    <div className="flex items-center gap-2 text-sm">
      <span
        className={cn(
          "flex size-4 items-center justify-center rounded-full",
          result.passed ? "bg-ok/15 text-ok" : "bg-danger/15 text-danger",
        )}
      >
        {result.passed ? <LuCheck className="size-3" /> : <LuX className="size-3" />}
      </span>
      <span className="font-medium">{result.name}</span>
      <span className="ml-auto text-xs text-muted-foreground">{result.ms.toFixed(1)}ms</span>
    </div>

    {!result.passed && (
      <div className="flex flex-col gap-0.5 pl-6 font-mono text-xs">
        {result.error ? (
          <span className="text-danger">{result.error}</span>
        ) : (
          <>
            <span>
              <span className="text-muted-foreground">expected </span>
              {stringify(result.expected)}
            </span>
            <span>
              <span className="text-muted-foreground">got </span>
              {stringify(result.actual)}
            </span>
          </>
        )}
      </div>
    )}

    {result.logs.length > 0 && (
      <pre className="ml-6 overflow-auto rounded bg-muted/50 p-2 font-mono text-xs text-muted-foreground">
        {result.logs.join("\n")}
      </pre>
    )}
  </li>
);

export const ResultsPanel = ({ outcome }: { outcome: SubmissionOutcome | null }) => {
  if (!outcome) {
    return (
      <div className="flex h-full items-center justify-center bg-card p-5 text-sm text-muted-foreground">
        Run your solution to see results.
      </div>
    );
  }

  if (outcome.status === "compile-error" || outcome.status === "crashed") {
    return (
      <div className="h-full overflow-auto bg-card p-5">
        <Banner tone="danger">{outcome.message}</Banner>
      </div>
    );
  }

  if (outcome.status === "timeout") {
    return (
      <div className="h-full overflow-auto bg-card p-5">
        <Banner tone="warn">Timed out after {outcome.ms}ms — check for an infinite loop.</Banner>
      </div>
    );
  }

  const passed = outcome.results.filter((result) => result.passed).length;
  const allPassed = passed === outcome.results.length;

  return (
    <div className="flex h-full flex-col gap-3 overflow-auto bg-card p-5">
      <div className={cn("text-sm font-medium", allPassed ? "text-ok" : "text-danger")}>
        {passed} / {outcome.results.length} cases passed
      </div>
      <ul className="flex flex-col gap-2">
        {outcome.results.map((result, index) => (
          <ResultRow key={index} result={result} />
        ))}
      </ul>
    </div>
  );
};
