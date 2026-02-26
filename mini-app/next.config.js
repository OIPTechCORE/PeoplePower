/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Enable standalone output for deployment
  output: 'standalone',
  
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Image optimization
  images: {
    domains: [
      'localhost',
      'your-api-domain.com',
      'telegram.org',
      'cdn.telegram.org',
    ],
    unoptimized: true, // Better for Telegram Mini Apps
  },
  
  // Headers for security and Telegram integration
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https:;",
          },
        ],
      },
    ];
  },
  
  // Rewrites for API proxy (development)
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/:path*`,
      },
    ];
  },
  
  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Add polyfills for Telegram Web App SDK
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    return config;
  },
  
  // Experimental features
  experimental: {
    // Enable app directory (if using Next.js 13+ app router)
    appDir: false, // Using pages router for now
  },
  
  // Build optimization
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

module.exports = nextConfig;
