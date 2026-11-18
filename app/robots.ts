import type { MetadataRoute } from "next";
import { SITE_URL } from "./layout";

// Required for `output: "export"` — robots.txt is emitted at build time
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
