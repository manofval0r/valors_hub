// This file now controls the ENTIRE content of my portfolio.

const portfolioData = {
    // Personal Info
    name: "David Idowu",
    title: "Web Developer & Web Designer",
    location: "Lagos, Nigeria | Open to Remote & Hybrid Roles",

    // Contact & Socials
    contact: {
        email: "didowu903@gmail.com | apexheightgames.valor@gmail.com",
        phone: "+2347037000448"
    },

    socials: {
        github: "https://github.com/manofval0r",
        linkedin: "https://www.linkedin.com/in/david-idowu-669687307",
    },

    // About Section
    about: {
        imageUrl: "assets/Hero-image.png",
        figureImage: "Father of Computer, Charles Babbage",
        description: [
            "Results-driven full-stack developer with proven experience creating end-to-end web solutions from concept to deployment. Successfully designed and implemented a complete restaurant website featuring cart functionality and automated checkout processes using HTML, CSS, Java, and Node.js.", "Skilled at independent project management and problem-solving with expertise in leveraging AI tools to enhance development efficiency."
        ]
    },

    // ---Pricing Data ---
    services: [
        {
            id: 'starter',
            name: "Starter Portfolio | Gold",
            priceUSD: 50,
            priceNGN: "75,000",
            description: "A stunning, responsive 1-3 page site to showcase your skills and projects. Perfect for individuals, students, and job seekers."
        },
        {
            id: 'business',
            name: "Business & Startup | Diamond",
            priceUSD: 150,
            priceNGN: "225,000",
            description: "A professional, multi-page (up to 6) website with a contact form and modern design to establish your online presence."
        },
        {
            id: 'custom',
            name: "Full Custom Project | Paladium",
            priceUSD: "300+",
            priceNGN: "450,000+",
            description: "A bespoke web application, e-commerce store, or complex platform built to your exact specifications. Might take a while!"
        },
        {
            id: 'revamp',
            name: "Website Revamp / Fixes",
            priceUSD: "10/hr",
            priceNGN: "15,000/hr",
            description: "Upgrade, fix, or add new features to your existing website to improve its performance, design, and functionality."
        }
    ],

    // ---Donation Data ---
    donations: {
        title: "Support My Mission",
        description: "My services are subsidized to help empower new businesses and individuals. If you believe in this mission, you can support my work through a donation.",
        accountNumber: "6092179815",
        bankName: "9 Payment Service Bank"
    },
    collaboration: {
        title: "Have an idea for a project?",
        description: "I'm always open to collaborating with other developers and designers on exciting projects. If you have an idea, let's connect.",
        buttonText: "Let's Grab Lunch",
        hoverText: "You might have to buy me lunch first 😅"
    },

    // --- Experience Section Data ---
    experience: [
        {
            title: "Web Developer",
            company: "Sidedish Foods",
            details: "Kano (Remote)",
            responsibilities: [
                "Developed a full-stack e-commerce website to enable seamless online food ordering for clients.",
                "Implemented an internal dashboard for staff to track orders in real-time and monitor business goals.",
                "Managed the end-to-end deployment process using sustainable, cost-effective tools.",
                "Currently provide ongoing website management, maintenance, and feature updates."
            ]
        },
        {
            title: "Freelance Web developer",
            company: "Confidential client",
            details: "Remote",
            responsibilities: [
                "Created a working portfolio website for a certain confidentialclient in the data world, using Vanilla JS, HTML, and CSS`",
                "Continued tweaking until the client was satisfied",
                "Continued to provide support and maintenance for the website"
            ]
        },
        {
            title: "Lead Developer",
            company: "5VE",
            details: "Remote, and Lab Situated",
            responsibilities: [
                "Built the prototype of a tech guide platform that uses AI to make skill learning more structured and reliable"
            ]
        }
    ],

    // --- Skills Section Data ---
    skills: [
        { name: "Responsive Web Design (HTML and CSS)", certificateUrl: "assets/Responsive web design.png" },
        { name: "JavaScript" },
        { name: "Next.js" },
        { name: "UI/UX Design", certificateUrl: "assets/Responsive web design.png" },
        { name: "Data Analytics" },
        { name: "Project Management" },
        { name: "AI Prompting", certificateUrl: "/CertificateOfCompletion_What Is Generative AI (1).pdf" },
        { name: "Gen AI", certificateUrl: "/CertificateOfCompletion_What Is Generative AI (1).pdf" },
        { name: "Git & GitHub" },
        { name: "Vercel" }
    ],


    // --- Education & Certifications Data ---
    education: [
        {
            degree: "Bachelor's Degree in Cybersecurity Science",
            institution: "XXXXXX, Lagos",
            dates: "2024 - Present",
            description: "Focusing on core principles of network protection and digital security at a strong university."
        }
    ],
    certifications: [
        { name: "MIT App Development Course", issuerDate: "NessCrown, 09.2024" },
        { name: "Scratch App Development Course", issuerDate: "NessCrown, 08.2023" },
        { name: "What is Generative AI?", issuerDate: "LinkedIn Learning, 06.2025", certificateUrl: "/CertificateOfCompletion_What Is Generative AI (1).pdf" },
        { name: "Responsive Web Design", issuerDate: "freeCodeCamp, 09.2025", certificateUrl: "assets/Responsive web design.png" }
    ],

    // Projects Section
    projects: [
        {
            title: "Midwife Tracking & Payroll System",
            client: "Client-Focused Project",
            description: "Developed an automated system to solve a real-world data management problem, replacing a strenuous manual ledger process for midwives. The solution ensures accurate, performance-based pay calculations.",
            tech: "Google Apps Script, Google Sheets, JavaScript, HTML",
            imageUrl: "assets/Midwive-Tracker.png",
            liveLink: "https://script.google.com/macros/s/AKfycbz7BLj481tg4TeJ66u6RTobd5x8eb4kJz6CUyaAhquuZdx2zLfZ3id_xOzseqqzJ_Dw/exec",
            codeLink: "https://github.com/manofval0r/Midwife-tracker-DT"
        },
        {
            title: "Solar Market Trend Analyzer",
            client: "Confidential",
            description: "A comprehensive web app for analyzing solar, inverter, and battery market trends using real-time data scraping and partly free to use, open-source API integrations.",
            tech: "Node.js, Express.js, REST APIs, Web Scraping, HTML, CSS",
            imageUrl: "assets/PES-analyser.png",
            liveLink: "https://pes-analyser.vercel.app",
            codeLink: "https://github.com/Anikin-kings/PES-analyzer",
            collaborator: "Anikin Kings",
            GitHub: "https://github.com/Anikin-kings"
        },
        {
            title: "Restaurant Website",
            client: "Client: Sidedish Foods",
            description: "An end-to-end web solution for a restaurant, featuring a customer-facing menu, dynamic cart functionality, and an automated checkout process.",
            tech: "HTML, CSS, Java, Node.js",
            imageUrl: "assets/SDSHFDS-pic.jpg",
            liveLink: "https://sidedishfoodsweb.vercel.app",
            codeLink: "https://github.com/manofval0r/websstt"
        },
        {
            title: "Client Portfolio Website",
            client: "Client-Focused Project",
            description: "Developed a portfolio website to showcase the client's work, integrating a blog and a contact form for potential clients.",
            tech: "HTML, CSS, JavaScript",
            imageUrl: "assets/confidential.png",
            liveLink: "https://solomon-binutu.vercel.app",
            codeLink: "https://github.com/manofval0r/ay-design"
        },
        {
            title: "Fashion Ecommerce Website",
            client: "Client-Focused Project",
            description: "Developed a fashion ecommerce website with a focus on user experience and seamless shopping.",
            tech: "HTML, CSS, JavaScript",
            imageUrl: "assets/kloshouse.png",
            liveLink: "https://kloshouse.vercel.app",
            codeLink: "https://github.com/manofval0r/kloshouse"
        },
        {
            title: "Client Portfolio Website",
            client: "Naijadataman",
            description: "Developed a portfolio website to show the client's prowess in data analytics and training.",
            tech: "HTML, CSS, JavaScript",
            imageUrl: "assets/confidential.png",
            liveLink: "https://naijadataman.vercel.app",
            codeLink: "https://github.com/manofval0r/naijadataman"
        },
        {
            title: "What's Next",
            client: "Uni project then Personal Project",
            description: "Its a platform meant to guide people to mastery of the skills they need to succeed in their career path.",
            tech: "Python(Django), React.js, Vite, Vanila CSS, HTML",
            imageUrl: "assets/image.png",
            liveLink: "https://whats-next-1.onrender.com",
            codeLink: "https://github.com/manofval0r/WHATS-NEXT"
        },
        {
            title: "Educational Platform",
            client: "Personal Project",
            description: "An in-development Learning Management System (LMS) designed to provide a centralized educational platform for students.",
            tech: "Next.js, TypeScript, JavaScript, Java",
            imageUrl: "assets/LMS-project-pic.jpg",
            liveLink: null,
            codeLink: null
        }
    ],

    //  "My Process" Section Data ---
    myProcess: [
        {
            number: 1,
            title: "Discovery & Planning",
            description: "We start with a deep dive into your goals to create a clear blueprint for success."
        },
        {
            number: 2,
            title: "Design & Development",
            description: "I design a beautiful, modern interface and build it with clean, efficient code."
        },
        {
            number: 3,
            title: "Review & Launch",
            description: "You'll review the project for refinements, and I'll handle the deployment to get you live."
        }
    ],

    // URL map used by script.js
    techLinks: {
        "JavaScript": "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
        "TypeScript": "https://www.typescriptlang.org",
        "Node.js": "https://nodejs.org",
        "Express.js": "https://expressjs.com",
        "React": "https://reactjs.org",
        "Next.js": "https://nextjs.org",
        "HTML": "https://developer.mozilla.org/en-US/docs/Web/HTML",
        "CSS": "https://developer.mozilla.org/en-US/docs/Web/CSS",
        "Python": "https://www.python.org",
        "Django": "https://www.djangoproject.com",
        "Figma": "https://www.figma.com",
        "Vercel": "https://vercel.com",
        "Firebase": "https://firebase.google.com",
        "GraphQL": "https://graphql.org",
        "REST": "https://en.wikipedia.org/wiki/Representational_state_transfer",
        "Vite": "https://vitejs.dev",
        "Google Cloud": "https://cloud.google.com",
        "Stitch": "https://www.stitch.withgoogle.com",
        "Canva": "https://www.canva.com",
        "V0 by Vercel": "https://v0.dev",
        "V0": "https://v0.dev",
        "Github Copilot": "https://github.com/features/copilot",
        "Claude": "https://claude.ai",
        "Microsoft Copilot": "https://copilot.microsoft.com",
        "Gemini": "https://deepmind.google/technologies/gemini",
        "Google AI Studio": "https://aistudio.google.com",
        "Agentic AI": "https://cloud.google.com/use-cases/agentic-ai",
        "LLMs": "https://en.wikipedia.org/wiki/Large_language_model",
        "Gen AI": "https://en.wikipedia.org/wiki/Generative_artificial_intelligence",
        "Gen AI Tools": "https://en.wikipedia.org/wiki/Generative_artificial_intelligence"
    }
};