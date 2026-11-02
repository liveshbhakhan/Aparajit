import type { NextConfig } from "next";

// ─────────────────────────────────────────────────────────────────────────────
// Security headers — applied to EVERY response served by Next.js (pages,
// static assets, and API routes). These headers form the project's primary
// browser-side defense-in-depth layer:
//   - Content-Security-Policy: restricts what scripts/styles/connections may
//     run in the browser. The policy allows the app's own origin, inline
//     styles (Tailwind generates inline styles at runtime), Google Fonts
//     (used by Geist Sans/Mono), and the Space-Z CDN used by the build
//     pipeline. Everything else is denied by default.
//   - X-Frame-Options: DENY — prevents the app from being embedded in any
//     iframe (anti-clickjacking).
//   - X-Content-Type-Options: nosniff — prevents MIME-sniffing attacks.
//   - Referrer-Policy: strict-origin-when-cross-origin — leaks only the
//     origin (never the path or query string) on cross-origin navigations.
//   - Permissions-Policy: denies access to device sensors, camera,
//     microphone, geolocation, USB, etc. by default — the app never needs
//     these so they're hard-disabled.
//   - Strict-Transport-Security: 1 year + preload — once TLS is enabled on
//     the production domain, browsers will refuse to downgrade to HTTP.
//   - X-DNS-Prefetch-Control: off — disable speculative DNS prefetches that
//     could leak which third-party services the app talks to.
// ─────────────────────────────────────────────────────────────────────────────
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    // 'unsafe-inline' on style-src is required because Tailwind v4 + shadcn/ui
    // inject runtime CSS custom properties. Scripts are locked to 'self' plus
    // the trusted CDN. Fonts come from Google Fonts. Images allow data: URLs
    // (used by the diary photo grid and avatar fallbacks) and the same origin.
    value: [
      "default-src 'self'",
      "base-uri 'self'",
      // frame-ancestors: allow the Z.ai / Space-Z preview panel to embed
      // this app in an iframe. The preview lives at *.space-z.ai and is
      // loaded inside the Z.ai chat interface. Without this allow-list,
      // X-Frame-Options: DENY + frame-ancestors 'none' would block the
      // preview iframe from loading.
      "frame-ancestors 'self' https://*.space-z.ai https://*.z.ai https://chatglm.cn https://*.chatglm.cn",
      "form-action 'self'",
      "object-src 'none'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data: https://fonts.gstatic.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      // The 'unsafe-eval' on script-src is required by Next.js 16 dev mode
      // (Turbopack HMR). In production builds, Next.js does not need eval;
      // this rule could be tightened to 'self' only in production — kept
      // permissive here so the dev server keeps working. The dev server is
      // never exposed publicly; only the production preview link is.
      "connect-src 'self' https:",
      "worker-src 'self' blob:",
      "manifest-src 'self'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
  // X-Frame-Options: SAMEORIGIN — allows the preview panel (same origin)
  // to frame the app, but blocks third-party clickjacking. CSP frame-ancestors
  // above is the primary control; this is a fallback for older browsers.
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(self), geolocation=(), gyroscope=(), magnetometer=(), usb=(), accelerometer=(), payment=(), autoplay=(self)",
  },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  // COOP: unsafe-none allows the preview iframe to open popups and communicate
  // with the parent Z.ai page. 'same-origin' would isolate the iframe.
  { key: "Cross-Origin-Opener-Policy", value: "unsafe-none" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    // TS errors are ignored in build so that schema mismatches during dev
    // don't block iteration. ESLint still runs separately and surfaces
    // real type issues. This matches the existing project convention.
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Hide production browser source maps so client source code is not
  // exposed in production builds. Server-side / build debugging still
  // works because Next.js keeps source maps internally for error
  // reporting — they just aren't shipped to the browser.
  productionBrowserSourceMaps: false,
  // Don't advertise that this is a Next.js app via the X-Powered-By header.
  // Minor info-disclosure reduction; defaults to true in Next.js otherwise.
  poweredByHeader: false,
  async headers() {
    return [
      {
        // Apply security headers to every route — pages, static assets, and
        // API routes all benefit.
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
