// --- CONFIGURATION & STATE ---
const API_URL = 'https://kollab-backend-bxik.onrender.com/api/jobs';
let jobs = [];
let currentPage = 1;
const itemsPerPage = 10;
let currentCategory = 'all';

// --- CUSTOM NOTIFICATIONS (TOASTS) ---
function showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="background:none;border:none;color:inherit;cursor:pointer;margin-left:10px;">&times;</button>
    `;

    container.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Auto remove
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// --- CUSTOM MODAL (CONFIRM) ---
function showConfirmModal(message, onConfirm) {
    // Remove existing if any
    const existing = document.querySelector('.modal-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    overlay.innerHTML = `
        <div class="custom-modal">
            <h3 class="modal-title">Confirm Action</h3>
            <p class="modal-message">${message}</p>
            <div class="modal-actions">
                <button class="btn-modal-cancel">Cancel</button>
                <button class="btn-modal-confirm">Confirm</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    // Animation
    setTimeout(() => overlay.classList.add('show'), 10);

    // Events
    const close = () => {
        overlay.classList.remove('show');
        setTimeout(() => overlay.remove(), 300);
    };

    overlay.querySelector('.btn-modal-cancel').onclick = close;
    overlay.querySelector('.btn-modal-confirm').onclick = () => {
        close();
        onConfirm();
    };
}

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
    // Define postJobLink BEFORE using it
    const postJobLink = document.querySelector('a[href="post-job.html"]');

    // Hide "Post a Job" by default result
    if (postJobLink) postJobLink.style.display = 'none';

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

        // Show "Post a Job" ONLY for Recruiters
        if (user.role === 'recruiter' && postJobLink) {
            postJobLink.style.display = 'inline-block';
        } else if (postJobLink) {
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
        showToast('Invalid credentials. Please try again.', 'error');
    }
}

function handleJobSubmit(event) {
    event.preventDefault();

    // Check if user is allowed to post
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user || user.role !== 'recruiter') {
        showToast('You must be logged in as a recruiter to post a job.', 'error');
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
                showToast(editJobId ? 'Job updated successfully!' : 'Job posted successfully!', 'success');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000); // Wait for toast
            } else {
                showToast(`Error ${editJobId ? 'updating' : 'posting'} job: ` + data.error, 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showToast('An error occurred. Please try again.', 'error');
        })
        .finally(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
}

// --- DATA & API ---
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

    // Page Initializers
    const path = window.location.pathname;
    if (path.includes('profile.html') || document.getElementById('profile-name')) {
        if (typeof renderProfilePage === 'function') renderProfilePage();
    }
    if (path.includes('edit-profile.html') || document.getElementById('edit-profile-form')) {
        if (typeof initEditProfilePage === 'function') initEditProfilePage();
    }

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

    // --- EDIT JOB LOGIC (Global Check) ---
    // Runs on EVERY page load, but only acts if 'edit' param exists
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const editJobId = urlParams.get('edit');

        if (editJobId) {
            // Update Title
            const h1 = document.querySelector('h1');
            if (h1) h1.textContent = 'Edit Job';

            // Update Submit Button
            const submitBtn = document.querySelector('.btn-submit');
            if (submitBtn) {
                submitBtn.textContent = 'Save';
            }

            fetch(`${API_URL}/${editJobId}`)
                .then(res => {
                    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                    return res.json();
                })
                .then(data => {
                    if (data.success) {
                        const job = data.data;
                        const setValue = (id, val) => {
                            const el = document.getElementById(id);
                            if (el) {
                                el.value = val || '';
                            }
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
                        showToast('Could not load job details: ' + data.error, 'error');
                    }
                })
                .catch(err => {
                    console.error('Error fetching job for edit:', err);
                    showToast('Failed to load job details.', 'error');
                });
        }
    } catch (e) {
        console.error('Error in Edit Logic:', e);
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
            <div class="job-actions">
                <button onclick="editJob('${job.id}')" class="btn-secondary">Edit Job</button>
                <button onclick="deleteJob('${job.id}')" class="btn-danger">Delete Job</button>
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
                <a href="#" onclick="showToast('Application started!', 'success'); return false;" class="btn-apply">Apply for this job</a>
            </div>
        </div>
    `;
}

// --- JOB MANAGEMENT ACTIONS ---
function deleteJob(jobId) {
    showConfirmModal('Are you sure you want to delete this job? This action cannot be undone.', () => {
        fetch(`${API_URL}/${jobId}`, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showToast('Job deleted successfully.', 'success');
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1000); // Wait for toast
                } else {
                    showToast('Error deleting job: ' + data.error, 'error');
                }
            })
            .catch(err => console.error(err));
    });
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
            <div class="job-actions">
                <button onclick="editJob('${job.id}')" class="btn-secondary">Edit</button>
                <button onclick="deleteJob('${job.id}')" class="btn-danger">Delete</button>
            </div>
        `;

        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                <div style="flex: 1; padding-right: 1rem;">
                    <h3 style="margin: 0 0 0.25rem 0; font-size: 1.1rem; color: #111827; line-height: 1.2;">${job.title}</h3>
                    <div class="job-details">
                        <span class="company-name" style="font-weight: 500; color: #1f2937;">${job.company}</span> 
                        <span style="color: #9ca3af;">&middot;</span> 
                        <span style="color: #6b7280;">${job.location}</span>
                    </div>
                </div>

                <div style="text-align: right; min-width: 100px;">
                    <div style="display: inline-block; background: #f3f4f6; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 600; color: #374151; text-transform: uppercase;">
                        ${job.type}
                    </div>
                    <div style="font-size: 0.85rem; color: #9ca3af; margin-top: 4px;">
                        ${job.date}
                    </div>
                </div>
            </div>
            
            <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1rem;">
                <button onclick="editJob('${job.id}')" class="btn-secondary">Edit</button>
                <button onclick="deleteJob('${job.id}')" class="btn-danger">Delete</button>
            </div>
        `;
        container.appendChild(card);
    });
}

// --- PROFILE DATA & EDITING LOGIC ---

const defaultSeekerProfile = {
    name: "Alex Morgan",
    title: "Product Designer & UI Specialist",
    bio: "Creating intuitive and beautiful digital experiences. obsessive about typography and micro-interactions. always learning.",
    location: "San Francisco, CA",
    email: "alex.m@example.com",
    website: "alexmorgan.design",
    availability: "Open to offers",
    skills: ["UI Design", "UX Research", "Figma", "Prototyping", "HTML/CSS", "Design Systems"],
    experience: [
        {
            title: "Senior Product Designer",
            company: "TechFlow Inc.",
            date: "2023 - Present",
            description: "Leading the design system team and overseeing the UX for the main SaaS platform."
        },
        {
            title: "UI Designer",
            company: "Creative Studio",
            date: "2020 - 2023",
            description: "Designed marketing websites and mobile apps for various startup clients."
        }
    ],
    education: [
        {
            degree: "BFA in Interaction Design",
            school: "California College of the Arts",
            date: "2016 - 2020"
        }
    ]
};

const defaultRecruiterProfile = {
    name: "Jamel Eddine Ghabbara",
    title: "Senior Technical Recruiter at Kaiser Permanente",
    bio: "Passionate about connecting healthcare professionals with meaningful careers. Focusing on nursing, administration, and specialized medical roles across California.",
    location: "Oakland, CA",
    email: "jamel.g@kaiser.example.com",
    website: "kaiserpermanente.jobs",
    availability: "Hiring",
    skills: [],
    experience: [],
    education: []
};

function getProfile(role) {
    const key = `profile_${role}`;
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
    return role === 'recruiter' ? defaultRecruiterProfile : defaultSeekerProfile;
}

function saveProfile(role, data) {
    localStorage.setItem(`profile_${role}`, JSON.stringify(data));
    showToast('Profile saved successfully!', 'success');
}

// Render Profile Page (Read View)
function renderProfilePage() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) return;

    const profile = getProfile(user.role);

    // Text Fields
    const setText = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    };

    setText('profile-name', profile.name);
    setText('profile-title', profile.title);
    setText('profile-bio', profile.bio);
    setText('info-location', profile.location);
    setText('info-email', profile.email);
    setText('info-website', profile.website);
    setText('info-availability', profile.availability);

    // Skills
    const skillsContainer = document.getElementById('profile-skills-list');
    if (skillsContainer && profile.skills) {
        skillsContainer.innerHTML = profile.skills.map(skill => `<li>${skill}</li>`).join('');
    }

    // Experience
    const expContainer = document.getElementById('profile-experience-list');
    if (expContainer && profile.experience) {
        expContainer.innerHTML = profile.experience.map(exp => `
            <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                    <h4>${exp.title}</h4>
                    <p class="company">${exp.company}</p>
                    <p class="date">${exp.date}</p>
                    <p class="description">${exp.description}</p>
                </div>
            </div>
        `).join('');
    }

    // Education
    const eduContainer = document.getElementById('profile-education-list');
    if (eduContainer && profile.education) {
        eduContainer.innerHTML = profile.education.map(edu => `
            <div class="education-item">
                <h4>${edu.degree}</h4>
                <p class="school">${edu.school}</p>
                <p class="date">${edu.date}</p>
            </div>
        `).join('');
    }

    // Update Edit Button Link
    const editBtn = document.getElementById('edit-profile-btn');
    if (editBtn) {
        editBtn.onclick = () => window.location.href = 'edit-profile.html';
        editBtn.textContent = 'Edit Profile';
    }
}

// Logic for edit-profile.html
function initEditProfilePage() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    const profile = getProfile(user.role);
    const form = document.getElementById('edit-profile-form');
    const backLink = document.getElementById('back-link');

    // Setup Back Link
    if (backLink) {
        backLink.href = user.role === 'recruiter' ? 'recruiter-profile.html' : 'seeker-profile.html';
        backLink.onclick = (e) => {
            e.preventDefault();
            window.location.href = backLink.getAttribute('href');
        };
    }

    const cancelBtn = document.getElementById('cancel-btn');
    if (cancelBtn) {
        cancelBtn.onclick = () => window.location.href = (backLink ? backLink.getAttribute('href') : 'index.html');
    }

    // Pre-fill fields
    const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.value = val || '';
    };

    setVal('name', profile.name);
    setVal('title', profile.title);
    setVal('location', profile.location);
    setVal('bio', profile.bio);
    setVal('email', profile.email);
    setVal('website', profile.website);
    setVal('availability', profile.availability);
    setVal('skills', profile.skills ? profile.skills.join(', ') : '');

    // Render Experience Inputs
    const expContainer = document.getElementById('experience-container');
    if (expContainer) {
        expContainer.innerHTML = ''; // Clear
        (profile.experience || []).forEach(exp => addExperienceItem(exp));
    }

    // Render Education Inputs
    const eduContainer = document.getElementById('education-container');
    if (eduContainer) {
        eduContainer.innerHTML = ''; // Clear
        (profile.education || []).forEach(edu => addEducationItem(edu));
    }

    // Hide Seeker sections if Recruiter
    if (user.role === 'recruiter') {
        const seekerSections = document.getElementById('seeker-sections');
        if (seekerSections) seekerSections.style.display = 'none';
    }

    // Handle Submit
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Gather Basic Data
            const updatedProfile = {
                ...profile,
                name: document.getElementById('name').value,
                title: document.getElementById('title').value,
                location: document.getElementById('location').value,
                bio: document.getElementById('bio').value,
                email: document.getElementById('email').value,
                website: document.getElementById('website').value,
                availability: document.getElementById('availability').value,
            };

            if (user.role !== 'recruiter') { // Assume seeker by default
                // Gather Skills
                const skillsStr = document.getElementById('skills').value;
                updatedProfile.skills = skillsStr.split(',').map(s => s.trim()).filter(s => s);

                // Gather Experience
                updatedProfile.experience = Array.from(document.querySelectorAll('.experience-item')).map(item => ({
                    title: item.querySelector('.exp-title').value,
                    company: item.querySelector('.exp-company').value,
                    date: item.querySelector('.exp-date').value,
                    description: item.querySelector('.exp-desc').value
                }));

                // Gather Education
                updatedProfile.education = Array.from(document.querySelectorAll('.education-item-form')).map(item => ({
                    degree: item.querySelector('.edu-degree').value,
                    school: item.querySelector('.edu-school').value,
                    date: item.querySelector('.edu-date').value
                }));
            }

            saveProfile(user.role, updatedProfile);
            setTimeout(() => {
                window.location.href = backLink ? backLink.getAttribute('href') : 'index.html';
            }, 500);
        });
    }
}

function addExperienceItem(data = {}) {
    const container = document.getElementById('experience-container');
    if (!container) return;
    const div = document.createElement('div');
    div.className = 'experience-item';
    // Styles moved to CSS
    div.innerHTML = `
        <div style="display: flex; gap: 1rem; margin-bottom: 0.5rem;">
            <input type="text" class="exp-title" placeholder="Job Title" value="${data.title || ''}" style="flex: 1;" required>
            <input type="text" class="exp-company" placeholder="Company" value="${data.company || ''}" style="flex: 1;" required>
        </div>
        <div style="margin-bottom: 0.5rem;">
            <input type="text" class="exp-date" placeholder="Date (e.g. 2020 - 2022)" value="${data.date || ''}" style="width: 100%;">
        </div>
        <textarea class="exp-desc" placeholder="Description" rows="3" style="width: 100%;">${data.description || ''}</textarea>
        <div style="text-align: right; margin-top: 0.5rem;">
            <button type="button" class="btn-danger" onclick="this.closest('.experience-item').remove()">Remove</button>
        </div>
    `;
    container.appendChild(div);
}

function addEducationItem(data = {}) {
    const container = document.getElementById('education-container');
    if (!container) return;
    const div = document.createElement('div');
    div.className = 'education-item-form';
    // Styles moved to CSS
    div.innerHTML = `
        <div style="margin-bottom: 0.5rem;">
            <input type="text" class="edu-degree" placeholder="Degree / Certificate" value="${data.degree || ''}" style="width: 100%;" required>
        </div>
        <div style="display: flex; gap: 1rem; margin-bottom: 0.5rem;">
            <input type="text" class="edu-school" placeholder="School / University" value="${data.school || ''}" style="flex: 1;" required>
            <input type="text" class="edu-date" placeholder="Date" value="${data.date || ''}" style="flex: 1;">
        </div>
        <div style="text-align: right; margin-top: 0.5rem;">
            <button type="button" class="btn-danger" onclick="this.closest('.education-item-form').remove()">Remove</button>
        </div>
    `;
    container.appendChild(div);
}

// Global fallback for onclicks (redirects to edit page)
function toggleEditProfile() {
    window.location.href = 'edit-profile.html';
}
