/**
 * api.js — SDGconnect Shared API Utility Module
 * Provides a centralized fetch wrapper with auth headers,
 * error handling, and base URL configuration.
 */

const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Core fetch wrapper for the SDGconnect API.
 *
 * @param {string} endpoint  - The API path, e.g. '/events' or '/jobs/abc123'
 * @param {object} [options] - Standard fetch options (method, body, etc.)
 * @returns {Promise<any>}   - Parsed JSON response
 * @throws {Error}           - With a user-friendly message on failure
 */
async function apiFetch(endpoint, options = {}) {
    const token = window.SDGAuth ? window.SDGAuth.getToken() : null;

    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
    };

    const config = {
        ...options,
        headers,
    };

    const url = `${API_BASE_URL}${endpoint}`;

    let response;
    try {
        response = await fetch(url, config);
    } catch (networkErr) {
        throw new Error('Impossible de joindre le serveur. Vérifiez votre connexion.');
    }

    // Handle 401 Unauthorized — token expired or invalid
    if (response.status === 401) {
        if (window.SDGAuth) window.SDGAuth.logout();
        throw new Error('Session expirée. Veuillez vous reconnecter.');
    }

    // Try to parse the body as JSON
    let data;
    try {
        data = await response.json();
    } catch {
        data = {};
    }

    if (!response.ok) {
        throw new Error(data.message || `Erreur serveur (${response.status})`);
    }

    return data;
}

// ─── Shorthand helpers ────────────────────────────────────────────────────────

const API = {
    /** GET /api{endpoint} */
    get: (endpoint) => apiFetch(endpoint, { method: 'GET' }),

    /** POST /api{endpoint} with JSON body */
    post: (endpoint, body) => apiFetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(body),
    }),

    /** PUT /api{endpoint} with JSON body */
    put: (endpoint, body) => apiFetch(endpoint, {
        method: 'PUT',
        body: JSON.stringify(body),
    }),

    /** PATCH /api{endpoint} with JSON body */
    patch: (endpoint, body) => apiFetch(endpoint, {
        method: 'PATCH',
        body: JSON.stringify(body),
    }),

    /** DELETE /api{endpoint} */
    delete: (endpoint) => apiFetch(endpoint, { method: 'DELETE' }),
};

// Expose globally so all other scripts can use window.API
window.API = API;
