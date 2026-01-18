import { apiFetch } from "@/hooks/API/fetchAPI";

export async function clearAllStorage() {
    try { localStorage.clear(); } catch {}
    try { sessionStorage.clear(); } catch {}

    try {
        await apiFetch(`/api/v1/game/clear-cookie`, { method: "POST" });
    } catch {}
}
