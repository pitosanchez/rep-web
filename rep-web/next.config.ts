import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    // Turbopack is sensitive to working directory; pin it to this package.
    root: typeof __dirname !== "undefined" ? __dirname : path.resolve("."),
  },
};

export default nextConfig;
