"use client";

import { SettingsMenu, type SettingDef } from "@/components/SettingsMenu";

type PadSettingKey = "autosave";

const PAD_SETTINGS: Record<PadSettingKey, SettingDef> = {
  autosave: { label: "Autosave", description: "Apply edits to the preview as you type." },
};

type PadSettingsMenuProps = {
  autosave: boolean;
  onAutosaveChange: (next: boolean) => void;
};

/** Gear dropdown for pad editor preferences — currently just Autosave. */
export const PadSettingsMenu = ({ autosave, onAutosaveChange }: PadSettingsMenuProps) => (
  <SettingsMenu
    defs={PAD_SETTINGS}
    values={{ autosave }}
    onChange={(_, value) => onAutosaveChange(value)}
  />
);
