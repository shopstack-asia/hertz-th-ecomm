"use client";

import { ReactNode } from "react";

interface StickyBottomBarProps {
  children: ReactNode;
  className?: string;
}

export function StickyBottomBar({
  children,
  className = "",
}: StickyBottomBarProps) {
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 border-t border-hertz-border bg-white p-4 shadow-elevated lg:hidden ${className}`}
    >
      {children}
    </div>
  );
}
