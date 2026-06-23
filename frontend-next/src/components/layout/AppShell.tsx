"use client";

import { useCallback, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

/* ─────────────────────────────────────────────
   AppShell — The Main Application Layout
   
   Desktop:
   ┌──────────┬─────────────────────┐
   │ Sidebar  │      Topbar         │
   │ (fixed)  ├─────────────────────┤
   │          │                     │
   │          │     Content         │
   │          │                     │
   └──────────┴─────────────────────┘
   
   Mobile/Tablet:
   ┌─────────────────────────────────┐
   │ ☰  Topbar                      │
   ├─────────────────────────────────┤
   │                                 │
   │       Content                   │
   │                                 │
   └─────────────────────────────────┘
   + Sidebar as overlay drawer
───────────────────────────────────────────── */

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar  = useCallback(() => setSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <div className="flex h-screen overflow-hidden bg-surface-page">
      {/* ── Sidebar ──────────────────────────── */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* ── Main Area ────────────────────────── */}
      <div className="flex flex-1 flex-col min-w-0 relative">
        {/* Branding SVG Background Pattern — mix-blend-mode:multiply makes white transparent.
            Placed here so it doesn't scroll with the main content. */}
        <div 
          className="absolute inset-0 pointer-events-none z-0"
          style={{ 
            backgroundImage: "url('/patterns/gemini-pattern.svg')", 
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            opacity: 0.3,
            mixBlendMode: 'multiply'
          }}
        />

        {/* Topbar needs to be z-20 relative to be above the absolute background and main content */}
        <div className="relative z-20 shadow-sm">
          <Topbar onMenuToggle={openSidebar} />
        </div>

        {/* ── Page Content ───────────────────── */}
        <main className="flex-1 overflow-y-auto relative z-10">
          <div className="px-4 py-6 lg:px-8 lg:py-8 max-w-[1440px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
