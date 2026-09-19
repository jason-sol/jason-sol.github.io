export interface NavLink {
  label: string
  href: string
  arrow?: boolean
}

export type StatKey = 'pullRequests' | 'repositories' | 'patients' | 'facilities' | 'services' | 'risks'

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

export type ImpactItem = ({ statKey: StatKey } | { label: string; value: string }) & { accent?: boolean }

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

export interface ResumeRequest {
  label: string
  subject: string
  body: string
}

export interface ContactContent {
  title: HeadlineSegment[]
  tagline: string
  email: string
  github: string
  linkedin: string
  resume: ResumeRequest
}

export interface Practice {
  title: string
  body: string
}

export interface FooterContent {
  copyrightName: string
  location: string
  credit: string
}

export interface Site {
  brand: NavLink
  repoUrl: string
  nav: NavLink[]
  heroPhases: HeroPhase[]
  stats: Record<StatKey, Stat>
  ticker: TickerItem[]
  sectionLabels: Record<
    'about' | 'stack' | 'agentic' | 'experience' | 'projects' | 'education' | 'contact',
    string
  >
  about: AboutContent
  stackGroups: StackGroup[]
  practices: Practice[]
  roles: Role[]
  projects: Project[]
  education: EducationContent
  contact: ContactContent
  footer: FooterContent
}

const stats: Record<StatKey, Stat> = {
  pullRequests: { value: '180+', label: 'pull requests' },
  repositories: { value: '18', label: 'repositories' },
  patients: { value: '6M+', label: 'patients' },
  facilities: { value: '1,000+', label: 'facilities' },
  services: { value: '~12', label: 'services' },
  risks: { value: '~8', label: 'risks mitigated' },
}

/** The shared stat entity for a key. */
export function resolveStat(key: StatKey): Stat {
  return stats[key]
}

/** The canonical "value label" rendering of a stat (e.g. "6M+ patients"). */
export function formatStat(key: StatKey): string {
  const stat = stats[key]
  return `${stat.value} ${stat.label}`
}

export const site: Site = {
  brand: { label: 'JASON SOLANKI', href: '#top' },
  repoUrl: 'https://github.com/jason-sol/jason-sol.github.io',
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
      sub: 'Software engineer at Harrison.ai. Sydney, Australia.',
    },
    {
      eyebrow: '01 — THE PLATFORM',
      headline: [
        { text: 'Radiology AI for ' },
        { statKey: 'patients', style: 'accent' },
        { text: ' a year, in ' },
        { statKey: 'facilities', style: 'outline' },
        { text: '.' },
      ],
      sub: "Annalise.ai reads over a third of NHS England's chest X-rays. I work on HOP, the reporting and teleradiology platform next to it.",
    },
    {
      eyebrow: '02 — THE WORK',
      headline: [{ text: 'I build features ' }, { text: 'end to end', style: 'serif-accent' }, { text: '.' }],
      pipeline: ['design doc', 'API', 'UI', 'infra', 'production'],
      sub: 'I wrote Organization Onboarding on my own, from the design doc through to production.',
    },
    {
      eyebrow: '03 — THE BUGS',
      headline: [{ text: 'Some of what I ' }, { text: 'found', style: 'outline-accent' }, { text: '.' }],
      badges: [
        { tone: 'high', text: 'HIGH — bearer tokens in production logs · redacted' },
        { tone: 'warn', text: 'Patient name and DOB in session replays · masked' },
        { tone: 'ok', text: '~8 safety, privacy and security risks mitigated' },
      ],
    },
  ],
  stats,
  ticker: [
    { statKey: 'pullRequests' },
    { statKey: 'repositories' },
    { text: 'TYPESCRIPT · GO · C#' },
    { statKey: 'patients' },
    { statKey: 'facilities' },
    { text: 'TESTS BEFORE CODE' },
  ],
  sectionLabels: {
    about: '04 — ABOUT',
    stack: '05 — STACK',
    agentic: '06 — AI ENGINEERING',
    experience: '07 — EXPERIENCE',
    projects: '08 — SELECTED WORK',
    education: '09 — EDUCATION',
    contact: '10 — CONTACT',
  },
  about: {
    figCaption: 'FIG. 01 — SCROLL TO DEVELOP',
    statement:
      "I work on HOP, Harrison's radiology reporting and teleradiology platform. Most days that means an API, some React, and the Terraform underneath. I write the test before the code. When something breaks in production I go and read the logs until I know why.",
    stats: [
      { value: 70, caption: 'tests on the secrets system I designed' },
      { value: 22, caption: 'frontend defects I fixed in the radiology viewer' },
      { value: 15, suffix: 'm', accent: true, caption: 'CI run that replaced 6–7 hours of manual regression' },
    ],
  },
  stackGroups: [
    { title: 'Languages', items: ['TypeScript', 'Go', 'Python', 'C#', 'C / C++', 'SQL', 'Bash', 'HCL'] },
    { title: 'Frontend', items: ['React', 'Next.js', 'Zustand', 'Electron', 'Material UI'] },
    {
      title: 'Backend & APIs',
      items: ['Node.js / Koa / Express', 'REST / OpenAPI', '.NET', 'MongoDB', 'Zod', 'JWT / RBAC'],
    },
    {
      title: 'Testing',
      items: ['Playwright', 'Pact contract testing', 'Vitest', 'Jest', 'React Testing Library', 'Cypress'],
      highlight: true,
    },
    {
      title: 'Platform & DevOps',
      items: [
        'AWS · SSM · KMS · IAM · SQS',
        'GCP',
        'Docker',
        'Kubernetes / Helm / ArgoCD',
        'GitHub Actions',
        'Terraform / Terragrunt',
        'Grafana / Loki',
        'PostHog',
      ],
    },
    {
      title: 'AI agentic tooling',
      items: ['Claude Code', 'Custom skills', 'MCP connectors', 'Hooks & guardrails', 'Spec-driven development'],
    },
    {
      title: 'Medical imaging',
      items: ['DICOM / DICOMWeb', 'PACS', 'HL7 / FHIR / FHIRcast', 'PHI handling', 'Medical-device V&V'],
    },
  ],
  practices: [
    {
      title: 'Architecture first',
      body: 'Every feature starts as a written design spec, an implementation plan and a domain glossary, before any code. I use Claude Code to pressure-test the design, then break the approved plan into small increments I can review one at a time.',
    },
    {
      title: 'Tests before code',
      body: 'Red, green, refactor. The failing test goes in before the implementation, so generated code is verified before it lands. 480+ automated tests across two personal products, plus the Pact, integration and Vitest suites at Harrison.',
    },
    {
      title: 'Custom skills',
      body: 'I run and extend an agentic toolkit for my squad: cutting releases and promoting them through staging to production, sprint changelogs and PR summaries for product owners, Jira ticket-hygiene audits, retro prep. Multi-step operational work becomes one repeatable command.',
    },
    {
      title: 'MCP connectors',
      body: 'Claude Code is wired into Jira, Confluence, Slack, GitHub and PostHog, so the agent works against live tickets, documentation, pull requests and product analytics instead of context I paste in by hand.',
    },
    {
      title: 'Hooks and guardrails',
      body: 'Repository conventions live in CLAUDE.md and AGENTS.md, and hooks enforce them: formatting, lint and tests on edit, plus protected-file and secret-pattern checks. AI-assisted changes meet the bar before a human reviews them.',
    },
    {
      title: 'First-pass review',
      body: 'Claude reviews my pull requests before I send them, looking for bugs, security smells, missing tests and contract-test gaps. 180+ production pull requests across 18 repositories in year one, and two full-stack products shipped solo.',
    },
  ],
  roles: [
    {
      company: 'Harrison.ai',
      title: 'SOFTWARE ENGINEER',
      period: 'JUL 2026 — PRESENT',
      location: 'SYDNEY',
      bullets: [
        'Promoted to the L2 "Independent" level 12 months after joining the graduate program, and moved onto the HOP squad: reporting system, Rad Agent Router, admin service and portal, and the cloud configuration for live teleradiology customers.',
        'Found raw bearer tokens and request bodies being written to logs during organisation creation, which made token replay possible. Fixed it with log redaction and regression tests, and masked patient name and date of birth that were leaking into PostHog session replays.',
        'Traced a production patient-load failure to an all-or-nothing Promise.all of FHIR calls, then redesigned the fetch path so one failed call no longer blanks the page.',
        'Rolled the Rad Agent Router to production across 3 repositories, and built the PostHog feature-flag pipeline in Terraform and Terragrunt: 11 flags, 3 environments, parallel matrix plan-apply CI.',
      ],
    },
    {
      company: 'Harrison.ai',
      title: 'GRADUATE SOFTWARE ENGINEER',
      period: 'JUL 2025 — JUN 2026',
      location: 'SYDNEY',
      bullets: [
        'Sole author of Organization Onboarding: a CRUD /organizations API over 4 resources with SSO, members and roles in Node and TypeScript, plus the React admin portal and the BFF integration. Every endpoint shipped with unit, integration and Pact contract tests.',
        'Designed an SSM-backed secrets-management system across 5 layers (admin service, AWS SSM/KMS, BFF proxy, React UI, IAM) after finding an analytics API key that could be pulled straight out of the Electron desktop bundle. Wrote the design doc, the RBAC model and 70 tests.',
        'Built inference-output validation for the chest X-ray and CT chest models using Zod discriminated unions keyed by model type, so malformed model output is rejected before a radiologist ever sees it.',
        'Moved the admin service to an npm-workspaces monorepo with a shared schema package and a published client, and led error-code consolidation across 5 services.',
      ],
      impactLog: [
        { statKey: 'pullRequests', accent: true },
        { statKey: 'repositories' },
        { statKey: 'services' },
        { label: 'languages', value: 'TS · Go · C#' },
      ],
    },
    {
      company: 'Annalise.ai',
      title: 'INTERN SOFTWARE TEST ENGINEER',
      period: 'FEB 2025 — JUN 2025',
      location: 'SYDNEY',
      bullets: [
        'Built the radiology-viewer end-to-end suite: ~9 Playwright spec suites and ~20 scenarios covering PACS study open and close, panels, authentication and error handling, on a Page Object Model, run cross-browser and on Electron on a Windows GPU runner.',
        'Cut 6–7 hours of manual regression per release down to a 15–20 minute CI run, which surfaced panel-state, layout and clinical-correctness defects. One of them was a PanCan malignancy calculation with no pinned default when patient sex was missing.',
        'Fixed ~22 frontend defects in the viewer (edit-report panel, segmentation and bounding-box rendering, auth and session handling) and wrote the medical-device V&V verification protocols.',
      ],
    },
    {
      company: 'SATO Vicinity',
      title: 'ENGINEERING INTERN',
      period: 'MAY 2024 — FEB 2025',
      location: 'SYDNEY',
      bullets: [
        'Production testing and fault diagnosis on RFID hardware using oscilloscopes, meters and bench supplies, down to SMD-level soldering and circuit repair.',
        'Built and tested prototypes under design-engineering direction: PCB layout in Altium Designer, and mechanical test jigs in SolidWorks for repeatable hands-free verification.',
      ],
    },
  ],
  projects: [
    {
      kicker: 'HARRISON.AI · PRODUCTION',
      title: 'Organization Onboarding',
      blurb:
        'Multi-tenant onboarding for a clinical AI platform. A CRUD API over 4 resources with SSO, members and roles, plus the React admin portal and the BFF integration. I wrote all of it, with unit, integration and Pact contract tests on every endpoint.',
      tags: ['TypeScript', 'Koa', 'MongoDB', 'React'],
    },
    {
      kicker: 'HARRISON.AI · SECURITY',
      title: 'Secrets Management',
      blurb:
        'An analytics API key could be pulled straight out of the Electron desktop bundle. The fix spans 5 layers: admin service, AWS SSM and KMS, a BFF proxy, the React UI, and IAM. I wrote the design doc, the RBAC model and 70 tests.',
      tags: ['AWS SSM/KMS', 'IAM', 'Node'],
    },
    {
      kicker: 'UNSW MECHATRONICS',
      title: 'Maze-Solving Robot',
      blurb:
        "An autonomous robot that maps an unknown maze with sonar and an IMU, then plans the shortest route with Dijkstra. An OpenCV pipeline reads arbitrary maze layouts from a bird's-eye camera.",
      tags: ['Python', 'OpenCV', 'Dijkstra'],
    },
    {
      kicker: 'UNSW · BACKEND',
      title: 'Seams — Team Messaging',
      blurb:
        'A TypeScript and Node REST API for a Microsoft Teams clone, built with a team over three iterations. Token auth, channels, DMs, messaging, standups and admin permissions, with Jest suites and CI throughout, then integrated with the frontend client.',
      tags: ['TypeScript', 'Express', 'Jest'],
    },
  ],
  education: {
    institution: 'University of New South Wales',
    degree: 'Bachelor of Engineering (Honours) — Mechatronic Engineering',
    period: 'FEB 2021 — JUN 2025 · SYDNEY',
    reflectionLead:
      'An Engineers Australia accredited honours program covering control systems, embedded software and robotics. I specialised in software, with industry training at SATO Vicinity, Annalise.ai and Harrison.ai. ',
    reflectionEmphasis: 'Control systems is where I first had to design for the sensor being wrong.',
  },
  contact: {
    title: [{ text: 'GET IN ' }, { text: 'TOUCH', style: 'outline-accent' }, { text: '.', style: 'accent' }],
    tagline: 'Happy to talk about backend work, testing, or anything medical imaging. Email is the fastest way to reach me.',
    email: 'jassol2013@gmail.com',
    github: 'https://github.com/jason-sol',
    linkedin: 'https://www.linkedin.com/in/jason-solanki-099648355/',
    resume: {
      label: 'Request my resume',
      subject: 'Resume request',
      body: 'Hi Jason,\n\nCould you send me a copy of your resume?\n\nName:\nCompany:\nRole:\nWhat the role involves:\n\nThanks,\n',
    },
  },
  footer: {
    copyrightName: 'JASON SOLANKI',
    location: 'SYDNEY, NSW',
    credit: 'DESIGNED AND BUILT BY ME — SOURCE',
  },
}
