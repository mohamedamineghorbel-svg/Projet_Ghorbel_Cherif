/**
 * jobs.js — SDGconnect Jobs & Opportunities Page Module
 * Handles filtering, searching, API fetch, and application flow for job listings.
 */

const JOBS_API = 'http://localhost:3000/api/jobs';

// ─── State ────────────────────────────────────────────────────────────────────

let allJobs = []; // master list

// ─── Mock Data (fallback when backend is not running) ─────────────────────────

const MOCK_JOBS = [
    {
        _id: 'job1',
        title: 'Chef de Projet Énergies Renouvelables',
        description: 'Nous recherchons un chef de projet passionné pour développer des installations solaires en milieu urbain.',
        type: 'emploi',
        badge: 'Emploi CDI',
        badgeColor: 'badge-orange',
        sdg: 'ODD 7 - Énergie',
        sdgColor: 'badge-blue',
        company: 'GreenTech Solutions',
        location: 'Paris, France',
        publishedAt: '2026-03-31',
    },
    {
        _id: 'job2',
        title: 'Animateur Ateliers Zéro Déchet',
        description: 'Rejoignez notre association pour animer des ateliers de sensibilisation auprès des jeunes de votre quartier.',
        type: 'benevolat',
        badge: 'Bénévolat',
        badgeColor: 'badge-green',
        sdg: 'ODD 12 - Consommation',
        sdgColor: 'badge-blue',
        company: 'ÉcoCitoyens Asso',
        location: 'Lyon, France',
        publishedAt: '2026-03-29',
    },
    {
        _id: 'job3',
        title: 'Analyste Données Impact Social',
        description: 'Accompagnez-nous dans la mesure de l\'impact social de nos programmes d\'insertion professionnelle.',
        type: 'stage',
        badge: 'Stage (6 mois)',
        badgeColor: 'badge-blue',
        sdg: 'ODD 10 - Inégalités',
        sdgColor: 'badge-orange',
        company: 'Impact Data',
        location: 'Télétravail',
        publishedAt: '2026-03-26',
    },
    {
        _id: 'job4',
        title: 'Distributeur Banque Alimentaire',
        description: 'Nous avons besoin de bras pour la distribution alimentaire de ce samedi matin.',
        type: 'benevolat',
        badge: 'Bénévolat',
        badgeColor: 'badge-green',
        sdg: 'ODD 2 - Faim Zéro',
        sdgColor: 'badge-blue',
        company: 'Solidarité Alimentaire',
        location: 'Marseille, France',
        publishedAt: '2026-04-02',
    },
];

// ─── Utilities ────────────────────────────────────────────────────────────────

/**
 * Compute a relative date string (e.g. "Publié il y a 3j").
 * @param {string} dateStr — ISO date string
 * @returns {string}
 */
function relativeDate(dateStr) {
    if (!dateStr) return '';
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 86400000);
    if (diff === 0) return "Aujourd'hui";
    if (diff === 1) return 'Hier';
    if (diff < 7) return `Il y a ${diff}j`;
    if (diff < 14) return 'Il y a 1 sem.';
    return `Il y a ${Math.floor(diff / 7)} sem.`;
}

/**
 * Action label based on job type.
 * @param {string} type
 * @returns {string}
 */
function actionLabel(type) {
    if (type === 'benevolat') return "S'engager";
    return 'Postuler';
}

// ─── Fetch ────────────────────────────────────────────────────────────────────

/**
 * Fetch jobs from the API. Falls back to mock data if unavailable.
 * @returns {Promise<Array>}
 */
async function fetchJobs() {
    try {
        const token = window.SDGAuth ? window.SDGAuth.getToken() : null;
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch(JOBS_API, { headers });
        if (!res.ok) throw new Error('API error');
        return await res.json();
    } catch {
        console.warn('[SDGconnect] Backend unavailable — using mock jobs.');
        return MOCK_JOBS;
    }
}

// ─── Render ───────────────────────────────────────────────────────────────────

/**
 * Build the HTML card for a single job listing.
 * @param {object} job
 * @returns {string}
 */
function buildJobCard(job) {
    return `
    <div class="col-md-6 card job-card" data-type="${job.type || ''}" data-id="${job._id}">
      <div class="card-body">
        <div class="job-meta">
          <span class="badge ${job.badgeColor || 'badge-blue'}">${job.badge || job.type || 'Offre'}</span>
          <span class="job-date">${relativeDate(job.publishedAt || job.createdAt)}</span>
        </div>
        <h3 class="card-title">${job.title}</h3>
        <div class="card-tags">
          <span class="badge ${job.sdgColor || 'badge-blue'}">${job.sdg || ''}</span>
        </div>
        <p class="card-text">${job.description}</p>
        <div class="job-company">
          <strong>${job.company || ''}</strong>${job.location ? ' • ' + job.location : ''}
        </div>
        <button class="btn btn-secondary mt-3 apply-btn" data-id="${job._id}">
          ${actionLabel(job.type)}
        </button>
      </div>
    </div>`;
}

/**
 * Render job cards into the container and update the count badge.
 * @param {Array} jobs
 */
function renderJobs(jobs) {
    const container = document.getElementById('jobs-container');
    if (!container) return;

    if (jobs.length === 0) {
        container.innerHTML = `<p class="text-muted" style="text-align:center;padding:3rem 0;width:100%;">
            Aucune offre trouvée pour ce filtre.</p>`;
    } else {
        container.innerHTML = jobs.map(buildJobCard).join('');
    }

    // Attach apply button handlers
    container.querySelectorAll('.apply-btn').forEach((btn) => {
        btn.addEventListener('click', () => handleApply(btn.dataset.id));
    });

    // Update count
    const countEl = document.getElementById('job-count');
    if (countEl) countEl.textContent = jobs.length;
}

// ─── Filter & Search ──────────────────────────────────────────────────────────

/**
 * Filter jobs by type.
 * @param {string} type — 'all' | 'emploi' | 'benevolat' | 'stage'
 */
function filterJobs(type) {
    const filtered = type === 'all'
        ? allJobs
        : allJobs.filter((j) => j.type === type);
    renderJobs(filtered);
}

/**
 * Search jobs by keyword.
 * @param {string} query
 * @param {string} selectedType — currently selected filter (to combine)
 */
function searchJobs(query, selectedType = 'all') {
    const q = query.toLowerCase().trim();
    let results = selectedType === 'all' ? allJobs : allJobs.filter((j) => j.type === selectedType);

    if (q) {
        results = results.filter(
            (j) =>
                j.title.toLowerCase().includes(q) ||
                (j.description || '').toLowerCase().includes(q) ||
                (j.company || '').toLowerCase().includes(q) ||
                (j.sdg || '').toLowerCase().includes(q)
        );
    }

    renderJobs(results);

    // Reset filter dropdown when searching
    const filterSelect = document.getElementById('filter-type');
    if (filterSelect && q) filterSelect.value = 'all';
}

// ─── Apply Logic ──────────────────────────────────────────────────────────────

/**
 * Handle the "Postuler / S'engager" button click.
 * @param {string} jobId
 */
async function handleApply(jobId) {
    if (window.SDGAuth && !window.SDGAuth.isAuthenticated()) {
        if (confirm('Vous devez être connecté pour postuler. Aller à la page de connexion ?')) {
            window.location.href = 'login.html';
        }
        return;
    }

    const btn = document.querySelector(`.apply-btn[data-id="${jobId}"]`);
    if (btn) {
        btn.textContent = '✔ Candidature envoyée';
        btn.disabled = true;
        btn.style.backgroundColor = 'var(--secondary-green)';
        btn.style.color = '#fff';
    }

    try {
        const token = window.SDGAuth ? window.SDGAuth.getToken() : null;
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers.Authorization = `Bearer ${token}`;

        await fetch(`${JOBS_API}/${jobId}/apply`, {
            method: 'POST',
            headers,
        });
    } catch {
        console.info('[SDGconnect] Application noted (mock mode).');
    }
}

// ─── Initialisation ───────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', async () => {
    // Fetch and render
    allJobs = await fetchJobs();
    renderJobs(allJobs);

    // Filter dropdown
    const filterSelect = document.getElementById('filter-type');
    if (filterSelect) {
        filterSelect.addEventListener('change', () => filterJobs(filterSelect.value));
    }

    // Search button
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('job-search');

    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', () => {
            searchJobs(searchInput.value, filterSelect?.value || 'all');
        });
    }

    // Search on Enter key
    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                searchJobs(searchInput.value, filterSelect?.value || 'all');
            }
        });
    }
});
