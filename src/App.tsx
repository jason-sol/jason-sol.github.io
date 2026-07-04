import { About } from './components/sections/About'
import { Contact } from './components/sections/Contact'
import { Footer } from './components/sections/Footer'
import { Hero } from './components/sections/Hero'
import { Nav } from './components/sections/Nav'
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
        <Contact />
      </main>
      <Footer />
    </>
  )
}
