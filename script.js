// script.js (Final, Complete, and Synchronized Code)

document.addEventListener('DOMContentLoaded', function() {
    // --- Initialize Global Variables ---
    let pJS_instance = null;

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

    // --- ACCESSIBLE THEME TOGGLE & PARTICLES LOGIC ---
    const themeToggleCheckbox = document.getElementById('theme-toggle-checkbox');
    const docElement = document.documentElement;

    function updateParticlesColor(theme) {
        if (!pJS_instance) return;
        // Use the CSS variables for perfect color consistency
        const color = theme === 'dark' ? getComputedStyle(docElement).getPropertyValue('--accent-color').trim() : getComputedStyle(docElement).getPropertyValue('--text-color').trim();
        pJS_instance.particles.color.value = color;
        pJS_instance.particles.line_linked.color = color;
        pJS_instance.fn.particlesRefresh();
    }

    function setTheme(theme) {
        docElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        themeToggleCheckbox.checked = theme === 'dark';
        updateParticlesColor(theme);
    }

    themeToggleCheckbox.addEventListener('change', () => {
        const newTheme = themeToggleCheckbox.checked ? 'dark' : 'light';
        setTheme(newTheme);
    });

    // --- INITIALIZE PARTICLES.JS ---
    function initializeParticles() {
        if (typeof particlesJS === 'undefined') {
            console.error('particles.js script not loaded');
            return;
        }
        particlesJS("particles-js", {
            "particles": {
                "number": { "value": 60, "density": { "enable": true, "value_area": 900 } },
                "color": { "value": "#2c3e50" },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.6, "random": true },
                "size": { "value": 4, "random": true },
                "line_linked": { "enable": true, "distance": 150, "color": "#2c3e50", "opacity": 0.35, "width": 1 },
                "move": { "enable": true, "speed": 2, "direction": "none", "out_mode": "out" }
            },
            "interactivity": {
                "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": true, "mode": "push" } },
                "modes": { "grab": { "distance": 140, "line_linked": { "opacity": 1 } }, "push": { "particles_nb": 4 } }
            },
            "retina_detect": true
        });
        pJS_instance = window.pJSDom[0].pJS;
    }

    initializeParticles();
    const currentTheme = localStorage.getItem('theme') || 'light';
    setTheme(currentTheme);

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
    document.getElementById('footer-year').textContent = new Date().getFullYear();

    

    const form = document.getElementById('contact-form');
if (form) {
    // Ensure there's a visible status element
    let status = document.getElementById('form-status');
    if (!status) {
        status = document.createElement('div');
        status.id = 'form-status';
        status.setAttribute('role', 'status');
        form.parentElement.appendChild(status);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.target);

        try {
            const response = await fetch(event.target.action, {
                method: (form.method || 'POST'),
                body: data,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                // Always show success message for successful sends
                status.textContent = "Thanks — your message was sent successfully!";
                status.className = 'success';
                status.style.display = 'block';
                status.style.opacity = '1';
                form.reset();

                // Auto-hide after 6s
                setTimeout(() => {
                    status.style.opacity = '0';
                    setTimeout(() => { status.style.display = 'none'; }, 400);
                }, 6000);
            } else {
                // Try to extract server error details
                let msg = "Oops! There was a problem sending your message.";
                try {
                    const json = await response.json();
                    if (json && json.errors) msg = json.errors.map(e => e.message).join(', ');
                    else if (json && json.message) msg = json.message;
                } catch (_) { /* ignore parse errors */ }

                status.textContent = msg;
                status.className = 'error';
                status.style.display = 'block';
                status.style.opacity = '1';
            }
        } catch (err) {
            status.textContent = "Network error: message not sent.";
            status.className = 'error';
            status.style.display = 'block';
            status.style.opacity = '1';
        }
    }

    form.addEventListener('submit', handleSubmit);
}

    // --- SCROLL-BASED FUNCTIONALITY ---
    const smoothScrollLinks = document.querySelectorAll('nav a, .hero-buttons a, .scroll-down, .back-to-top-btn');
    smoothScrollLinks.forEach(link => { link.addEventListener('click', e => { e.preventDefault(); const target = document.querySelector(link.getAttribute('href')); if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }); });
    
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


    // --- NAVIGATION LINK ACTIVATION ON SCROLL ---
// --- Back to Top Button Logic ---
const backToTopButton = document.querySelector(".back-to-top-btn");
window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        backToTopButton.classList.add("active");
    } else {
        backToTopButton.classList.remove("active");
    }
});



// --- INITIALIZE PARTICLES.JS ---
function initializeParticles() {
    particlesJS("particles-js", {
        "particles": {
            "number": { "value": 60, "density": { "enable": true, "value_area": 900 } },
            "color": { "value": "#254a66" }, // Default to light theme color
            "shape": { "type": "circle" },
            "opacity": { "value": 0.6, "random": true },
            "size": { "value": 4, "random": true },
            "line_linked": { "enable": true, "distance": 150, "color": "#254a66", "opacity": 0.85, "width": 2 },
            "move": { "enable": true, "speed": 2, "direction": "none", "random": false, "straight": false, "out_mode": "out" }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": true, "mode": "push" } },
            "modes": { "grab": { "distance": 140, "line_linked": { "opacity": 0.35 } }, "push": { "particles_nb": 4 } }
        },
        "retina_detect": true
    });
    // Store the instance so we can control it later
    pJS_instance = window.pJSDom[0].pJS;
}

// Initialize everything on page load
initializeParticles();

// --- NAV ACTIVE LINK INDICATOR ---
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-links a');

function activateNavLink() {
    let scrollY = window.pageYOffset;
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 80; // adjust for nav height
        const sectionHeight = section.offsetHeight;
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            navLinksAll.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${section.id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', activateNavLink);
activateNavLink(); // Run on load


    function handleScroll() {
        if (window.scrollY > 300) { backToTopButton.classList.add("active"); } 
        else { backToTopButton.classList.remove("active"); }
        
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                currentSectionId = section.getAttribute('id');
            }
        });
        navLinksAll.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call to set active link on page load
});