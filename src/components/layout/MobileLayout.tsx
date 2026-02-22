"use client";

import { ReactNode } from "react";

interface MobileLayoutProps {
  children: ReactNode;
  /** Optional sticky bottom bar - rendered inside this layout */
  bottomBar?: ReactNode;
}

/**
 * Mobile-first layout: single column, touch targets, sticky bottom bar.
 * Visible only below desktop breakpoint (lg).
 */
export function MobileLayout({ children, bottomBar }: MobileLayoutProps) {
  return (
    <div className="flex flex-col lg:hidden">
      <div className="flex-1">{children}</div>
      {bottomBar}
    </div>
  );
}
