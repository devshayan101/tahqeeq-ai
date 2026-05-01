import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      // Added for the Sawade Azam logo, if it's hosted there (or use a placeholder)
      // Example, if you host it on your own domain or a CDN:
      // {
      //   protocol: 'https',
      //   hostname: 'www.sawadeazam.org', 
      //   port: '',
      //   pathname: '/wp-content/uploads/**',
      // },
    ],
  },
};

export default nextConfig;
