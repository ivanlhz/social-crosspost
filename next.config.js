/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  experimental: {
    // Enable runtime by default for all routes
    runtime: 'nodejs',
  },
  // Disable static optimization for pages that need to be dynamic
  staticPageGenerationTimeout: 0,
  output: 'standalone',
};

module.exports = nextConfig;
