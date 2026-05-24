import { LuInfo, LuLightbulb, LuTriangleAlert } from "react-icons/lu";
import type { IconType } from "react-icons";
import type { CalloutTone, Section } from "@/learn/data/topic";
import { cn } from "@/lib/utils";
import { renderInline } from "./renderInline";

type CalloutSection = Extract<Section, { kind: "callout" }>;

const TONE: Record<CalloutTone, { box: string; icon: string; Icon: IconType }> = {
  warn: { box: "border-amber-500/40 bg-amber-500/10", icon: "text-amber-400", Icon: LuTriangleAlert },
  info: { box: "border-sky-500/40 bg-sky-500/10", icon: "text-sky-400", Icon: LuInfo },
  tip: { box: "border-emerald-500/40 bg-emerald-500/10", icon: "text-emerald-400", Icon: LuLightbulb },
};

export const CalloutSection = ({ section }: { section: CalloutSection }) => {
  const tone = TONE[section.tone];
  return (
    <div className={cn("flex gap-3 rounded-lg border p-4", tone.box)}>
      <tone.Icon className={cn("mt-0.5 size-4 shrink-0", tone.icon)} />
      <ul className="space-y-1.5 text-sm leading-relaxed text-muted-foreground">
        {section.items.map((item, index) => (
          <li key={index}>{renderInline(item)}</li>
        ))}
      </ul>
    </div>
  );
};
