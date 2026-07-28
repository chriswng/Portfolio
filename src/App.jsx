import { Grain, ScrollProgress, Nav, SkipLink } from './components/Chrome';
import Hero from './components/Hero';
import Bio from './components/Bio';
import Principles from './components/Principles';
import Scenario from './components/Scenario';
import Tools from './components/Tools';
import Experience from './components/Experience';
import SiteFooter from './components/SiteFooter';

export default function App() {
  return (
    <>
      <SkipLink />
      <Grain />
      <ScrollProgress />
      <Nav />
      <main id="main-content" className="page-home">
        <Hero />
        <Bio />
        <Principles />
        <Scenario />
        <Tools />
        <Experience />
      </main>
      <SiteFooter />
    </>
  );
}
