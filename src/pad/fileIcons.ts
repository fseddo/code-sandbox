import type { IconType } from "react-icons";
import { LuFile, LuFileImage, LuFileType } from "react-icons/lu";
import { FaReact } from "react-icons/fa";
import { FaCircleInfo } from "react-icons/fa6";
import { BiLogoJavascript, BiLogoTypescript } from "react-icons/bi";
import { VscJson } from "react-icons/vsc";
import { FiCode } from "react-icons/fi";
import { PiHashBold } from "react-icons/pi";

export type FileIcon = { Icon: IconType; color: string };

const FILE_ICONS: Record<string, FileIcon> = {
  tsx: { Icon: FaReact, color: "text-cyan-400" },
  jsx: { Icon: FaReact, color: "text-cyan-400" },
  ts: { Icon: BiLogoTypescript, color: "text-blue-400" },
  js: { Icon: BiLogoJavascript, color: "text-amber-300" },
  css: { Icon: PiHashBold, color: "text-sky-500" },
  scss: { Icon: LuFileType, color: "text-pink-400" },
  html: { Icon: FiCode, color: "text-orange-400" },
  json: { Icon: VscJson, color: "text-amber-300" },
  md: { Icon: FaCircleInfo, color: "text-slate-300" },
  svg: { Icon: LuFileImage, color: "text-violet-300" },
  png: { Icon: LuFileImage, color: "text-violet-300" },
  jpg: { Icon: LuFileImage, color: "text-violet-300" },
  jpeg: { Icon: LuFileImage, color: "text-violet-300" },
};

const DEFAULT_ICON: FileIcon = { Icon: LuFile, color: "text-slate-400" };

/** Picks an icon + color from a file name's extension. */
export const iconFor = (name: string): FileIcon => {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  return FILE_ICONS[ext] ?? DEFAULT_ICON;
};
