"use client";

import { useMemo } from "react";
import { SandpackProvider } from "@codesandbox/sandpack-react";
import { PAD_TEMPLATE, loadPad } from "@/lib/pad";
import { PadWorkspace } from "@/components/pad-workspace";

/**
 * The CoderPad-style workspace: a Sandpack bundler scoped to one pad.
 * Loaded client-side only (see pad-loader.tsx) since Sandpack needs the DOM.
 */
export default function CoderPad({ padId }: { padId: string }) {
  const savedFiles = useMemo(() => loadPad(padId) ?? undefined, [padId]);

  return (
    <SandpackProvider
      key={padId}
      template={PAD_TEMPLATE}
      theme="dark"
      files={savedFiles}
      options={{
        autorun: true,
        autoReload: true,
        recompileMode: "delayed",
        recompileDelay: 350,
      }}
      className="h-full!"
      style={{ height: "100%" }}
    >
      <PadWorkspace padId={padId} />
    </SandpackProvider>
  );
}
