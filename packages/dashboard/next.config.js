/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  transpilePackages: ['kubernetesjs', '@kubernetesjs/react', 'json-schema-faker'],
  webpack: (config, { isServer }) => {
    // Fix for isomorphic-git
    config.resolve.fallback = {
      // ... existing code ...
    };

    return config;
  },
};

module.exports = nextConfig;
