import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
  // Prisma must stay external to the Next.js bundle so OpenNext/wrangler can
  // patch it for the workerd runtime (Cloudflare Workers).
  serverExternalPackages: ["@prisma/client", ".prisma/client"],
};

export default nextConfig;
