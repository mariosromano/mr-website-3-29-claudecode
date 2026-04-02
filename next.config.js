/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/dtlodxxio/**',
      },
    ],
  },
  async redirects() {
    return [
      // Renamed slugs
      { source: '/applications/reception-desks', destination: '/applications/reception', permanent: true },
      { source: '/applications/branded-environments', destination: '/applications/branding', permanent: true },
      // Consolidated into facades
      { source: '/applications/rain-screens', destination: '/applications/facades', permanent: true },
      { source: '/applications/canopies', destination: '/applications/facades', permanent: true },
      { source: '/applications/building-envelopes', destination: '/applications/facades', permanent: true },
      // Removed — send to index
      { source: '/applications/column-wraps', destination: '/applications', permanent: true },
      { source: '/applications/stair-walls', destination: '/applications', permanent: true },
    ];
  },
};

module.exports = nextConfig;
