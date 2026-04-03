/**
 * events.js — SDGconnect Events Page Module
 * Handles fetching, rendering, filtering, RSVP, and modal management for events.
 */

const EVENTS_API = 'http://localhost:3000/api/events';

// ─── State ────────────────────────────────────────────────────────────────────

let allEvents = []; // master list from API (or mock data)

// ─── Mock Data (fallback when backend is not running) ─────────────────────────

const MOCK_EVENTS = [
    {
        _id: 'evt1',
        title: 'Coastal Cleanup Drive 2026',
        description: 'Join us in making our beaches plastic-free. Connect with local environmentalists and make a real difference.',
        category: 'Climat',
        badgeColor: 'badge-green',
        date: '2026-10-12T09:00:00',
        location: 'Nice, France',
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&q=80',
        status: 'approved',
    },
    {
        _id: 'evt2',
        title: 'Tech for Good Workshop',
        description: 'Learn how to use open-source tech to solve educational inequality in underprivileged areas.',
        category: 'Éducation',
        badgeColor: 'badge-blue',
        date: '2026-11-05T14:00:00',
        location: 'Paris, France',
        image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=500&q=80',
        status: 'approved',
    },
    {
        _id: 'evt3',
        title: 'Green Energy Hackathon',
        description: 'A 48-hour challenge to build innovative software solutions promoting renewable energy use worldwide.',
        category: 'Énergie',
        badgeColor: 'badge-orange',
        date: '2026-12-01T17:00:00',
        location: 'Lyon, France',
        image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=500&q=80',
        status: 'approved',
    },
    {
        _id: 'evt4',
        title: 'Plantation Collective',
        description: 'Rejoignez-nous ce week-end pour planter des arbres en périphérie de la ville.',
        category: 'Biodiversité',
        badgeColor: 'badge-green',
        date: '2026-09-20T08:00:00',
        location: 'Bordeaux, France',
        image: 'https://images.unsplash.com/photo-1573246123961-125a114d5f1d?w=500&q=80',
        status: 'approved',
    },
];

// ─── Utilities ────────────────────────────────────────────────────────────────

/**
 * Format an ISO date string for display.
 * @param {string} isoDate
 * @returns {string} e.g. "12 oct. • 09:00"
 */
function formatEventDate(isoDate) {
    const d = new Date(isoDate);
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
        + ' • '
        + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

// ─── Fetch Events ─────────────────────────────────────────────────────────────

/**
 * Fetch events from the API. Falls back to mock data if the API is unavailable.
 * @returns {Promise<Array>}
 */
async function fetchEvents() {
    try {
        const token = window.SDGAuth ? window.SDGAuth.getToken() : null;
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await fetch(EVENTS_API, { headers });
        if (!response.ok) throw new Error('API error');
        return await response.json();
    } catch {
        console.warn('[SDGconnect] Backend unavailable — using mock events.');
        return MOCK_EVENTS;
    }
}

// ─── Render ───────────────────────────────────────────────────────────────────

/**
 * Build the HTML card for a single event.
 * @param {object} event
 * @returns {string} HTML string
 */
function buildEventCard(event) {
    const dateStr = formatEventDate(event.date || event.createdAt || new Date().toISOString());
    return `
    <div class="col-4 event-card" data-id="${event._id}" data-category="${event.category || ''}">
      <div class="card">
        <img src="${event.image || 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=500&q=80'}"
             alt="${event.title}"
             class="card-img-top"
             onerror="this.src='https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=500&q=80'">
        <div class="card-body">
          <span class="badge ${event.badgeColor || 'badge-blue'} mb-4">${event.category || 'Événement'}</span>
          <h3 class="card-title mt-4">${event.title}</h3>
          <p class="card-text">${event.description}</p>
          <div class="card-footer">
            <span class="text-muted" style="font-size:0.85rem;">
              <span class="event-location">${event.location || ''}</span>
              ${event.location ? ' &mdash; ' : ''}${dateStr}
            </span>
            <button class="btn btn-secondary rsvp-btn" data-id="${event._id}">RSVP</button>
          </div>
        </div>
      </div>
    </div>`;
}

/**
 * Render an array of events into the grid container.
 * @param {Array} events
 */
function renderEvents(events) {
    const grid = document.querySelector('.events-grid');
    if (!grid) return;

    if (events.length === 0) {
        grid.innerHTML = `<p class="text-muted" style="grid-column:1/-1;text-align:center;padding:3rem 0;">
            Aucun événement trouvé pour ce filtre.</p>`;
        return;
    }

    grid.innerHTML = events.map(buildEventCard).join('');

    // Attach RSVP handlers
    grid.querySelectorAll('.rsvp-btn').forEach((btn) => {
        btn.addEventListener('click', () => handleRSVP(btn.dataset.id));
    });

    // Update count badge
    const countEl = document.getElementById('event-count');
    if (countEl) countEl.textContent = events.length;
}

// ─── Filter ───────────────────────────────────────────────────────────────────

/**
 * Filter the displayed events by a category string.
 * @param {string} category - the selected category, or 'all'
 */
function filterEvents(category) {
    const filtered = category === 'all'
        ? allEvents
        : allEvents.filter((e) => (e.category || '').toLowerCase() === category.toLowerCase());
    renderEvents(filtered);
}

// ─── Search ───────────────────────────────────────────────────────────────────

/**
 * Filter events by keyword match on title or description.
 * @param {string} query
 */
function searchEvents(query) {
    const q = query.toLowerCase().trim();
    if (!q) {
        renderEvents(allEvents);
        return;
    }
    const results = allEvents.filter(
        (e) =>
            e.title.toLowerCase().includes(q) ||
            (e.description || '').toLowerCase().includes(q) ||
            (e.category || '').toLowerCase().includes(q)
    );
    renderEvents(results);
}

// ─── RSVP ─────────────────────────────────────────────────────────────────────

/**
 * Handle RSVP button click for a given event ID.
 * Sends POST /api/events/:id/rsvp if authenticated, otherwise prompts login.
 * @param {string} eventId
 */
async function handleRSVP(eventId) {
    if (window.SDGAuth && !window.SDGAuth.isAuthenticated()) {
        if (confirm('Vous devez être connecté pour vous inscrire. Aller à la page de connexion ?')) {
            window.location.href = 'login.html';
        }
        return;
    }

    const btn = document.querySelector(`.rsvp-btn[data-id="${eventId}"]`);
    if (btn) {
        btn.textContent = '✔ Inscrit !';
        btn.disabled = true;
        btn.style.backgroundColor = 'var(--secondary-green)';
    }

    try {
        const token = window.SDGAuth ? window.SDGAuth.getToken() : null;
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers.Authorization = `Bearer ${token}`;

        const res = await fetch(`${EVENTS_API}/${eventId}/rsvp`, {
            method: 'POST',
            headers,
        });

        if (!res.ok) throw new Error('RSVP failed');
    } catch {
        // Silently succeed in demo mode — the visual feedback is enough
        console.info('[SDGconnect] RSVP noted (mock mode).');
    }
}

// ─── Create Event Modal ───────────────────────────────────────────────────────

/**
 * Open the create-event modal (if it exists on the page).
 */
function openCreateEventModal() {
    const modal = document.getElementById('create-event-modal');
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('modal-open');
    }
}

/**
 * Close the create-event modal.
 */
function closeCreateEventModal() {
    const modal = document.getElementById('create-event-modal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('modal-open');
    }
}

/**
 * Handle submission of the create-event form.
 */
async function handleCreateEvent(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');

    const payload = {
        title: form.querySelector('#new-event-title')?.value || '',
        description: form.querySelector('#new-event-desc')?.value || '',
        category: form.querySelector('#new-event-category')?.value || '',
        date: form.querySelector('#new-event-date')?.value || '',
        location: form.querySelector('#new-event-location')?.value || '',
    };

    submitBtn.textContent = 'Création...';
    submitBtn.disabled = true;

    try {
        const token = window.SDGAuth ? window.SDGAuth.getToken() : null;
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers.Authorization = `Bearer ${token}`;

        const res = await fetch(EVENTS_API, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload),
        });

        const created = await res.json();

        // Prepend new event optimistically
        allEvents.unshift({ ...payload, _id: created._id || `local-${Date.now()}`, badgeColor: 'badge-green' });
        renderEvents(allEvents);
        closeCreateEventModal();
        form.reset();
    } catch {
        // Demo fallback
        const mockEvent = { ...payload, _id: `local-${Date.now()}`, badgeColor: 'badge-green' };
        allEvents.unshift(mockEvent);
        renderEvents(allEvents);
        closeCreateEventModal();
        form.reset();
    } finally {
        submitBtn.textContent = 'Créer l\'événement';
        submitBtn.disabled = false;
    }
}

// ─── Initialisation ───────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', async () => {
    // Load and render events
    allEvents = await fetchEvents();
    renderEvents(allEvents);

    // Category filter dropdown
    const filterSelect = document.getElementById('filter-category');
    if (filterSelect) {
        filterSelect.addEventListener('change', () => filterEvents(filterSelect.value));
    }

    // Search input
    const searchInput = document.getElementById('event-search');
    const searchBtn = document.getElementById('event-search-btn');

    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') searchEvents(searchInput.value);
        });
    }
    if (searchBtn) {
        searchBtn.addEventListener('click', () => searchEvents(searchInput?.value || ''));
    }

    // "+ Create Event" button
    const createBtn = document.getElementById('create-event-btn');
    if (createBtn) {
        createBtn.addEventListener('click', () => {
            if (window.SDGAuth && !window.SDGAuth.isAuthenticated()) {
                if (confirm('Vous devez être connecté. Aller à la page de connexion ?')) {
                    window.location.href = 'login.html';
                }
                return;
            }
            openCreateEventModal();
        });
    }

    // Modal close button
    const modalCloseBtn = document.getElementById('close-event-modal');
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeCreateEventModal);

    // Create event form
    const createForm = document.getElementById('create-event-form');
    if (createForm) createForm.addEventListener('submit', handleCreateEvent);

    // Close modal on backdrop click
    const modal = document.getElementById('create-event-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeCreateEventModal();
        });
    }
});
