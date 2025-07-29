
import React from 'react';

export const BrainLogo = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9.5 2A2.5 2.5 0 0 0 7 4.5c0 1.55.8 2.83 2 3.5" />
    <path d="M14.5 2A2.5 2.5 0 0 1 17 4.5c0 1.55-.8 2.83-2 3.5" />
    <path d="M9.5 15a2.5 2.5 0 0 1-2-3.5c1.2-.67 2-1.95 2-3.5" />
    <path d="M14.5 15a2.5 2.5 0 0 0 2-3.5c-1.2-.67-2-1.95-2-3.5" />
    <path d="M12 22C7 22 5 18 5 13.5S7 5 12 5s7 3.5 7 8.5-2 8.5-7 8.5Z" />
    <path d="M12 5v17" />
    <path d="M12 12h-2" />
    <path d="M12 15h2" />
    <path d="M12 9h2" />
    <path d="M12 18h-2" />
  </svg>
);
