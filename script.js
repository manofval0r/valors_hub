// script.js (Complete Code with Full Content Expansion)

document.addEventListener('DOMContentLoaded', function() {

    // --- HAMBURGER MENU FUNCTIONALITY ---
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");
    const allLinks = document.querySelectorAll(".nav-links a");
    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navLinks.classList.toggle("active");
    });
    allLinks.forEach(link => {
        link.addEventListener("click", () => {
            hamburger.classList.remove("active");
            navLinks.classList.remove("active");
        });
    });


    // --- POPULATE ALL DATA FROM CONFIG.JS ---
    
    // Header & Hero
    document.getElementById('page-title').textContent = `${portfolioData.name} | ${portfolioData.title}`;
    document.querySelector('.logo a').textContent = portfolioData.name;
    document.getElementById('hero-name').textContent = portfolioData.name;
    document.getElementById('hero-title').textContent = portfolioData.title;
    document.getElementById('hero-github').href = portfolioData.socials.github;
    document.getElementById('hero-linkedin').href = portfolioData.socials.linkedin;
    
    // About
    document.getElementById('about-image').src = portfolioData.about.imageUrl;
    document.getElementById('about-image').alt = `${portfolioData.name} Headshot`;
    document.getElementById('about-name').textContent = `Hi! I'm ${portfolioData.name}.`;
    document.getElementById('about-location').textContent = portfolioData.location;
    const aboutDescription = document.getElementById('about-description');
    aboutDescription.innerHTML = '';
    portfolioData.about.description.forEach(p => { aboutDescription.innerHTML += `<p>${p}</p>`; });

    // --- NEW: Experience Builder ---
    const experienceContainer = document.getElementById('experience-container');
    portfolioData.experience.forEach((job, index) => {
        let responsibilitiesHTML = job.responsibilities.map(r => `<li>${r}</li>`).join('');
        experienceContainer.innerHTML += `
            <div class="experience-item">
                <div class="experience-number">${index + 1}</div>
                <div class="experience-details">
                    <h3>${job.title}</h3>
                    <p class="company">${job.company} <span class="details">(${job.details})</span></p>
                    <ul>${responsibilitiesHTML}</ul>
                </div>
            </div>`;
    });

    // --- NEW: Skills Builder ---
    const skillsGrid = document.getElementById('skills-grid');
    portfolioData.skills.forEach(skill => {
        skillsGrid.innerHTML += `<span class="skill-tag">${skill}</span>`;
    });

    // --- NEW: Education Builder ---
    const educationContainer = document.getElementById('education-container');
    educationContainer.innerHTML = '<h3>Education</h3>';
    portfolioData.education.forEach(edu => {
        educationContainer.innerHTML += `
            <h4>${edu.degree} <small>(${edu.dates})</small></h4>
            <p><em>${edu.institution}</em></p>
            <p>${edu.description}</p>`;
    });

    // --- NEW: Certifications Builder ---
    const certificationsContainer = document.getElementById('certifications-container');
    certificationsContainer.innerHTML = '<h4>Certifications</h4>';
    let certsHTML = portfolioData.certifications.map(cert => `<li>${cert.name} - <em>${cert.issuerDate}</em></li>`).join('');
    certificationsContainer.innerHTML += `<ul>${certsHTML}</ul>`;


    // Projects
    const projectGrid = document.getElementById('project-grid');
    portfolioData.projects.forEach(project => {
        let liveSiteButton = project.liveLink ? `<a href="${project.liveLink}" class="btn btn-secondary" target="_blank">Live Site</a>` : `<a href="#" class="btn btn-secondary disabled" target="_blank">Live Site (Soon)</a>`;
        let codeSiteButton = project.codeLink ? `<a href="${project.codeLink}" class="btn btn-secondary" target="_blank">View Code</a>` : `<a href="#" class="btn btn-secondary disabled" target="_blank">View Code (Soon)</a>`;
        projectGrid.innerHTML += `
            <div class="project-card reveal">
                <a href="${project.liveLink || project.codeLink || '#'}" target="_blank">
                    <div class="project-image"><img src="${project.imageUrl}" alt="${project.title} screenshot"></div>
                    <div class="project-info">
                        <h3>${project.title}</h3>
                        <p>${project.description}</p>
                        <p class="tech-stack"><strong>Technologies:</strong> ${project.tech}</p>
                    </div>
                </a>
                <div class="project-links">${liveSiteButton}${codeSiteButton}</div>
            </div>`;
    });

    // Contact & Footer
    document.getElementById('contact-email').href = `mailto:${portfolioData.contact.email}`;
    document.getElementById('contact-email').textContent = portfolioData.contact.email;
    document.getElementById('contact-phone').href = `tel:${portfolioData.contact.phone}`;
    document.getElementById('contact-phone').textContent = portfolioData.contact.phone;
    document.getElementById('footer-github').href = portfolioData.socials.github;
    document.getElementById('footer-linkedin').href = portfolioData.socials.linkedin;
    document.getElementById('footer-copyright').textContent = `© ${new Date().getFullYear()} ${portfolioData.name}. Built with code.`;


    // --- SMOOTH SCROLLING FUNCTIONALITY ---
    const smoothScrollLinks = document.querySelectorAll('nav a, .hero-buttons a, .scroll-down');
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
});