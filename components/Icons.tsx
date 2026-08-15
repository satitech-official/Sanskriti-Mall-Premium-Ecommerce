import type { ReactNode } from "react";

export function Icon({ children, label }: { children: ReactNode; label: string }) {
  return <span className="icon-symbol" role="img" aria-label={label}>{children}</span>;
}
