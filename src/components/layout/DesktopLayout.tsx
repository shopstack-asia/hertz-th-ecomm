"use client";

import { ReactNode } from "react";

interface DesktopLayoutProps {
  /** Main content area (left column) */
  main: ReactNode;
  /** Sidebar/summary (right column, sticky) */
  sidebar: ReactNode;
}

/**
 * Desktop layout: 2-column with sticky summary on right.
 * Visible only at desktop breakpoint (lg) and up.
 */
export function DesktopLayout({ main, sidebar }: DesktopLayoutProps) {
  return (
    <div className="hidden lg:flex lg:max-w-7xl lg:gap-8 lg:px-6">
      <div className="flex-1">{main}</div>
      <aside className="w-96 shrink-0">{sidebar}</aside>
    </div>
  );
}
