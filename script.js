// script.js (Final, Complete Version with Dynamic Script Loading)

document.addEventListener('DOMContentLoaded', function() {

    // --- 1. DYNAMIC SCRIPT LOADER ---
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) {
                resolve(); return;
            }
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Script load error for ${src}`));
            document.head.appendChild(script);
        });
    }

    // --- 2. CORE SETUP & THEME MANAGEMENT ---
    let vantaInstances = {};
    const docElement = document.documentElement;

    async function initVanta(theme) {
        for (const key in vantaInstances) { if (vantaInstances[key]) vantaInstances[key].destroy(); }
        try {
            await loadScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js");
            const isDark = theme === 'dark';

            // --- NEW: NET effect for the Hero section ---
            try {
                // determine hero colors with sensible fallbacks
                let heroColor;
                if (isDark) heroColor = portfolioData?.vantaConfigs?.hero?.color ?? 0x3498db;
                else heroColor = portfolioData?.vantaConfigs?.hero?.lightColor ?? (function() {
                    const cssAccent = getComputedStyle(docElement).getPropertyValue('--accent-color')?.trim();
                    return (cssAccent && cssAccent.startsWith('#')) ? parseInt(cssAccent.replace('#',''), 16) : 0x072761;
                })();
                const heroBgColor = isDark ? 0x121212 : 0x072761;

                if (document.querySelector('#vanta-hero-bg')) {
                    await loadScript("https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js");
                    if (typeof VANTA !== 'undefined' && typeof VANTA.NET === 'function') {
                        vantaInstances.hero = VANTA.NET({
                            el: "#vanta-hero-bg",
                            ...(portfolioData.vantaConfigs?.hero || {}),
                            backgroundColor: heroBgColor,
                            color: heroColor
                        });
                    } else {
                        console.warn('VANTA.NET not available after script load.');
                    }
                }
            } catch (err) {
                console.warn("VANTA.NET init failed:", err);
            }

            // --- NEW: Birds effect for the Projects section ---
            if (document.querySelector('#projects')) {
                try {
                    await loadScript("https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.birds.min.js");
                    const birdsCfg = portfolioData.vantaConfigs?.birds || {};
                    // Updated default bird color as requested
                    const birdsColor = birdsCfg.color ?? 0x2028ac;
                    const birdsQuantity = birdsCfg.quantity ?? 3;
                    const birdsBackground = birdsCfg.backgroundColor ?? (isDark ? 0x111827 : 0x072761);

                    // attach to the whole projects section so birds fly over the grid area
                    vantaInstances.birds = VANTA.BIRDS({
                        el: "#projects",
                        backgroundColor: birdsBackground,
                        color: birdsColor,
                        quantity: birdsQuantity,
                        // sensible defaults for motion
                        size: birdsCfg.size ?? 1.2,
                        speed: birdsCfg.speed ?? 1.0,
                        separation: birdsCfg.separation ?? 45
                    });
                } catch (err) {
                    console.warn("Vanta BIRDS init failed:", err);
                }
            }
            
            // Replace WAVES with DOTS for contact background
            if (document.querySelector('#vanta-contact-bg')) {
                try {
                    await loadScript("https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.dots.min.js");
                    const contactCfg = portfolioData.vantaConfigs?.contact || {};
                    const contactColor = contactCfg.color ?? (isDark ? 0xffffff : 0x9ad1ff);
                    const contactBg = contactCfg.backgroundColor ?? (isDark ? 0x071022 : 0x0b2f6b);

                    if (typeof VANTA !== 'undefined' && typeof VANTA.DOTS === 'function') {
                        vantaInstances.contact = VANTA.DOTS({
                            el: "#vanta-contact-bg",
                            ...(contactCfg || {}),
                            backgroundColor: contactBg,
                            color: contactColor,
                            spacing: contactCfg.spacing ?? 20,
                            showLines: contactCfg.showLines ?? true
                        });
                    } else {
                        console.warn('VANTA.DOTS not available after script load.');
                    }
                } catch (err) {
                    console.warn("VANTA.DOTS init failed:", err);
                }
            }

            // --- NEW: Globe effect for the Collaborate section ---
            if (document.querySelector('#vanta-collab-bg')) {
                try {
                    await loadScript("https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.globe.min.js");
                    const globeCfg = portfolioData.vantaConfigs?.globe || {};
                    const globeColor = globeCfg.color ?? (isDark ? 0xffffff : 0x9ad1ff);
                    const globeBg = globeCfg.backgroundColor ?? (isDark ? 0x071022 : 0x072761);

                    if (typeof VANTA !== 'undefined' && typeof VANTA.GLOBE === 'function') {
                        vantaInstances.globe = VANTA.GLOBE({
                            el: "#vanta-collab-bg",
                            backgroundColor: globeBg,
                            color: globeColor,
                            size: globeCfg.size ?? 1.0,
                            scale: globeCfg.scale ?? 1.0
                        });
                    } else {
                        console.warn('VANTA.GLOBE not available after script load.');
                    }
                } catch (err) {
                    console.warn("VANTA.GLOBE init failed:", err);
                }
            }

        } catch (error) { console.error("Vanta initialization failed:", error); }
    }

    const themeToggleCheckbox = document.getElementById('theme-toggle-checkbox');
    function setTheme(theme) {
        docElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        themeToggleCheckbox.checked = theme === 'dark';
        initVanta(theme);
    }
    const currentTheme = localStorage.getItem('theme') || 'light';
    setTheme(currentTheme);
    themeToggleCheckbox.addEventListener('change', () => setTheme(themeToggleCheckbox.checked ? 'dark' : 'light'));

    // --- 3. DYNAMIC CONTENT BUILDERS ---
    const heroName = document.getElementById('hero-name');
    if (heroName) {
        document.getElementById('page-title').textContent = `${portfolioData.name} | Portfolio`;
        document.querySelector('.logo a').textContent = portfolioData.name;
        heroName.textContent = portfolioData.name;
        document.getElementById('hero-title').textContent = portfolioData.title;
        document.getElementById('hero-github').href = portfolioData.socials.github;
        document.getElementById('hero-linkedin').href = portfolioData.socials.linkedin;
    }   
    const aboutDesc = document.getElementById('about-description');
    if (aboutDesc) {
        document.getElementById('about-image').src = portfolioData.about.imageUrl;
        document.getElementById('about-image').alt = `${portfolioData.name} Headshot`;
        document.getElementById('about-name').textContent = `Hi! I'm ${portfolioData.name}.`;
        document.getElementById('about-location').textContent = portfolioData.location;
        aboutDesc.innerHTML = '';
        portfolioData.about.description.forEach(p => { aboutDesc.innerHTML += `<p>${p}</p>`; });
    }
    const expContainer = document.getElementById('experience-container');
    if (expContainer) {
        portfolioData.experience.forEach((job, index) => {
            let respHTML = job.responsibilities.map(r => `<li>${r}</li>`).join('');
            expContainer.innerHTML += `<div class="experience-item"><div class="experience-number">${index + 1}</div><div class="experience-details"><h3>${job.title}</h3><p class="company">${job.company} <span class="details">(${job.details})</span></p><ul>${respHTML}</ul></div></div>`;
        });
    }
    const skillsGrid = document.getElementById('skills-grid');
    if (skillsGrid) {
        portfolioData.skills.forEach(skill => { skillsGrid.innerHTML += skill.certificateUrl ? `<a href="${skill.certificateUrl}" target="_blank" class="skill-tag skill-tag-link">${skill.name}</a>` : `<span class="skill-tag">${skill.name}</span>`; });
        const eduContainer = document.getElementById('education-container');
        eduContainer.innerHTML = '<h3>Education</h3>';
        portfolioData.education.forEach(edu => { eduContainer.innerHTML += `<h4>${edu.degree} <small>(${edu.dates})</small></h4><p><em>${edu.institution}</em></p><p>${edu.description}</p>`; });
        const certContainer = document.getElementById('certifications-container');
        certContainer.innerHTML = '<h4>Certifications</h4>';
        let certsHTML = portfolioData.certifications.map(cert => `<li>${cert.name} - <em>${cert.issuerDate}</em></li>`).join('');
        certContainer.innerHTML += `<ul>${certsHTML}</ul>`;
    }
    // --- Projects Grid Builder ---
    const projectGrid = document.getElementById('project-grid');
    if (projectGrid) {
        portfolioData.projects.forEach(project => {
            const liveSiteButton = project.liveLink ? `<a href="${project.liveLink}" class="btn btn-secondary" target="_blank">Live Site</a>` : `<a href="#" class="btn btn-secondary disabled">Live Site (Soon)</a>`;
            const codeSiteButton = project.codeLink ? `<a href="${project.codeLink}" class="btn btn-primary" target="_blank">View Code</a>` : `<a href="#" class="btn btn-primary disabled">View Code (Soon)</a>`;
            
            let collaboratorHTML = '';
            if (project.collaborator && project.GitHub) {
                collaboratorHTML = `<p class="collaborator"><em>Collaboration with: <a href="${project.GitHub}" target="_blank">${project.collaborator}</a></em></p>`;
            }

            const projectCardHTML = `
                <div class="project-card reveal">
                    <div class="project-card-header"></div>
                    <div class="project-card-image">
                        <img src="${project.imageUrl}" alt="${project.title} screenshot">
                    </div>
                    <div class="project-card-body">
                        <h3>${project.title}</h3>
                        <p class="client">${project.client}</p>
                        <p class="description">${project.description}</p>
                        ${collaboratorHTML}
                        <p class="tech-stack">${project.tech}</p>
                        <div class="project-links">
                            ${liveSiteButton}
                            ${codeSiteButton}
                        </div>
                    </div>
                </div>
            `;
            projectGrid.innerHTML += projectCardHTML;
        });
    }
    // --- Process Steps & Pricing Cards Builders ---
    const processContainer = document.getElementById('process-steps-container');
    if (processContainer) { portfolioData.myProcess.forEach(step => { processContainer.innerHTML += `<div class="step-card"><div class="step-number">${step.number}</div><h3>${step.title}</h3><p>${step.description}</p></div>`; }); }
    const pricingGrid = document.getElementById('pricing-grid');
    if (pricingGrid) { portfolioData.services.forEach(service => { pricingGrid.innerHTML += `<div class="pricing-card"><div class="pricing-card-header"></div><div class="pricing-card-body"><h3>"${service.name}"</h3><div class="price-display">price: ${service.priceUSD}$ <span>/ ${service.priceNGN}₦</span></div><p class="service-description">${service.description}</p><a href="#contact" class="btn btn-primary">initiate()</a></div></div>`; }); }

    // <-- STICKY-STACK PROJECT SCROLL block removed -->

    // --- 4. GENERAL UTILITIES ---
    const hamburger = document.querySelector(".hamburger");
    if (hamburger) { const navLinks = document.querySelector(".nav-links"); hamburger.addEventListener("click", () => { hamburger.classList.toggle("active"); navLinks.classList.toggle("active"); document.body.classList.toggle("mobile-menu-active"); }); }
    document.querySelectorAll('a[href^="#"]').forEach(anchor => { anchor.addEventListener('click', function (e) { e.preventDefault(); document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' }); }); });
    const form = document.getElementById('contact-form');
    if (form) {
        // --- show/hide helpers for the new fields ---
        const projectTypeSelect = document.getElementById('project-type');
        const projectTypeOther = document.getElementById('project-type-other');
        const planSelect = document.getElementById('plan-selection');
        const customPlanDetails = document.getElementById('custom-plan-details');
        const preferredStack = document.getElementById('preferred-stack');
        const preferredStackOther = document.getElementById('preferred-stack-other');

        function updateProjectType() {
            if (!projectTypeSelect || !projectTypeOther) return;
            const isOther = projectTypeSelect.value === 'Other';
            projectTypeOther.style.display = isOther ? 'block' : 'none';
            projectTypeOther.required = isOther;
        }

        function updatePlanSelection() {
            if (!planSelect || !customPlanDetails) return;
            const isCustom = planSelect.value === 'Custom';
            customPlanDetails.style.display = isCustom ? 'block' : 'none';
            customPlanDetails.required = isCustom;
        }

        function updatePreferredStack() {
            if (!preferredStack || !preferredStackOther) return;
            const selected = Array.from(preferredStack.selectedOptions).map(o => o.value);
            const needsOther = selected.includes('Other');
            preferredStackOther.style.display = needsOther ? 'block' : 'none';
            preferredStackOther.required = needsOther;
        }

        // initialize visibility on load
        updateProjectType();
        updatePlanSelection();
        updatePreferredStack();

        // wire change handlers
        if (projectTypeSelect) projectTypeSelect.addEventListener('change', updateProjectType);
        if (planSelect) planSelect.addEventListener('change', updatePlanSelection);
        if (preferredStack) preferredStack.addEventListener('change', updatePreferredStack);

        // existing submit handler (keeps your Formspree logic)
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const status = document.getElementById('form-status');
            const data = new FormData(event.target);

            // Ensure multi-select preferredStack values are present (FormData includes them by default).
            // If user selected "Other" and provided free text, it's present due to preferredStackOther name.
            try {
                const response = await fetch(event.target.action, { method: 'POST', body: data, headers: { 'Accept': 'application/json' } });
                if (response.ok) {
                    status.textContent = "Thanks — your message was sent successfully!";
                    status.className = 'success';
                    status.style.display = 'block';
                    form.reset();
                    // reset visibility after reset
                    updateProjectType();
                    updatePlanSelection();
                    updatePreferredStack();
                    try { showCollabToast('Message sent'); } catch (e) {}
                } else {
                    const json = await response.json().catch(() => null);
                    status.textContent = json?.errors ? json.errors.map(e => e.message).join(', ') : "Oops! There was a problem.";
                    status.className = 'error';
                    status.style.display = 'block';
                    try { showCollabToast('Send failed'); } catch (e) {}
                }
            } catch (err) {
                status.textContent = "Network error: message not sent.";
                status.className = 'error';
                status.style.display = 'block';
                try { showCollabToast('Network error'); } catch (e) {}
            }
        });
    }
    const footer = document.getElementById('footer');
    if (footer) { footer.innerHTML = `<p>Here's To Us Working Together</p><p>&copy; ${new Date().getFullYear()} David Idowu. All rights reserved.</p>`; }
    const backToTopButton = document.querySelector(".back-to-top-btn");
    if (backToTopButton) { const scrollContainer = document.querySelector('.scroll-container'); scrollContainer.addEventListener("scroll", () => { if (scrollContainer.scrollTop > 300) { backToTopButton.classList.add("active"); } else { backToTopButton.classList.remove("active"); } }); }
    // Intersection Observer for Fade-In Animations (restored)
    const revealElements = document.querySelectorAll(".reveal");
    if (revealElements.length) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        revealElements.forEach(el => revealObserver.observe(el));
    }

    // small helper to copy text and show toast (applies to cmd-btn and copy-btn)
    function showCollabToast(msg = "Copied") {
        const t = document.getElementById('collab-toast');
        if (!t) return;
        t.textContent = msg;
        t.classList.add('show');
        clearTimeout(t._hide);
        t._hide = setTimeout(() => t.classList.remove('show'), 2500);
    }

    document.body.addEventListener('click', (e) => {
        const el = e.target;
        if (el.matches('.cmd-btn')) {
            const txt = el.dataset.copy || el.textContent || '';
            navigator.clipboard?.writeText(txt.trim()).then(() => showCollabToast('Command copied'), () => showCollabToast('Copy failed'));
        }
        if (el.matches('#copy-btn')) {
            const acc = document.getElementById('account-number')?.textContent || '';
            navigator.clipboard?.writeText(acc.trim()).then(() => showCollabToast('Account copied'), () => showCollabToast('Copy failed'));
        }
    });

    // --- 4. NAV SCROLL-SPY (show "< Name />" and underline active link) ---
    (function initScrollSpy() {
        const navLinks = document.querySelectorAll('.nav-links a');
        const sections = Array.from(document.querySelectorAll('section[id]'));

        if (!navLinks.length || !sections.length) return;

        // store original label
        navLinks.forEach(a => {
            if (!a.dataset.orig) a.dataset.orig = a.textContent.trim();
        });

        function setActiveLinkFor(sectionId) {
            navLinks.forEach(link => {
                const href = (link.getAttribute('href') || '').replace('#', '');
                if (href === sectionId) {
                    link.classList.add('active');
                    link.textContent = `< ${link.dataset.orig} />`;
                } else {
                    link.classList.remove('active');
                    link.textContent = link.dataset.orig;
                }
            });
        }

        // Use the scrollable container as the observer root so visibility is measured correctly
        const rootEl = document.querySelector('.scroll-container') || null;

        const spyObserver = new IntersectionObserver((entries) => {
            // pick the intersecting entry with largest intersectionRatio
            let visibleEntry = null;
            entries.forEach(e => {
                if (e.isIntersecting) {
                    if (!visibleEntry || e.intersectionRatio > visibleEntry.intersectionRatio) visibleEntry = e;
                }
            });
            if (visibleEntry && visibleEntry.target && visibleEntry.target.id) {
                setActiveLinkFor(visibleEntry.target.id);
            }
        }, {
            root: rootEl,
            threshold: 0.5,
            rootMargin: '0px 0px -10% 0px'
        });

        sections.forEach(s => spyObserver.observe(s));

        // clicking nav still smooth-scrolls and forces immediate active state
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                const id = (link.getAttribute('href') || '').replace('#', '');
                setActiveLinkFor(id);
            });
        });
    })();
});