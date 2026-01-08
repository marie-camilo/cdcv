// services/gameService.js (ou équivalent côté serveur)

import {apiFetch} from "@/hooks/API/fetchAPI";

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

    return apiFetch(`/api/games/${code}/players`, {
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

    return apiFetch(`/api/games/${code}`, {
        method: "GET"
    });
}

/**
 * Récupère le rôle du joueur connecté dans la partie
 * @returns {Promise<{ role: string }>}
 */
export async function getPlayerRole() {
    return apiFetch("/api/me/role", {
        method: "GET"
    });
}