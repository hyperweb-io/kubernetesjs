/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['kubernetesjs'],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      kubernetesjs: path.resolve(__dirname, '../kubernetesjs/dist')
    };
    return config;
  },
}

module.exports = nextConfig
