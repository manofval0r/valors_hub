document.addEventListener('DOMContentLoaded', function () {

    // --- 1. TYPING ANIMATION ---
    const heroHighlight = document.querySelector('.hero-title .highlight');
    if (heroHighlight) {
        const textToType = "digital experiences";
        heroHighlight.textContent = "";
        let i = 0;

        function typeWriter() {
            if (i < textToType.length) {
                heroHighlight.textContent += textToType.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                // Optional: blinking cursor effect after typing
                heroHighlight.style.borderRight = "3px solid var(--primary-accent)";
                setInterval(() => {
                    heroHighlight.style.borderColor =
                        heroHighlight.style.borderColor === "transparent" ? "var(--primary-accent)" : "transparent";
                }, 500);
            }
        }

        // Start after a slight delay
        setTimeout(typeWriter, 500);
    }

    // --- 2. DYNAMIC CONTENT BUILDERS ---
    function techToUrl(name) {
        const map = (window.portfolioData && portfolioData.techLinks) ? portfolioData.techLinks : {};
        if (map[name]) return map[name];
        const key = Object.keys(map).find(k => k.toLowerCase() === (name || '').toLowerCase());
        if (key) return map[key];
        return `https://www.google.com/search?q=${encodeURIComponent(name)}`;
    }

    function buildTechTags(techString) {
        if (!techString) return '';
        return techString.split(/[,|\/]/).map(t => t.trim()).filter(Boolean)
            .map(t => `<span class="tech-tag">${t}</span>`)
            .join(' ');
    }

    // Prefer the local portfolioData symbol, fall back to window.portfolioData
    const pd = (typeof portfolioData !== 'undefined') ? portfolioData : (window.portfolioData || null);

    if (pd) {
        // HERO
        const heroName = document.querySelector('.hero-subtitle span'); // "I'm David Idowu"
        if (heroName) heroName.textContent = pd.name || 'David Idowu';

        const heroGithub = document.getElementById('hero-github');
        if (heroGithub) heroGithub.href = pd.socials?.github || '#';

        const heroLinkedin = document.getElementById('hero-linkedin');
        if (heroLinkedin) heroLinkedin.href = pd.socials?.linkedin || '#';

        // ABOUT
        const aboutDesc = document.getElementById('about-description');
        if (aboutDesc && pd.about) {
            const img = document.getElementById('about-image');
            if (img && pd.about.imageUrl) {
                img.src = pd.about.imageUrl;
                img.alt = `${pd.name} Headshot`;
            }
            aboutDesc.innerHTML = '';
            (pd.about.description || []).forEach(p => aboutDesc.innerHTML += `<p>${p}</p>`);
        }

        // PROJECTS
        const projectGrid = document.getElementById('project-grid');
        if (projectGrid && Array.isArray(pd.projects)) {
            projectGrid.innerHTML = '';
            pd.projects.forEach(project => {
                const liveBtn = project.liveLink ? `<a href="${project.liveLink}" class="link-btn" target="_blank"><span class="material-icons-outlined">open_in_new</span> Live Site</a>` : '';
                const codeBtn = project.codeLink ? `<a href="${project.codeLink}" class="link-btn" target="_blank"><span class="material-icons-outlined">code</span> Code</a>` : '';
                const techHTML = project.tech ? `<div class="project-tags">${buildTechTags(project.tech)}</div>` : '';

                projectGrid.innerHTML += `
                    <div class="project-card">
                        <div class="project-image">
                            <img src="${project.imageUrl || 'placeholder.jpg'}" alt="${project.title}">
                        </div>
                        <div class="project-content">
                            <h3 class="project-title">${project.title}</h3>
                            <p class="project-desc">${project.description || ''}</p>
                            ${techHTML}
                            <div class="project-links">
                                ${liveBtn}
                                ${codeBtn}
                            </div>
                        </div>
                    </div>`;
            });
        }

        // SERVICES
        const pricingGrid = document.getElementById('pricing-grid');
        if (pricingGrid && Array.isArray(pd.services)) {
            pricingGrid.innerHTML = '';
            pd.services.forEach(service => {
                pricingGrid.innerHTML += `
                    <div class="service-card">
                        <div class="service-header">
                            <h3 class="service-title">${service.name}</h3>
                            <div class="service-price">$${service.priceUSD} <span>/ ₦${service.priceNGN}</span></div>
                        </div>
                        <p class="service-desc">${service.description}</p>
                        <a href="#contact" class="btn btn-secondary" style="width: 100%;">Get Started</a>
                    </div>`;
            });
        }
    }

    // --- 3. GENERAL UTILITIES ---

    // Hamburger Menu
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    if (hamburger && navLinks) {
        hamburger.addEventListener("click", () => {
            navLinks.classList.toggle("active");
            hamburger.classList.toggle("active"); // Optional: animate hamburger
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove("active");
                hamburger.classList.remove("active");
            });
        });
    }

    // Smooth Scroll for Anchors
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#' || href.startsWith('mailto:')) return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Scroll Spy (Active Nav Link)
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href').includes(current)) {
                a.classList.add('active');
            }
        });
    });

    // Form Handling (Formspree)
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const status = document.getElementById('form-status');
            const data = new FormData(form);

            if (status) status.textContent = "Sending...";

            try {
                const res = await fetch(form.action, {
                    method: form.method,
                    body: data,
                    headers: { 'Accept': 'application/json' }
                });

                if (res.ok) {
                    if (status) {
                        status.textContent = "Message sent successfully!";
                        status.style.color = "var(--primary-accent)";
                    }
                    form.reset();
                } else {
                    if (status) {
                        status.textContent = "Oops! There was a problem sending your message.";
                        status.style.color = "red";
                    }
                }
            } catch (error) {
                if (status) {
                    status.textContent = "Network error. Please try again.";
                    status.style.color = "red";
                }
            }
        });
    }

    // Footer Year
    const footer = document.querySelector('footer p');
    if (footer && pd) {
        footer.innerHTML = `&copy; ${new Date().getFullYear()} ${pd.name}. All rights reserved.`;
    }
});