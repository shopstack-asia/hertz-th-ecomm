"use client";

import { ReactNode } from "react";

interface BottomActionBarProps {
  children: ReactNode;
  className?: string;
}

export function BottomActionBar({ children, className = "" }: BottomActionBarProps) {
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white p-4 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] lg:relative lg:rounded-2xl lg:border lg:border-gray-200 lg:shadow-card lg:p-6 ${className}`}
    >
      {children}
    </div>
  );
}
