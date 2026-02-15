// Job Data (Fetched from API)
let jobs = [];

// Fetch Jobs from API
async function fetchJobs() {
    try {
        const response = await fetch('http://localhost:5000/api/jobs');
        const data = await response.json();

        if (data.success) {
            jobs = data.data;
            renderJobs();
            // Update pagination/filtering if needed
            filterJobs();
        } else {
            console.error('Failed to fetch jobs:', data.error);
        }
    } catch (error) {
        console.error('Error fetching jobs:', error);
    }
}

// Call fetch on load
document.addEventListener('DOMContentLoaded', fetchJobs);

const jobListContainer = document.getElementById('job-cards-container');
const searchInput = document.getElementById('keywords');
const locationInput = document.getElementById('location-filter');
const categoryLinks = document.querySelectorAll('.category-link');
let currentCategory = 'all';

// Render Job Details Page
function renderJobDetails(jobId) {
    const container = document.getElementById('job-details-container');
    const job = jobs.find(j => j.id === jobId);

    if (!job) {
        container.innerHTML = '<div class="error">Job not found.</div>';
        return;
    }

    // Helper to render lists or text
    const renderList = (items) => {
        if (Array.isArray(items)) {
            return `<ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>`;
        }
        return `<p>${items}</p>`; // Fallback if string
    };

    container.innerHTML = `
        <div class="job-details-wrapper">
            <div class="job-header">
                <a href="recruiter-profile.html" class="company-link">${job.company}</a>
                <h1>${job.title}</h1>
                <div class="job-meta-row">
                    <span>${job.location}</span>
                    <span>&bull;</span>
                    <span>${job.type}</span>
                    <span>&bull;</span>
                    <span>${job.date}</span>
                    <span>&bull;</span>
                    <span>${job.field}</span>
                </div>
                <div class="tags" style="margin-top: 1rem;">
                    ${job.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>

            <div class="job-content-section">
                <h3>About the job</h3>
                <p>${job.about}</p>
            </div>

            <div class="job-content-section">
                <h3>Requirements</h3>
                ${renderList(job.requirements)}
            </div>

            <div class="job-content-section">
                <h3>Benefits</h3>
                ${renderList(job.benefits)}
            </div>

            <div class="apply-section">
                <div class="apply-info">
                    <strong>Interested?</strong>
                    <p style="margin:0; font-size: 0.9rem; color: var(--text-secondary);">Please check requirements before applying.</p>
                </div>
                <a href="#" onclick="alert('Application started!'); return false;" class="btn-apply">Apply for this job</a>
            </div>
        </div>
    `;
}

if (jobListContainer) {
    // Pagination State
    let currentPage = 1;
    const itemsPerPage = 10;
    const paginationContainer = document.getElementById('pagination-controls');

    function renderJobs(jobData) {
        jobListContainer.innerHTML = '';
        paginationContainer.innerHTML = '';

        if (jobData.length === 0) {
            jobListContainer.innerHTML = '<div class="no-results">No jobs found matching your criteria.</div>';
            return;
        }

        // Calculate Pagination
        const totalPages = Math.ceil(jobData.length / itemsPerPage);

        // Ensure currentPage is valid
        if (currentPage > totalPages) currentPage = 1;

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const jobsToShow = jobData.slice(startIndex, endIndex);

        // Render Jobs
        jobsToShow.forEach(job => {
            const card = document.createElement('a');
            card.href = `job-details.html?id=${job.id}`; // Updated link
            card.className = 'job-card';
            card.innerHTML = `
                <div class="job-info">
                    <h3>${job.title}</h3>
                    <div class="job-details">
                        <span class="company-name">${job.company}</span> &middot; <span>${job.location}</span>
                    </div>
                    <div class="tags">
                        ${job.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
                <div class="job-meta">
                    <span class="job-type">${job.type}</span>
                    <span class="job-date">${job.date}</span>
                </div>
            `;
            // Add subtle animation for new page loads
            card.style.animation = 'fadeIn 0.3s ease-out';
            jobListContainer.appendChild(card);
        });

        // Render Pagination Controls
        if (totalPages > 1) {
            // Previous Button
            const prevBtn = document.createElement('button');
            prevBtn.innerText = '←';
            prevBtn.className = 'pagination-btn';
            prevBtn.disabled = currentPage === 1;
            prevBtn.onclick = () => {
                if (currentPage > 1) {
                    currentPage--;
                    renderJobs(jobData);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            };
            paginationContainer.appendChild(prevBtn);

            // Page Numbers
            for (let i = 1; i <= totalPages; i++) {
                const pageBtn = document.createElement('button');
                pageBtn.innerText = i;
                pageBtn.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
                pageBtn.onclick = () => {
                    currentPage = i;
                    renderJobs(jobData);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                };
                paginationContainer.appendChild(pageBtn);
            }

            // Next Button
            const nextBtn = document.createElement('button');
            nextBtn.innerText = '→';
            nextBtn.className = 'pagination-btn';
            nextBtn.disabled = currentPage === totalPages;
            nextBtn.onclick = () => {
                if (currentPage < totalPages) {
                    currentPage++;
                    renderJobs(jobData);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            };
            paginationContainer.appendChild(nextBtn);
        }
    }

    function filterJobs() {
        const query = searchInput ? searchInput.value.toLowerCase() : '';
        const locationQuery = locationInput ? locationInput.value.toLowerCase() : '';

        const filtered = jobs.filter(job => {
            const matchesCategory = currentCategory === 'all' || job.field === currentCategory;
            const matchesSearch = (
                job.title.toLowerCase().includes(query) ||
                job.company.toLowerCase().includes(query) ||
                job.tags.some(tag => tag.toLowerCase().includes(query))
            );
            const matchesLocation = job.location.toLowerCase().includes(locationQuery);

            return matchesCategory && matchesSearch && matchesLocation;
        });

        // Reset to first page when filtering
        currentPage = 1;
        renderJobs(filtered);
    }

    // Category Filtering
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Update active state
            categoryLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Update filter
            currentCategory = link.getAttribute('data-category');
            filterJobs();
        });
    });

    // Initial render
    renderJobs(jobs);
}

if (searchInput || locationInput) {
    const handleInput = () => {
        // If we are on the index page (jobListContainer exists), filter in real-time
        if (jobListContainer) {
            filterJobs();
        }
        // If we are on other pages (like job-details), redirect on Enter
        else {
            // Check if Enter key was pressed (this listener needs to be keydown/keyup, not input)
        }
    };

    // Real-time filtering for index page
    if (jobListContainer) {
        if (searchInput) searchInput.addEventListener('input', handleInput);
        if (locationInput) locationInput.addEventListener('input', handleInput);
    }
    // Redirection logic for non-index pages
    else {
        const handleEnter = (e) => {
            if (e.key === 'Enter') {
                const query = searchInput ? searchInput.value : '';
                const location = locationInput ? locationInput.value : '';
                window.location.href = `index.html?q=${encodeURIComponent(query)}&loc=${encodeURIComponent(location)}`;
            }
        };

        if (searchInput) searchInput.addEventListener('keydown', handleEnter);
        if (locationInput) locationInput.addEventListener('keydown', handleEnter);
    }
}

// Check for URL parameters on load (for index.html)
if (jobListContainer) {
    const urlParams = new URLSearchParams(window.location.search);
    const queryParam = urlParams.get('q');
    const locParam = urlParams.get('loc');

    if (queryParam || locParam) {
        if (searchInput && queryParam) searchInput.value = queryParam;
        if (locationInput && locParam) locationInput.value = locParam;
        // Trigger filter immediately
        filterJobs();
    }
}

// Job Post Form Handling
const jobForm = document.getElementById('job-form');
if (jobForm) {
    jobForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = jobForm.querySelector('.btn-submit');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Posting...';
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            const formData = new FormData(jobForm);
            const newJob = {
                title: formData.get('title'),
                company: formData.get('company'),
                location: formData.get('location'),
                field: formData.get('field'),
                type: formData.get('type'),
                tags: formData.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag),
                description: formData.get('description'),
                url: formData.get('url'),
                date: 'Just now' // Mock date
            };

            console.log('New Job Posted:', newJob);
            alert('Job posted successfully! (Check console for object details)');

            jobForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1000);
    });
}

// Recruiter Profile Job Rendering
function renderRecruiterJobs(containerId, fieldFilter) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Filter jobs by field for demo match
    const recruiterJobs = jobs.filter(job => job.field === fieldFilter);

    container.innerHTML = '';

    if (recruiterJobs.length === 0) {
        container.innerHTML = '<div class="no-results">No active job listings.</div>';
        return;
    }

    recruiterJobs.forEach(job => {
        const card = document.createElement('a');
        card.href = `index.html#job-${job.id}`; // Link back to main list
        card.className = 'job-card';
        card.innerHTML = `
            <div class="job-info">
                <h3>${job.title}</h3>
                <div class="job-details">
                    <span class="company-name">${job.company}</span> &middot; <span>${job.location}</span>
                </div>
                <div class="tags">
                    ${job.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
            <div class="job-meta">
                <span class="job-type">${job.type}</span>
                <span class="job-date">${job.date}</span>
            </div>
        `;
        container.appendChild(card);
    });
}

