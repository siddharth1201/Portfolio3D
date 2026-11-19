"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, FileText } from "lucide-react";
import { navLinks, profile } from "@/lib/data";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-20">
      <nav className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-[#0a0d16]/70 px-5 py-3 backdrop-blur-xl">
          <Link href="/" className="text-lg font-bold tracking-tight">
            <span className="text-gradient">SV</span>
            <span className="text-white/90">.</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-white/60 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-[#22d3ee]/40 bg-[#22d3ee]/10 px-4 py-2 text-sm font-medium text-[#7fe7f7] transition-colors hover:bg-[#22d3ee]/20"
            >
              <FileText className="h-4 w-4" />
              Resume
            </a>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="md:hidden rounded-lg p-2 text-white/70 hover:text-white"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden mt-2 rounded-2xl border border-white/10 bg-[#0a0d16]/90 p-4 backdrop-blur-xl">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-3 text-white/70 hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex items-center gap-2 rounded-lg px-3 py-3 text-[#7fe7f7] hover:bg-white/5"
            >
              <FileText className="h-4 w-4" />
              Resume
            </a>
          </div>
        )}
      </nav>
    </header>
  );
}
