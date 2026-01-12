// hooks/API/rules.js

import { apiFetch } from "@/hooks/API/fetchAPI";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

/**
 * Vérifie si une session de jeu est active (cookie présent et valide)
 * @returns {Promise<{ authenticated: boolean, player?: object, reason?: string }>}
 */
export async function checkPlayerCookie() {
    return await apiFetch(`${API_BASE_URL}/api/v1/session`, {
        method: "GET"
    });
}

/**
 * Vérifie l'état de la partie ainsi que l'existence du cookie joueur
 */
export async function checkGameState(code) {
    return await apiFetch(`${API_BASE_URL}/api/v1/games/${code}/state`, {
        method: "GET"
    });
}



/**
 * Ajoute le code de la partie dans un cookie
 */
export async function joinGame(code) {
    return await apiFetch(`/api/v1/games/${code}/log`, {
        method: "POST"
    });
}

/**
 * Récupère le cookie de la partie
 */
export async function getCodeFromCookie() {
    return await apiFetch("/api/v1/games/log/session", {
        method: "GET"
    });
}
