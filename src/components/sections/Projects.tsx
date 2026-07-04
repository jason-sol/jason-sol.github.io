import { site } from '../../content/site'
import { Card } from '../ui/Card'
import { SectionLabel } from '../ui/SectionLabel'
import styles from './Projects.module.css'

export function Projects() {
  return (
    <section id="projects" className={styles.projects}>
      <div className={styles.labelWrap}>
        <SectionLabel as="h2">{site.sectionLabels.projects}</SectionLabel>
      </div>
      <div data-projects-grid className={styles.grid}>
        {site.projects.map((project, i) => (
          <Card
            key={project.title}
            kicker={project.kicker}
            title={project.title}
            blurb={project.blurb}
            tags={project.tags}
            url={project.url}
            delay={i * 100}
          />
        ))}
      </div>
    </section>
  )
}
