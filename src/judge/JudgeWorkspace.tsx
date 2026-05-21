"use client";

import Link from "next/link";
import { LuArrowLeft } from "react-icons/lu";
import { Group, Panel } from "react-resizable-panels";
import type { Problem } from "./problem";
import { ProblemPanel } from "./ProblemPanel";
import { SolutionEditor } from "./SolutionEditor";
import { ResultsPanel } from "./ResultsPanel";
import { useJudge } from "./useJudge";
import { ResizeBar } from "@/components/ResizeBar";

/** Two-column judge layout: problem on the left, editor over results on the right. */
export const JudgeWorkspace = ({ problem }: { problem: Problem }) => {
  const { language, setLanguage, source, setSource, outcome, isRunning, run } = useJudge(problem);

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="flex items-center gap-2 border-b border-sidebar-border bg-card px-3 py-2">
        <Link
          href="/judge"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <LuArrowLeft className="size-4" />
          Problems
        </Link>
      </div>

      <Group orientation="horizontal" className="flex-1">
        <Panel id="problem" className="min-w-0" defaultSize="40%" minSize="22%">
          <ProblemPanel problem={problem} />
        </Panel>
        <ResizeBar axis="x" />
        <Panel id="solution" className="min-w-0" defaultSize="60%" minSize="30%">
          <Group orientation="vertical" className="h-full">
            <Panel id="editor" className="min-h-0" defaultSize="62%" minSize="25%">
              <SolutionEditor
                language={language}
                onLanguageChange={setLanguage}
                source={source}
                onSourceChange={setSource}
                onRun={run}
                isRunning={isRunning}
              />
            </Panel>
            <ResizeBar axis="y" />
            <Panel id="results" className="min-h-0" defaultSize="38%" minSize="15%">
              <ResultsPanel outcome={outcome} />
            </Panel>
          </Group>
        </Panel>
      </Group>
    </div>
  );
};
