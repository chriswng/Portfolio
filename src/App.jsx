import { Grain, ScrollProgress, Nav, SkipLink } from './components/Chrome';
import Hero from './components/Hero';
import Bio from './components/Bio';
import Principles from './components/Principles';
import Ticker from './components/Ticker';
import Scenario from './components/Scenario';
import Experience from './components/Experience';
import Contact from './components/Contact';
import StripesFooter from './components/StripesFooter';

export default function App() {
  return (
    <>
      <SkipLink />
      <Grain />
      <ScrollProgress />
      <Nav />
      <main id="main-content">
        <Hero />
        <Bio />
        <Principles />
        <Ticker />
        <Scenario />
        <Experience />
        <Contact />
      </main>
      <StripesFooter />
    </>
  );
}
