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
export const SITE_URL = "https://siddharth.openappworld.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Siddharth Verma — Full Stack + Gen AI Developer",
  description:
    "I use AI to eliminate the repetitive, so I can engineer what truly matters—scalable, intelligent systems.",
  openGraph: {
    title: "Siddharth Verma — Full Stack + Gen AI Developer",
    description:
      "I use AI to eliminate the repetitive, so I can engineer what truly matters—scalable, intelligent systems.",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Siddharth Verma — Full Stack + Gen AI Developer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Siddharth Verma — Full Stack + Gen AI Developer",
    description:
      "I use AI to eliminate the repetitive, so I can engineer what truly matters—scalable, intelligent systems.",
    images: ["/og.png"],
  },
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
        {children}
      </body>
    </html>
  );
}
