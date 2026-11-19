import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { projects } from "@/lib/data";
import { caseStudies } from "@/lib/case-studies";
import { SITE_URL } from "@/lib/site";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SceneLoader } from "@/components/three/scene-loader";

export const metadata: Metadata = {
  title: "Case Studies — AI & Full Stack Projects | Siddharth Verma",
  description:
    "Deep dives into production AI systems: a codebase-aware VS Code assistant (Code RAG), an enterprise HR chatbot for Teams & Slack, a Shopify shopping agent, and a Whisper-based call analysis engine.",
  alternates: { canonical: `${SITE_URL}/projects` },
  openGraph: {
    title: "Case Studies — AI & Full Stack Projects | Siddharth Verma",
    description:
      "Deep dives into production AI systems built by Siddharth Verma: Code RAG, enterprise HR chatbots, Shopify agents and speech analytics.",
    url: `${SITE_URL}/projects`,
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Case Studies — AI & Full Stack Projects | Siddharth Verma",
    description:
      "Deep dives into production AI systems: Code RAG, enterprise HR chatbots, Shopify agents and speech analytics.",
    images: ["/og.png"],
  },
};

export default function ProjectsIndexPage() {
  const items = projects.filter((p) => caseStudies[p.slug]);

  return (
    <main className="relative">
      {/* Dimmed reading pose of the neural core */}
      <SceneLoader variant="article" />
      <Navbar />

      <div className="relative z-10 mx-auto max-w-5xl px-4 pb-20 pt-32 sm:px-6">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-sm text-white/40 transition-colors hover:text-[#7fe7f7]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to portfolio
        </Link>

        <header className="glass mt-6 rounded-3xl p-8 sm:p-10">
          <p className="text-sm font-medium text-[#7fe7f7]">Case Studies</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            How I build <span className="text-gradient">AI systems</span>
          </h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-white/55">
            Deep dives into the architecture, trade-offs and hard problems behind each project —
            retrieval pipelines, agent orchestration, enterprise integrations and LLM cost
            engineering. Written from the actual build, not the pitch deck.
          </p>
        </header>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {items.map((project) => {
            const study = caseStudies[project.slug];
            return (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="group glass flex flex-col rounded-2xl p-6 transition-all hover:-translate-y-1 hover:border-[#22d3ee]/40"
              >
                <h2 className="text-lg font-semibold text-white transition-colors group-hover:text-[#7fe7f7]">
                  {project.title}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-white/50">
                  {study.subtitle}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#7fe7f7]">
                  Read case study
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <Footer />
    </main>
  );
}
