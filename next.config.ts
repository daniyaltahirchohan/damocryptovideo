/** @type {import('next').NextConfig} */
const nextConfig = {
  // Temporarily disable ESLint during builds
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig