// hooks/API/rules.js

import { apiFetch } from "@/hooks/API/fetchAPI";

/**
 * Vérifie si une session de jeu est active (cookie présent et valide)
 * @returns {Promise<{ authenticated: boolean, player?: object, reason?: string }>}
 */
export async function checkGameSession() {
    return await apiFetch("/api/v1/session", {
        method: "GET"
    });
}

/**
 * Vérifie l'état de la partie
 */
export async function checkGameState(code) {
    return await apiFetch(`/api/v1/games/${code}/state`, {
        method: "GET"
    });
}
