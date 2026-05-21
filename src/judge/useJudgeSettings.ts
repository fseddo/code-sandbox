"use client";

import { useCallback, useEffect, useState } from "react";
import { loadSettings, saveSettings, type JudgeSettingKey, type JudgeSettings } from "./settings";

/** Editor settings, persisted to localStorage. Lazy-init is hydration-safe (no setting reaches the SSR DOM). */
export const useJudgeSettings = () => {
  const [settings, setSettings] = useState<JudgeSettings>(loadSettings);

  const setSetting = useCallback(
    (key: JudgeSettingKey, value: boolean) => setSettings((prev) => ({ ...prev, [key]: value })),
    [],
  );

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  return { settings, setSetting };
};
