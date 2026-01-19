// lib/gameEventBus.js

class GameEventBus {
    constructor() {
        this.listeners = new Map();
        this.debug = true; // Activé pour debug
    }

    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event).add(callback);

        if (this.debug) {
            console.log(`📝 [EventBus] Listener ajouté pour: ${event} (total: ${this.listeners.get(event).size})`);
        }

        // Retourne une fonction de cleanup pour useEffect
        return () => this.off(event, callback);
    }

    off(event, callback) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).delete(callback);
            if (this.debug) {
                console.log(`🗑️ [EventBus] Listener retiré pour: ${event}`);
            }
        }
    }

    emit(event, data) {
        if (this.debug) {
            console.log(`📢 [EventBus] Émission: ${event}`, data);
            console.log(`   Nombre de listeners: ${this.listeners.get(event)?.size || 0}`);
        }

        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(cb => {
                try {
                    cb(data);
                } catch (error) {
                    console.error(`❌ [EventBus] Erreur dans le callback de ${event}:`, error);
                }
            });
        } else {
            console.warn(`⚠️ [EventBus] Aucun listener pour: ${event}`);
        }
    }

    // Méthode utilitaire pour voir tous les listeners actifs
    getActiveListeners() {
        const result = {};
        this.listeners.forEach((listeners, event) => {
            result[event] = listeners.size;
        });
        return result;
    }
}

// Singleton global (une seule instance pour toute l'app)
export const gameEvents = new GameEventBus();

// Constantes des événements disponibles
export const GAME_EVENTS = {
    APP_UNLOCKED: 'app_unlocked',
    DIGIT_UPDATED: 'digit_updated',
    LOCKER_UPDATED: 'locker_updated',
    SNAKE_UPDATED: 'snake_updated',
    VIDEO_TRIGGERED: 'video_triggered',
    LABYRINTH_COMPLETED: 'labyrinth_completed',
    GAME_STARTING: 'game_starting',
};