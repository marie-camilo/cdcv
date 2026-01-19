import { apiFetch } from "@/hooks/API/fetchAPI";

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
        body: JSON.stringify({ name: player }),
    });
}

/**
 * Envoie un enregistrement audio au serveur
 * @param {Blob} audioBlob
 * @returns {Promise<{url: string}>}
 */
export async function uploadAudio(audioBlob) {
    if (!audioBlob) {
        throw new Error("Aucun audioBlob fourni");
    }

    const formData = new FormData();

    // ✅ meilleur : extension cohérente avec le type réel
    const ext = audioBlob.type.includes("ogg") ? "ogg" : "webm";
    formData.append("audio", audioBlob, `voice.${ext}`);

    return apiFetch(`/api/v1/audio`, {
        method: "POST",
        body: formData,
    });
}

export async function getAudioMessages() {
    return apiFetch(`/api/v1/audio/messages`, {
        method: "GET",
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
        method: "GET",
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

/**
 * Valide une étape de jeu et débloque l'application suivante pour tout le groupe
 * @param {string} code - Le code de la partie
 * @returns {Promise<any>}
 */
export async function validateGameStep(code) {
    if (!code) throw new Error("Code de partie manquant");

    // On change /games/ par /game/
    return apiFetch(`/api/v1/game/${code}/validate-step`, {
        method: "POST",
    });
}

export async function getChatMessages(gameId, channel = null) {
    if (!gameId) throw new Error("gameId manquant");

    const url = channel
        ? `/api/v1/chat/${gameId}?channel=${encodeURIComponent(channel)}`
        : `/api/v1/chat/${gameId}`;

    return apiFetch(url, { method: "GET" });
}

export async function sendChatMessage(gameId, content) {
    if (!gameId) throw new Error("gameId manquant");
    if (!content || typeof content !== "string") throw new Error("Message invalide");

    return apiFetch(`/api/v1/chat/${gameId}`, {
        method: "POST",
        body: JSON.stringify({ content }),
    });
}

export async function sendImpostorChatMessage(gameId, content) {
    if (!gameId) throw new Error("gameId manquant");
    if (!content || typeof content !== "string") throw new Error("Message invalide");

    return apiFetch(`/api/v1/chat/impostor/${gameId}`, {
        method: "POST",
        body: JSON.stringify({ content }),
    });
}

export async function getTimeRemaining(gameCode) {
    if (!gameCode) throw new Error("gameCode manquant");

    return apiFetch(`/api/v1/countdown/${gameCode}`, {
        method: "GET",
    });
}

export async function getEndingAt(code) {
    if (!code) throw new Error("code manquant");

    return apiFetch(`/api/v1/game/end/${code}`, {
        method: "GET",
    });
}
