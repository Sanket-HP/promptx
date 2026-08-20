/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  transpilePackages: ["@promptx/shared", "dlv", "tailwindcss"]
};

module.exports = nextConfig;
