import { Contact } from './components/sections/Contact'
import { Footer } from './components/sections/Footer'
import { Nav } from './components/sections/Nav'

export function App() {
  return (
    <>
      <Nav />
      <main>
        <Contact />
      </main>
      <Footer />
    </>
  )
}
