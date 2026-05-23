"use client";

import { SettingsMenu } from "@/components/SettingsMenu";
import { ALGO_SETTINGS, type AlgoSettingKey, type AlgoSettings } from "@/problems/progress/settings";

type SolutionSettingsMenuProps = {
  settings: AlgoSettings;
  onSettingChange: (key: AlgoSettingKey, value: boolean) => void;
};

/** Editor-settings dropdown, one checkbox per `ALGO_SETTINGS` entry. */
export const SolutionSettingsMenu = ({ settings, onSettingChange }: SolutionSettingsMenuProps) => (
  <SettingsMenu defs={ALGO_SETTINGS} values={settings} onChange={onSettingChange} />
);
