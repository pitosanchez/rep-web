import type { NextConfig } from "next";

// Avoid overriding Turbopack root: it can break when running `npm --prefix rep-web run dev`
// from the repo root (workspace root inference becomes incorrect).
const nextConfig: NextConfig = {};

export default nextConfig;
