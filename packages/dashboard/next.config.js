/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Avoid bundling these server-only workspace packages so __dirname/paths stay real.
    serverExternalPackages: ['@interweb/manifests', '@interweb/client', '@interweb/interwebjs'],
  },
  async rewrites() {
    return [
      {
        source: '/k8s/:path*',
        destination: 'http://localhost:8001/:path*',
      },
    ];
  },
  webpack: (config, { isServer }) => {
    // Only stub Node built-ins for the client bundle; server routes need fs.
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    // Ensure server doesn't bundle selected workspace packages; load from node_modules at runtime.
    if (isServer) {
      const externals = config.externals || [];
      externals.push('@interweb/manifests', '@interweb/client', '@interweb/interwebjs');
      config.externals = externals;
    }
    return config;
  },
};

module.exports = nextConfig;
