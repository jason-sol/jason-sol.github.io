export interface NavLink {
  label: string
  href: string
  arrow?: boolean
}

export type StatKey = 'pullRequests' | 'repositories' | 'clinicians' | 'sites' | 'services' | 'risks'

export interface Stat {
  value: string
  label: string
}

export type HeadlineStyle = 'accent' | 'outline' | 'outline-accent' | 'serif-accent'

export type HeadlineSegment =
  | { text: string; style?: HeadlineStyle }
  | { statKey: StatKey; style?: HeadlineStyle }

export interface RiskBadge {
  tone: 'high' | 'warn' | 'ok'
  text: string
}

export interface HeroPhase {
  eyebrow: string
  headline: HeadlineSegment[]
  sub?: string
  pipeline?: string[]
  badges?: RiskBadge[]
}

export type TickerItem = { statKey: StatKey } | { text: string }

export interface AboutStat {
  value: number
  suffix?: string
  accent?: boolean
  caption: string
}

export interface AboutContent {
  figCaption: string
  statement: string
  stats: AboutStat[]
}

export interface StackGroup {
  title: string
  items: string[]
  highlight?: boolean
}

export type ImpactItem =
  | { statKey: StatKey; accent?: boolean }
  | { label: string; value: string; accent?: boolean }

export interface Role {
  company: string
  title: string
  period: string
  location: string
  bullets: string[]
  impactLog?: ImpactItem[]
}

export interface Project {
  kicker: string
  title: string
  blurb: string
  tags: string[]
  url?: string
}

export interface EducationContent {
  institution: string
  degree: string
  period: string
  reflectionLead: string
  reflectionEmphasis: string
}

export interface ContactContent {
  title: HeadlineSegment[]
  tagline: string
  email: string
  github: string
  linkedin: string
}

export interface FooterContent {
  copyright: string
  location: string
  credit: string
}

export interface Site {
  brand: NavLink
  nav: NavLink[]
  heroPhases: HeroPhase[]
  stats: Record<StatKey, Stat>
  ticker: TickerItem[]
  sectionLabels: Record<'about' | 'stack' | 'experience' | 'projects' | 'education' | 'contact', string>
  about: AboutContent
  stackGroups: StackGroup[]
  roles: Role[]
  projects: Project[]
  education: EducationContent
  contact: ContactContent
  footer: FooterContent
}

const stats: Record<StatKey, Stat> = {
  pullRequests: { value: '180+', label: 'pull requests' },
  repositories: { value: '18', label: 'repositories' },
  clinicians: { value: '3,500+', label: 'clinicians' },
  sites: { value: '1,000+', label: 'sites' },
  services: { value: '~12', label: 'services' },
  risks: { value: '~8', label: 'risks remediated' },
}

export const site: Site = {
  brand: { label: 'JASON SOLANKI', href: '#top' },
  nav: [
    { label: 'WORK', href: '#experience' },
    { label: 'STACK', href: '#stack' },
    { label: 'PROJECTS', href: '#projects' },
    { label: 'CONTACT', href: '#contact', arrow: true },
  ],
  heroPhases: [
    {
      eyebrow: 'SYDNEY, AUSTRALIA — PORTFOLIO',
      headline: [{ text: 'JASON' }, { text: 'SOLANKI', style: 'outline-accent' }],
      sub: 'Full-stack engineer — production AI on medical imaging · Harrison.ai',
    },
    {
      eyebrow: '01 — THE SCALE',
      headline: [
        { text: 'I ship AI that ' },
        { statKey: 'clinicians', style: 'accent' },
        { text: ' rely on, across ' },
        { statKey: 'sites', style: 'outline' },
        { text: '.' },
      ],
      sub: 'Regulated medical-imaging platform. Real patients. No room for "works on my machine."',
    },
    {
      eyebrow: '02 — THE CRAFT',
      headline: [{ text: 'Whole features, ' }, { text: 'end to end', style: 'serif-accent' }, { text: '.' }],
      pipeline: ['design doc', 'API', 'UI', 'infra', 'production'],
      sub: "Sole author of the platform's multi-tenant organization-onboarding system.",
    },
    {
      eyebrow: '03 — THE EDGE',
      headline: [{ text: 'I hunt the bugs ' }, { text: 'others miss', style: 'outline-accent' }, { text: '.' }],
      badges: [
        { tone: 'high', text: 'HIGH — credential leak in logs · found & fixed' },
        { tone: 'warn', text: 'PHI leaking into session replays · stopped' },
        { tone: 'ok', text: `${stats.risks.value} safety & security risks remediated` },
      ],
    },
  ],
  stats,
  ticker: [
    { statKey: 'pullRequests' },
    { statKey: 'repositories' },
    { text: 'TYPESCRIPT · GO · C# · PYTHON' },
    { statKey: 'clinicians' },
    { text: 'TEST-FIRST, ALWAYS' },
  ],
  sectionLabels: {
    about: '04 — ABOUT',
    stack: '05 — STACK',
    experience: '06 — EXPERIENCE',
    projects: '07 — SELECTED WORK',
    education: '08 — EDUCATION',
    contact: '09 — CONTACT',
  },
  about: {
    figCaption: 'FIG. 01 — SCROLL TO DEVELOP',
    statement:
      'The fastest way to trust software is to try to break it first. I write the tests before the code, read the logs nobody reads, and treat every deploy like a patient is on the other end — because on my platform, one usually is.',
    stats: [
      { value: 70, caption: 'tests covering the secrets-management system I designed' },
      { value: 22, caption: 'frontend defects fixed across the radiology viewer' },
      { value: 15, suffix: 'm', accent: true, caption: 'automated CI run replacing 6–7 hours of manual regression' },
    ],
  },
  stackGroups: [
    { title: 'Languages', items: ['TypeScript', 'Python', 'Go', 'C#', 'SQL', 'Bash', 'HCL'] },
    { title: 'Frontend', items: ['React', 'Next.js', 'Zustand', 'Electron'] },
    { title: 'Backend & APIs', items: ['Node.js / Koa', 'REST / OpenAPI', 'MongoDB', 'Zod', 'JWT / RBAC'] },
    {
      title: 'Testing',
      items: ['Playwright', 'Vitest', 'pytest', 'Pact contract testing', 'Cypress'],
      highlight: true,
    },
    {
      title: 'Cloud & DevOps',
      items: [
        'AWS · SSM · KMS · IAM · SQS',
        'Docker',
        'GitHub Actions',
        'Terraform / Terragrunt',
        'ArgoCD',
        'Grafana / Loki',
      ],
    },
    {
      title: 'AI platform & domain',
      items: ['Medical-imaging AI', 'DICOM / DICOMWeb', 'FHIR / FHIRcast', 'PHI handling', 'Medical-device V&V'],
    },
  ],
  roles: [
    {
      company: 'Harrison.ai',
      title: 'GRADUATE SOFTWARE ENGINEER',
      period: 'JUL 2025 — PRESENT',
      location: 'SYDNEY',
      bullets: [
        'Sole author of multi-tenant Organization Onboarding — full CRUD API across 4 resources with SSO, member management and RBAC, plus the React admin portal and BFF integration.',
        'Designed a 5-layer secrets-management system (admin service, AWS SSM/KMS, BFF proxy, React UI, IAM) after finding an extractable API key in the desktop bundle.',
        'Built the PostHog feature-flag Terraform pipeline — 11 flags, 3 environments, parallel matrix CI — and rolled an AI model-router service to production.',
      ],
      impactLog: [
        { statKey: 'pullRequests', accent: true },
        { statKey: 'repositories' },
        { statKey: 'services' },
        { label: 'languages', value: 'TS · Go · C#' },
        { statKey: 'risks', accent: true },
      ],
    },
    {
      company: 'Annalise.ai',
      title: 'INTERN SOFTWARE TEST ENGINEER',
      period: 'FEB 2025 — JUN 2025',
      location: 'SYDNEY',
      bullets: [
        'Built the radiology-viewer E2E suite — ~9 Playwright spec suites, ~20 scenarios, Page-Object-Model, cross-browser + Electron on a Windows-GPU CI runner.',
        'Turned 6–7 hours of manual regression per release into a 15–20 minute automated run; fixed ~22 viewer defects along the way.',
      ],
    },
    {
      company: 'SATO Vicinity',
      title: 'ENGINEERING INTERN',
      period: 'MAY 2024 — FEB 2025',
      location: 'SYDNEY',
      bullets: [
        'Product testing, fault diagnostics and prototype development across the full hardware test cycle for an RFID product line.',
      ],
    },
  ],
  projects: [
    {
      kicker: 'HARRISON.AI · PRODUCTION',
      title: 'Organization Onboarding',
      blurb:
        'Multi-tenant onboarding for a clinical AI platform — CRUD API over 4 resources, SSO, member management, RBAC, React admin portal. Sole author, unit + integration + Pact tested.',
      tags: ['TypeScript', 'Koa', 'MongoDB', 'React'],
    },
    {
      kicker: 'HARRISON.AI · SECURITY',
      title: 'Secrets Management',
      blurb:
        'Found an analytics key extractable from the Electron bundle — designed the fix across 5 layers: admin service, AWS SSM/KMS, BFF proxy, React UI, IAM. 70 tests. Design doc + RBAC model authored.',
      tags: ['AWS SSM/KMS', 'IAM', 'Node'],
    },
    {
      kicker: 'UNSW MECHATRONICS',
      title: 'Maze-Solving Robot',
      blurb:
        "Autonomous robot that maps unknown mazes with sonar + IMU, plans optimal routes with Dijkstra, and reads arbitrary maze layouts from a bird's-eye camera via an OpenCV pipeline.",
      tags: ['Python', 'OpenCV', 'Dijkstra'],
    },
    {
      kicker: 'UNSW · BACKEND',
      title: 'Seams — Team Messaging',
      blurb:
        'Node.js REST API replicating core Microsoft-Teams-style functionality — channels, messaging, auth — integrated with the front-end client.',
      tags: ['Node.js', 'REST', 'Auth'],
    },
  ],
  education: {
    institution: 'University of New South Wales',
    degree: 'Bachelor of Engineering (Honours) — Mechatronic Engineering',
    period: '2021 — JUN 2025 · SYDNEY',
    reflectionLead:
      'Robotics taught me systems thinking — sensors, control loops, failure modes. I bring the same discipline to software: ',
    reflectionEmphasis: 'everything is a system, and every system can fail in ways you should have tested for.',
  },
  contact: {
    title: [{ text: "LET'S " }, { text: 'BUILD', style: 'outline-accent' }, { text: '.', style: 'accent' }],
    tagline: 'Open to interesting problems — especially ones where correctness actually matters.',
    email: 'jassol2013@gmail.com',
    github: 'https://github.com/jason-sol',
    linkedin: 'https://www.linkedin.com/in/jason-solanki-099648355/',
  },
  footer: {
    copyright: '© 2026 JASON SOLANKI',
    location: 'SYDNEY, NSW',
    credit: 'DESIGNED & BUILT BY ME',
  },
}
