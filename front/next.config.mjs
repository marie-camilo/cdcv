/** @type {import('next').NextConfig} */

const nextConfig = {
    basePath: '',
    assetPrefix: '',
    trailingSlash: true,
    output: 'export',
    async rewrites() {
        return [
            {
                source: "/api/v1/:path*",
                destination: "https://cs5d.23.gremmi.fr/api/v1/:path*",
            },
        ];
    },
};

export default nextConfig;
