/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      'placeholder.com', 
      'via.placeholder.com', 
      'images.unsplash.com', 
      'placehold.co',
      'pbs.twimg.com',
      'public.rootdata.com',
      'avatars.githubusercontent.com',
      'hebbkx1anhila5yf.public.blob.vercel-storage.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true,
  },
}

export default nextConfig
