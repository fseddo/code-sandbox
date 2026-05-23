import { typedEntries } from "@/lib/utils";
import { createSingletonStore } from "@/lib/localStore";

const STORAGE_KEY = "noodle:judge-settings";

type SettingDef = {
  label: string;
  description: string;
  default: boolean;
};

/** Single source of truth: each editor toggle's metadata + default. Add a key here and the menu, state, and persistence all pick it up. */
export const ALGO_SETTINGS = {
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

export type AlgoSettingKey = keyof typeof ALGO_SETTINGS;
export type AlgoSettings = Record<AlgoSettingKey, boolean>;

const entries = typedEntries<AlgoSettingKey, SettingDef>(ALGO_SETTINGS);

const defaultSettings = (): AlgoSettings =>
  Object.fromEntries(entries.map(([key, def]) => [key, def.default])) as AlgoSettings;

const store = createSingletonStore<Partial<AlgoSettings>>(STORAGE_KEY);

/** Reads editor settings from this browser, merged over defaults so a newly-added key gets its default. */
export const loadSettings = (): AlgoSettings => ({ ...defaultSettings(), ...store.read() });

/** Persists editor settings to this browser. */
export const saveSettings = (settings: AlgoSettings): void => store.write(settings);
