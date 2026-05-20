"use client";

import { useMemo } from "react";
import { SandpackProvider, type SandpackFiles } from "@codesandbox/sandpack-react";
import { loadPad } from "@/pad/pad";
import { typescriptFrontend } from "@/pad/padProfiles/typescriptFrontend";
import { PadWorkspace } from "@/pad/PadWorkspace";

const profile = typescriptFrontend;

/** Sandpack bundler scoped to one pad. Client-only (Sandpack needs the DOM). */
export const CoderPad = ({ padId }: { padId: string }) => {
  const files = useMemo<SandpackFiles>(
    () => ({ ...(loadPad(padId) ?? profile.seedFiles), ...profile.baseFiles }),
    [padId],
  );

  return (
    <SandpackProvider
      key={padId}
      template={profile.template}
      theme="dark"
      files={files}
      options={{
        activeFile: "/src/App.tsx",
        autorun: false,
        autoReload: false,
      }}
      className="h-full!"
      style={{ height: "100%" }}
    >
      <PadWorkspace padId={padId} />
    </SandpackProvider>
  );
};
