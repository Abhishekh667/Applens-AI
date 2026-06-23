/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "play-lh.googleusercontent.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "*.mzstatic.com" },
      { protocol: "https", hostname: "apps.apple.com" },
      { protocol: "https", hostname: "play.google.com" },
    ],
  },
  // google-play-scraper / app-store-scraper are server-only
  serverExternalPackages: ["google-play-scraper", "app-store-scraper"],
};

export default nextConfig;
