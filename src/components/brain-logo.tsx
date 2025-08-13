
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
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="absolute h-full w-full"
    >
      <defs>
        <linearGradient id="brain-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FEDA77" /> 
          <stop offset="30%" stopColor="#DD2A7B" />
          <stop offset="100%" stopColor="hsl(var(--primary))" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="10" />
    </svg>
    <Sprout className="h-[55%] w-[55%]" stroke="url(#brain-gradient)" strokeWidth={1.5}/>
  </div>
);
