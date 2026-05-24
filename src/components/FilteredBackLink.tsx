"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * A back-link to a listing page that restores the filters the user left it with. The listing caches its
 * filter query string in `sessionStorage`; this reads it after mount and points the link at `base?<cached>`.
 * Falls back to the bare `base` (no cache, or direct navigation), and starts there to avoid a hydration mismatch.
 */
export const FilteredBackLink = ({
  base,
  cacheKey,
  className,
  children,
}: {
  base: string;
  cacheKey: string;
  className?: string;
  children: React.ReactNode;
}) => {
  const [href, setHref] = useState(base);

  useEffect(() => {
    const cached = window.sessionStorage.getItem(cacheKey);
    setHref(cached ? `${base}?${cached}` : base);
  }, [base, cacheKey]);

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
};
