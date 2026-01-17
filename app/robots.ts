import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/checkout/", "/auth/"],
    },
    sitemap: "https://www.dahsjhoss.store/sitemap.xml",
  };
}
