// This function runs when the entire page is loaded.
document.addEventListener('DOMContentLoaded', function() {

    // --- HAMBURGER MENU FUNCTIONALITY ---
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");
    const allLinks = document.querySelectorAll(".nav-links a");

    // Toggle menu on hamburger click
    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navLinks.classList.toggle("active");
    });

    // Close menu when a link is clicked
    allLinks.forEach(link => {
        link.addEventListener("click", () => {
            hamburger.classList.remove("active");
            navLinks.classList.remove("active");
        });
    });


    // --- POPULATE DATA FROM CONFIG.JS ---
    
    // Page Title
    document.getElementById('page-title').textContent = `${portfolioData.name} | ${portfolioData.title}`;

    // Hero Section
    document.getElementById('hero-name').textContent = portfolioData.name;
    document.getElementById('hero-title').textContent = portfolioData.title;
    document.getElementById('hero-github').href = portfolioData.socials.github;
    document.getElementById('hero-linkedin').href = portfolioData.socials.linkedin;

    // About Section
    document.getElementById('about-image').src = portfolioData.about.imageUrl;
    document.getElementById('about-image').alt = `${portfolioData.name} Headshot`;
    document.getElementById('about-name').textContent = `Hi! I'm ${portfolioData.name}.`;
    document.getElementById('about-location').textContent = portfolioData.location;
    const aboutDescription = document.getElementById('about-description');
    portfolioData.about.description.forEach(paragraph => {
        aboutDescription.innerHTML += `<p>${paragraph}</p>`;
    });

    // Projects Section
    const projectGrid = document.getElementById('project-grid');
    portfolioData.projects.forEach(project => {
        let liveSiteButton = project.liveLink 
            ? `<a href="${project.liveLink}" class="btn btn-secondary" target="_blank">Live Site</a>`
            : `<a href="#" class="btn btn-secondary disabled" target="_blank">Live Site (Soon)</a>`;

        const projectCard = `
            <div class="project-card">
                <h3>${project.title}</h3>
                <p class="project-client">${project.client}</p>
                <p>${project.description}</p>
                <p class="tech-stack"><strong>Technologies:</strong> ${project.tech}</p>
                <div class="project-links">
                    ${liveSiteButton}
                    <a href="${project.codeLink}" class="btn btn-secondary" target="_blank">View Code</a>
                </div>
            </div>`;
        projectGrid.innerHTML += projectCard;
    });

    // Contact Section
    document.getElementById('contact-email').href = `mailto:${portfolioData.contact.email}`;
    document.getElementById('contact-email').textContent = portfolioData.contact.email;
    document.getElementById('contact-phone').href = `tel:${portfolioData.contact.phone}`;
    document.getElementById('contact-phone').textContent = portfolioData.contact.phone;
    
    // Footer Socials & Copyright
    document.getElementById('footer-github').href = portfolioData.socials.github;
    document.getElementById('footer-linkedin').href = portfolioData.socials.linkedin;
    document.getElementById('footer-copyright').textContent = `© ${new Date().getFullYear()} ${portfolioData.name}. Built with code.`;


    // --- SMOOTH SCROLLING FUNCTIONALITY ---
    const smoothScrollLinks = document.querySelectorAll('nav a, .hero-buttons a');
    for (const link of smoothScrollLinks) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
});