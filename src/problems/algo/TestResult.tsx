import { useState } from "react";
import type { ClientProblem, RunMode, SubmissionOutcome, TestResult as TestResultData } from "@/problems/data/problem";
import { CaseTabs } from "@/problems/algo/CaseTabs";
import { ValueBlock } from "@/problems/algo/ValueBlock";
import { ArgsList } from "@/problems/algo/ArgsList";
import { stringify } from "@/problems/shared/format";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Centered = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">{children}</div>
);

/** Full-panel status block for the non-per-case outcomes (compile error, crash, timeout). */
const StatusBlock = ({ title, tone, message }: { title: string; tone: "danger" | "warn"; message: string }) => (
  <div className="flex flex-col gap-2">
    <div className={cn("text-base font-semibold", tone === "danger" ? "text-danger" : "text-warn")}>{title}</div>
    <pre
      className={cn(
        "overflow-auto rounded-md border p-3 font-mono text-xs",
        tone === "danger" ? "border-danger/40 bg-danger/8 text-danger" : "border-warn/40 bg-warn/8 text-warn",
      )}
    >
      {message}
    </pre>
  </div>
);

const CaseDetail = ({
  result,
  problem,
  revealed,
  onReveal,
}: {
  result: TestResultData;
  problem: ClientProblem;
  revealed: boolean;
  onReveal: () => void;
}) => {
  if (result.hidden && !revealed) {
    return (
      <div className="flex flex-col items-start gap-3">
        <p className="text-xs text-muted-foreground">
          Hidden test — input and output stay masked so the case still probes a real solution.
        </p>
        <Button variant="outline" size="sm" onClick={onReveal}>
          Reveal test case
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <ArgsList problem={problem} args={result.args} />
      <ValueBlock label="Stdout">{result.logs.length > 0 ? result.logs.join("\n") : "(no output)"}</ValueBlock>
      {result.error ? (
        <ValueBlock label="Runtime Error" tone="danger">
          {result.error}
        </ValueBlock>
      ) : (
        <ValueBlock label="Output" tone={result.passed ? "ok" : "danger"}>
          {stringify(result.actual)}
        </ValueBlock>
      )}
      <ValueBlock label="Expected" tone="ok">
        {stringify(result.expected)}
      </ValueBlock>
    </div>
  );
};

const OkResult = ({ results, problem }: { results: TestResultData[]; problem: ClientProblem }) => {
  const [active, setActive] = useState(0);
  const [revealed, setRevealed] = useState<ReadonlySet<number>>(new Set());
  const selected = Math.min(active, results.length - 1);
  const result = results[selected];

  const passed = results.filter((r) => r.passed).length;
  const totalMs = results.reduce((sum, r) => sum + r.ms, 0);
  const hasError = results.some((r) => r.error);
  const status = hasError
    ? { label: "Runtime Error", tone: "danger" as const }
    : passed === results.length
      ? { label: "Accepted", tone: "ok" as const }
      : { label: "Wrong Answer", tone: "danger" as const };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-baseline gap-3">
        <span className={cn("text-base font-semibold", status.tone === "ok" ? "text-ok" : "text-danger")}>
          {status.label}
        </span>
        <span className="text-xs text-muted-foreground">
          {passed} / {results.length} cases · {totalMs.toFixed(1)} ms
        </span>
      </div>
      <CaseTabs
        count={results.length}
        active={selected}
        onSelect={setActive}
        statusAt={(index) => (results[index].passed ? "pass" : "fail")}
      />
      <CaseDetail
        result={result}
        problem={problem}
        revealed={revealed.has(selected)}
        onReveal={() => setRevealed((prev) => new Set(prev).add(selected))}
      />
    </div>
  );
};

type TestResultProps = {
  outcome: SubmissionOutcome | null;
  runningMode: RunMode | null;
  problem: ClientProblem;
};

export const TestResult = ({ outcome, runningMode, problem }: TestResultProps) => {
  if (runningMode) return <Centered>Running…</Centered>;
  if (!outcome) return <Centered>Run your code to see results.</Centered>;

  if (outcome.status === "compile-error") return <StatusBlock title="Compile Error" tone="danger" message={outcome.message} />;
  if (outcome.status === "crashed") return <StatusBlock title="Runtime Error" tone="danger" message={outcome.message} />;
  if (outcome.status === "timeout")
    return (
      <StatusBlock
        title="Time Limit Exceeded"
        tone="warn"
        message={`Timed out after ${outcome.ms}ms — check for an infinite loop or a too-slow algorithm.`}
      />
    );

  return <OkResult results={outcome.results} problem={problem} />;
};
