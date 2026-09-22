"use client";

import { cn } from "@/lib/utils";

interface WavySeparatorProps {
  className?: string;
  color?: string;
}

export function WavySeparator({ className, color = "animate-rainbow" }: WavySeparatorProps) {
  return (
    <div className={cn("w-full overflow-hidden leading-none py-12", className)}>
      <svg
        viewBox="0 0 1200 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("w-full h-6", color)}
        preserveAspectRatio="none"
      >
        <path
          d="M0 10c10-10 20-10 30 0s20 10 30 0 20-10 30 0 20 10 30 0 20-10 30 0 20 10 30 0 20-10 30 0 20 10 30 0 20-10 30 0 20 10 30 0 20-10 30 0 20 10 30 0 20-10 30 0 20 10 30 0 20-10 30 0 20 10 30 0 20-10 30 0 20 10 30 0 20-10 30 0 20 10 30 0 20-10 30 0 20 10 30 0 20-10 30 0 20 10 30 0 20-10 30 0 20 10 30 0 20-10 30 0 20 10 30 0 20-10 30 0 20 10 30 0 20-10 30 0 20 10 30 0 20-10 30 0 20 10 30 0 20-10 30 0 20 10 30 0 20-10 30 0 20 10 30 0 20-10 30 0 20 10 30 0 20-10 30 0 20 10 30 0 20-10 30 0 20 10 30 0 20-10 30 0 20 10 30 0 20-10 30 0 20 10 30 0 20-10 30 0 20 10 30 0 20-10 30 0 20 10 30 0"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}