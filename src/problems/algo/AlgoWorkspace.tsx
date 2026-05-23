"use client";

import { useState } from "react";
import { LuPlay, LuSend } from "react-icons/lu";
import { Group, Panel } from "react-resizable-panels";
import type { ClientProblem, ProblemHeaderData, RunMode } from "@/problems/data/problem";
import { ProblemDetailHeader } from "@/problems/shared/ProblemDetailHeader";
import { ProblemTitleBar } from "@/problems/shared/ProblemTitleBar";
import { ProblemPanel } from "@/problems/algo/ProblemPanel";
import { SolutionEditor } from "@/problems/algo/SolutionEditor";
import { SolutionSettingsMenu } from "@/problems/algo/SolutionSettingsMenu";
import { ResultsPanel, type ResultsTab } from "@/problems/algo/ResultsPanel";
import { useAlgo } from "@/problems/algo/useAlgo";
import { useIsHydrated } from "@/components/useIsHydrated";
import { ResizeBar } from "@/components/ResizeBar";
import { Button } from "@/components/ui/button";
import { ResetAction } from "@/components/ResetAction";

type AlgoWorkspaceProps = ProblemHeaderData & {
  problem: ClientProblem;
};

/** Two-column judge layout: problem on the left, editor over results on the right. */
export const AlgoWorkspace = ({ problem, number, companies }: AlgoWorkspaceProps) => {
  const {
    language,
    setLanguage,
    source,
    setSource,
    resetSolution,
    restoreSubmission,
    submittedSolution,
    format,
    isFormatting,
    save,
    isDirty,
    settings,
    setSetting,
    outcome,
    runningMode,
    run,
  } = useAlgo(problem);

  // submittedSolution and settings are seeded from localStorage, so they differ between SSR (defaults)
  // and the client's first render. Gate the values that reach the SSR'd DOM (the Last-submission button's
  // `disabled`, the SaveStatus label) until after hydration so the first client render matches the server.
  const isHydrated = useIsHydrated();

  const [resultsTab, setResultsTab] = useState<ResultsTab>("testcase");
  const runAndShowResults = (mode: RunMode) => {
    setResultsTab("result");
    run(mode);
  };

  // Reset is problem-level (clears the code buffer and the results), so it lives in the top bar.
  const resetProblem = () => {
    resetSolution();
    setResultsTab("testcase");
  };

  return (
    <div className="flex h-full flex-col bg-background">
      <ProblemDetailHeader title={problem.title}>
        <Button
          size="sm"
          variant="outline"
          onClick={() => runAndShowResults("run")}
          disabled={runningMode !== null}
          title="Run the example tests"
        >
          <LuPlay className="size-3.5" />
          {runningMode === "run" ? "Running…" : "Run"}
        </Button>
        <Button
          size="sm"
          variant="success"
          onClick={() => runAndShowResults("submit")}
          disabled={runningMode !== null}
          title="Run all tests, including hidden ones"
        >
          <LuSend className="size-3.5" />
          {runningMode === "submit" ? "Submitting…" : "Submit"}
        </Button>
        <ResetAction
          title="Reset to starter code?"
          description="This restores the starter code and clears your test results for this problem. This can't be undone."
          onConfirm={resetProblem}
        />
        <SolutionSettingsMenu settings={settings} onSettingChange={setSetting} />
      </ProblemDetailHeader>

      <ProblemTitleBar
        number={number}
        title={problem.title}
        kind={problem.kind}
        difficulty={problem.difficulty}
        tags={problem.tags}
        companies={companies}
      />

      <Group orientation="horizontal" className="flex-1">
        <ProblemPanel
          problem={problem}
          language={language}
          expandToward="right"
          defaultSize="40%"
          minSize="22%"
          collapsedSize="3%"
        />
        <ResizeBar axis="x" />
        <Panel id="solution" className="min-w-0" defaultSize="60%" minSize="30%">
          <Group orientation="vertical" className="h-full">
            <Panel id="editor" className="min-h-0" defaultSize="62%" minSize="25%">
              <SolutionEditor
                language={language}
                onLanguageChange={setLanguage}
                source={source}
                onSourceChange={setSource}
                onRestoreSubmission={restoreSubmission}
                canRestore={isHydrated && submittedSolution !== null}
                onFormat={format}
                isFormatting={isFormatting}
                onSave={save}
                isDirty={isDirty}
                autosave={isHydrated && settings.autosave}
                isAutocompleteEnabled={settings.autocomplete}
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
