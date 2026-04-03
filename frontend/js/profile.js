/**
 * profile.js — SDGconnect User Profile Page
 * Loads the logged-in user's profile data from the API and renders it.
 * Falls back to static demo data if the backend is not running.
 */

const API_BASE = 'http://localhost:3000/api';

// ─── Mock Profile Data ────────────────────────────────────────────────────────

const MOCK_PROFILE = {
    name: 'Sarah L.',
    badges: ['Écolo Actif', 'Mentor', 'Top Contrib'],
    badgeColors: ['badge-green', 'badge-blue', 'badge-orange'],
    bio: "Passionnée par le développement durable et l'économie circulaire. Je cherche des missions pour aider les assos locales à réduire leur empreinte carbone.",
    stats: { missions: 12, connexions: 45, impact: '150h' },
    skills: ['Management de Projet', 'Économie Circulaire', 'Animation d\'Atelier', 'Réseaux Sociaux'],
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    reachLevel: 8,
    activities: [
        {
            title: 'A participé à "Plantation Collective"',
            comment: '"Superbe expérience de pouvoir planter ces arbres en équipe ! Merci aux organisateurs."',
            date: 'Il y a 3 jours',
            image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=60',
        },
        {
            title: 'S\'est inscrit à "Atelier Recyclage"',
            comment: null,
            date: 'Il y a 1 semaine',
            image: 'https://images.unsplash.com/photo-1528605105345-5344ea20e269?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=60',
        },
    ],
};

// ─── Fetch Profile ────────────────────────────────────────────────────────────

/**
 * Fetch the current user's profile from the API.
 * @returns {Promise<object>}
 */
async function fetchProfile() {
    try {
        const token = window.SDGAuth ? window.SDGAuth.getToken() : null;
        if (!token) return MOCK_PROFILE;

        const res = await fetch(`${API_BASE}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Profile fetch failed');
        return await res.json();
    } catch {
        console.warn('[SDGconnect] Profil non disponible depuis l\'API — mode démo.');
        return MOCK_PROFILE;
    }
}

// ─── Render ───────────────────────────────────────────────────────────────────

/**
 * Inject the profile data into the DOM.
 * @param {object} profile
 */
function renderProfile(profile) {
    // Name
    const nameEl = document.getElementById('profile-name');
    if (nameEl) nameEl.textContent = profile.name || 'Utilisateur';

    // Bio
    const bioEl = document.getElementById('profile-bio');
    if (bioEl) bioEl.textContent = profile.bio || '';

    // Avatar
    const avatarEl = document.getElementById('profile-avatar');
    if (avatarEl && profile.avatar) avatarEl.src = profile.avatar;

    // Reach level
    const reachEl = document.getElementById('reach-level');
    if (reachEl && profile.reachLevel != null) reachEl.textContent = profile.reachLevel;

    // Badges
    const badgesEl = document.getElementById('profile-badges');
    if (badgesEl && profile.badges) {
        badgesEl.innerHTML = profile.badges.map((b, i) =>
            `<span class="badge ${(profile.badgeColors || [])[i] || 'badge-blue'}">${b}</span>`
        ).join('');
    }

    // Stats
    if (profile.stats) {
        const missionsEl = document.getElementById('stat-missions');
        const connexionsEl = document.getElementById('stat-connexions');
        const impactEl = document.getElementById('stat-impact');
        if (missionsEl) missionsEl.textContent = profile.stats.missions ?? '—';
        if (connexionsEl) connexionsEl.textContent = profile.stats.connexions ?? '—';
        if (impactEl) impactEl.textContent = profile.stats.impact ?? '—';
    }

    // Skills
    const skillsEl = document.getElementById('profile-skills');
    if (skillsEl && profile.skills) {
        const colors = ['badge-blue', 'badge-green', 'badge-orange', 'badge-blue'];
        skillsEl.innerHTML = profile.skills.map((s, i) =>
            `<span class="badge ${colors[i % colors.length]}">${s}</span>`
        ).join('');
    }

    // Activity feed
    const feedEl = document.getElementById('activity-feed');
    if (feedEl && profile.activities) {
        feedEl.innerHTML = profile.activities.map((a) => `
            <div class="card mb-4" style="flex-direction:row;">
                <img src="${a.image}" alt="Activité" style="width:150px;object-fit:cover;">
                <div class="card-body">
                    <h3 style="font-size:1.1rem;margin-bottom:0.5rem;">${a.title}</h3>
                    ${a.comment ? `<p class="card-text" style="font-size:0.9rem;">${a.comment}</p>` : ''}
                    <span class="job-date" style="font-size:0.85rem;color:var(--text-muted);">${a.date}</span>
                </div>
            </div>`).join('');
    }
}

// ─── Edit Profile ─────────────────────────────────────────────────────────────

/**
 * Toggle the bio field between display and editable mode.
 */
function setupEditBio() {
    const editBtn = document.getElementById('edit-bio-btn');
    const bioDisplay = document.getElementById('profile-bio');
    if (!editBtn || !bioDisplay) return;

    editBtn.addEventListener('click', () => {
        const isEditing = editBtn.dataset.editing === 'true';

        if (isEditing) {
            // Save
            const textarea = document.getElementById('bio-textarea');
            if (textarea && bioDisplay) {
                bioDisplay.textContent = textarea.value;
                textarea.replaceWith(bioDisplay);
            }
            editBtn.textContent = 'Modifier la bio';
            editBtn.dataset.editing = 'false';
            // TODO: PATCH /api/users/me with new bio
        } else {
            // Switch to edit
            const textarea = document.createElement('textarea');
            textarea.id = 'bio-textarea';
            textarea.className = 'form-control';
            textarea.rows = 3;
            textarea.value = bioDisplay.textContent;
            bioDisplay.replaceWith(textarea);
            editBtn.textContent = 'Sauvegarder';
            editBtn.dataset.editing = 'true';
        }
    });
}

// ─── Init ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', async () => {
    const profile = await fetchProfile();
    renderProfile(profile);
    setupEditBio();
});
