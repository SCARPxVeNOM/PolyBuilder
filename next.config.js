/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  webpack: (config, { isServer }) => {
    // Suppress warnings for optional dependencies that aren't needed in browser
    config.ignoreWarnings = [
      { module: /node_modules\/@metamask\/sdk/ },
      { module: /node_modules\/pino/ },
      { module: /node_modules\/@reown/ },
      { module: /node_modules\/@base-org/ },
      { module: /node_modules\/@wagmi/ },
    ];

    // Fallback for modules not available in browser
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        '@react-native-async-storage/async-storage': false,
        'pino-pretty': false,
        'encoding': false,
      };
    }

    return config;
  },
}

module.exports = nextConfig

