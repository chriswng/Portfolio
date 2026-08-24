import { useState } from 'react';
import { GATE, PRIVATE_TOOLS } from '../data/content';
import { isUnlocked, unlock } from '../lib/gate';
import Mark from './Mark';

// The passphrase screen in front of the drafts at /lab/ and the tool pages it
// indexes. One component for all of them, so a draft can be opened straight
// from its own URL rather than only through the index, and so there is one
// place to change how the ask reads. What the gate does and does not amount to
// is written out in src/lib/gate.js.
//
// `tool` is a PRIVATE_TOOLS spec id, so a draft's own page names the draft
// being asked for and the name is read from the tool index rather than typed
// into an entry file. The index at /lab/ passes none and takes the generic
// title, because there it is the whole bench that is shut.
export default function Gate({ children, tool, home = '../' }) {
  const name = PRIVATE_TOOLS.find((t) => t.spec === tool)?.name;
  const [open, setOpen] = useState(() => isUnlocked());
  const [entry, setEntry] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (open) return children;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    const result = await unlock(entry);
    setBusy(false);
    if (result === true) { setOpen(true); return; }
    // null is the browser refusing to hash rather than a wrong passphrase, and
    // saying "wrong" to someone who typed the right thing wastes their evening.
    setError(result === null ? GATE.unavailable : GATE.wrong);
    setEntry('');
  };

  return (
    <main className="gate">
      <div className="gate-card">
        <a href={home} className="gate-mark" aria-label={GATE.homeAria}><Mark /></a>
        <div className="gate-eyebrow">{GATE.eyebrow}</div>
        <h1 className="display gate-title">{name || GATE.title}</h1>
        <p className="gate-body">{GATE.body}</p>
        <form className="gate-form" onSubmit={onSubmit}>
          <label className="gate-label" htmlFor="gate-pass">{GATE.label}</label>
          <div className="gate-row">
            <input
              id="gate-pass"
              className="gate-input"
              type="password"
              autoComplete="current-password"
              autoFocus
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              aria-describedby={error ? 'gate-error' : undefined}
              aria-invalid={error ? 'true' : undefined}
            />
            <button type="submit" className="btn btn-primary gate-btn" disabled={busy || !entry}>
              {busy ? GATE.checking : GATE.submit}
            </button>
          </div>
          <p className="gate-error" id="gate-error" role="alert">{error}</p>
        </form>
        <a className="gate-back" href={home}>← {GATE.back}</a>
      </div>
    </main>
  );
}
