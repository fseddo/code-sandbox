"use client";

import { LuPlay, LuRotateCcw, LuSave } from "react-icons/lu";
import type { SupportedLanguage } from "./problem";
import type { JudgeSettingKey, JudgeSettings } from "./settings";
import { SolutionSettingsMenu } from "./SolutionSettingsMenu";
import { CodeEditor } from "@/components/CodeEditor";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SolutionEditorProps = {
  language: SupportedLanguage;
  onLanguageChange: (language: SupportedLanguage) => void;
  source: string;
  onSourceChange: (source: string) => void;
  onReset: () => void;
  onSave: () => void;
  isDirty: boolean;
  settings: JudgeSettings;
  onSettingChange: (key: JudgeSettingKey, value: boolean) => void;
  onRun: () => void;
  isRunning: boolean;
};

const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  typescript: "TypeScript",
  javascript: "JavaScript",
};

export const SolutionEditor = ({
  language,
  onLanguageChange,
  source,
  onSourceChange,
  onReset,
  onSave,
  isDirty,
  settings,
  onSettingChange,
  onRun,
  isRunning,
}: SolutionEditorProps) => (
  <div className="flex h-full flex-col bg-card">
    <div className="flex items-center justify-between gap-2 border-b border-sidebar-border px-3 py-2">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 rounded-md bg-background p-0.5">
          {(Object.keys(LANGUAGE_LABELS) as SupportedLanguage[]).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => onLanguageChange(lang)}
              aria-pressed={lang === language}
              className={cn(
                "rounded px-2.5 py-1 text-xs font-medium transition-colors",
                lang === language
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {LANGUAGE_LABELS[lang]}
            </button>
          ))}
        </div>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className={cn("size-1.5 rounded-full", isDirty ? "bg-warn" : "bg-ok")} />
          {isDirty ? "Unsaved" : "Saved"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <SolutionSettingsMenu settings={settings} onSettingChange={onSettingChange} />
        <ConfirmDialog
          trigger={
            <Button size="sm" variant="ghost">
              <LuRotateCcw className="size-3.5" />
              Reset
            </Button>
          }
          title="Reset to starter code?"
          description={`This discards your saved ${LANGUAGE_LABELS[language]} solution for this problem and restores the starter code. This can't be undone.`}
          confirmLabel="Reset"
          onConfirm={onReset}
        />
        <Button
          size="sm"
          variant="outline"
          onClick={onSave}
          disabled={settings.autosave}
          title="Save (⌘S)"
        >
          <LuSave className="size-3.5" />
          Save
        </Button>
        <Button size="sm" variant="success" onClick={onRun} disabled={isRunning}>
          <LuPlay className="size-3.5" />
          {isRunning ? "Running…" : "Run"}
        </Button>
      </div>
    </div>
    <div className="min-h-0 flex-1">
      <CodeEditor
        value={source}
        onChange={onSourceChange}
        language={language}
        isAutocompleteEnabled={settings.autocomplete}
      />
    </div>
  </div>
);
