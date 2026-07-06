import { act, render, screen } from '@testing-library/react'
import { Profiler } from 'react'
import { site } from '../../content/site'
import { Experience } from './Experience'
import styles from './Experience.module.css'

it('uses id="experience" as the section anchor', () => {
  const { container } = render(<Experience />)
  expect(container.querySelector('section#experience')).not.toBeNull()
})

it('renders the section label as a level-2 heading', () => {
  render(<Experience />)
  expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(site.sectionLabels.experience)
})

it('renders every role with its company, title, and period', () => {
  const { container } = render(<Experience />)
  for (const role of site.roles) {
    expect(screen.getByText(role.company)).toBeInTheDocument()
    expect(screen.getByText(role.title)).toBeInTheDocument()
    expect(container.textContent).toContain(role.period)
  }
})

it('renders impact log rows resolved against the shared stats record', () => {
  const { container } = render(<Experience />)
  const impactLog = site.roles.find((r) => r.impactLog)!.impactLog!
  const rows = container.querySelectorAll('[data-impact-row]')
  expect(rows).toHaveLength(impactLog.length)
  for (const item of impactLog) {
    if ('statKey' in item) {
      const stat = site.stats[item.statKey]
      expect(screen.getByText(stat.label)).toBeInTheDocument()
      expect(screen.getByText(stat.value)).toBeInTheDocument()
    } else {
      expect(screen.getByText(item.label)).toBeInTheDocument()
      expect(screen.getByText(item.value)).toBeInTheDocument()
    }
  }
})

it('accents only the impact-log values flagged accent in the content model', () => {
  render(<Experience />)
  const impactLog = site.roles.find((r) => r.impactLog)!.impactLog!
  const accented = impactLog.filter((item) => item.accent)
  expect(accented.length).toBeGreaterThan(0)
  for (const item of accented) {
    const value = 'statKey' in item ? site.stats[item.statKey].value : item.value
    expect(screen.getByText(value)).toHaveClass(styles.impactValueAccent)
  }
  const plain = impactLog.filter((item) => !item.accent)
  expect(plain.length).toBeGreaterThan(0)
  for (const item of plain) {
    const value = 'statKey' in item ? site.stats[item.statKey].value : item.value
    expect(screen.getByText(value)).not.toHaveClass(styles.impactValueAccent)
  }
})

it('hides the decorative timeline svg from assistive tech', () => {
  const { container } = render(<Experience />)
  expect(container.querySelector('[data-tl-svg]')).toHaveAttribute('aria-hidden', 'true')
})

describe('timeline progress quantization', () => {
  let rafCallbacks: FrameRequestCallback[]
  let rafSpy: ReturnType<typeof vi.spyOn>
  let rectSpy: ReturnType<typeof vi.spyOn>
  let top: number

  beforeEach(() => {
    rafCallbacks = []
    rafSpy = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      rafCallbacks.push(cb)
      return rafCallbacks.length
    })
    rectSpy = vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(
      () =>
        ({
          top,
          left: 0,
          right: 0,
          bottom: 0,
          width: 0,
          height: 1000,
          x: 0,
          y: 0,
          toJSON() {},
        }) as DOMRect,
    )
  })

  afterEach(() => {
    rafSpy.mockRestore()
    rectSpy.mockRestore()
  })

  const flushRaf = () => {
    act(() => {
      const pending = rafCallbacks.splice(0)
      pending.forEach((cb) => cb(0))
    })
  }

  it('skips re-rendering for sub-epsilon scroll deltas but re-renders for real movement', () => {
    let commits = 0
    top = 402
    render(
      <Profiler id="experience" onRender={() => commits++}>
        <Experience />
      </Profiler>,
    )
    flushRaf()

    // Settling frame: React renders once more before bailing out on a first same-value update.
    window.dispatchEvent(new Event('scroll'))
    flushRaf()
    const baseline = commits

    // Sub-epsilon movement: same quantized timeline progress.
    top = 401.5
    window.dispatchEvent(new Event('scroll'))
    flushRaf()
    expect(commits).toBe(baseline)

    // Real movement: state must update.
    top = 100
    window.dispatchEvent(new Event('scroll'))
    flushRaf()
    expect(commits).toBeGreaterThan(baseline)
  })
})
