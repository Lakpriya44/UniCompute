"use client";

import { usePathname } from "next/navigation";
import AppShell from "./AppShell";
import { HPCProvider } from "./HPCProvider";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (["/landing", "/login", "/register"].includes(pathname)) return children;
  return <HPCProvider><AppShell>{children}</AppShell></HPCProvider>;
}
