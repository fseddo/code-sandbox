import Link from "next/link";
import { ArrowRight, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RecentPads } from "@/components/RecentPads";

const Home = () => {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-10 px-6 py-20">
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="flex items-center gap-2 rounded-full border px-3 py-1 text-sm text-muted-foreground">
          <Code2 className="size-4 text-primary" />
          codepad
        </span>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          A live code playground
        </h1>
        <p className="max-w-md text-pretty text-muted-foreground">
          Write React + TypeScript in the editor and watch it build and run
          instantly in the preview pane. Every pad autosaves to this browser.
        </p>
      </div>

      <Button size="lg" render={<Link href="/pad" />}>
        New pad
        <ArrowRight className="size-4" />
      </Button>

      <RecentPads />
    </main>
  );
};

export default Home;
