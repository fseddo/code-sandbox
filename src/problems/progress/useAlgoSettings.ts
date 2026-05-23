"use client";

import { useCallback, useState } from "react";
import { loadSettings, saveSettings, type AlgoSettingKey, type AlgoSettings } from "@/problems/progress/settings";

/** Editor settings, persisted to localStorage. Lazy-init is hydration-safe (no setting reaches the SSR DOM). */
export const useAlgoSettings = () => {
  const [settings, setSettings] = useState<AlgoSettings>(loadSettings);

  // Persist in the handler that owns the change, not a reactive effect — no re-render-after-commit,
  // and it can't fire on an unrelated render or re-save the loaded-from-storage value on mount.
  const setSetting = useCallback(
    (key: AlgoSettingKey, value: boolean) => {
      const next = { ...settings, [key]: value };
      setSettings(next);
      saveSettings(next);
    },
    [settings],
  );

  return { settings, setSetting };
};
