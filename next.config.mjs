/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gaia.hiro.so",
        port: "",
        pathname: "/hub/**",
      },
    ],
  },
};

export default nextConfig;
