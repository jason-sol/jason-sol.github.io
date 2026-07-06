import { describe, expect, it } from 'vitest'
import { formatStat, resolveStat, site } from './site'

describe('Content model invariants', () => {
  it('has exactly 4 hero phases', () => expect(site.heroPhases).toHaveLength(4))
  it('nav WORK link targets the experience section', () => {
    const work = site.nav.find((l) => l.label === 'WORK')
    expect(work?.href).toBe('#experience')
  })
  it('contact email is a valid mailto target', () =>
    expect(site.contact.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
  it('ticker stat items reference the shared stats entity (single-sourced)', () => {
    const statItems = site.ticker.filter((t) => 'statKey' in t)
    expect(statItems.length).toBeGreaterThanOrEqual(3)
    for (const t of statItems) expect(site.stats).toHaveProperty(t.statKey)
  })
  it('contains no phone number anywhere', () =>
    expect(JSON.stringify(site)).not.toMatch(/\d{4}\s?\d{3}\s?\d{3}/))
  it('external links are https', () => {
    for (const l of [site.contact.github, site.contact.linkedin]) expect(l).toMatch(/^https:\/\//)
  })
  it('every project has 1+ tags and non-empty blurb', () => {
    for (const p of site.projects) {
      expect(p.tags.length).toBeGreaterThan(0)
      expect(p.blurb.length).toBeGreaterThan(20)
    }
  })
})

describe('stat resolution', () => {
  it('resolveStat returns the shared stat entity for a key', () => {
    expect(resolveStat('clinicians')).toBe(site.stats.clinicians)
    expect(resolveStat('pullRequests')).toBe(site.stats.pullRequests)
  })

  it('formatStat renders the canonical "value label" string', () => {
    expect(formatStat('clinicians')).toBe('3,500+ clinicians')
    expect(formatStat('repositories')).toBe('18 repositories')
  })
})
