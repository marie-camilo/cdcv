const API_URL = 'http://localhost:8000/api/v1/talkie';
const API_KEY = 'ta_clé_api'; // La même que dans ton .env Laravel

export const talkieApi = {
    async joinRoom(code) {
        const res = await fetch(`${API_URL}/rooms/join`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': API_KEY
            },
            body: JSON.stringify({ code })
        });
        return res.json();
    },

    async getRoom(code) {
        const res = await fetch(`${API_URL}/rooms/${code}`, {
            headers: { 'X-API-KEY': API_KEY }
        });
        return res.json();
    },

    async updateTimer(code, time_remaining) {
        const res = await fetch(`${API_URL}/rooms/update-timer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': API_KEY
            },
            body: JSON.stringify({ code, time_remaining })
        });
        return res.json();
    },

    async notifySpeaking(code, is_speaking) {
        const res = await fetch(`${API_URL}/rooms/speaking`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': API_KEY
            },
            body: JSON.stringify({ code, is_speaking })
        });
        return res.json();
    }
};