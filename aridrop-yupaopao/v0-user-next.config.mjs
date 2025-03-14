/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'placeholder.com', 
      'via.placeholder.com', 
      'images.unsplash.com', 
      'placehold.co',
      'pbs.twimg.com',
      'v0.blob.com',
      'public.rootdata.com',
      'avatars.githubusercontent.com',
      process.env.SUPABASE_URL?.replace('https://', ''), // 允许来自 Supabase Storage 的图片
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // 禁用静态导出和预渲染
  output: 'standalone',
  experimental: {
    // 禁用 serverActions，避免与 NextAuth 冲突
    serverActions: false,
  },
}

export default nextConfig

