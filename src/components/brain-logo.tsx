
import React from 'react';
import { cn } from "@/lib/utils";
import { Sprout } from 'lucide-react';

export const BrainLogo = ({ className }: { className?: string }) => (
  <div className={cn("relative flex items-center justify-center", className)}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="url(#brain-gradient)"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="absolute h-full w-full"
    >
      <defs>
        <linearGradient id="brain-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
           <stop offset="0%" stopColor="hsl(var(--primary))" />
           <stop offset="100%" stopColor="hsl(var(--accent))" />
        </linearGradient>
      </defs>
      <path d="M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23-1.03 1.2-2.43 2.1-4.04 2.65-.9.3-1.85.3-2.78.02-2.13-.64-3.8-2.2-4.57-4.22A6.5 6.5 0 0 1 9.5 3zM4.5 14A6.5 6.5 0 0 0 11 20.5c3.27 0 6.02-2.4 6.44-5.5H11A6.5 6.5 0 0 1 4.5 14z" />
    </svg>
    <Sprout className="h-[55%] w-[55%] text-primary" stroke="hsl(var(--primary))" strokeWidth={1.5}/>
  </div>
);
