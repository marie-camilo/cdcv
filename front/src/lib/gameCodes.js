// lib/gameCodes.js

/**
 * 🎯 CODES DU JEU
 * Format: 'CODE_SAISI': {
 *   appId: 'app',
 *   fileName: 'nom_fichier_terminal',
 *   videoId: 'id_video' (optionnel)
 * }
 */
export const GAME_CODES = {
    // Énigme 1 - Foyer → Débloque SCAN
    'FOYER': {
        appId: 'scan',
        fileName: 'mission_foyer_log'
    },

    // Scan QR → Débloque PUZZLE + Vidéo
    'GAMMA9012': {
        appId: 'puzzle',
        fileName: 'security_bypass_key',
    },

    // Mini-jeux terminés → Débloque PHONE (talkies)
    // (Ce code est trouvé en faisant les mini-jeux)
    'P7AJ0': {
        appId: 'phone',
        fileName: 'comm_relay_data',
        videoId: 'foyer'
    },

    // Codes du labyrinthe (juste pour la sidebar, pas pour débloquer)
    'REACTOR_CORE': {
        appId: null, // Ne débloque rien, juste un indice
        fileName: 'reactor_core_path'
    },
    'SHADOW_OPS': {
        appId: null,
        fileName: 'shadow_ops_path'
    },
    // Boussole QR → Débloque TERMINAL
    'BADFIN1964': {
        appId: 'terminal',
        fileName: 'terminal_access_granted'
    },
    // Boussole QR → Débloque TERMINAL
    'GOODFIN1964': {
        appId: 'terminal',
        fileName: 'terminal_access_denied'
    },

};

/**
 * Retourne les infos complètes d'un code
 */
export function getCodeInfo(code) {
    const upperCode = code.toUpperCase().trim();
    return GAME_CODES[upperCode] || null;
}

/**
 * Retourne uniquement l'appId
 */
export function getAppIdFromCode(code) {
    const info = getCodeInfo(code);
    return info ? info.appId : null;
}

/**
 * Retourne uniquement le nom de fichier
 */
export function getFileNameFromCode(code) {
    const info = getCodeInfo(code);
    return info ? info.fileName : null;
}

/**
 * Retourne uniquement le videoId (si existe)
 */
export function getVideoIdFromCode(code) {
    const info = getCodeInfo(code);
    return info ? info.videoId : null;
}

/**
 * Vérifie si un code existe
 */
export function isValidCode(code) {
    return getCodeInfo(code) !== null;
}