"use client";

const API_BASE_URL = "http://localhost:8000/api/v1";
const API_KEY = "testapikey12345";
/**
 * Vérifie un code reçu via QR code
 * @param {string} code
 * @param {string} player
 * @returns {Promise<{valid: boolean, data?: any}>}
 */
export async function addPlayer(code, player) {
    if (!code) {
        throw new Error("Code manquant");
    }

    const response = await fetch(`${API_BASE_URL}/games/${code}/players`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: player })
    });

    const data = await response.json();

    if (!response.ok) {
        // On propage l’erreur métier du backend
        throw {
            status: response.status,
            ...data
        };
    }

    return data;
}

/**
 * Récupère les joueurs enregistrés pour une partie
 * @param {string} code
 * @returns {Promise<Array>}
 */
export async function getPlayersForGivenGame(code) {
    if (!code) {
        throw new Error("Code manquant");
    }

    const response = await fetch(`${API_BASE_URL}/games/${code}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${API_KEY}`,
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw {
            status: response.status,
            ...data
        };
    }

    return data;
}

