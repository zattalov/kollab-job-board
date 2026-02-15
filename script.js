// --- CONFIGURATION & STATE ---
const API_URL = 'https://kollab-backend-bxik.onrender.com/api/jobs';
let jobs = [];
let currentPage = 1;
const itemsPerPage = 10;
let currentCategory = 'all';

// --- DOM ELEMENTS ---
const jobListContainer = document.getElementById('job-cards-container');
const paginationContainer = document.getElementById('pagination-controls');
const searchInput = document.getElementById('keywords');
const locationInput = document.getElementById('location-filter');
const categoryLinks = document.querySelectorAll('.category-link');

// --- AUTHENTICATION ---
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const navLinks = document.querySelector('nav');
    const postJobLink = document.querySelector('a[href="post-job.html"]');

    if (user) {
        // Change Log In to Profile Icon
        const loginLink = document.querySelector('a[href="login.html"]');
        if (loginLink) {
            loginLink.innerHTML = '<img src="user-icon.svg" alt="Profile" style="width: 24px; height: 24px; vertical-align: middle;">';
            loginLink.href = user.role === 'recruiter' ? 'recruiter-profile.html' : 'seeker-profile.html';
            loginLink.removeAttribute('onclick');
            loginLink.title = "View Profile";
        }

        // Add Logout Button
        if (!document.getElementById('logout-btn')) {
            const logoutBtn = document.createElement('a');
            logoutBtn.id = 'logout-btn';
            logoutBtn.href = '#';
            logoutBtn.className = 'nav-link';
            logoutBtn.style.marginLeft = '1rem';
            logoutBtn.textContent = 'Logout';
            logoutBtn.onclick = (e) => {
                e.preventDefault();
                localStorage.removeItem('currentUser');
                window.location.href = 'index.html';
            };
            if (navLinks) navLinks.appendChild(logoutBtn);
        }

        // Hide "Post a Job" for Seekers
        if (user.role === 'seeker' && postJobLink) {
            postJobLink.style.display = 'none';
        }
    }
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (email === 'rec@rec.tn' && password === '111') {
        localStorage.setItem('currentUser', JSON.stringify({ email, role: 'recruiter' }));
        window.location.href = 'index.html';
    } else if (email === 'skr@skr.tn' && password === '111') {
        localStorage.setItem('currentUser', JSON.stringify({ email, role: 'seeker' }));
        window.location.href = 'index.html';
    } else {
        alert('Invalid credentials');
    }
}

function handleJobSubmit(event) {
    event.preventDefault();

    // Check if user is allowed to post
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user || user.role !== 'recruiter') {
        alert('You must be logged in as a recruiter to post a job.');
        return;
    }

    const submitBtn = document.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Saving...';
    submitBtn.disabled = true;

    const formData = new FormData(event.target);

    // Check if we are editing
    const urlParams = new URLSearchParams(window.location.search);
    const editJobId = urlParams.get('edit');

    // Map form data to Backend Schema
    const jobData = {
        title: formData.get('title'),
        company: formData.get('company'),
        location: formData.get('location'),
        field: formData.get('field'),
        type: formData.get('type'),
        tags: formData.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag),
        about: formData.get('about'),
        requirements: formData.get('requirements').split('\n').filter(line => line.trim()),
        benefits: formData.get('benefits').split('\n').filter(line => line.trim()),
    };

    const method = editJobId ? 'PUT' : 'POST';
    const url = editJobId ? `${API_URL}/${editJobId}` : API_URL;

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jobData)
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(editJobId ? 'Job updated successfully!' : 'Job posted successfully!');
                window.location.href = 'index.html';
            } else {
                alert(`Error ${editJobId ? 'updating' : 'posting'} job: ` + data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        })
        .finally(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
}

// --- DATA & API ---
// Modified to return a Promise
async function fetchJobs() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (data.success) {
            // Map API data to frontend format
            jobs = data.data.map(job => ({
                ...job,
                id: job._id,
                date: new Date(job.postedAt).toLocaleDateString()
            }));
            return jobs;
        } else {
            console.error('Failed to fetch jobs:', data.error);
            return [];
        }
    } catch (error) {
        console.error('Error fetching jobs:', error);
        return [];
    }
}

// --- RENDERING ---
function renderJobs(jobData) {
    if (!jobListContainer) return;

    jobListContainer.innerHTML = '';
    paginationContainer.innerHTML = '';

    if (jobData.length === 0) {
        jobListContainer.innerHTML = '<div class="no-results">No jobs found matching your criteria.</div>';
        return;
    }

    // Pagination Logic
    const totalPages = Math.ceil(jobData.length / itemsPerPage);
    if (currentPage > totalPages) currentPage = 1;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const jobsToShow = jobData.slice(startIndex, endIndex);

    // Render Cards
    jobsToShow.forEach(job => {
        const card = document.createElement('a');
        card.href = `job-details.html?id=${job.id}`;
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
        card.style.animation = 'fadeIn 0.3s ease-out';
        jobListContainer.appendChild(card);
    });

    // Render Pagination Controls
    if (totalPages > 1) {
        const createBtn = (text, onClick, disabled, active) => {
            const btn = document.createElement('button');
            btn.innerText = text;
            btn.className = `pagination-btn ${active ? 'active' : ''}`;
            btn.disabled = disabled;
            btn.onclick = () => {
                onClick();
                renderJobs(jobData); // Re-render with existing data
                window.scrollTo({ top: 0, behavior: 'smooth' });
            };
            return btn;
        };

        paginationContainer.appendChild(createBtn('←', () => currentPage--, currentPage === 1));

        for (let i = 1; i <= totalPages; i++) {
            paginationContainer.appendChild(createBtn(i, () => currentPage = i, false, i === currentPage));
        }

        paginationContainer.appendChild(createBtn('→', () => currentPage++, currentPage === totalPages));
    }
}

function filterJobs() {
    // Determine query sources
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

    currentPage = 1; // Reset to first page
    renderJobs(filtered);
}

// --- INITIALIZATION & EVENTS ---
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();

    // CHAINING: Fetch -> Then -> Render
    fetchJobs().then(() => {
        // 1. Initial Render for Index (if on index page)
        if (jobListContainer) {
            const urlParams = new URLSearchParams(window.location.search);
            const queryParam = urlParams.get('q');
            const locParam = urlParams.get('loc');

            if (queryParam || locParam) {
                if (searchInput && queryParam) searchInput.value = queryParam;
                if (locationInput && locParam) locationInput.value = locParam;
            }
            filterJobs();
        }

        // 2. Render Job Details (if on details page)
        const detailsContainer = document.getElementById('job-details-container');
        if (detailsContainer) {
            const urlParams = new URLSearchParams(window.location.search);
            const jobId = urlParams.get('id');
            if (jobId) {
                renderJobDetails(jobId);
            } else {
                detailsContainer.innerHTML = '<div class="error">Invalid Job ID.</div>';
            }
        }

        // 3. Render Recruiter Profile Jobs (if on profile page)
        const recruiterContainer = document.getElementById('recruiter-job-list');
        if (recruiterContainer) {
            // We force 'All' here because the user wants to manage all jobs
            renderRecruiterJobs('recruiter-job-list', 'All');
        }
    });

    // Event Listeners
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            categoryLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            currentCategory = link.getAttribute('data-category');
            filterJobs();
        });
    });

    const handleInput = () => {
        if (jobListContainer) filterJobs();
    };

    const handleEnter = (e) => {
        if (e.key === 'Enter') {
            const query = searchInput ? searchInput.value : '';
            const location = locationInput ? locationInput.value : '';
            window.location.href = `index.html?q=${encodeURIComponent(query)}&loc=${encodeURIComponent(location)}`;
        }
    };

    if (searchInput) {
        searchInput.addEventListener('input', handleInput);
        searchInput.addEventListener('keydown', handleEnter);
    }
    if (locationInput) {
        locationInput.addEventListener('input', handleInput);
        locationInput.addEventListener('keydown', handleEnter);
    }

    // Check URL Params for Edit Mode (post-job.html)
    // We check this GLOBALLY, not just if jobListContainer exists.
    if (window.location.pathname.includes('post-job.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const editJobId = urlParams.get('edit');

        if (editJobId) {
            console.log('Edit mode detected for Job ID:', editJobId);
            document.querySelector('h1').textContent = 'Edit Job';
            const submitBtn = document.querySelector('.btn-submit');
            if (submitBtn) submitBtn.textContent = 'Save';

            fetch(`${API_URL}/${editJobId}`)
                .then(res => {
                    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                    return res.json();
                })
                .then(data => {
                    console.log('Fetched job data for edit:', data);
                    if (data.success) {
                        const job = data.data;
                        const setValue = (id, val) => {
                            const el = document.getElementById(id);
                            if (el) el.value = val || '';
                        };

                        setValue('title', job.title);
                        setValue('company', job.company);
                        setValue('location', job.location);
                        setValue('field', job.field);
                        setValue('type', job.type);

                        // Handle Arrays/Textareas
                        setValue('tags', Array.isArray(job.tags) ? job.tags.join(', ') : job.tags);
                        setValue('about', job.about);
                        setValue('requirements', Array.isArray(job.requirements) ? job.requirements.join('\n') : job.requirements);
                        setValue('benefits', Array.isArray(job.benefits) ? job.benefits.join('\n') : job.benefits);

                        // Optional URL
                        setValue('url', job.applicationUrl || job.url);
                    } else {
                        console.error('API returned error:', data.error);
                        alert('Could not load job details: ' + data.error);
                    }
                })
                .catch(err => {
                    console.error('Error fetching job for edit:', err);
                    alert('Failed to load job details. Please check console.');
                });
        }
    }
});

// --- RENDER JOB DETAILS (Called by job-details.html) ---
function renderJobDetails(jobId) {
    const container = document.getElementById('job-details-container');
    const job = jobs.find(j => j.id === jobId);

    if (!job) {
        container.innerHTML = '<div class="error">Job not found.</div>';
        return;
    }

    const renderList = (items) => {
        if (Array.isArray(items)) {
            return `<ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>`;
        }
        return `<p>${items}</p>`;
    };

    const user = JSON.parse(localStorage.getItem('currentUser'));
    let actionsHtml = '';

    if (user && user.role === 'recruiter') {
        actionsHtml = `
            <div class="job-actions" style="margin-top: 1rem;">
                <button onclick="editJob('${job.id}')" class="btn-secondary" style="margin-right: 0.5rem;">Edit Job</button>
                <button onclick="deleteJob('${job.id}')" class="btn-danger" style="background-color: #ff4d4f; color: white; border: none; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer;">Delete Job</button>
            </div>
        `;
    }

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
                ${actionsHtml}
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

// --- JOB MANAGEMENT ACTIONS ---
function deleteJob(jobId) {
    if (confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
        fetch(`${API_URL}/${jobId}`, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Job deleted successfully.');
                    window.location.href = 'index.html';
                } else {
                    alert('Error deleting job: ' + data.error);
                }
            })
            .catch(err => console.error(err));
    }
}

function editJob(jobId) {
    window.location.href = `post-job.html?edit=${jobId}`;
}

// --- RECRUITER PROFILE JOBS (Called by recruiter-profile.html) ---
function renderRecruiterJobs(containerId, fieldFilter) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let recruiterJobs = jobs; // Default to all
    if (fieldFilter && fieldFilter !== 'All') {
        recruiterJobs = jobs.filter(job => job.field === fieldFilter);
    }

    container.innerHTML = '';

    if (recruiterJobs.length === 0) {
        container.innerHTML = '<div class="no-results">No active job listings.</div>';
        return;
    }

    recruiterJobs.forEach(job => {
        const card = document.createElement('div');
        card.className = 'job-card';
        card.style.display = 'block';

        const actions = `
            <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #eee; display: flex; gap: 1rem;">
                <button onclick="editJob('${job.id}')" class="btn-secondary" style="font-size: 0.9rem; padding: 0.25rem 0.5rem;">Edit</button>
                <button onclick="deleteJob('${job.id}')" class="btn-danger" style="background-color: #ff4d4f; color: white; border: none; padding: 0.25rem 0.5rem; border-radius: 4px; cursor: pointer; font-size: 0.9rem;">Delete</button>
            </div>
        `;

        card.innerHTML = `
            <a href="job-details.html?id=${job.id}" style="text-decoration: none; color: inherit; display: block;">
                <div class="job-info">
                    <h3>${job.title}</h3>
                    <div class="job-details">
                        <span class="company-name">${job.company}</span> &middot; <span>${job.location}</span>
                    </div>
                </div>
                <div class="job-meta">
                    <span class="job-type">${job.type}</span>
                    <span class="job-date">${job.date}</span>
                </div>
            </a>
            ${actions}
        `;
        container.appendChild(card);
    });
}
