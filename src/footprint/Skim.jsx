// The 45-second lane for assessors (audience 1 in the audience brief):
// four cards computed from the same aggregates as the full page, ending at
// the method and a contact action. Rendered for the worked example only;
// a visitor running their own audit has a different job to be done.

import SplitText from '../components/SplitText';
import { CONTACT } from '../data/content';
import { FACTOR_SET } from './data/factors';
import { METHOD, SKIM, fmtT } from './data/copy';
import { AUS_AVG } from './data/benchmarks';
import Icon from './Icons';

export default function Skim({ agg, macc }) {
  const topLever = macc
    .filter((r) => r.applicable && r.reduction > 0)
    .sort((a, b) => b.reduction - a.reduction)[0];

  const values = {
    number: (
      <>
        <div className="fp-skim-v">{fmtT(agg.total)}<span> {SKIM.numberUnit}</span></div>
        <div className="fp-skim-s">{Math.round((agg.total / AUS_AVG.tco2e) * 100)}% {SKIM.numberSub}</div>
      </>
    ),
    engine: (
      <>
        <div className="fp-skim-v">{agg.count}<span> {SKIM.engineUnit}</span></div>
        <div className="fp-skim-s">{SKIM.engineSub}</div>
      </>
    ),
    plan: (
      <>
        <div className="fp-skim-v">{topLever ? '-' + fmtT(topLever.reduction) : '0'}<span> {SKIM.planUnit}</span></div>
        <div className="fp-skim-s">{topLever ? topLever.action : SKIM.planSub}</div>
      </>
    ),
    method: (
      <>
        <div className="fp-skim-v fp-skim-mono">{FACTOR_SET.id}</div>
        <div className="fp-skim-s">{METHOD.exclusions.items.length} {SKIM.methodSub}</div>
      </>
    ),
  };

  return (
    <section id="fp-skim" aria-label="The 45-second version">
      <div className="canvas">
        {/* Unnumbered: the numbered sequence starts at the audit below. */}
        <div className="sec-tag" data-idx="./ "><Icon name="spark" size={16} />The short version</div>
        <h2 className="display fp-h2"><SplitText text={SKIM.title[0]} /> <SplitText text={SKIM.title[1]} accentIndex={3} /></h2>
        <p className="fp-sub">{SKIM.lede}</p>
        <div className="fp-skim-grid">
          {SKIM.cards.map((c, i) => (
            <a className="fp-skim-card" href={c.href} key={c.id}>
              <div className="fp-skim-n">{'0' + (i + 1)}</div>
              <div className="fp-skim-label">{c.label}</div>
              {values[c.id]}
              <p className="fp-skim-line">{c.line}</p>
              <span className="fp-skim-cta">{c.cta} ↓</span>
            </a>
          ))}
        </div>
        <div className="fp-skim-contact">
          <p>{SKIM.contact}</p>
          <div className="fp-ctrl-row">
            <a className="btn btn-primary fp-btn" href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer">{SKIM.contactCta} ↗</a>
            <a className="fp-linkbtn" href="../#contact">{SKIM.contactProfile} →</a>
          </div>
        </div>
      </div>
    </section>
  );
}
