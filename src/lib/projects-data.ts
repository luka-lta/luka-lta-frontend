export interface Project {
    id: string
    title: string
    description: string
    longDescription: string
    techStack: string[]
    screenshots: string[]
    liveUrl: string
    repoUrl?: string
    repoOwner?: string
    repoName?: string
    role: string
    year: string
    liveLabel?: string
    clientProject?: boolean
}

export const projects: Project[] = [
    {
        id: "luka-lta-api",
        title: "luka-lta-api",
        description:
            "API for User Management, LinkTracking and ApiKey Management",
        longDescription:
            "A RESTful API built with PHP and the Slim Framework. Handles user authentication via JWT, link click tracking with analytics, and API key management. Backed by MySQL for persistent storage and Redis for caching.",
        techStack: [
            "PHP",
            "Slim Framework",
            "MySQL",
            "Redis",
            "JWT",
            "Docker",
        ],
        screenshots: ["/static/images/projects/luka-lta-api.webp", "/static/images/projects/frontend.png"],
        liveUrl: "https://luka-lta.dev",
        repoUrl: "https://github.com/luka-lta/luka-lta-api",
        repoOwner: "luka-lta",
        repoName: "luka-lta-api",
        role: "Creator",
        year: "2022",
    },
    {
        id: "mexcal",
        title: "Mexcal Hameln",
        description: "Restaurant website for a local client in Hameln",
        longDescription:
            "Restaurant website built for Mexcal Hameln, a local Mexican restaurant. Showcases the full menu, opening hours, location, and a contact section. Built as a client project with emphasis on mobile-first design, fast load times, and a warm visual identity that matches the brand.",
        techStack: [
            "TypeScript",
            "React",
            "Vite",
            "Tailwind CSS",
        ],
        screenshots: ["/static/images/projects/mexcal-hameln.png", "/static/images/projects/mexcal/mexcal-website.png"],
        liveUrl: "https://mexcal-hameln.de",
        role: "Creator",
        year: "2026",
        clientProject: true,
    },
    {
        id: "luka-lta-backend",
        title: "luka-lta-backend",
        description:
            "Backend dashboard to manage API resources",
        longDescription:
            "A React-based admin dashboard for managing links, users, and API keys exposed by the luka-lta-api. Built with shadcn/ui components and Node.js tooling.",
        techStack: [
            "React",
            "Node.js",
            "Shadcn/ui",
        ],
        screenshots: ["/static/images/projects/backend.png"],
        liveUrl: "https://luka-lta.dev",
        repoUrl: "https://github.com/luka-lta/luka-lta-backend",
        repoOwner: "luka-lta",
        repoName: "luka-lta-backend",
        role: "Creator",
        year: "2024",
    },
    {
        id: "kindled",
        title: "Kindled",
        description: "iOS habit tracker app to build and maintain daily habits",
        longDescription:
            "Kindled is a native iOS habit tracking app built with Swift and SwiftUI. It helps users build and maintain daily habits through streak tracking, visual progress indicators, and smart reminders. Designed with a clean, minimal interface focused on reducing friction between intention and action.",
        techStack: [
            "Swift",
            "SwiftUI",
            "iOS",
            "Core Data",
        ],
        screenshots: ["/static/images/projects/kindled.png"],
        liveUrl: "https://apps.apple.com/us/app/kindled/id6765896395",
        liveLabel: "App Store",
        repoUrl: "https://github.com/luka-lta/kindled",
        repoOwner: "luka-lta",
        repoName: "kindled",
        role: "Creator",
        year: "2025",
    },
    {
        id: "luka-lta-frontend",
        title: "luka-lta-frontend",
        description:
            "Portfolio page about myself and link collection",
        longDescription:
            "My personal portfolio website and link-in-bio page. Built with React, TypeScript, Tailwind CSS, and Framer Motion. Features a project showcase, skills section, timeline, contact form, and a Linktree-style links page.",
        techStack: [
            "React",
            "TypeScript",
            "Tailwind CSS",
            "Shadcn/ui",
            "Framer Motion",
            "Node.js",
        ],
        screenshots: ["/static/images/projects/frontend.png"],
        liveUrl: "https://luka-lta.dev",
        repoUrl: "https://github.com/luka-lta/luka-lta-frontend",
        repoOwner: "luka-lta",
        repoName: "luka-lta-frontend",
        role: "Creator",
        year: "2025",
    },
]
