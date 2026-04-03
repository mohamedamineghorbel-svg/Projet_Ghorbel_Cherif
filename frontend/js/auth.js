/**
 * auth.js — SDGconnect Authentication Module
 * Handles login, logout, token storage, and auth-guard logic.
 */

const API_BASE = 'http://localhost:3000/api';

// ─── Token Helpers ────────────────────────────────────────────────────────────

/**
 * Store the JWT token in localStorage.
 * @param {string} token
 */
function setToken(token) {
    localStorage.setItem('sdg_token', token);
}

/**
 * Retrieve the stored JWT token.
 * @returns {string|null}
 */
function getToken() {
    return localStorage.getItem('sdg_token');
}

/**
 * Remove the JWT token (logout).
 */
function removeToken() {
    localStorage.removeItem('sdg_token');
    localStorage.removeItem('sdg_user');
}

/**
 * Returns true if a token is currently stored.
 * @returns {boolean}
 */
function isAuthenticated() {
    return !!getToken();
}

/**
 * Store the logged-in user info as JSON.
 * @param {object} user
 */
function setUser(user) {
    localStorage.setItem('sdg_user', JSON.stringify(user));
}

/**
 * Retrieve the stored user object.
 * @returns {object|null}
 */
function getUser() {
    try {
        return JSON.parse(localStorage.getItem('sdg_user'));
    } catch {
        return null;
    }
}

// ─── API Calls ────────────────────────────────────────────────────────────────

/**
 * Log in with email and password.
 * Calls POST /api/auth/login. Stores the token on success.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>} Resolves with the user object.
 */
async function login(email, password) {
    const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Identifiants invalides.');
    }

    setToken(data.token);
    setUser(data.user);
    return data.user;
}

/**
 * Register a new user account.
 * Calls POST /api/auth/register.
 * @param {object} userData - { name, email, password }
 * @returns {Promise<object>} Resolves with the new user object.
 */
async function register(userData) {
    const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'inscription.");
    }

    setToken(data.token);
    setUser(data.user);
    return data.user;
}

/**
 * Log out the current user and redirect to the login page.
 */
function logout() {
    removeToken();
    window.location.href = 'login.html';
}

// ─── Auth Guard ───────────────────────────────────────────────────────────────

/**
 * Redirect unauthenticated users to the login page.
 * Call this at the top of any protected page script.
 */
function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
    }
}

/**
 * Update the navbar to reflect the logged-in state:
 * - Show the user's name or initials
 * - Replace "Se Connecter" with a "Déconnexion" link
 */
function updateNavbarForAuth() {
    const user = getUser();
    if (!user) return;

    // Swap "Se Connecter" button to show logout link
    const loginBtn = document.querySelector('.btn-nav-cta');
    if (loginBtn) {
        loginBtn.textContent = 'Déconnexion';
        loginBtn.href = '#';
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }

    // Update profile avatar/initials if the element exists
    const profilePic = document.querySelector('.profile-pic');
    if (profilePic && user.name) {
        profilePic.textContent = user.name.charAt(0).toUpperCase();
    }
}

// ─── Login Page Logic ─────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    // If user is already logged in and visits login page, redirect to events
    const isLoginPage = !!document.getElementById('login-form');
    if (isLoginPage && isAuthenticated()) {
        window.location.href = 'events.html';
        return;
    }

    // Handle login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        const errorEl = document.getElementById('login-error');

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const submitBtn = loginForm.querySelector('button[type="submit"]');

            // Loading state
            submitBtn.textContent = 'Connexion en cours...';
            submitBtn.disabled = true;
            if (errorEl) errorEl.textContent = '';

            try {
                await login(email, password);
                window.location.href = 'events.html';
            } catch (err) {
                if (errorEl) errorEl.textContent = err.message;
            } finally {
                submitBtn.textContent = 'Se Connecter';
                submitBtn.disabled = false;
            }
        });
    }

    // Refresh navbar auth state on all pages
    updateNavbarForAuth();

    // Wire up logout links (e.g., the "Logout" button on events/admin pages)
    document.querySelectorAll('[data-action="logout"]').forEach((el) => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    });
});

// Export helpers for use in other modules (works without bundler via global scope)
window.SDGAuth = {
    login,
    logout,
    register,
    isAuthenticated,
    getToken,
    getUser,
    requireAuth,
};
