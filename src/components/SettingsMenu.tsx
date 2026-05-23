"use client";

import { LuSettings } from "react-icons/lu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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
        <Button size="sm" variant="outline" aria-label="Editor settings">
          <LuSettings className="size-4.5" />
        </Button>
      }
    />
    <DropdownMenuContent align="end" className="w-64">
      <DropdownMenuGroup>
        <DropdownMenuLabel>Editor settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {typedEntries<K, SettingDef>(defs).map(([key, def]) => (
          <DropdownMenuItem
            key={key}
            closeOnClick={false}
            onClick={() => onChange(key, !values[key])}
            className="gap-3"
          >
            <span className="flex flex-1 flex-col">
              <span>{def.label}</span>
              <span className="text-xs text-muted-foreground">{def.description}</span>
            </span>
            <Switch checked={values[key]} tabIndex={-1} className="pointer-events-none" />
          </DropdownMenuItem>
        ))}
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
);
