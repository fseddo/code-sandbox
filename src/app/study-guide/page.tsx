import Link from "next/link";
import { LuArrowRight, LuListChecks, LuServer } from "react-icons/lu";
import type { IconType } from "react-icons";
import { AppHeader } from "@/components/AppHeader";
import { TRACKS, type TrackId } from "@/learn/data/curriculum";

const ICONS: Record<TrackId, IconType> = { algos: LuListChecks, "system-design": LuServer };

const GuidePicker = () => (
  <div className="flex h-screen flex-col">
    <AppHeader crumb={[{ label: "Interview Study Guide" }]} />
    <div className="flex-1 overflow-auto">
      <div className="mx-auto max-w-3xl space-y-8 px-6 py-16">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Interview Study Guide</h1>
          <p className="text-muted-foreground">
            Pick a track and work it end to end — read each pattern, then step through its problems.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {(Object.values(TRACKS)).map((track) => {
            const Icon = ICONS[track.id];
            const count = track.chapters.length;
            return (
              <Link
                key={track.id}
                href={`/study-guide/${track.id}`}
                className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/50"
              >
                <Icon className="size-6 text-primary" />
                <div className="space-y-1">
                  <div className="flex items-center gap-1 font-medium tracking-tight">
                    {track.title}
                    <LuArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">{track.subtitle}</p>
                </div>
                <span className="mt-auto text-xs text-muted-foreground/70">
                  {count > 0 ? `${count} chapters` : "Coming soon"}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  </div>
);

export default GuidePicker;
