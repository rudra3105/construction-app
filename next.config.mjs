import withPWA from 'next-pwa';

const isProd = process.env.NODE_ENV === 'production';

const nextConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: !isProd
})({
  reactStrictMode: true,
  turbopack: {}
});

export default nextConfig;
