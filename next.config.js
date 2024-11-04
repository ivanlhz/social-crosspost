/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
  // Disable static page generation
  staticPageGenerationTimeout: 0,
  images: {
    unoptimized: true
  }
};

module.exports = nextConfig;
