// script.js (Final, Complete Version with Dynamic Script Loading)

document.addEventListener('DOMContentLoaded', function () {

    /* VANTA IMPLEMENTATION - loadScript, vantaInstances and initVanta */
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
            const s = document.createElement('script');
            s.src = src;
            s.async = true;
            s.onload = () => resolve();
            s.onerror = () => reject(new Error(`Script load error for ${src}`));
            document.head.appendChild(s);
        });
    }

    let vantaInstances = {};
    let vantaInitPromise = null;
    const docElement = document.documentElement;

    async function initVanta(theme) {
        // serialize concurrent inits
        if (vantaInitPromise) {
            try { await vantaInitPromise; } catch (_) { /* ignore previous failure */ }
        }

        vantaInitPromise = (async () => {
            console.info('initVanta: starting for theme=', theme);

            // destroy previous instances safely
            try {
                for (const k in vantaInstances) {
                    const inst = vantaInstances[k];
                    if (inst && typeof inst.destroy === 'function') {
                        try { inst.destroy(); } catch (e) { console.warn('Vanta destroy error', e); }
                        vantaInstances[k] = null;
                    }
                }
            } catch (e) { console.warn('Error clearing Vanta instances', e); }

            // allow missing portfolioData (don't abort)
            const pd = window.portfolioData || {};
            const isDark = theme === 'dark';

            // ensure THREE is present (required by Vanta)
            if (typeof THREE === 'undefined') {
                try {
                    console.info('initVanta: loading three.js');
                    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js');
                } catch (e) {
                    console.warn('three.js load error', e);
                }
            }

            // helper: load Vanta module if not available
            async function ensureVantaModule(name, url) {
                if (typeof VANTA === 'undefined' || typeof VANTA[name] !== 'function') {
                    try {
                        console.info(`initVanta: loading ${name} from ${url}`);
                        await loadScript(url);
                    } catch (e) {
                        console.warn(`${name} load error`, e);
                    }
                }
            }

            // instantiate a vanta effect if element exists
            async function tryInit(effectName, selector, url, buildOpts) {
                const el = document.querySelector(selector);
                if (!el) { console.info(`initVanta: ${effectName} - selector ${selector} not present`); return; }
                await ensureVantaModule(effectName, url);
                if (typeof VANTA !== 'undefined' && typeof VANTA[effectName] === 'function') {
                    try {
                        const opts = buildOpts(pd);
                        opts.el = el;
                        vantaInstances[effectName.toLowerCase()] = VANTA[effectName](opts);
                        console.info(`initVanta: ${effectName} initialized on ${selector}`);
                    } catch (err) {
                        console.warn(`initVanta: ${effectName} instantiation error`, err);
                    }
                } else {
                    console.warn(`initVanta: ${effectName} constructor not available after load`);
                }
            }

            // NET (hero)
            await tryInit('NET', '#vanta-hero-bg', 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js', (cfgRoot) => {
                const cfg = (cfgRoot.vantaConfigs && cfgRoot.vantaConfigs.hero) || {};
                const heroBg = isDark ? cfg.backgroundColor ?? 0x121212 : cfg.backgroundColor ?? 0x072761;
                const heroColor = isDark ? cfg.color ?? 0x3498db : (cfg.lightColor ?? cfg.color ?? 0x072761);
                return { ...cfg, backgroundColor: heroBg, color: heroColor };
            });

            // DOTS (contact)
            await tryInit('DOTS', '#vanta-contact-bg', 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.dots.min.js', (cfgRoot) => {
                const cfg = (cfgRoot.vantaConfigs && cfgRoot.vantaConfigs.contact) || {};
                const bg = cfg.backgroundColor ?? (isDark ? 0x071022 : 0x0b2f6b);
                const color = cfg.color ?? (isDark ? 0xffffff : 0x9ad1ff);
                return { ...cfg, backgroundColor: bg, color };
            });

            // GLOBE (collaborate)
            await tryInit('GLOBE', '#vanta-collab-bg', 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.globe.min.js', (cfgRoot) => {
                const cfg = (cfgRoot.vantaConfigs && cfgRoot.vantaConfigs.globe) || {};
                const bg = cfg.backgroundColor ?? (isDark ? 0x071022 : 0x072761);
                const color = cfg.color ?? (isDark ? 0xffffff : 0x9ad1ff);
                return { ...cfg, backgroundColor: bg, color };
            });

            // BIRDS (projects) - optional
            if (pd.vantaConfigs && pd.vantaConfigs.birds && pd.vantaConfigs.birds.enabled) {
                await tryInit('BIRDS', '#projects', 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.birds.min.js', (cfgRoot) => {
                    const cfg = cfgRoot.vantaConfigs.birds || {};
                    const bg = cfg.backgroundColor ?? (isDark ? 0x111827 : 0x072761);
                    const color = cfg.color ?? 0xd1ff;
                    return { ...cfg, backgroundColor: bg, color };
                });
            } else {
                console.info('initVanta: birds effect not enabled in config');
            }

        })();

        try { await vantaInitPromise; } catch (_) { /* errors already logged */ }
        vantaInitPromise = null;
    }

    const themeToggleCheckbox = document.getElementById('theme-toggle-checkbox');
    function setTheme(theme) {
        if (!theme) return;
        docElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        if (themeToggleCheckbox) themeToggleCheckbox.checked = theme === 'dark';
        initVanta(theme);
    }
    const currentTheme = localStorage.getItem('theme') || 'light';
    if (themeToggleCheckbox) themeToggleCheckbox.addEventListener('change', () => setTheme(themeToggleCheckbox.checked ? 'dark' : 'light'));

    // --- 3. DYNAMIC CONTENT BUILDERS & HELPERS ---
    function techToUrl(name) {
        const map = (window.portfolioData && portfolioData.techLinks) ? portfolioData.techLinks : {};
        if (map[name]) return map[name];
        const key = Object.keys(map).find(k => k.toLowerCase() === (name || '').toLowerCase());
        if (key) return map[key];
        return `https://www.google.com/search?q=${encodeURIComponent(name)}`;
    }
    function buildTechLinks(techString) {
        if (!techString) return '';
        return techString.split(/[,|\/]/).map(t => t.trim()).filter(Boolean).map(t => `<a href="${techToUrl(t)}" target="_blank" rel="noopener noreferrer" class="tech-link">${t}</a>`).join(', ');
    }

    // HERO
    const heroName = document.getElementById('hero-name');
    // Prefer the local portfolioData symbol, fall back to window.portfolioData
    const pd = (typeof portfolioData !== 'undefined') ? portfolioData : (window.portfolioData || null);
    if (heroName && pd) {
        document.getElementById('page-title') && (document.getElementById('page-title').textContent = `${pd.name || ''} | Portfolio`);
        document.querySelector('.logo a') && (document.querySelector('.logo a').textContent = pd.name || '');
        heroName.textContent = pd.name || '';
        document.getElementById('hero-title') && (document.getElementById('hero-title').textContent = pd.title || '');
        document.getElementById('hero-github') && (document.getElementById('hero-github').href = pd.socials?.github || '#');
        document.getElementById('hero-linkedin') && (document.getElementById('hero-linkedin').href = pd.socials?.linkedin || '#');
    }

    // ABOUT / EXPERIENCE / SKILLS
    const aboutDesc = document.getElementById('about-description');
    if (aboutDesc && portfolioData.about) {
        const img = document.getElementById('about-image');
        if (img && portfolioData.about.imageUrl) { img.src = portfolioData.about.imageUrl; img.alt = `${portfolioData.name} Headshot`; }
        document.getElementById('about-name') && (document.getElementById('about-name').textContent = `Hi! I'm ${portfolioData.name}.`);
        document.getElementById('about-location') && (document.getElementById('about-location').textContent = portfolioData.location || '');
        aboutDesc.innerHTML = '';
        (portfolioData.about.description || []).forEach(p => aboutDesc.innerHTML += `<p>${p}</p>`);
    }

    const expContainer = document.getElementById('experience-container');
    if (expContainer && Array.isArray(portfolioData.experience)) {
        expContainer.innerHTML = '';
        portfolioData.experience.forEach((job, idx) => {
            const resp = (job.responsibilities || []).map(r => `<li>${r}</li>`).join('');
            expContainer.innerHTML += `<div class="experience-item"><div class="experience-number">${idx + 1}</div><div class="experience-details"><h3>${job.title}</h3><p class="company">${job.company} <span class="details">(${job.details || ''})</span></p><ul>${resp}</ul></div></div>`;
        });
    }

    const skillsGrid = document.getElementById('skills-grid');
    if (skillsGrid && Array.isArray(portfolioData.skills)) {
        skillsGrid.innerHTML = '';
        portfolioData.skills.forEach(s => {
            skillsGrid.innerHTML += s.certificateUrl ? `<a href="${s.certificateUrl}" target="_blank" class="skill-tag skill-tag-link">${s.name}</a>` : `<span class="skill-tag">${s.name}</span>`;
        });
    }

    // PROJECTS
    const projectGrid = document.getElementById('project-grid');
    if (projectGrid && Array.isArray(portfolioData.projects)) {
        projectGrid.innerHTML = '';
        portfolioData.projects.forEach(project => {
            const liveBtn = project.liveLink ? `<a href="${project.liveLink}" class="btn btn-secondary" target="_blank">Live Site</a>` : `<a class="btn btn-secondary disabled">Live Site</a>`;
            const codeBtn = project.codeLink ? `<a href="${project.codeLink}" class="btn btn-primary" target="_blank">View Code</a>` : `<a class="btn btn-primary disabled">View Code</a>`;
            const collabHTML = project.collaborator && project.GitHub ? `<p class="collaborator"><em>Collaboration with: <a href="${project.GitHub}" target="_blank">${project.collaborator}</a></em></p>` : '';
            const techHTML = project.tech ? `<p class="tech-stack1">${buildTechLinks(project.tech)}</p>` : '';
            projectGrid.innerHTML += `
                <div class="project-card reveal">
                    <div class="project-card-header"></div>
                    <div class="project-card-image"><img src="${project.imageUrl || ''}" alt="${project.title} screenshot"></div>
                    <div class="project-card-body">
                        <h3>${project.title}</h3>
                        <p class="client">${project.client || ''}</p>
                        <p class="description">${project.description || ''}</p>
                        ${collabHTML}
                        ${techHTML}
                        <div class="project-links">${liveBtn}${codeBtn}</div>
                    </div>
                </div>`;
        });
    }

    // PROCESS & PRICING
    const processContainer = document.getElementById('process-steps-container');
    if (processContainer && Array.isArray(portfolioData.myProcess)) {
        processContainer.innerHTML = '';
        portfolioData.myProcess.forEach(step => processContainer.innerHTML += `<div class="step-card"><div class="step-number">${step.number}</div><h3>${step.title}</h3><p>${step.description}</p></div>`);
    }
    const pricingGrid = document.getElementById('pricing-grid');
    if (pricingGrid && Array.isArray(portfolioData.services)) {
        pricingGrid.innerHTML = '';
        portfolioData.services.forEach(service => pricingGrid.innerHTML += `<div class="pricing-card"><div class="pricing-card-header"></div><div class="pricing-card-body"><h3>"${service.name}"</h3><div class="price-display">price: $${service.priceUSD} <span>/ ₦${service.priceNGN}</span></div><p class="service-description">${service.description}</p><a href="#contact" class="btn btn-primary">initiate()</a></div></div>`);
    }

    // --- 4. GENERAL UTILITIES ---
    // Hamburger
    const hamburger = document.querySelector(".hamburger");
    if (hamburger) {
        const navWrap = document.querySelector(".nav-links");
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navWrap && navWrap.classList.toggle("active");
            document.body.classList.toggle("mobile-menu-active");
        });
    }

    // Smooth anchor scrolling (only for in-page anchors)
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

    // Reveal Observer (uses scroll-container root if present)
    const revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length) {
        const root = document.querySelector('.scroll-container') || null;
        const ro = new IntersectionObserver((entries, obs) => {
            entries.forEach(en => {
                if (en.isIntersecting) { en.target.classList.add('active'); obs.unobserve(en.target); }
            });
        }, { root, threshold: 0.12 });
        revealEls.forEach(el => ro.observe(el));
    }

    // Copy / toast helper
    function showCollabToast(msg = 'Copied') {
        const t = document.getElementById('collab-toast');
        if (!t) return;
        t.textContent = msg;
        t.classList.add('show');
        clearTimeout(t._hide);
        t._hide = setTimeout(() => t.classList.remove('show'), 2200);
    }
    document.body.addEventListener('click', (e) => {
        const el = e.target;
        if (el.matches('.cmd-btn')) {
            const txt = el.dataset.copy || el.textContent || '';
            navigator.clipboard?.writeText(txt.trim()).then(() => showCollabToast('Copied'), () => showCollabToast('Copy failed'));
        }
        if (el.matches('#copy-btn')) {
            const acc = document.getElementById('account-number')?.textContent || document.querySelector('.donation-line')?.textContent || '';
            navigator.clipboard?.writeText((acc || '').trim()).then(() => showCollabToast('Account copied'), () => showCollabToast('Copy failed'));
        }
    });

    // --- 5. FORM ENHANCEMENTS (Project Type / Plan / Preferred Stack) ---
    const form = document.getElementById('contact-form');
    const projectTypeSelect = document.getElementById('project-type');
    const projectTypeOther = document.getElementById('project-type-other');
    const planSelect = document.getElementById('plan-selection');
    const customPlanDetails = document.getElementById('custom-plan-details');
    const preferredStackCheckboxes = Array.from(document.querySelectorAll('.tech-stack'));
    const preferredStackOther = document.getElementById('preferred-stack-other');

    function updateProjectType() {
        if (!projectTypeSelect || !projectTypeOther) return;
        const other = projectTypeSelect.value === 'Other';
        projectTypeOther.style.display = other ? 'block' : 'none';
        projectTypeOther.required = other;
    }
    function updatePlanSelection() {
        if (!planSelect || !customPlanDetails) return;
        const custom = planSelect.value === 'Custom';
        customPlanDetails.style.display = custom ? 'block' : 'none';
        customPlanDetails.required = custom;
    }
    function updatePreferredStack() {
        if (!preferredStackCheckboxes.length || !preferredStackOther) return;
        const selected = preferredStackCheckboxes.filter(cb => cb.checked).map(cb => cb.value);
        const needsOther = selected.includes('Other');
        preferredStackOther.style.display = needsOther ? 'block' : 'none';
        preferredStackOther.required = needsOther;
    }

    // init + wire
    updateProjectType();
    updatePlanSelection();
    updatePreferredStack();
    projectTypeSelect && projectTypeSelect.addEventListener('change', updateProjectType);
    planSelect && planSelect.addEventListener('change', updatePlanSelection);
    preferredStackCheckboxes.forEach(cb => cb.addEventListener('change', updatePreferredStack));

    // Form submit (Formspree)
    if (form) form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const status = document.getElementById('form-status');
        const data = new FormData(form);
        try {
            const res = await fetch(form.action, { method: form.method || 'POST', body: data, headers: { 'Accept': 'application/json' } });
            if (res.ok) {
                if (status) {
                    // clear previous hide timer if present
                    if (status._hideTimeout) { clearTimeout(status._hideTimeout); status._hideTimeout = null; }
                    status.textContent = "Thanks — your message was sent successfully!";
                    status.className = 'success';
                    status.style.display = 'block';
                    // hide after 6 seconds
                    status._hideTimeout = setTimeout(() => {
                        status.style.display = 'none';
                        status.textContent = '';
                        status.className = '';
                        status._hideTimeout = null;
                    }, 6000);
                }
                form.reset();
                updateProjectType(); updatePlanSelection(); updatePreferredStack();
                showCollabToast('Message sent');
            } else {
                const json = await res.json().catch(()=>null);
                if (status) {
                    // errors remain until user action
                    status.textContent = json?.errors ? json.errors.map(i=>i.message).join(', ') : "Oops! There was a problem.";
                    status.className = 'error';
                    status.style.display = 'block';
                }
                showCollabToast('Send failed');
            }
        } catch (err) {
            if (status) {
                status.textContent = "Network error: message not sent.";
                status.className = 'error';
                status.style.display = 'block';
            }
            showCollabToast('Network error');
        }
    });

    // Footer
    const footer = document.getElementById('footer');
    if (footer) footer.innerHTML = `<p>Here's To Us Working Together</p><p>&copy; ${new Date().getFullYear()} ${portfolioData?.name || 'David Idowu'}. All rights reserved.</p>`;

    // Back to top button
    const backToTop = document.querySelector('.back-to-top-btn');
    const scrollContainer = document.querySelector('.scroll-container');
    if (backToTop && scrollContainer) {
        scrollContainer.addEventListener('scroll', () => {
            if (scrollContainer.scrollTop > 300) backToTop.classList.add('active'); else backToTop.classList.remove('active');
        }, { passive: true });
    }

    // --- 6. NAV SCROLL-SPY (robust) ---
    (function initScrollSpy() {
        const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
        const sections = Array.from(document.querySelectorAll('section[id]'));
        if (!navLinks.length || !sections.length) return;

        navLinks.forEach(a => { if (!a.dataset.orig) a.dataset.orig = a.textContent.trim(); });

        function setActive(sectionId) {
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

        const container = document.querySelector('.scroll-container') || window;

        function computeActive() {
            let best = { id: null, ratio: 0 };
            const containerRect = container === window ? { top: 0, bottom: window.innerHeight } : container.getBoundingClientRect();
            sections.forEach(sec => {
                const r = sec.getBoundingClientRect();
                const top = Math.max(r.top, containerRect.top);
                const bottom = Math.min(r.bottom, containerRect.bottom);
                const visible = Math.max(0, bottom - top);
                const ratio = r.height > 0 ? (visible / r.height) : 0;
                if (ratio > best.ratio) best = { id: sec.id, ratio };
            });
            if (best.id) setActive(best.id);
        }

        function throttle(fn, wait = 120) {
            let last = 0, t = null;
            return function () {
                const now = Date.now();
                const rem = wait - (now - last);
                if (rem <= 0) { if (t) { clearTimeout(t); t = null; } last = now; fn(); }
                else if (!t) t = setTimeout(() => { last = Date.now(); t = null; fn(); }, rem);
            };
        }

        const onScroll = throttle(computeActive, 120);
        if (container === window) window.addEventListener('scroll', onScroll, { passive: true });
        else container.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', throttle(computeActive, 200));

        // initial compute and nav clicks
        computeActive();
        navLinks.forEach(link => link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (!href || href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            const id = (href || '').replace('#', '');
            setActive(id);
        }));
    })();

    // Finally init theme & vanta now that DOM + content are ready
    try { setTimeout(() => setTheme(currentTheme), 40); } catch (e) { console.warn('Theme/vanta init failed', e); }

});