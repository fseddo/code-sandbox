"use client";

import { useMemo } from "react";
import { SandpackProvider, type SandpackFiles } from "@codesandbox/sandpack-react";
import { PAD_BASE_FILES, PAD_TEMPLATE, loadPad } from "@/lib/pad";
import { PadWorkspace } from "@/components/pad-workspace";

/**
 * The CoderPad-style workspace: a Sandpack bundler scoped to one pad.
 * Loaded client-side only (see pad-loader.tsx) since Sandpack needs the DOM.
 */
export default function CoderPad({ padId }: { padId: string }) {
  // Saved pad files (if any), with the Vite config override always on top.
  const files = useMemo<SandpackFiles>(
    () => ({ ...(loadPad(padId) ?? {}), ...PAD_BASE_FILES }),
    [padId],
  );

  return (
    <SandpackProvider
      key={padId}
      template={PAD_TEMPLATE}
      theme="dark"
      files={files}
      options={{
        // Manual save model: typing never pushes to the bundler. ⌘S or the
        // Save button calls runSandpack to apply current files. File create
        // and delete still push immediately (their own default), mirroring
        // local dev where saving a new file is what makes Vite see it.
        autorun: false,
        autoReload: false,
      }}
      className="h-full!"
      style={{ height: "100%" }}
    >
      <PadWorkspace padId={padId} />
    </SandpackProvider>
  );
}
