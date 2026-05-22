import { typedEntries } from "@/lib/utils";

const STORAGE_KEY = "noodle:judge-settings";

type SettingDef = {
  label: string;
  description: string;
  default: boolean;
};

/** Single source of truth: each editor toggle's metadata + default. Add a key here and the menu, state, and persistence all pick it up. */
export const JUDGE_SETTINGS = {
  autocomplete: {
    label: "Autocomplete",
    description: "Suggest completions as you type; Tab accepts.",
    default: true,
  },
  autosave: {
    label: "Autosave",
    description: "Persist your solution while you type.",
    default: false,
  },
} as const satisfies Record<string, SettingDef>;

export type JudgeSettingKey = keyof typeof JUDGE_SETTINGS;
export type JudgeSettings = Record<JudgeSettingKey, boolean>;

const entries = typedEntries<JudgeSettingKey, SettingDef>(JUDGE_SETTINGS);

const defaultSettings = (): JudgeSettings =>
  Object.fromEntries(entries.map(([key, def]) => [key, def.default])) as JudgeSettings;

/** Reads editor settings from this browser, merged over defaults so a newly-added key gets its default. */
export const loadSettings = (): JudgeSettings => {
  const defaults = defaultSettings();
  if (typeof window === "undefined") return defaults;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    return { ...defaults, ...(JSON.parse(raw) as Partial<JudgeSettings>) };
  } catch {
    return defaults;
  }
};

/** Persists editor settings to this browser. */
export const saveSettings = (settings: JudgeSettings): void => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
};
