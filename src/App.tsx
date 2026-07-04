import { About } from './components/sections/About'
import { Contact } from './components/sections/Contact'
import { Experience } from './components/sections/Experience'
import { Footer } from './components/sections/Footer'
import { Hero } from './components/sections/Hero'
import { Nav } from './components/sections/Nav'
import { Projects } from './components/sections/Projects'
import { Stack } from './components/sections/Stack'
import { Ticker } from './components/sections/Ticker'

export function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Ticker />
        <About />
        <Stack />
        <Experience />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
