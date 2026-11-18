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

export const metadata: Metadata = {
  title: "Siddharth Verma — Full Stack + Gen AI Developer",
  description:
    "I use AI to eliminate the repetitive, so I can engineer what truly matters—scalable, intelligent systems.",
  openGraph: {
    title: "Siddharth Verma — Full Stack + Gen AI Developer",
    description:
      "I use AI to eliminate the repetitive, so I can engineer what truly matters—scalable, intelligent systems.",
    type: "website",
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
