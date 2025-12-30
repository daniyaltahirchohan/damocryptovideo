//// next.config.js
///** @type {import('next').NextConfig} */
//const nextConfig = {
//  experimental: {
//    serverActions: {
//      bodySizeLimit: '10mb', // or '10mb' / false to turn off
//    },
//  },
//};
//
//export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Temporarily disable ESLint during builds to isolate the issue
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Add more detailed logging
  distDir: 'dist',
  // Ensure proper output
  output: 'standalone',
}

module.exports = nextConfig