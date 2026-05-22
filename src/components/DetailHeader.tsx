import Link from "next/link";
import { LuChevronRight, LuWaves } from "react-icons/lu";

type Crumb = { label: string; href?: string };

type DetailHeaderProps = {
  /** The middle breadcrumb segment ("Problems" / "Pads"); a link when `href` is set, plain text otherwise. */
  crumb: Crumb;
  /** The trailing crumb — a quiet title (problems, whose prominent identity is in the title bar below) or an editable control (pads). */
  title?: React.ReactNode;
  /** Right-side controls (settings gear, completion/reset actions). Save state lives in the editor toolbar. */
  children?: React.ReactNode;
};

/** The slim top breadcrumb bar shared by the problem and pad detail pages: brand → crumb (→ title), then controls. */
export const DetailHeader = ({ crumb, title, children }: DetailHeaderProps) => (
  <header className="flex h-12 shrink-0 items-center gap-2 border-b border-sidebar-border bg-card px-3 font-sans text-sm leading-none">
    <Link href="/" className="flex items-center gap-1.5 text-sm font-semibold tracking-tight">
      <LuWaves className="size-4 text-primary" />
      noodle
    </Link>
    <LuChevronRight className="size-4 text-muted-foreground" />
    {crumb.href ? (
      <Link href={crumb.href} className="text-sm text-muted-foreground hover:text-foreground">
        {crumb.label}
      </Link>
    ) : (
      <span className="text-sm text-muted-foreground">{crumb.label}</span>
    )}
    {title != null ? (
      <>
        <span className="text-muted-foreground/50">/</span>
        <div className="flex min-w-0 flex-1 items-center">{title}</div>
      </>
    ) : (
      <div className="flex-1" />
    )}

    <div className="flex shrink-0 items-center gap-2">{children}</div>
  </header>
);
