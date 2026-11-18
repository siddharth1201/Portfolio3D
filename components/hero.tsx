"use client";

import { motion, type Variants } from "motion/react";
import { ArrowDown, ChevronDown } from "lucide-react";
import { GithubIcon, LinkedinIcon, XIcon } from "@/components/brand-icons";
import { profile, socials } from "@/lib/data";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

export function Hero() {
  return (
    <section id="home" className="relative flex min-h-screen flex-col items-center justify-center px-4">
      {/* Vignette so text stays legible over the particle core */}
      <div className="hero-vignette pointer-events-none absolute inset-0" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 flex max-w-3xl flex-col items-center text-center"
      >
        <motion.p
          variants={item}
          className="mb-4 rounded-full border border-[#22d3ee]/30 bg-[#22d3ee]/5 px-4 py-1.5 text-sm text-[#7fe7f7]"
        >
          Hello, I&apos;m
        </motion.p>

        <motion.h1
          variants={item}
          className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl"
        >
          {profile.firstName}{" "}
          <span className="text-gradient">Verma</span>
        </motion.h1>

        <motion.h2
          variants={item}
          className="mt-4 text-xl font-semibold text-white/70 sm:text-2xl"
        >
          {profile.role}
        </motion.h2>

        <motion.p
          variants={item}
          className="mt-6 max-w-xl text-base leading-relaxed text-white/50 sm:text-lg"
        >
          {profile.tagline}
        </motion.p>

        <motion.div variants={item} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#projects"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#22d3ee] to-[#8b5cf6] px-6 py-3 font-medium text-[#05060a] shadow-lg shadow-[#22d3ee]/20 transition-transform hover:scale-[1.03] active:scale-[0.98]"
          >
            View My Work
            <ArrowDown className="h-4 w-4" />
          </a>
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-6 py-3 font-medium text-white/80 transition-colors hover:border-white/40 hover:text-white"
          >
            View Resume
          </a>
        </motion.div>

        <motion.div variants={item} className="mt-8 flex items-center gap-5">
          {[
            { href: socials.github, label: "GitHub", Icon: GithubIcon },
            { href: socials.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
            { href: socials.twitter, label: "Twitter", Icon: XIcon },
          ].map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="rounded-full border border-white/10 bg-white/5 p-3 text-white/60 transition-all hover:scale-110 hover:border-[#22d3ee]/40 hover:text-[#7fe7f7]"
            >
              <Icon className="h-5 w-5" />
            </a>
          ))}
        </motion.div>

        <motion.p variants={item} className="mt-10 text-xs tracking-wide text-white/25">
          Click anywhere — the core listens
        </motion.p>
      </motion.div>

      {/* Scroll hint */}
      <motion.a
        href="#skills"
        aria-label="Scroll to skills"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white/40"
      >
        <ChevronDown className="h-6 w-6 animate-bounce" />
      </motion.a>
    </section>
  );
}
