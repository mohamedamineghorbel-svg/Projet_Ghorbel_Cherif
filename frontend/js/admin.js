/**
 * admin.js — SDGconnect Admin Dashboard
 * Handles event management table: approve, delete,
 * and (placeholder) create / edit actions.
 */

const EVENTS_API_ADMIN = 'http://localhost:3000/api/events';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_ADMIN_EVENTS = [
    { _id: 'evt1', title: 'Coastal Cleanup Drive 2026', organizer: 'EcoWarriors',     date: '12 Oct 2026', status: 'approved' },
    { _id: 'evt2', title: 'Tech for Good Workshop',     organizer: 'TechEd Org',       date: '05 Nov 2026', status: 'pending'  },
    { _id: 'evt3', title: 'Green Energy Hackathon',     organizer: 'Future Innovators', date: '01 Déc 2026', status: 'approved' },
];

let adminEvents = [];

// ─── Fetch ────────────────────────────────────────────────────────────────────

async function fetchAdminEvents() {
    try {
        const token = window.SDGAuth ? window.SDGAuth.getToken() : null;
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch(EVENTS_API_ADMIN, { headers });
        if (!res.ok) throw new Error();
        return await res.json();
    } catch {
        console.warn('[SDGconnect Admin] Backend unavailable — using mock data.');
        return MOCK_ADMIN_EVENTS;
    }
}

// ─── Render Table ─────────────────────────────────────────────────────────────

function statusBadge(status) {
    if (status === 'approved') return '<span class="badge badge-green">Approuvé</span>';
    if (status === 'pending')  return '<span class="badge badge-orange">En attente</span>';
    return `<span class="badge">${status}</span>`;
}

function buildAdminRow(event) {
    const approveBtn = event.status === 'pending'
        ? `<a href="#" class="approve-btn" data-id="${event._id}" style="color:var(--secondary-green);font-weight:600;">Approuver</a>`
        : '';
    return `
    <tr id="row-${event._id}">
      <td>${event.title}</td>
      <td>${event.organizer || '—'}</td>
      <td>${event.date || '—'}</td>
      <td>${statusBadge(event.status)}</td>
      <td class="action-links">
        ${approveBtn}
        <a href="#" class="edit-btn" data-id="${event._id}">Modifier</a>
        <a href="#" class="delete-btn text-danger" data-id="${event._id}"
           data-confirm="Supprimer cet événement ? Cette action est irréversible.">Supprimer</a>
      </td>
    </tr>`;
}

function renderAdminTable(events) {
    const tbody = document.getElementById('events-tbody');
    if (!tbody) return;
    tbody.innerHTML = events.map(buildAdminRow).join('');
    attachTableHandlers();
}

// ─── Action Handlers ──────────────────────────────────────────────────────────

function attachTableHandlers() {
    // Approve
    document.querySelectorAll('.approve-btn').forEach((btn) => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            const id = btn.dataset.id;
            try {
                const token = window.SDGAuth ? window.SDGAuth.getToken() : null;
                const headers = { 'Content-Type': 'application/json' };
                if (token) headers.Authorization = `Bearer ${token}`;
                await fetch(`${EVENTS_API_ADMIN}/${id}/approve`, { method: 'PATCH', headers });
            } catch { /* mock */ }

            // Update locally
            const evt = adminEvents.find((e) => e._id === id);
            if (evt) evt.status = 'approved';
            renderAdminTable(adminEvents);
            window.showToast?.('Événement approuvé.', 'success');
        });
    });

    // Delete
    document.querySelectorAll('.delete-btn').forEach((btn) => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            const msg = btn.dataset.confirm || 'Supprimer ?';
            if (!confirm(msg)) return;

            const id = btn.dataset.id;
            try {
                const token = window.SDGAuth ? window.SDGAuth.getToken() : null;
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                await fetch(`${EVENTS_API_ADMIN}/${id}`, { method: 'DELETE', headers });
            } catch { /* mock */ }

            adminEvents = adminEvents.filter((e) => e._id !== id);
            renderAdminTable(adminEvents);
            window.showToast?.('Événement supprimé.', 'error');
        });
    });

    // Edit (placeholder — would open a modal in a full implementation)
    document.querySelectorAll('.edit-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            window.showToast?.('Fonctionnalité de modification à venir.', 'info');
        });
    });
}

// ─── Create Event (New Event button) ─────────────────────────────────────────

function setupNewEventButton() {
    const btn = document.querySelector('.btn-new-event, button.btn-primary');
    if (!btn) return;
    btn.addEventListener('click', () => {
        window.showToast?.('Formulaire de création à venir.', 'info');
    });
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

function updateDashboardStats(events) {
    const totalEl = document.getElementById('stat-total-events');
    const pendingEl = document.getElementById('stat-pending-events');
    const approvedEl = document.getElementById('stat-approved-events');

    const total    = events.length;
    const pending  = events.filter((e) => e.status === 'pending').length;
    const approved = events.filter((e) => e.status === 'approved').length;

    if (totalEl)    totalEl.textContent    = total;
    if (pendingEl)  pendingEl.textContent  = pending;
    if (approvedEl) approvedEl.textContent = approved;
}

// ─── Init ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', async () => {
    adminEvents = await fetchAdminEvents();
    renderAdminTable(adminEvents);
    updateDashboardStats(adminEvents);
    setupNewEventButton();
});
