import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { projects } from "@/lib/data";
import { caseStudies } from "@/lib/case-studies";
import { SITE_URL } from "@/lib/site";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SceneLoader } from "@/components/three/scene-loader";
import { GithubIcon } from "@/components/brand-icons";

// Static export: every slug is prerendered at build time — nothing dynamic.
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

function getData(slug: string) {
  const project = projects.find((p) => p.slug === slug);
  const study = caseStudies[slug];
  if (!project || !study) return null;
  return { project, study };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = getData(slug);
  if (!data) return {};
  const { project, study } = data;
  const title = `${project.title} | Siddharth Verma`;
  const description = `${study.subtitle}. ${project.description}`;
  // Projects with a demo get their video thumbnail as the share image
  const image = project.videoId
    ? `https://img.youtube.com/vi/${project.videoId}/maxresdefault.jpg`
    : "/og.png";

  return {
    title,
    description,
    openGraph: { title, description, type: "article", images: [{ url: image, width: 1280, height: 720 }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

const headingClass = "mt-14 text-2xl font-bold tracking-tight";
const bodyClass = "mt-4 leading-relaxed text-white/55";

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = getData(slug);
  if (!data) notFound();
  const { project, study } = data;

  const index = projects.findIndex((p) => p.slug === slug);
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  const image = project.videoId
    ? `https://img.youtube.com/vi/${project.videoId}/maxresdefault.jpg`
    : "/og.png";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    url: `${SITE_URL}/projects/${project.slug}`,
    image,
    keywords: project.tags.join(", "),
    author: { "@type": "Person", name: "Siddharth Verma", url: SITE_URL },
  };

  return (
    <main className="relative">
      {/* Dimmed reading pose of the neural core */}
      <SceneLoader variant="article" />
      <Navbar />

      <article className="relative z-10 mx-auto max-w-3xl px-4 pb-20 pt-32 sm:px-6">
        {/* Breadcrumb */}
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-sm text-white/40 transition-colors hover:text-[#7fe7f7]"
        >
          <ArrowLeft className="h-4 w-4" />
          All Projects
        </Link>

        {/* Header */}
        <header className="glass mt-6 rounded-3xl p-8 sm:p-10">
          <p className="text-sm font-medium text-[#7fe7f7]">Case Study</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{project.title}</h1>
          <p className="mt-3 text-lg text-white/60">{study.subtitle}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {project.githubUrl ? (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-2.5 text-sm text-white/70 transition-colors hover:border-white/35 hover:text-white"
              >
                <GithubIcon className="h-4 w-4" />
                View Source
              </a>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-5 py-2.5 text-sm text-white/30">
                <GithubIcon className="h-4 w-4" />
                Private project — details on request
              </span>
            )}
            {project.videoId && (
              <a
                href={`https://www.youtube.com/watch?v=${project.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-[#22d3ee]/30 bg-[#22d3ee]/10 px-5 py-2.5 text-sm text-[#7fe7f7] transition-colors hover:bg-[#22d3ee]/20"
              >
                <ExternalLink className="h-4 w-4" />
                Watch Demo
              </a>
            )}
          </div>
        </header>

        {/* Demo video */}
        {project.videoId && (
          <section className="mt-12">
            <h2 className={headingClass}>
              Demo <span className="text-gradient">video</span>
            </h2>
            <div className="mt-5 aspect-video w-full overflow-hidden rounded-2xl border border-white/10">
              <iframe
                src={`https://www.youtube.com/embed/${project.videoId}?rel=0&modestbranding=1`}
                title={`${project.title} demo`}
                loading="lazy"
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </section>
        )}

        {/* Overview + problem */}
        <section>
          <h2 className={headingClass}>
            What it <span className="text-gradient">is</span>
          </h2>
          <p className={bodyClass}>{study.overview}</p>

          <h2 className={headingClass}>
            The <span className="text-gradient">problem</span>
          </h2>
          <p className={bodyClass}>{study.problem}</p>
        </section>

        {/* Approach */}
        <section>
          <h2 className={headingClass}>
            How it <span className="text-gradient">works</span>
          </h2>
          {study.approach.map((step) => (
            <div key={step.heading} className="glass mt-5 rounded-2xl p-6">
              <h3 className="font-semibold text-white">{step.heading}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{step.body}</p>
            </div>
          ))}
        </section>

        {/* Challenges */}
        <section>
          <h2 className={headingClass}>
            Challenges &amp; <span className="text-gradient">solutions</span>
          </h2>
          {study.challenges.map((item) => (
            <div key={item.challenge} className="mt-5 border-l-2 border-[#22d3ee]/30 pl-5">
              <h3 className="font-semibold text-white/85">{item.challenge}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{item.solution}</p>
            </div>
          ))}
        </section>

        {/* Learnings */}
        <section>
          <h2 className={headingClass}>
            What I <span className="text-gradient">learned</span>
          </h2>
          <ul className="mt-5 space-y-3">
            {study.learnings.map((learning) => (
              <li key={learning} className="flex gap-3 text-sm leading-relaxed text-white/55">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-[#22d3ee] to-[#8b5cf6]" />
                {learning}
              </li>
            ))}
          </ul>
        </section>

        {/* Prev / next */}
        <nav className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link
            href={`/projects/${prev.slug}`}
            className="glass group rounded-2xl p-5 transition-colors hover:border-[#22d3ee]/40"
          >
            <span className="flex items-center gap-2 text-xs text-white/40">
              <ArrowLeft className="h-3.5 w-3.5" /> Previous project
            </span>
            <span className="mt-2 block text-sm font-medium text-white/80 transition-colors group-hover:text-[#7fe7f7]">
              {prev.title}
            </span>
          </Link>
          <Link
            href={`/projects/${next.slug}`}
            className="glass group rounded-2xl p-5 text-right transition-colors hover:border-[#22d3ee]/40"
          >
            <span className="flex items-center justify-end gap-2 text-xs text-white/40">
              Next project <ArrowRight className="h-3.5 w-3.5" />
            </span>
            <span className="mt-2 block text-sm font-medium text-white/80 transition-colors group-hover:text-[#7fe7f7]">
              {next.title}
            </span>
          </Link>
        </nav>
      </article>

      <Footer />

      {/* Structured data — this page is a creative work authored by you */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}
