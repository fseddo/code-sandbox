import { DetailHeader } from "@/components/DetailHeader";

type ProblemDetailHeaderProps = {
  title: string;
  /** Right-side controls: Run/Submit/Reset + settings gear (algo) or completion actions (build). */
  children?: React.ReactNode;
};

/**
 * The problem detail top bar: a `DetailHeader` with the "Problems" crumb and a quiet trailing title.
 * The prominent identity (big title + badges + tags) lives in the full-width `ProblemTitleBar` below;
 * this crumb is deliberately low-emphasis so the two don't compete.
 */
export const ProblemDetailHeader = ({ title, children }: ProblemDetailHeaderProps) => (
  <DetailHeader
    crumb={{ label: "Problems", href: "/" }}
    title={<span className="truncate text-sm text-muted-foreground/50">{title}</span>}
  >
    {children}
  </DetailHeader>
);
