/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  images: {
    // Allow Unsplash hero/category images
    domains: ['images.unsplash.com', 'alaba-marketplace.s3.amazonaws.com'],
    // If you later change your S3 bucket name, update the domain above accordingly.
  },
}

module.exports = nextConfig
