const skills = [
    'JavaScript',
    'TypeScript',
    'React',
    'Node.js',
    'PHP',
    'SQL',
    'HTML',
    'CSS',
    'Git',
    'Docker',
]

const Skills = () => {
    return (
        <section id="skills" className="py-20">
            <h2 className="text-3xl font-bold mb-8">My Skills</h2>
            <div className="flex flex-wrap gap-4">
                {skills.map((skill, index) => (
                    <span
                        key={index}
                        className="bg-purple-900 text-white px-3 py-1 rounded-full text-sm"
                    >
            {skill}
          </span>
                ))}
            </div>
        </section>
    )
}

export default Skills

