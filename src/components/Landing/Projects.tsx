import { Github, ExternalLink } from 'lucide-react'

const projects = [
    {
        title: 'Project 1',
        description: 'A web application built with React and Node.js',
        github: 'https://github.com/yourusername/project1',
        live: 'https://project1.com',
    },
    {
        title: 'Project 2',
        description: 'An e-commerce platform using Next.js and Stripe',
        github: 'https://github.com/yourusername/project2',
        live: 'https://project2.com',
    },
    {
        title: 'Project 3',
        description: 'A mobile app developed with React Native',
        github: 'https://github.com/yourusername/project3',
        live: 'https://project3.com',
    },
]

const Projects = () => {
    return (
        <section id="projects" className="py-20">
            <h2 className="text-3xl font-bold mb-8">My Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                        <p className="mb-4">{project.description}</p>
                        <div className="flex space-x-4">
                            <a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-purple-500 hover:text-purple-600"
                            >
                                <Github size={20} className="mr-1" />
                                GitHub
                            </a>
                            <a
                                href={project.live}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-purple-500 hover:text-purple-600"
                            >
                                <ExternalLink size={20} className="mr-1" />
                                Live Demo
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Projects
