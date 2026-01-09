const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

/**
 * Vérifie la présence des credentials critiques
 * Appelée au chargement du module (fail fast)
 */
function checkCredentials() {
    if (!API_BASE_URL) {
        throw new Error("API_BASE_URL manquante dans les variables d’environnement");
    }
    if (!API_KEY) {
        throw new Error("API_KEY manquante dans les variables d’environnement");
    }
}

checkCredentials();

/**
 * Wrapper fetch avec gestion d’erreur normalisée
 * @param {string} url
 * @param {RequestInit} options
 */
export async function apiFetch(url, options) {
    const response = await fetch(url, {
        ...options,
        headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
            ...(options.headers || {})
        }
    });

    let data;
    try {
        data = await response.json();
    } catch {
        data = null;
    }

    if (!response.ok) {
        const error = new Error(data?.message || "Erreur API");
        error.status = response.status;
        error.data = data;
        throw error;
    }

    return data;
}