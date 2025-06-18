// config.js
// All your personal data is in this one file.
// Just edit this file to update your portfolio!

const portfolioData = {
    name: "David Idowu",
    title: "Web Developer & Web Designer",
    location: "Lagos, Nigeria | Open to Remote & Hybrid Roles",
    
    contact: {
        email: "didowu903@gmail.com",
        phone: "+2347037000448"
    },

    socials: {
        github: "https://github.com/manofval0r", // <-- UPDATE THIS
        linkedin: "https://linkedin.com/in/david-idowu-669687307" // <-- UPDATE THIS
    },
    
    // You can add a link to your actual photo here.
    // For now, it uses a placeholder.
    about: {
        imageUrl: "/Hero-image.jpg",
        // The description is an array of strings. Each string is a paragraph.
        description: [
            "Results-driven full-stack developer with proven experience creating end-to-end web solutions from concept to deployment. Successfully designed and implemented a complete restaurant website featuring cart functionality and automated checkout processes using HTML, CSS, Java, and Node.js.",
            "Currently developing a sophisticated Learning Management System utilizing Next.js, TypeScript, JavaScript, and Java with seamless database integration. Skilled at independent project management and problem-solving with expertise in leveraging AI tools to enhance development efficiency. Seeking opportunities to apply my technical versatility across computing, data analysis, and cybersecurity sectors."
        ]
    },

    // To add a new project, just copy an object and add it to the array.
    projects: [
        {
            title: "Restaurant Website",
            client: "Client: Sidedish Foods",
            description: "An end-to-end web solution for a restaurant, featuring a customer-facing menu, dynamic cart functionality, and an automated checkout process. The site includes a back-end dashboard for order management.",
            tech: "HTML, CSS, Java, Node.js",
            imageUrl: "/SDSHFDS-pic.jpg",
            liveLink: "#", // <-- UPDATE THIS
            codeLink: "https://github.com/manofval0r/websstt" // <-- UPDATE THIS
        },
        {
            title: "Educational Platform",
            client: "Personal Project",
            description: "An in-development Learning Management System (LMS) designed to provide a centralized educational platform for students at the Nigerian University of Technology and Management.",
            tech: "Next.js, TypeScript, JavaScript, Java",
            imageUrl: "/LMS-project-pic.jpg",
            liveLink: null, // No link yet, the button will be disabled.
            codeLink: null
                    }
    ]
};