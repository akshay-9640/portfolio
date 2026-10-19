import Nav from "./components/Nav";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Process from "./components/Process";
import Chat from "./components/Chat";
import Palette from "./components/Palette";
import Certifications from "./components/Certifications";
import Experience from "./components/Experience";
import Achievements from "./components/Achievements";
import Contact from "./components/Contact";

export default function App() {
  return (
    <>
      <Nav />
      <Palette />
      <Chat />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Process />
        <Certifications />
        <Experience />
        <Achievements />
        <Contact />
      </main>
    </>
  );
}
