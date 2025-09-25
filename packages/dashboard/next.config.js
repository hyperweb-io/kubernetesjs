/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  transpilePackages: ['json-schema-faker'],
  webpack: (config, { isServer }) => {
    // Fix for isomorphic-git
    config.resolve.fallback = {
      // ... existing code ...
    };

    return config;
  },
};

module.exports = nextConfig;
