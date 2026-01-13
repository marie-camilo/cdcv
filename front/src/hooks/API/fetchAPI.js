const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

function checkCredentials() {
    if (!API_BASE_URL) throw new Error("API_BASE_URL manquante");
    if (!API_KEY) throw new Error("API_KEY manquante");
}

checkCredentials();

export async function apiFetch(url, options = {}) {
    const isFormData = options.body instanceof FormData;

    const headers = {
        Authorization: `Bearer ${API_KEY}`,
        ...(options.headers || {}),
    };

    if (!isFormData) {
        headers["Content-Type"] = "application/json";
    } else {
        delete headers["Content-Type"];
    }

    const response = await fetch(url, {
        ...options,
        headers,
        credentials: "include",
    });

    let data;
    try {
        data = await response.json();
    } catch {
        data = null;
    }

    if (!response.ok) {
        const error = new Error(data?.message || "Erreur API");
        error.status = response.status;
        error.data = data;
        throw error;
    }

    return data;
}
