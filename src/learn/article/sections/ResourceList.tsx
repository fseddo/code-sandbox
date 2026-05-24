import { LuBookOpen, LuFileText, LuPlay } from "react-icons/lu";
import type { IconType } from "react-icons";
import type { ResourceItem, Section } from "@/learn/data/topic";
import { cn } from "@/lib/utils";

type ResourceSection = Extract<Section, { kind: "resources" }>;

const TYPE: Record<ResourceItem["type"], { Icon: IconType; tile: string; label: string }> = {
  article: { Icon: LuFileText, tile: "bg-violet-500/15 text-violet-300", label: "Article" },
  video: { Icon: LuPlay, tile: "bg-rose-500/15 text-rose-300", label: "Video" },
  doc: { Icon: LuBookOpen, tile: "bg-slate-500/15 text-slate-300", label: "Doc" },
};

export const ResourceList = ({ section }: { section: ResourceSection }) => (
  <div className="space-y-2">
    {section.items.map((item) => {
      const type = TYPE[item.type];
      return (
        <a
          key={item.url}
          href={item.url}
          target="_blank"
          rel="noreferrer"
          className="group flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:border-primary/50"
        >
          <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-md", type.tile)}>
            <type.Icon className="size-4" />
          </span>
          <span className="flex-1 text-sm font-medium group-hover:text-foreground">{item.label}</span>
          <span className="text-xs uppercase tracking-wide text-muted-foreground/70">{type.label}</span>
        </a>
      );
    })}
  </div>
);
