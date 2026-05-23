import { titleizeSlug } from "@/problems/shared/format";
import { cn } from "@/lib/utils";

/** First letter of each word, capped at two — `new-york-times` → "NY", `stripe` → "S". */
const monogram = (slug: string): string =>
  slug
    .split("-")
    .map((word) => word[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

/** Stable hue (0–359) hashed from the slug, so each company keeps one consistent tint across the app. */
const hueOf = (slug: string): number => {
  let hash = 0;
  for (const char of slug) hash = (hash * 31 + char.charCodeAt(0)) % 360;
  return hash;
};

/** A small monogram square tinted by a hue hashed from the company slug — no logo assets needed. */
export const CompanyAvatar = ({ company, className }: { company: string; className?: string }) => {
  const hue = hueOf(company);
  return (
    <span
      aria-hidden
      title={titleizeSlug(company)}
      className={cn(
        "inline-flex size-5 shrink-0 items-center justify-center rounded text-[0.6rem] font-semibold",
        className,
      )}
      style={{
        backgroundColor: `hsl(${hue} 45% 22%)`,
        color: `hsl(${hue} 70% 78%)`,
      }}
    >
      {monogram(company)}
    </span>
  );
};
