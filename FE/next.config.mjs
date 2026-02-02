/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {},
  experimental: {
    webpackBuildWorker: false,
    cpus: 1,
    workerThreads: false,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        path: false,
        buffer: false,
        crypto: false,
      };
    }
    return config;
  },
};

export default nextConfig;
