
import React from 'react';
import { cn } from "@/lib/utils";

export const BrainLogo = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="url(#brain-gradient)"
    strokeWidth="1"
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
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" strokeWidth="1.5" />
    <path d="M12 20C12 20 12 11 17 6" />
    <path d="M12 20C12 20 12 11 7 6" />
    <path d="M15.5 8C15.5 8 14 11 12 11.5" />
    <path d="M8.5 8C8.5 8 10 11 12 11.5" />
    <path d="M14 13C14 13 13 15 12 15.25" />
    <path d="M10 13C10 13 11 15 12 15.25" />
    <path d="M13 17.5C13 17.5 12.5 17.5 12 17.5" />
    <path d="M11 17.5C11 17.5 11.5 17.5 12 17.5" />
  </svg>
);
