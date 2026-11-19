"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Play, ArrowRight } from "lucide-react";
import { GithubIcon } from "@/components/brand-icons";
import { projects } from "@/lib/data";

export function ProjectsSection() {
  const [playing, setPlaying] = useState<number | null>(null);

  return (
    <section id="projects" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="mb-12 flex justify-center"
      >
        <div className="glass rounded-3xl px-8 py-6 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            My <span className="text-gradient">Projects</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/50">
            Each project represents different skills and technologies I&apos;ve mastered.
          </p>
          <Link
            href="/projects"
            className="mt-5 inline-flex items-center gap-2 rounded-xl border border-[#22d3ee]/40 bg-[#22d3ee]/10 px-5 py-2.5 text-sm font-medium text-[#7fe7f7] transition-colors hover:bg-[#22d3ee]/20"
          >
            Browse all case studies
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {projects.map((project, index) => (
          <motion.article
            key={project.title}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, delay: (index % 2) * 0.1 }}
            className="group glass flex flex-col overflow-hidden rounded-2xl transition-all hover:-translate-y-1 hover:border-[#22d3ee]/40"
          >
            {/* Video preview */}
            <div className="relative h-64 w-full bg-black sm:h-72">
              {playing === index ? (
                <iframe
                  src={`https://www.youtube.com/embed/${project.videoId}?autoplay=1&modestbranding=1&rel=0`}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={`${project.title} demo`}
                />
              ) : project.videoId ? (
                <button
                  onClick={() => setPlaying(index)}
                  className="relative h-full w-full cursor-pointer"
                  aria-label={`Play ${project.title} demo video`}
                >
                  <Image
                    src={`https://img.youtube.com/vi/${project.videoId}/maxresdefault.jpg`}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors hover:bg-black/10">
                    <span className="flex items-center justify-center rounded-full bg-white/85 p-4 transition-transform hover:scale-110">
                      <Play className="h-7 w-7 text-black" />
                    </span>
                  </span>
                </button>
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0b1020] to-[#141a33]">
                  <span className="text-sm text-white/40">Private project — details on request</span>
                </div>
              )}
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col p-6">
              <h3 className="text-lg font-semibold text-white">{project.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-white/50">
                {project.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {project.githubUrl ? (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2 text-sm text-white/70 transition-colors hover:border-white/35 hover:text-white"
                  >
                    <GithubIcon className="h-4 w-4" />
                    Code
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-white/30">
                    <GithubIcon className="h-4 w-4" />
                    Private
                  </span>
                )}
                {project.videoId && (
                  <button
                    onClick={() => setPlaying(index)}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2 text-sm text-white/70 transition-colors hover:border-white/35 hover:text-white"
                  >
                    <Play className="h-4 w-4" />
                    Watch demo
                  </button>
                )}
              </div>

              {/* Primary CTA — the case study is the main path, so make it unmissable */}
              <Link
                href={`/projects/${project.slug}`}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#22d3ee]/40 bg-[#22d3ee]/10 px-5 py-3 text-sm font-medium text-[#7fe7f7] transition-colors hover:bg-[#22d3ee]/20"
              >
                Read the case study
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
