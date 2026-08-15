import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const repoName = "Sanskriti-Mall-Premium-Ecommerce";
const assetPrefix = isGitHubPages ? `/${repoName}` : undefined;

const nextConfig: NextConfig = isGitHubPages
  ? {
      output: "export",
      trailingSlash: true,
      assetPrefix,
    }
  : {};

export default nextConfig;
