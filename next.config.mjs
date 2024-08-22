/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '**',
      },
    ],
  },
  webpack(config, { dev }) {
    if (dev) {
      config.devtool = 'source-map'; // Enables source maps for development
    }
    return config;
  },
};

export default nextConfig;
