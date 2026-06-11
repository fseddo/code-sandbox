"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuBookOpen, LuChevronDown, LuGraduationCap, LuHouse, LuListChecks, LuSquareCode, LuWaves } from "react-icons/lu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const AREAS = [
  { href: "/concepts", label: "Concepts", icon: LuBookOpen },
  { href: "/study-guide", label: "Interview Study Guide", icon: LuGraduationCap },
  { href: "/problems", label: "Problems", icon: LuListChecks },
  { href: "/pads", label: "Pads", icon: LuSquareCode },
];

/** The brand mark as an area switcher — one nav for hopping between the listing pages (and back to the landing). */
export const BrandMenu = () => {
  const pathname = usePathname();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex shrink-0 items-center gap-2 rounded-md py-1 pr-1.5 pl-1 font-semibold tracking-tight transition-colors hover:bg-muted">
        <LuWaves className="size-5 text-primary" />
        noodle
        <LuChevronDown className="size-3.5 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-56">
        {AREAS.map(({ href, label, icon: Icon }) => (
          <DropdownMenuItem
            key={href}
            render={<Link href={href} />}
            className={cn(pathname.startsWith(href) && "bg-muted font-medium text-foreground")}
          >
            <Icon className="size-4" />
            {label}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/" />}>
          <LuHouse className="size-4" />
          Home
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
