
import React from 'react';
import { cn } from "@/lib/utils";

export const BrainLogo = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="url(#brain-gradient)"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn(className)}
  >
    <defs>
      <linearGradient id="brain-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" style={{ stopColor: '#8134AF' }} />
        <stop offset="50%" style={{ stopColor: '#DD2A7B' }} />
        <stop offset="100%" style={{ stopColor: '#FEDA77' }} />
      </linearGradient>
    </defs>
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v0A2.5 2.5 0 0 1 9.5 7v0A2.5 2.5 0 0 0 7 9.5v0A2.5 2.5 0 0 0 9.5 12v0A2.5 2.5 0 0 1 12 14.5v0A2.5 2.5 0 0 1 9.5 17v0A2.5 2.5 0 0 0 7 19.5v0A2.5 2.5 0 0 0 9.5 22" />
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v0A2.5 2.5 0 0 0 14.5 7v0A2.5 2.5 0 0 1 17 9.5v0A2.5 2.5 0 0 1 14.5 12v0A2.5 2.5 0 0 0 12 14.5v0A2.5 2.5 0 0 0 14.5 17v0A2.5 2.5 0 0 1 17 19.5v0A2.5 2.5 0 0 1 14.5 22" />
    <path d="M12 4.5a2.5 2.5 0 0 1-2.5-2.5" />
    <path d="M12 4.5a2.5 2.5 0 0 0 2.5-2.5" />
    <path d="M12 14.5a2.5 2.5 0 0 1-2.5 2.5" />
    <path d="M12 14.5a2.5 2.5 0 0 0 2.5 2.5" />
    <path d="M7 9.5a2.5 2.5 0 0 0-2.5-2.5" />
    <path d="M17 9.5a2.5 2.5 0 0 1 2.5-2.5" />
    <path d="M7 19.5a2.5 2.5 0 0 1-2.5-2.5" />
    <path d="M17 19.5a2.5 2.5 0 0 0 2.5-2.5" />
    <path d="M2.5 7.5a2.5 2.5 0 0 0 0 5" />
    <path d="M21.5 7.5a2.5 2.5 0 0 1 0 5" />
    <path d="M9.5 7A2.5 2.5 0 0 0 7 9.5" />
    <path d="M9.5 17A2.5 2.5 0 0 1 7 19.5" />
    <path d="M14.5 7A2.5 2.5 0 0 1 17 9.5" />
    <path d="M14.5 17A2.5 2.5 0 0 0 17 19.5" />
  </svg>
);
