// script.js (Corrected: Obsolete contact lines removed)

document.addEventListener('DOMContentLoaded', function() {

    // --- HAMBURGER MENU FUNCTIONALITY ---
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");
    const allLinks = document.querySelectorAll(".nav-links a");
    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navLinks.classList.toggle("active");
        document.body.classList.toggle("mobile-menu-active");
    });
    allLinks.forEach(link => {
        link.addEventListener("click", () => {
            hamburger.classList.remove("active");
            navLinks.classList.remove("active");
            document.body.classList.remove("mobile-menu-active");
        });
    });


    // --- POPULATE ALL DATA FROM CONFIG.JS ---
    document.getElementById('page-title').textContent = `${portfolioData.name} | ${portfolioData.title}`;
    document.querySelector('.logo a').textContent = portfolioData.name;
    document.getElementById('hero-name').textContent = portfolioData.name;
    document.getElementById('hero-title').textContent = portfolioData.title;
    document.getElementById('hero-github').href = portfolioData.socials.github;
    document.getElementById('hero-linkedin').href = portfolioData.socials.linkedin;
    document.getElementById('about-image').src = portfolioData.about.imageUrl;
    document.getElementById('about-image').alt = `${portfolioData.name} Headshot`;
    document.getElementById('about-name').textContent = `Hi! I'm ${portfolioData.name}.`;
    document.getElementById('about-location').textContent = portfolioData.location;
    const aboutDescription = document.getElementById('about-description');
    aboutDescription.innerHTML = '';
    portfolioData.about.description.forEach(p => { aboutDescription.innerHTML += `<p>${p}</p>`; });

    const experienceContainer = document.getElementById('experience-container');
    portfolioData.experience.forEach((job, index) => {
        let responsibilitiesHTML = job.responsibilities.map(r => `<li>${r}</li>`).join('');
        experienceContainer.innerHTML += `<div class="experience-item"><div class="experience-number">${index + 1}</div><div class="experience-details"><h3>${job.title}</h3><p class="company">${job.company} <span class="details">(${job.details})</span></p><ul>${responsibilitiesHTML}</ul></div></div>`;
    });

    // --- Skills Builder with UPGRADED LOGIC ---
    const skillsGrid = document.getElementById('skills-grid');
    portfolioData.skills.forEach(skill => {
        // ** HERE'S THE NEW LOGIC **
        if (skill.certificateUrl) {
            // If a certificate URL exists, create a clickable link
            skillsGrid.innerHTML += `
                <a href="${skill.certificateUrl}" target="_blank" class="skill-tag skill-tag-link">
                    ${skill.name}
                </a>`;
        } else {
            // Otherwise, create a normal, non-clickable tag
            skillsGrid.innerHTML += `<span class="skill-tag">${skill.name}</span>`;
        }
    });

    const educationContainer = document.getElementById('education-container');
    educationContainer.innerHTML = '<h3>Education</h3>';
    portfolioData.education.forEach(edu => {
        educationContainer.innerHTML += `<h4>${edu.degree} <small>(${edu.dates})</small></h4><p><em>${edu.institution}</em></p><p>${edu.description}</p>`;
    });

    const certificationsContainer = document.getElementById('certifications-container');
    certificationsContainer.innerHTML = '<h4>Certifications</h4>';
    let certsHTML = portfolioData.certifications.map(cert => `<li>${cert.name} - <em>${cert.issuerDate}</em></li>`).join('');
    certificationsContainer.innerHTML += `<ul>${certsHTML}</ul>`;

    const projectGrid = document.getElementById('project-grid');
    portfolioData.projects.forEach(project => {
        let liveSiteButton = project.liveLink ? `<a href="${project.liveLink}" class="btn btn-secondary" target="_blank">Live Site</a>` : `<a href="#" class="btn btn-secondary disabled">Live Site (Soon)</a>`;
        let codeSiteButton = project.codeLink ? `<a href="${project.codeLink}" class="btn btn-secondary" target="_blank">View Code</a>` : `<a href="#" class="btn btn-secondary disabled">View Code (Soon)</a>`;
        let collaboratorHTML = '';
        if (project.collaborator && project.GitHub) {
            collaboratorHTML = `<p class="collaborator"><em>Collaboration with: <a href="${project.GitHub}" target="_blank">${project.collaborator}</a></em></p>`;
        }
        projectGrid.innerHTML += `<div class="project-card reveal"><a href="${project.liveLink || project.codeLink || '#'}" target="_blank"><div class="project-image"><img src="${project.imageUrl}" alt="${project.title} screenshot"></div><div class="project-info"><h3>${project.title}</h3><p>${project.description}</p>${collaboratorHTML}<p class="tech-stack"><strong>Technologies:</strong> ${project.tech}</p></div></a><div class="project-links">${liveSiteButton}${codeSiteButton}</div></div>`;
    });

    // *** THIS SECTION IS NOW CORRECTED ***
    // The old lines that tried to find 'contact-email' and 'contact-phone' are gone.
    document.getElementById('footer-github').href = portfolioData.socials.github;
    document.getElementById('footer-linkedin').href = portfolioData.socials.linkedin;
    document.getElementById('footer-copyright').textContent = `© ${new Date().getFullYear()} ${portfolioData.name}. Built with AI and TIME`;


    // --- SMOOTH SCROLLING FUNCTIONALITY ---
    const smoothScrollLinks = document.querySelectorAll('nav a, .hero-buttons a, .scroll-down, .back-to-top-btn');
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // --- INTERSECTION OBSERVER FOR SCROLL ANIMATIONS ---
    const revealElements = document.querySelectorAll(".reveal");
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    revealElements.forEach(el => { revealObserver.observe(el); });

    // --- AJAX Contact Form Submission ---
    const form = document.getElementById('contact-form');
    async function handleSubmit(event) {
        event.preventDefault();
        const status = document.getElementById('form-status');
        const data = new FormData(event.target);
        try {
            const response = await fetch(event.target.action, {
                method: form.method,
                body: data,
                headers: { 'Accept': 'application/json' }
            });
            if (response.ok) {
                status.innerHTML = "Thanks for your submission!";
                status.className = 'success';
                form.reset();
            } else {
                const responseData = await response.json();
                status.innerHTML = responseData.errors ? responseData.errors.map(e => e.message).join(", ") : "Oops! There was a problem.";
                status.className = 'error';
            }
        } catch (error) {
            status.innerHTML = "Oops! There was a problem submitting your form.";
            status.className = 'error';
        }
    }
    form.addEventListener("submit", handleSubmit);

    // --- Back to Top Button Logic ---
    const backToTopButton = document.querySelector(".back-to-top-btn");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            backToTopButton.classList.add("active");
        } else {
            backToTopButton.classList.remove("active");
        }
    });

    // --- OVERHAULED: Dark Mode Toggle Logic ---
    const themeToggleButton = document.getElementById('theme-toggle-btn');
    const docElement = document.documentElement;

    function setTheme(theme) {
        docElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        setTheme(currentTheme);
    } else {
        // Default to light theme if no preference is saved
        setTheme('light');
    }

    themeToggleButton.addEventListener('click', () => {
        const activeTheme = docElement.getAttribute('data-theme');
        if (activeTheme === 'dark') {
            setTheme('light');
        } else {
            setTheme('dark');
        }
    });
});