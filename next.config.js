/** @type {import('next').NextConfig} */
const nextConfig = {
    // Production source maps setting
  productionBrowserSourceMaps: true,

  // Image settings for remote patterns
  // images: {
  //   domains: ['paskvjemkyxnpmlrvzzt.supabase.co'],
  // },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'paskvjemkyxnpmlrvzzt.supabase.co',
        pathname: '/storage/v1/object/public/avatar_files/**',
      },
      {
        protocol: 'https',
        hostname: 'paskvjemkyxnpmlrvzzt.supabase.co',
        pathname: '/storage/v1/object/public/attachment_files/editor-uploads/**',
      },
    ],
  }
};

export default nextConfig;
