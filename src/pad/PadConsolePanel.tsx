"use client";

import { Fragment, useState } from "react";
import { LuChevronDown, LuChevronUp, LuRotateCcw } from "react-icons/lu";
import {
  useSandpackConsole,
  useSandpackShell,
  useSandpackShellStdout,
} from "@codesandbox/sandpack-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { UnderlineTabs } from "@/components/UnderlineTabs";

const TABS = ["server", "client"] as const;
type ConsoleTab = (typeof TABS)[number];

const TAB_LABEL: Record<ConsoleTab, string> = {
  server: "Server",
  client: "Client",
};

// --- ANSI parsing ---------------------------------------------------------
// SGR fg codes → Midnight palette utility classes; bold/dim map to plain Tailwind.

type AnsiState = {
  color: string | undefined;
  bold: boolean;
  dim: boolean;
};
type AnsiSegment = AnsiState & { text: string };

const ANSI_FG: Record<number, string> = {
  30: "text-muted-foreground",
  31: "text-danger",
  32: "text-ok",
  33: "text-warn",
  34: "text-link",
  35: "text-link",
  36: "text-primary",
  37: "text-foreground",
  90: "text-muted-foreground",
  91: "text-danger",
  92: "text-ok",
  93: "text-warn",
  94: "text-link",
  95: "text-link",
  96: "text-primary",
  97: "text-foreground",
};

const ANSI_RE = /\x1b\[([\d;]*)m/g;

const parseAnsi = (input: string): AnsiSegment[] => {
  const out: AnsiSegment[] = [];
  let state: AnsiState = { color: undefined, bold: false, dim: false };
  let last = 0;
  let match: RegExpExecArray | null;
  ANSI_RE.lastIndex = 0;
  while ((match = ANSI_RE.exec(input))) {
    if (match.index > last) {
      out.push({ text: input.slice(last, match.index), ...state });
    }
    const codes = (match[1] || "0").split(";").map((c) => Number(c) || 0);
    state = { ...state };
    for (const code of codes) {
      if (code === 0) state = { color: undefined, bold: false, dim: false };
      else if (code === 1) state.bold = true;
      else if (code === 2) state.dim = true;
      else if (code === 22) {
        state.bold = false;
        state.dim = false;
      } else if (code === 39) state.color = undefined;
      else if (ANSI_FG[code]) state.color = ANSI_FG[code];
    }
    last = ANSI_RE.lastIndex;
  }
  if (last < input.length) {
    out.push({ text: input.slice(last), ...state });
  }
  return out;
};

// --- URL highlighting (used inside both views) ----------------------------

const URL_RE = /(https?:\/\/[^\s]+)/g;

/** Splits a string into alternating plain / URL parts for rendering. */
const splitUrls = (text: string): Array<{ kind: "text" | "url"; value: string }> => {
  const parts: Array<{ kind: "text" | "url"; value: string }> = [];
  let last = 0;
  let match: RegExpExecArray | null;
  URL_RE.lastIndex = 0;
  while ((match = URL_RE.exec(text))) {
    if (match.index > last) {
      parts.push({ kind: "text", value: text.slice(last, match.index) });
    }
    parts.push({ kind: "url", value: match[0] });
    last = URL_RE.lastIndex;
  }
  if (last < text.length) {
    parts.push({ kind: "text", value: text.slice(last) });
  }
  return parts;
};

const RichText = ({ text }: { text: string }) => (
  <>
    {splitUrls(text).map((part, i) =>
      part.kind === "url" ? (
        <a
          key={i}
          href={part.value}
          target="_blank"
          rel="noreferrer"
          className="text-link underline-offset-2 hover:underline"
        >
          {part.value}
        </a>
      ) : (
        <Fragment key={i}>{part.value}</Fragment>
      ),
    )}
  </>
);

// --- Server view ----------------------------------------------------------

const ServerView = () => {
  const { logs } = useSandpackShellStdout({ resetOnPreviewRestart: true });
  const segments = parseAnsi(logs.map((l) => l.data).join(""));
  return (
    <div className="h-full overflow-auto">
      {segments.length === 0 ? (
        <p className="px-3 py-2 font-mono text-xs text-muted-foreground">
          Waiting for the dev server…
        </p>
      ) : (
        <div className="px-3 py-2 font-mono text-xs whitespace-pre-wrap wrap-anywhere">
          {segments.map((seg, i) => (
            <span
              key={i}
              className={cn(
                seg.color ?? "text-foreground",
                seg.bold && "font-semibold",
                seg.dim && "opacity-70",
              )}
            >
              <RichText text={seg.text} />
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Console view ---------------------------------------------------------

type LogMethod = ReturnType<typeof useSandpackConsole>["logs"][number]["method"];

const METHOD_ROW: Partial<Record<LogMethod, string>> = {
  error: "bg-danger/8 text-danger",
  warn: "bg-warn/8 text-warn",
  info: "bg-link/8 text-link",
  debug: "text-muted-foreground",
  clear: "text-muted-foreground italic",
};

const formatArg = (arg: unknown): string => {
  if (typeof arg === "string") return arg;
  if (arg === null) return "null";
  if (arg === undefined) return "undefined";
  try {
    return JSON.stringify(arg, null, 2);
  } catch {
    return String(arg);
  }
};

const ConsoleView = () => {
  const { logs } = useSandpackConsole({ resetOnPreviewRestart: true });
  return (
    <div className="h-full overflow-auto">
      {logs.length === 0 ? (
        <p className="px-3 py-2 font-mono text-xs text-muted-foreground">
          No console output yet.
        </p>
      ) : (
        <ul>
          {logs.map((entry) => {
            const text =
              entry.method === "clear"
                ? "(console cleared)"
                : (entry.data ?? []).map(formatArg).join(" ");
            return (
              <li
                key={entry.id}
                className={cn(
                  "border-b border-border/40 px-3 py-1.5 font-mono text-xs whitespace-pre-wrap last:border-b-0",
                  METHOD_ROW[entry.method] ?? "text-foreground",
                )}
              >
                <RichText text={text} />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

// --- Panel ----------------------------------------------------------------

/**
 * Tabbed console pane with collapse. Both panes stay mounted at all times
 * (each owns its own subscription via a hook) so neither misses messages —
 * switching tabs only toggles visibility.
 */
export const PadConsolePanel = ({
  isCollapsed,
  onToggleCollapse,
}: {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}) => {
  const [tab, setTab] = useState<ConsoleTab>("server");
  const { restart } = useSandpackShell();
  const ToggleIcon = isCollapsed ? LuChevronUp : LuChevronDown;

  return (
    <div className="flex h-full flex-col bg-card">
      <div className="flex h-9 shrink-0 items-center border-b pr-1.5">
        <UnderlineTabs
          tabs={TABS}
          labelOf={TAB_LABEL}
          active={tab}
          onSelect={setTab}
          className="h-full"
          tabClassName="px-3 text-xs tracking-wide uppercase"
        />
        <div className="ml-auto flex items-center gap-1">
          <Button
            variant="outline"
            size="xs"
            onClick={restart}
            title="Cold-restart the Vite dev server (keeps your code)"
          >
            <LuRotateCcw className="size-3" />
            Restart server
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={isCollapsed ? "Expand console" : "Collapse console"}
            title={isCollapsed ? "Expand" : "Collapse"}
            onClick={onToggleCollapse}
          >
            <ToggleIcon className="size-4" />
          </Button>
        </div>
      </div>
      <div className={cn("min-h-0 flex-1", isCollapsed && "hidden")}>
        <div className={cn("h-full", tab !== "server" && "hidden")}>
          <ServerView />
        </div>
        <div className={cn("h-full", tab !== "client" && "hidden")}>
          <ConsoleView />
        </div>
      </div>
    </div>
  );
};
