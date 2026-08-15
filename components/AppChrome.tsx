"use client";

import { usePathname } from "next/navigation";
import { StoreProvider } from "./StoreProvider";
import { StoreShell } from "./StoreShell";

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return <StoreProvider>{pathname.startsWith("/admin") ? children : <StoreShell>{children}</StoreShell>}</StoreProvider>;
}
