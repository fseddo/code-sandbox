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
import { typedEntries } from "@/lib/utils";

/** The label + per-surface copy for one toggle. Extra fields (e.g. a `default`) are ignored here. */
export type SettingDef = {
  label: string;
  description: string;
};

type SettingsMenuProps<K extends string> = {
  defs: Record<K, SettingDef>;
  values: Record<K, boolean>;
  onChange: (key: K, value: boolean) => void;
};

/** Gear dropdown with one checkbox per `defs` entry; checkbox items keep the menu open on toggle. */
export const SettingsMenu = <K extends string>({ defs, values, onChange }: SettingsMenuProps<K>) => (
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
        {typedEntries<K, SettingDef>(defs).map(([key, def]) => (
          <DropdownMenuCheckboxItem
            key={key}
            checked={values[key]}
            onCheckedChange={(checked) => onChange(key, checked)}
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
