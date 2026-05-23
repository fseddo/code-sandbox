"use client";

import { useCallback, useEffect, useState } from "react";
import { loadSettings, saveSettings, type AlgoSettingKey, type AlgoSettings } from "@/problems/progress/settings";

/** Editor settings, persisted to localStorage. Lazy-init is hydration-safe (no setting reaches the SSR DOM). */
export const useAlgoSettings = () => {
  const [settings, setSettings] = useState<AlgoSettings>(loadSettings);

  const setSetting = useCallback(
    (key: AlgoSettingKey, value: boolean) => setSettings((prev) => ({ ...prev, [key]: value })),
    [],
  );

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  return { settings, setSetting };
};
