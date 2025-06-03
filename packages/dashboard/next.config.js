/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['kubernetesjs', '@kubernetesjs/react'],
}

module.exports = nextConfig