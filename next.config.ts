// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // or '10mb' / false to turn off
    },
  },
};

export default nextConfig;