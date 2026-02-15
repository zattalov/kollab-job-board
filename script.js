const jobs = [
    {
        id: 1,
        title: "Senior Product Designer",
        company: "Linear",
        location: "Remote",
        type: "Full-time",
        tags: ["Design", "UI/UX", "Figma"],
        date: "2h ago",
        field: "Design",
        about: "We are looking for a Senior Product Designer to join our team. You will be responsible for designing the next generation of our project management tools.",
        requirements: ["5+ years of experience in product design", "Proficiency in Figma and prototyping tools", "Strong understanding of design systems"],
        benefits: ["Remote-first culture", "Competitive salary and equity", "Health, dental, and vision insurance"]
    },
    {
        id: 2,
        title: "Frontend Engineer",
        company: "Vercel",
        location: "San Francisco / Remote",
        type: "Full-time",
        tags: ["React", "Next.js", "TypeScript"],
        date: "5h ago",
        field: "Engineering",
        about: "Join the Vercel team to build the Web. We are seeking a Frontend Engineer deeply passionate about the web platform.",
        requirements: ["Experience with React and Next.js", "Strong TypeScript skills", "Knowledge of web performance optimization"],
        benefits: ["Flexible PTO", "Home office stipend", "Wellness benefits"]
    },
    {
        id: 3,
        title: "Staff Software Engineer",
        company: "Stripe",
        location: "Dublin",
        type: "Full-time",
        tags: ["Backend", "Java", "Infrastructure"],
        date: "1d ago",
        field: "Engineering",
        about: "Help us build the economic infrastructure for the internet. You will work on high-scale backend systems.",
        requirements: ["Deep knowledge of distributed systems", "Experience with Java or similar languages", "Ability to design scalable architecture"],
        benefits: ["Global mobility program", "Education stipend", "Comprehensive healthcare"]
    },
    {
        id: 4,
        title: "Marketing Designer",
        company: "Notion",
        location: "New York",
        type: "Contract",
        tags: ["Marketing", "Visual Design", "Brand"],
        date: "2d ago",
        field: "Design",
        about: "We need a Marketing Designer to help tell the Notion story. You will create visual assets for campaigns and our website.",
        requirements: ["Portfolio demonstrating strong visual design", "Experience with motion design is a plus", "Proficiency in Adobe Creative Suite"],
        benefits: ["Contractor competitive rate", "Opportunity for full-time conversion", "Collaborative creative team"]
    },
    {
        id: 5,
        title: "Developer Advocate",
        company: "Supabase",
        location: "Remote",
        type: "Full-time",
        tags: ["DevRel", "PostgreSQL", "Content"],
        date: "3d ago",
        field: "Marketing",
        about: "Be the voice of Supabase in the developer community. Create content, give talks, and gather feedback.",
        requirements: ["Experience in Developer Relations", "Strong technical writing skills", "Knowledge of SQL and PostgreSQL"],
        benefits: ["Remote work anywhere", "Conference travel budget", "Latest hardware"]
    },
    {
        id: 7,
        title: "Senior Accountant",
        company: "Deloitte",
        location: "Chicago",
        type: "Full-time",
        tags: ["CPA", "Audit", "Finance"],
        date: "6h ago",
        field: "Finance",
        about: "Deloitte is seeking a Senior Accountant to lead audit engagements. You will work with diverse clients.",
        requirements: ["CPA certification required", "3+ years in public accounting", "Strong analytical skills"],
        benefits: ["Career advancement paths", "Performance bonuses", "Continuing education support"]
    },
    {
        id: 8,
        title: "Registered Nurse",
        company: "Kaiser Permanente",
        location: "Oakland",
        type: "Full-time",
        tags: ["Nursing", "Patient Care", "ICU"],
        date: "1d ago",
        field: "Healthcare",
        about: "Provide high-quality patient care in our ICU department. Work with a multidisciplinary team.",
        requirements: ["Current RN license in CA", "BLS and ACLS certification", "1+ year of ICU experience"],
        benefits: ["Union benefits", "Pension plan", "Tuition reimbursement"]
    },
    {
        id: 9,
        title: "High School Math Teacher",
        company: "Public Schools",
        location: "Boston",
        type: "Contract",
        tags: ["Education", "Math", "Teaching"],
        date: "2d ago",
        field: "Education",
        about: "Teach Mathematics to high school students. Inspire the next generation of problem solvers.",
        requirements: ["Bachelor's degree in Math or Education", "State teaching certification", "Classroom management skills"],
        benefits: ["School holidays off", "Health benefits", "Professional development"]
    },
    {
        id: 10,
        title: "Legal Counsel",
        company: "Google",
        location: "Mountain View",
        type: "Full-time",
        tags: ["Corporate Law", "Tech", "Legal"],
        date: "3d ago",
        field: "Legal",
        about: "Advise product teams on legal matters. Navigate complex regulatory landscapes in tech.",
        requirements: ["JD from an accredited law school", "Bar admission", "Experience in tech transactions"],
        benefits: ["Google perks (food, gym)", "Stock units", "Parental leave"]
    },
    {
        id: 11,
        title: "Sales Representative",
        company: "Salesforce",
        location: "Chicago",
        type: "Full-time",
        tags: ["Sales", "CRM", "B2B"],
        date: "4d ago",
        field: "Sales",
        about: "Drive revenue growth by acquiring new customers. Manage the full sales cycle.",
        requirements: ["2+ years of sales experience", "Strong communication skills", "Ability to meet quotas"],
        benefits: ["Uncapped commission", "Travel opportunities", "Health insurance"]
    },
    {
        id: 12,
        title: "Operations Manager",
        company: "Amazon",
        location: "Seattle",
        type: "Full-time",
        tags: ["Operations", "Logistics", "Management"],
        date: "5d ago",
        field: "Operations",
        about: "Oversee daily operations in a fulfillment center. Ensure efficiency and safety.",
        requirements: ["Bachelor's degree in Business or related field", "Experience in operations management", "Leadership skills"],
        benefits: ["Stock options", "Health benefits", "Career growth"]
    },
    {
        id: 13,
        title: "Software Engineer",
        company: "Microsoft",
        location: "Redmond",
        type: "Full-time",
        tags: ["C#", ".NET", "Azure"],
        date: "1w ago",
        field: "Engineering",
        about: "Build scalable cloud services on Azure. Work with a world-class engineering team.",
        requirements: ["Proficiency in C# and .NET", "Experience with cloud computing", "Strong problem-solving skills"],
        benefits: ["Competitive salary", "Bonuses", "Comprehensive benefits"]
    },
    {
        id: 14,
        title: "UX Researcher",
        company: "Spotify",
        location: "Remote",
        type: "Contract",
        tags: ["Design", "User Research", "Usability"],
        date: "1w ago",
        field: "Design",
        about: "Conduct user research to inform product decisions. Improve the listening experience for millions.",
        requirements: ["Experience in qualitative and quantitative research", "Strong analytical skills", "Ability to present findings"],
        benefits: ["Flexible schedule", "Remote work", "Spotify Premium"]
    },
    {
        id: 15,
        title: "Data Analyst",
        company: "Netflix",
        location: "Los Gatos",
        type: "Full-time",
        tags: ["Data", "SQL", "Python"],
        date: "2w ago",
        field: "Engineering",
        about: "Analyze viewing data to improve content recommendations. Work with big data technologies.",
        requirements: ["Proficiency in SQL and Python", "Experience with data visualization tools", "Strong analytical mindset"],
        benefits: ["Top-tier salary", "Freedom and responsibility culture", "Unlimited PTO"]
    },
    {
        id: 16,
        title: "Content Marketing Manager",
        company: "HubSpot",
        location: "Cambridge",
        type: "Full-time",
        tags: ["Marketing", "Content", "SEO"],
        date: "2w ago",
        field: "Marketing",
        about: "Create compelling content to attract and engage our audience. Manage the content calendar.",
        requirements: ["3+ years of content marketing experience", "Strong writing and editing skills", "Knowledge of SEO"],
        benefits: ["Tuition reimbursement", "Sabbatical program", "Health and wellness benefits"]
    },
    {
        id: 17,
        title: "Financial Analyst",
        company: "Goldman Sachs",
        location: "New York",
        type: "Full-time",
        tags: ["Finance", "Analysis", "Investment"],
        date: "3w ago",
        field: "Finance",
        about: "Provide financial analysis to support investment decisions. Model complex financial scenarios.",
        requirements: ["Bachelor's degree in Finance or Economics", "Strong Excel skills", "Attention to detail"],
        benefits: ["Performance-based bonuses", "Prestige", "Networking opportunities"]
    },
    {
        id: 18,
        title: "Elementary School Teacher",
        company: "Private Academy",
        location: "San Francisco",
        type: "Full-time",
        tags: ["Education", "Teaching", "Elementary"],
        date: "3w ago",
        field: "Education",
        about: "Teach core subjects to elementary students. Foster a love of learning in a supportive environment.",
        requirements: ["Teaching credential", "Experience with young children", "Patience and creativity"],
        benefits: ["Small class sizes", "Professional development", "Competitive salary"]
    },
    {
        id: 19,
        title: "Pediatrician",
        company: "Children's Hospital",
        location: "Los Angeles",
        type: "Full-time",
        tags: ["Healthcare", "Pediatrics", "Medicine"],
        date: "1mo ago",
        field: "Healthcare",
        about: "Diagnose and treat medical conditions in infants, children, and adolescents.",
        requirements: ["MD or DO degree", "Board certification in Pediatrics", "Compassionate bedside manner"],
        benefits: ["Comprehensive medical benefits", "Malpractice insurance", "Relocation assistance"]
    },
    {
        id: 20,
        title: "Corporate Attorney",
        company: "Baker McKenzie",
        location: "Chicago",
        type: "Full-time",
        tags: ["Legal", "Corporate", "Law"],
        date: "1mo ago",
        field: "Legal",
        about: "Advise corporations on legal rights and obligations. Draft and review contracts.",
        requirements: ["JD degree", "Admission to the Bar", "Experience in corporate law"],
        benefits: ["High salary", "Merit bonuses", "Partnership track"]
    }
];

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

