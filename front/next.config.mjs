/** @type {import('next').NextConfig} */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

const nextConfig = {
    basePath: '',
    assetPrefix: '',
    trailingSlash: true,
    output: 'export',
    images: {
        unoptimized: true,
    },
    async rewrites() {
        return [
            {
                source: "/api/v1/:path*",
                destination: `${API_BASE_URL}/api/v1/:path*`,
            },
        ];
    },
};

export default nextConfig;