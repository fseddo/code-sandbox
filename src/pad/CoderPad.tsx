"use client";

import { type ReactNode, useMemo } from "react";
import { SandpackProvider, type SandpackFiles } from "@codesandbox/sandpack-react";
import { loadPad } from "@/pad/pad";
import { typescriptFrontend } from "@/pad/padProfiles/typescriptFrontend";
import type { PadProfile } from "@/pad/padProfiles/typescriptFrontend";
import { PadWorkspace, type PadToolbarState } from "@/pad/PadWorkspace";

type CoderPadProps = {
  padId: string;
  /** A fixed display name persisted with the pad (e.g. a build problem's title); scratchpads omit it. */
  title?: string;
  /** Which kind of pad to boot (template + seed + base files). Defaults to the TS-frontend profile. */
  profile?: PadProfile;
  /** File opened on first load; falls back to Sandpack's default when its path isn't in the seed. */
  activeFile?: string;
  leadingPanel?: ReactNode;
  headerBar?: ReactNode;
  renderToolbar?: (state: PadToolbarState) => ReactNode;
};

/** Sandpack bundler scoped to one pad. Client-only (Sandpack needs the DOM). */
export const CoderPad = ({
  padId,
  title,
  profile = typescriptFrontend,
  activeFile = "/src/App.tsx",
  leadingPanel,
  headerBar,
  renderToolbar,
}: CoderPadProps) => {
  const files = useMemo<SandpackFiles>(
    () => ({ ...(loadPad(padId) ?? profile.seedFiles), ...profile.baseFiles }),
    [padId, profile],
  );

  return (
    <SandpackProvider
      key={padId}
      template={profile.template}
      theme="dark"
      files={files}
      options={{
        activeFile,
        autorun: false,
        autoReload: false,
      }}
      className="h-full!"
      style={{ height: "100%" }}
    >
      <PadWorkspace
        padId={padId}
        title={title}
        leadingPanel={leadingPanel}
        headerBar={headerBar}
        renderToolbar={renderToolbar}
      />
    </SandpackProvider>
  );
};
