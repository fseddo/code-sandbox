"use client";

import { LuSettings } from "react-icons/lu";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { JUDGE_SETTINGS, type JudgeSettingKey, type JudgeSettings } from "./settings";

type SolutionSettingsMenuProps = {
  settings: JudgeSettings;
  onSettingChange: (key: JudgeSettingKey, value: boolean) => void;
};

const settingEntries = Object.entries(JUDGE_SETTINGS) as [
  JudgeSettingKey,
  (typeof JUDGE_SETTINGS)[JudgeSettingKey],
][];

/** Editor-settings dropdown. One checkbox per JUDGE_SETTINGS entry; checkbox items keep the menu open on toggle. */
export const SolutionSettingsMenu = ({ settings, onSettingChange }: SolutionSettingsMenuProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger
      render={
        <Button size="sm" variant="ghost" aria-label="Editor settings">
          <LuSettings className="size-3.5" />
        </Button>
      }
    />
    <DropdownMenuContent align="end" className="w-64">
      <DropdownMenuGroup>
        <DropdownMenuLabel>Editor settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {settingEntries.map(([key, def]) => (
          <DropdownMenuCheckboxItem
            key={key}
            checked={settings[key]}
            onCheckedChange={(checked) => onSettingChange(key, checked)}
          >
            <span className="flex flex-col">
              <span>{def.label}</span>
              <span className="text-xs text-muted-foreground">{def.description}</span>
            </span>
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
);
