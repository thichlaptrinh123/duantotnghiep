import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com"], // ✅ Cho phép ảnh từ Cloudinary
  },
};

export default nextConfig;
