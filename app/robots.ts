import type { MetadataRoute } from "next";

// One signal for every group. A crawler applies only its most specific
// user-agent group, so the line has to be repeated or training bots would
// not see ai-train=no.
const contentSignal = "search=yes, ai-input=yes, ai-train=no";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: [
          "GPTBot",
          "ClaudeBot",
          "CCBot",
          "Bytespider",
          "anthropic-ai",
          "cohere-ai",
          "Meta-ExternalAgent",
          "Diffbot",
          "Omgilibot",
          "omgili",
          "Applebot-Extended",
        ],
        disallow: "/",
        other: { "Content-Signal": contentSignal },
      },
      {
        userAgent: [
          "*",
          "Googlebot",
          "Bingbot",
          "Google-Extended",
          "OAI-SearchBot",
          "ChatGPT-User",
          "PerplexityBot",
          "Perplexity-User",
          "Claude-SearchBot",
          "Claude-User",
          "Applebot",
          "DuckDuckBot",
        ],
        allow: "/",
        disallow: ["/admin", "/api/"],
        other: { "Content-Signal": contentSignal },
      },
    ],
    sitemap: "https://vegaskiddos.com/sitemap.xml",
  };
}
