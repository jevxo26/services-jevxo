import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Unsplash (HTTPS)
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },

      // HTTP version (same domain support)
      {
        protocol: "http",
        hostname: "images.unsplash.com",
      },

      // Optional: generic CDN support (Cloudinary)
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },

      // Optional: Firebase Storage
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },

      // Optional: any S3 bucket style CDN
      {
        protocol: "https",
        hostname: "*.amazonaws.com",
      },
    ],
  },

  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;