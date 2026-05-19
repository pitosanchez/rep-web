import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

// Control turbopack.root pinning safely to avoid workspace-root inference issues when
// invoking npm from the repository root (for example: `npm --prefix where-we-live-site run dev`).
// Behavior:
//  - By default we do not pin turbopack.root (preserve Next/Turbopack default inference).
//  - To explicitly pin the root when running the package in isolation, set:
//      TURBOPACK_PIN_ROOT=1
//  - We also pin automatically when it's safe to do so: when the running cwd is inside
//    the package (cwd differs from __dirname) and npm was not invoked with --prefix.

const npmPrefix = process.env.npm_config_prefix || process.env.NPM_CONFIG_PREFIX;
const explicitlyPinned = process.env.TURBOPACK_PIN_ROOT === "1";
const dirnameAvailable = typeof __dirname !== "undefined";
const cwd = typeof process !== "undefined" && typeof process.cwd === "function" ? process.cwd() : undefined;

const shouldPinRoot = explicitlyPinned || (
  dirnameAvailable &&
  cwd !== undefined &&
  // Only pin when running from inside the package folder (cwd differs from repo root)
  __dirname !== cwd &&
  // Avoid pinning when npm was invoked with --prefix (npm sets npm_config_prefix)
  !npmPrefix
);

const withNextIntl = createNextIntlPlugin('./lib/i18n.ts');

const nextConfig: NextConfig = shouldPinRoot
  ? {
      turbopack: {
        // Pin turbopack.root to the package directory to make resolution stable when
        // running dev from within the package.
        root: __dirname,
      },
    }
  : {};

export default withNextIntl(nextConfig);
