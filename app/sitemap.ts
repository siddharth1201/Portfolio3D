import type { MetadataRoute } from "next";
import { SITE_URL } from "./layout";

// Required for `output: "export"` — sitemap.xml is emitted at build time
export const dynamic = "force-static";

// Single-page site — one canonical entry
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
