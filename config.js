// This file now controls the ENTIRE content of my portfolio.

const portfolioData = {
    // Personal Info
    name: "David Idowu",
    title: "Web Developer & Web Designer",
    location: "Lagos, Nigeria | Open to Remote & Hybrid Roles",
    
    // Contact & Socials
    contact: {
        email: "didowu903@gmail.com",
        phone: "+2347037000448"
    },
    socials: {
        github: "https://github.com/manofval0r", // <-- UPDATE THIS
        linkedin: "https://www.linkedin.com/in/david-idowu-669687307" // <-- UPDATE THIS
    },
    
    // About Section
    about: {
        imageUrl: "/Hero-image.jpg", // Make sure this image is in your folder
        description: [
            "Results-driven full-stack developer with proven experience creating end-to-end web solutions from concept to deployment. Successfully designed and implemented a complete restaurant website featuring cart functionality and automated checkout processes using HTML, CSS, Java, and Node.js.",
            "Currently developing a sophisticated Learning Management System utilizing Next.js, TypeScript, JavaScript, and Java with seamless database integration. Skilled at independent project management and problem-solving with expertise in leveraging AI tools to enhance development efficiency. Seeking opportunities to apply my technical versatility across computing, data analysis, and cybersecurity sectors."
        ]
    },

    // --- NEW: Experience Section Data ---
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
        }
    ],

    // --- Skills Section Data ---
    skills: [
        { name: "HTML" },
        { name: "CSS" },
        { name: "JavaScript" },
        { name: "Next.js" },
        { name: "UI/UX Design" },
        { name: "Data Analytics" },
        { name: "Project Management" },
        { name: "AI Prompting" },
        { name: "Gen AI", certificateUrl: "/CertificateOfCompletion_What Is Generative AI (1).pdf" },
        { name: "Git & GitHub" },
        { name: "Vercel" }
    ],


    // --- Education & Certifications Data ---
    education: [
        {
            degree: "Bachelor's Degree in Cybersecurity Science",
            institution: "Nigerian University of Technology and Management, Lagos",
            dates: "2024 - Present",
            description: "Focusing on core principles of network protection and digital security at a strong university."
        }
    ],
    certifications: [
        { name: "MIT App Development Course", issuerDate: "NessCrown, 09.2024" },
        { name: "Scratch App Development Course", issuerDate: "NessCrown, 08.2023" }
    ],

    // Projects Section
    projects: [
                // --- Paste the new project object here ---
        {
            title: "Midwife Tracking & Payroll System",
            client: "Client-Focused Project",
            description: "Developed an automated system to solve a real-world data management problem, replacing a strenuous manual ledger process for midwives. The solution ensures accurate, performance-based pay calculations.",
            tech: "Google Apps Script, Google Sheets, JavaScript, HTML",
            imageUrl: "/Midwive-Tracker.png", // You'll need to add this image to your folder
            liveLink: "https://script.google.com/macros/s/AKfycbz7BLj481tg4TeJ66u6RTobd5x8eb4kJz6CUyaAhquuZdx2zLfZ3id_xOzseqqzJ_Dw/exec",
            codeLink: "https://github.com/manofval0r/Midwife-tracker-DT"
        }, // <-- The comma is very important!
        {
            title: "Solar Market Trend Analyzer",
            client: "Confidential",
            description: "A comprehensive web app for analyzing solar, inverter, and battery market trends using real-time data scraping and partly free to use, open-source API integrations.",
            tech: "Node.js, Express.js, REST APIs, Web Scraping, HTML, CSS",
            imageUrl: "/PES-analyser.png", // Make sure this image is in your folder
            liveLink: "https://pes-analyser.vercel.app", // Add your live link
            codeLink: "https://github.com/Anikin-kings/PES-analyzer",
            collaborator: "Anikin Kings",
            GitHub: "https://github.com/Anikin-kings"
        },
        {
            title: "Restaurant Website",
            client: "Client: Sidedish Foods",
            description: "An end-to-end web solution for a restaurant, featuring a customer-facing menu, dynamic cart functionality, and an automated checkout process.",
            tech: "HTML, CSS, Java, Node.js",
            imageUrl: "/SDSHFDS-pic.jpg", // Make sure this image is in your folder
            liveLink: "https://sidedishfoodsweb.vercel.app", // Add your live link
            codeLink: "https://github.com/manofval0r/websstt" // Add your code link
        },
        {
            title: "Educational Platform",
            client: "Personal Project",
            description: "An in-development Learning Management System (LMS) designed to provide a centralized educational platform for students.",
            tech: "Next.js, TypeScript, JavaScript, Java",
            imageUrl: "/LMS-project-pic.jpg", // Make sure this image is in your folder
            liveLink: null,
            codeLink: null
        }
    ]
};