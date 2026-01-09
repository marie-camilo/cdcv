/** @type {import('next').NextConfig} */
const FRONT_BASE_URI = process.env.NEXT_PUBLIC_FRONT_BASE_URI || '';

const nextConfig = {
    basePath: FRONT_BASE_URI,
    assetPrefix: FRONT_BASE_URI,
    output: 'export',
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: "http://127.0.0.1:8000/api/v1/:path*",
            },
        ];
    },
};

export default nextConfig;
