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
import { ALGO_SETTINGS, type AlgoSettingKey, type AlgoSettings } from "@/problems/progress/settings";

type SolutionSettingsMenuProps = {
  settings: AlgoSettings;
  onSettingChange: (key: AlgoSettingKey, value: boolean) => void;
};

const settingEntries = Object.entries(ALGO_SETTINGS) as [
  AlgoSettingKey,
  (typeof ALGO_SETTINGS)[AlgoSettingKey],
][];

/** Editor-settings dropdown. One checkbox per ALGO_SETTINGS entry; checkbox items keep the menu open on toggle. */
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
