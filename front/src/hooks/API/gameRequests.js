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

    return apiFetch(`/api/v1/games/${code}/players`, {
        method: "POST",
        body: JSON.stringify({ name: player })
    });
}
/**
 * Envoie un enregistrement audio au serveur
 * @param {Blob} audioBlob
 * @returns {Promise<{url: string}>}
 */
export async function uploadAudio(audioBlob) {
    const formData = new FormData();
    formData.append("audio", audioBlob, "voice.webm");

    // On utilise apiFetch mais on doit SURCHARGER le Content-Type à undefined
    // pour que le navigateur le génère correctement avec le "boundary" du FormData
    return apiFetch(`/api/v1/audio-upload`, {
        method: "POST",
        body: formData,
        headers: {
            "Content-Type": null, // On force à null pour annuler le défaut JSON de apiFetch
        }
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

    return apiFetch(`/api/v1/games/${code}`, {
        method: "GET"
    });
}

/**
 * Récupère le rôle et le statut imposteur du joueur connecté
 * @returns {Promise<{ role: string, impostor: boolean }>}
 */
export async function getPlayerRole() {
    return apiFetch(`/api/v1/me/role`, {
        method: "GET",
    });
}

