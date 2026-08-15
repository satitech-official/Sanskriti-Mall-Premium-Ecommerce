import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const repoName = "Sanskriti-Mall-Premium-Ecommerce";
const basePath = isGitHubPages ? `/${repoName}` : "";

const nextConfig: NextConfig = isGitHubPages
  ? {
      output: "export",
      basePath,
      assetPrefix: basePath,
      trailingSlash: true,
    }
  : {};

export default nextConfig;
