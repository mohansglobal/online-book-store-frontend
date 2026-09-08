import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "shelfie-joy.lovable.app",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn-dlmfn.nitrocdn.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.britannica.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "assets-in.bmscdn.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "media.licdn.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.haveagonews.com.au",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "indobanglabooks.in",
        pathname: "/**",
      },
      {
      protocol: "https",
      hostname: "i.pinimg.com",
    },
    ],
  },
};

export default nextConfig;