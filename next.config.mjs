/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/unauthorized",
        destination: "/unauthorized", // Redirect to your custom unauthorized page
        permanent: false,
      },
      {
        source: "/login",
        destination: "/login", // Redirect to login page
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
