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
    {/* Light rays */}
    <path d="M12 1v2" />
    <path d="M12 21v2" />
    <path d="m4.22 4.22 1.42 1.42" />
    <path d="m18.36 18.36 1.42 1.42" />
    <path d="M1 12h2" />
    <path d="M21 12h2" />
    <path d="m4.22 19.78 1.42-1.42" />
    <path d="m18.36 5.64 1.42-1.42" />

    {/* Brain */}
    <path d="M12.5 7.1a2.1 2.1 0 0 0-2.4 0" />
    <path d="M14.5 9c.7-1.1.5-2.6-.5-3.5a2.5 2.5 0 0 0-3.5 0c-1 1-1.2 2.4-.5 3.5" />
    <path d="M11 12.5c-1.1.7-2.6.5-3.5-.5a2.5 2.5 0 0 1 0-3.5c1-1 2.4-1.2 3.5-.5" />
    <path d="M13 12.5c1.1.7 2.6.5 3.5-.5a2.5 2.5 0 0 0 0-3.5c-1-1-2.4-1.2-3.5-.5" />
    <path d="M9.5 15.6a2.1 2.1 0 0 1 2.4 0" />
    <path d="M7.5 15c-.7 1.1-.5 2.6.5 3.5a2.5 2.5 0 0 0 3.5 0c1-1 1.2-2.4.5-3.5" />
    <path d="M16.5 15c.7 1.1.5 2.6-.5 3.5a2.5 2.5 0 0 1-3.5 0c-1-1-1.2-2.4-.5-3.5" />
    <path d="M12 17.5a1.5 1.5 0 0 0-1.5 1.5v1.5a1.5 1.5 0 0 0 3 0V19a1.5 1.5 0 0 0-1.5-1.5Z" />
  </svg>
);