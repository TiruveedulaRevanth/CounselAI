
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
           <stop offset="0%" style={{ stopColor: '#8134AF' }} />
           <stop offset="50%" style={{ stopColor: '#DD2A7B' }} />
           <stop offset="100%" style={{ stopColor: '#FEDA77' }} />
        </linearGradient>
      </defs>
      <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z" />
    </svg>
    <Sprout className="h-[55%] w-[55%] text-primary" stroke="url(#brain-gradient)" strokeWidth={1.5}/>
  </div>
);
