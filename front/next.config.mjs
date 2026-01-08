/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',

    // Optionnel : Si tu déploies sur GitHub Pages (ex: username.github.io/repo/)
    // basePath: '/nom-du-repo',

    // Optionnel : Pour éviter les erreurs si tu utilises l'optimisation d'image native
    // (qui nécessite normalement un serveur Node.js)
    images: {
        unoptimized: true,
    },
};

export default nextConfig;