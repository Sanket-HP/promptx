/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@promptx/shared", "dlv", "tailwindcss"]
};

module.exports = nextConfig;
