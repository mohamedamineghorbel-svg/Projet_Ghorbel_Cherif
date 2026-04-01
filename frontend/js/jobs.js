document.addEventListener('DOMContentLoaded', () => {
    const filterSelect = document.getElementById('filter-type');
    const jobsContainer = document.getElementById('jobs-container');
    const jobCards = document.querySelectorAll('.job-card');
    const jobCount = document.getElementById('job-count');

    if (filterSelect) {
        filterSelect.addEventListener('change', (e) => {
            const selectedType = e.target.value;
            let count = 0;

            jobCards.forEach(card => {
                if (selectedType === 'all' || card.dataset.type === selectedType) {
                    card.style.display = 'flex';
                    count++;
                } else {
                    card.style.display = 'none';
                }
            });

            if (jobCount) {
                jobCount.textContent = count;
            }
        });
    }

    // Search functionality mock
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('job-search');

    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', () => {
            const query = searchInput.value.toLowerCase();
            let count = 0;

            jobCards.forEach(card => {
                const title = card.querySelector('.card-title').textContent.toLowerCase();
                const text = card.querySelector('.card-text').textContent.toLowerCase();
                
                if (title.includes(query) || text.includes(query)) {
                    card.style.display = 'flex';
                    count++;
                } else {
                    card.style.display = 'none';
                }
            });

            if (jobCount) {
                jobCount.textContent = count;
            }
            
            // Re-set the filter dropdown when searching
            if(filterSelect) filterSelect.value = 'all';
        });
    }
});
