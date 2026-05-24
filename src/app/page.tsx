import Link from "next/link";
import { LuArrowRight, LuBookOpen, LuListChecks, LuSquareCode, LuWaves } from "react-icons/lu";

const DESTINATIONS = [
  { href: "/learn", title: "Learn", description: "Data structures & algorithms, explained with worked examples.", icon: LuBookOpen },
  { href: "/problems", title: "Problems", description: "Coding and build challenges, auto-graded where possible.", icon: LuListChecks },
  { href: "/pads", title: "Pad", description: "Your free-coding scratchpads — open one or start fresh.", icon: LuSquareCode },
] as const;

const Home = () => (
  <main className="flex min-h-screen flex-col items-center justify-center gap-12 px-6 py-16">
    <div className="flex flex-col items-center gap-3 text-center">
      <LuWaves className="size-10 text-primary" />
      <h1 className="text-4xl font-semibold tracking-tight">noodle</h1>
      <p className="max-w-md text-muted-foreground">Learn it, practice it, or just start coding.</p>
    </div>

    <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-3">
      {DESTINATIONS.map(({ href, title, description, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/50"
        >
          <Icon className="size-6 text-primary" />
          <div className="space-y-1">
            <div className="flex items-center gap-1 font-medium tracking-tight">
              {title}
              <LuArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </Link>
      ))}
    </div>

    <p className="text-xs text-muted-foreground">
      Press <kbd className="rounded border border-border px-1.5 py-0.5">⌘K</kbd> to search
    </p>
  </main>
);

export default Home;
