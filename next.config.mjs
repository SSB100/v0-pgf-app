/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  images: {
    unoptimized: true,
  },
  async headers() {
    const noStore = [{ key: "Cache-Control", value: "private, no-store, max-age=0" }]

    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
        ],
      },
      { source: "/api/:path*", headers: noStore },
      { source: "/dashboard/:path*", headers: noStore },
      { source: "/onboarding/:path*", headers: noStore },
      { source: "/check-in/:path*", headers: noStore },
      { source: "/community/:path*", headers: noStore },
      { source: "/journey/:path*", headers: noStore },
      { source: "/skills/:path*", headers: noStore },
      { source: "/training/:path*", headers: noStore },
      { source: "/safeguards/:path*", headers: noStore },
      { source: "/profile/:path*", headers: noStore },
      { source: "/settings/:path*", headers: noStore },
      { source: "/share-journey/:path*", headers: noStore },
    ]
  },
}

export default nextConfig
