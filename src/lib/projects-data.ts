export interface Project {
    id: string
    title: string
    description: string
    longDescription: string
    techStack: string[]
    screenshots: string[]
    liveUrl: string
    repoUrl: string
    repoOwner: string
    repoName: string
    role: string
    year: string
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
