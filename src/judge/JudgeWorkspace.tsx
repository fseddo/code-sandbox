"use client";

import { useState } from "react";
import { LuPlay, LuRotateCcw, LuSend } from "react-icons/lu";
import { Group, Panel } from "react-resizable-panels";
import type { ClientProblem, RunMode } from "./problem";
import { ProblemDetailHeader } from "./ProblemDetailHeader";
import { ProblemTitleBar } from "./ProblemTitleBar";
import { ProblemPanel } from "./ProblemPanel";
import { SolutionEditor } from "./SolutionEditor";
import { SolutionSettingsMenu } from "./SolutionSettingsMenu";
import { ResultsPanel, type ResultsTab } from "./ResultsPanel";
import { useJudge } from "./useJudge";
import { ResizeBar } from "@/components/ResizeBar";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ConfirmDialog";

type JudgeWorkspaceProps = {
  problem: ClientProblem;
  number: number;
  companies: readonly string[];
};

/** Two-column judge layout: problem on the left, editor over results on the right. */
export const JudgeWorkspace = ({ problem, number, companies }: JudgeWorkspaceProps) => {
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
  } = useJudge(problem);

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
        <ConfirmDialog
          trigger={
            <Button size="sm" variant="outline">
              <LuRotateCcw className="size-3.5" />
              Reset
            </Button>
          }
          title="Reset to starter code?"
          description="This restores the starter code and clears your test results for this problem. This can't be undone."
          confirmLabel="Reset"
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
                onRestoreSubmission={restoreSubmission}
                canRestore={submittedSolution !== null}
                onFormat={format}
                isFormatting={isFormatting}
                onSave={save}
                isDirty={isDirty}
                autosave={settings.autosave}
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
