/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pinimg.com",
        port: ""
      },
      {
        protocol: "https",
        hostname: "st2.depositphotos.com"
      }
    ]
  }
};

export default nextConfig;
