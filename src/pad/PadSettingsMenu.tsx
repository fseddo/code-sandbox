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

type PadSettingsMenuProps = {
  autosave: boolean;
  onAutosaveChange: (next: boolean) => void;
};

/** Gear dropdown for pad editor preferences — currently just Autosave. Mirrors the judge's settings menu. */
export const PadSettingsMenu = ({ autosave, onAutosaveChange }: PadSettingsMenuProps) => (
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
        <DropdownMenuCheckboxItem checked={autosave} onCheckedChange={onAutosaveChange}>
          <span className="flex flex-col">
            <span>Autosave</span>
            <span className="text-xs text-muted-foreground">Apply edits to the preview as you type.</span>
          </span>
        </DropdownMenuCheckboxItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
);
