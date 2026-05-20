import type {
  SandpackFiles,
  SandpackPredefinedTemplate,
} from "@codesandbox/sandpack-react";
import { mainTsx } from "@/pad/padDefaults/mainTsx";
import { appTsx } from "@/pad/padDefaults/appTsx";
import { appCss } from "@/pad/padDefaults/appCss";
import { indexCss } from "@/pad/padDefaults/indexCss";
import { globalDTs } from "@/pad/padDefaults/globalDTs";
import { indexHtml } from "@/pad/padDefaults/indexHtml";

/**
 * A pad profile describes one "kind of pad": which Sandpack template it boots
 * from, the user-editable files seeded on first load, and the files that get
 * force-applied on every load (config overrides the user shouldn't edit).
 */
export type PadProfile = {
  template: SandpackPredefinedTemplate;
  seedFiles: SandpackFiles;
  baseFiles: SandpackFiles;
};

/**
 * TypeScript frontend pad — Vite + React + TS. Reshapes Sandpack's flat
 * vite-react-ts template into the conventional /src layout; hides the
 * template's orphan /App.tsx and /index.tsx; force-applies a vite.config
 * that silences Nodebox's missing-readline warning.
 */
export const typescriptFrontend: PadProfile = {
  template: "vite-react-ts",
  seedFiles: {
    "/src/main.tsx": { code: mainTsx },
    "/src/App.tsx": { code: appTsx },
    "/src/App.css": { code: appCss },
    "/src/index.css": { code: indexCss },
    "/src/global.d.ts": { code: globalDTs },
    "/index.html": { code: indexHtml },
    "/App.tsx": { code: "// moved to /src/App.tsx\n", hidden: true },
    "/index.tsx": { code: "// moved to /src/main.tsx\n", hidden: true },
  },
  baseFiles: {
    "/vite.config.ts": {
      code: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Sandpack's in-browser Node has no terminal to clear.
  clearScreen: false,
})
`,
    },
  },
};
