import { useTranslation } from 'react-i18next';
import Reveal from '@/components/Landing/Section/Reveal';
import SectionHeader from '@/components/Landing/Section/SectionHeader';

const SKILL_CATEGORIES = [
  { titleKey: 'skills.frontend', skills: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion', 'shadcn/ui'] },
  { titleKey: 'skills.backend', skills: ['PHP', 'Slim Framework', 'Node.js', 'REST APIs'] },
  { titleKey: 'skills.database', skills: ['MySQL', 'MongoDB', 'Redis', 'Elasticsearch'] },
  { titleKey: 'skills.devops', skills: ['Docker', 'Git', 'GitHub', 'Linux'] },
  { titleKey: 'skills.design', skills: ['Figma', 'UI/UX Principles'] },
  { titleKey: 'skills.methodology', skills: ['Agile', 'Scrum', 'Clean Code'] },
] as const;

export default function Skills() {
  const { t } = useTranslation();

  return (
    <section id="skills" className="bg-background py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader
          id="skills"
          title={<span className="block text-5xl font-black leading-[0.95] md:text-7xl">{t('skills.headline')}</span>}
        />

        <ul className="grid gap-x-12 md:grid-cols-2 lg:grid-cols-3">
          {SKILL_CATEGORIES.map((category, index) => (
            <Reveal as="li" key={category.titleKey} delay={(index % 3) * 0.08} className="border-t border-border py-8">
              <h3 className="mb-5 font-mono text-xs uppercase tracking-widest text-teal">{t(category.titleKey)}</h3>
              <ul className="space-y-2">
                {category.skills.map((skill) => (
                  <li key={skill} className="text-lg text-foreground">
                    {skill}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
