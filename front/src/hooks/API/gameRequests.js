// services/gameService.js (ou équivalent côté serveur)

import {apiFetch} from "@/hooks/API/fetchAPI";


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

/**
 * Ajoute un joueur à une partie via un code QR
 * @param {string} code
 * @param {string} player
 * @returns {Promise<any>}
 */
export async function addPlayer(code, player) {
    if (!code) {
        throw new Error("Code manquant");
    }

    if (!player || typeof player !== "string") {
        throw new Error("Nom de joueur invalide");
    }

    return apiFetch(`${API_BASE_URL}/api/v1/games/${code}/players`, {
        method: "POST",
        body: JSON.stringify({ name: player })
    });
}

/**
 * Récupère les joueurs d’une partie
 * @param {string} code
 * @returns {Promise<any>}
 */
export async function getPlayersForGivenGame(code) {
    if (!code) {
        throw new Error("Code manquant");
    }

    return apiFetch(`${API_BASE_URL}/api/v1/games/${code}`, {
        method: "GET"
    });
}

/**
 * Récupère le rôle du joueur connecté dans la partie
 * @returns {Promise<{ role: string }>}
 */
export async function getPlayerRole() {
    return apiFetch(`${API_BASE_URL}/api/v1/me/role`, {
        method: "GET"
    });
}