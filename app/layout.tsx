import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Canonical origin — used to resolve OG/Twitter image URLs and sitemap links.
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Siddharth Verma — Full Stack & Gen AI Developer | Indore, India",
  description:
    "Full-stack & GenAI developer building scalable, intelligent systems — LLM apps, RAG pipelines, and modern web experiences. Based in Indore, India.",
  openGraph: {
    title: "Siddharth Verma — Full Stack & Gen AI Developer | Indore, India",
    description:
      "Full-stack & GenAI developer building scalable, intelligent systems — LLM apps, RAG pipelines, and modern web experiences. Based in Indore, India.",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Siddharth Verma — Full Stack + Gen AI Developer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Siddharth Verma — Full Stack & Gen AI Developer | Indore, India",
    description:
      "Full-stack & GenAI developer building scalable, intelligent systems — LLM apps, RAG pipelines, and modern web experiences. Based in Indore, India.",
    images: ["/og.png"],
  },
};

// Structured data — tells Google this site IS the entity "Siddharth Verma",
// a developer, and links the identity to GitHub/LinkedIn profiles.
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Siddharth Verma",
  jobTitle: "Full Stack & Gen AI Developer",
  url: SITE_URL,
  image: `${SITE_URL}/myimg.jpg`,
  sameAs: [
    "https://github.com/siddharth1201",
    "https://www.linkedin.com/in/siddharthverma7952a31a9",
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Indore",
    addressRegion: "Madhya Pradesh",
    addressCountry: "IN",
  },
  knowsAbout: [
    "Next.js", "React", "TypeScript", "Python", "FastAPI",
    "LangChain", "RAG", "LLM applications", "Azure OpenAI",
    "Google Gemini", "Vector databases", "AI agents",
  ],
};

export const viewport: Viewport = {
  themeColor: "#05060a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#05060a]`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
