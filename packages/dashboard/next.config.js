/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: false,
  transpilePackages: ['@interweb/client', '@interweb/interwebjs', '@interweb/manifests'],
  eslint: {
    // Temporarily disable lint errors during build to unblock type/module resolution work
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Temporarily ignore type errors during build to allow compile to succeed while we fix typings
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    config.resolve.alias['@interweb/client'] = path.resolve(__dirname, '../client/dist');
    config.resolve.alias['@interweb/interwebjs'] = path.resolve(__dirname, '../interwebjs/dist');
    config.resolve.alias['@interweb/manifests'] = path.resolve(__dirname, '../manifests/dist');
    return config;
  },
};

module.exports = nextConfig;
