/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "database-upload.v3.microgen.id",
      },
      {
        protocol: "https",
        hostname: "robohash.org",
      },
      {
        protocol: "https",
        hostname: "dummyimage.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `https://database-query.v3.microgen.id/api/v1/${String(
          process.env.NEXT_PUBLIC_MICROGEN_API_KEY,
        )}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
