import { useState } from 'react'
import { About } from './components/sections/About'
import { Contact } from './components/sections/Contact'
import { Education } from './components/sections/Education'
import { Experience } from './components/sections/Experience'
import { Footer } from './components/sections/Footer'
import { Hero } from './components/sections/Hero'
import { Nav } from './components/sections/Nav'
import { Projects } from './components/sections/Projects'
import { Stack } from './components/sections/Stack'
import { Ticker } from './components/sections/Ticker'
import { CursorTrail } from './components/effects/CursorTrail'
import { IntroOverlay } from './components/effects/IntroOverlay'
import { Orb } from './components/effects/Orb'

export function App() {
  const [introDone, setIntroDone] = useState(false)
  const [entranceKey, setEntranceKey] = useState(0)

  const handleIntroDone = (played: boolean) => {
    setIntroDone(true)
    // Replay the hero entrance only when the intro actually covered it.
    if (played) setEntranceKey((key) => key + 1)
  }

  return (
    <>
      {!introDone && <IntroOverlay onDone={handleIntroDone} />}
      <CursorTrail />
      <Orb introDone={introDone} />
      <Nav />
      <main>
        <Hero entranceKey={entranceKey} />
        <Ticker />
        <About />
        <Stack />
        <Experience />
        <Projects />
        <Education />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
