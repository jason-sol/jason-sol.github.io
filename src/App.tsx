import { Contact } from './components/sections/Contact'
import { Footer } from './components/sections/Footer'
import { Hero } from './components/sections/Hero'
import { Nav } from './components/sections/Nav'

export function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
