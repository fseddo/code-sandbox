import type { NextConfig } from "next";

// Security headers for the public deploy. The app is fully client-side (no API routes; the algo judge
// runs in a browser Web Worker — see docs/features/algo.md), so the surface is small. These cover
// clickjacking, MIME sniffing, referrer leakage, transport security, and unused browser features.
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  // Report-Only, not enforcing: the in-browser judge needs `'unsafe-eval'` (the worker grades via
  // `new Function`), and Sandpack (the Pad) bundles by fetching packages from CodeSandbox CDNs and
  // iframing a sandbox — origins that are hard to pin exactly. Ships safe (never blocks), surfaces
  // violations in the console. Validate against the Pad, tighten the Sandpack/CDN origins, then promote
  // the key to `Content-Security-Policy` to enforce.
  {
    key: "Content-Security-Policy-Report-Only",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "worker-src 'self' blob:",
      "child-src 'self' blob: https://*.codesandbox.io https://*.csb.app",
      "frame-src 'self' blob: https://*.codesandbox.io https://*.csb.app",
      "connect-src 'self' https://*.codesandbox.io https://*.csb.app https://*.bundler.codesandbox.io wss://*.codesandbox.io https://cdn.jsdelivr.net https://unpkg.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "object-src 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  headers: () => Promise.resolve([{ source: "/:path*", headers: securityHeaders }]),
};

export default nextConfig;
