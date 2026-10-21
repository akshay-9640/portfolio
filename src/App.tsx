import Nav from "./components/Nav";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Process from "./components/Process";
import Chat from "./components/Chat";
import Experience from "./components/Experience";
import Contact from "./components/Contact";
import Intro from "./components/Intro";
import TravelBadge from "./components/TravelBadge";

export default function App() {
  return (
    <>
      <Intro />
      <Nav />
      <Chat />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Process />
        <Experience />
        <Contact />
      </main>
      <TravelBadge />
    </>
  );
}
