"use client";

import { useState } from "react";
import Link from "next/link";
import { LuArrowLeft } from "react-icons/lu";
import { Group, Panel } from "react-resizable-panels";
import type { ClientProblem, RunMode } from "./problem";
import { ProblemPanel } from "./ProblemPanel";
import { SolutionEditor } from "./SolutionEditor";
import { ResultsPanel, type ResultsTab } from "./ResultsPanel";
import { useJudge } from "./useJudge";
import { ResizeBar } from "@/components/ResizeBar";

/** Two-column judge layout: problem on the left, editor over results on the right. */
export const JudgeWorkspace = ({ problem }: { problem: ClientProblem }) => {
  const {
    language,
    setLanguage,
    source,
    setSource,
    resetSolution,
    save,
    isDirty,
    settings,
    setSetting,
    outcome,
    runningMode,
    run,
  } = useJudge(problem);

  const [resultsTab, setResultsTab] = useState<ResultsTab>("testcase");
  const runAndShowResults = (mode: RunMode) => {
    setResultsTab("result");
    run(mode);
  };

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
          <ProblemPanel problem={problem} language={language} />
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
                onReset={resetSolution}
                onSave={save}
                isDirty={isDirty}
                settings={settings}
                onSettingChange={setSetting}
                onRun={() => runAndShowResults("run")}
                onSubmit={() => runAndShowResults("submit")}
                runningMode={runningMode}
              />
            </Panel>
            <ResizeBar axis="y" />
            <Panel id="results" className="min-h-0" defaultSize="38%" minSize="15%">
              <ResultsPanel
                problem={problem}
                outcome={outcome}
                runningMode={runningMode}
                tab={resultsTab}
                onTabChange={setResultsTab}
              />
            </Panel>
          </Group>
        </Panel>
      </Group>
    </div>
  );
};
