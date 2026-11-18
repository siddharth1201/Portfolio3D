import Link from "next/link";
import { GithubIcon, LinkedinIcon, XIcon } from "@/components/brand-icons";
import { profile, socials } from "@/lib/data";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#05060a]/70 py-10 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 sm:flex-row sm:justify-between sm:px-6">
        <p className="text-sm text-white/40">
          © {new Date().getFullYear()} {profile.name}
        </p>

        <div className="flex items-center gap-5">
          <a href={socials.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-white/40 transition-colors hover:text-white">
            <GithubIcon className="h-4 w-4" />
          </a>
          <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-white/40 transition-colors hover:text-white">
            <LinkedinIcon className="h-4 w-4" />
          </a>
          <a href={socials.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-white/40 transition-colors hover:text-white">
            <XIcon className="h-4 w-4" />
          </a>
        </div>

        <p className="text-sm text-white/40">
          Built with <Link href="https://nextjs.org" target="_blank" className="text-white/60 hover:text-white">Next.js</Link> +{" "}
          <Link href="https://threejs.org" target="_blank" className="text-white/60 hover:text-white">Three.js</Link>
        </p>
      </div>
    </footer>
  );
}
