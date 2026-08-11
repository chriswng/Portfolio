import { useEffect, useMemo, useRef, useState } from 'react';
import { SHARE_ST } from '../data/storyCopy';
import { renderShare, shareCanvas, downloadCanvas, canShareImage } from '../lib/shareCard';

const slug = (s) => String(s || '').replace(/[^a-z0-9-]+/gi, '-').toLowerCase();

// The share sheet: draw the chosen card, show it, then let the visitor send it
// to a story, a post or LinkedIn, or save the PNG. The card is only ever drawn
// in this browser; "Share" hands the file to the native share sheet where it
// exists (mobile), and falls back to a download everywhere else.
export default function ShareSheet({ kind, data, linkedIn, initialFormat, onClose }) {
  // Freeze the card inputs at open time: the underlying moment does not change
  // while the sheet is up, and this keeps the preview effect from re-running on
  // every parent render (data is an inline literal upstream).
  const frozen = useRef({ kind, data, linkedIn });
  const { kind: k, data: d, linkedIn: li } = frozen.current;

  const formats = useMemo(() => {
    const base = ['story', 'post'];
    if (li) base.push('linkedin');
    return base;
  }, [li]);

  // Open on the format the caller's preview showed, so preview and sheet agree.
  const [fmt, setFmt] = useState(() => (formats.includes(initialFormat) ? initialFormat : 'story'));
  const [url, setUrl] = useState('');
  const [busy, setBusy] = useState(true);
  const [status, setStatus] = useState('');
  const canvasRef = useRef(null);
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const tabRefs = useRef({});
  const urlRef = useRef('');
  const canNativeShare = useMemo(() => canShareImage(), []);

  // Draw a fresh preview whenever the format changes. The outgoing preview's
  // blob URL stays alive until its replacement exists, so the img never
  // points at a revoked URL mid-switch; the last URL is revoked on unmount.
  useEffect(() => {
    let alive = true;
    setBusy(true);
    setStatus('');
    (async () => {
      let canvas;
      try { canvas = await renderShare(fmt, k, d, li); }
      catch { if (alive) setBusy(false); return; }
      if (!alive) return;
      canvasRef.current = canvas;
      canvas.toBlob((blob) => {
        if (!alive || !blob) { if (alive) setBusy(false); return; }
        const objUrl = URL.createObjectURL(blob);
        if (urlRef.current) URL.revokeObjectURL(urlRef.current);
        urlRef.current = objUrl;
        setUrl(objUrl);
        setBusy(false);
      }, 'image/png');
    })();
    return () => { alive = false; };
  }, [fmt, k, d, li]);
  useEffect(() => () => { if (urlRef.current) URL.revokeObjectURL(urlRef.current); }, []);

  // Modal chrome: focus in, scroll lock, Escape to close, Tab trapped inside
  // the dialog, focus back on exit.
  useEffect(() => {
    const opener = document.activeElement;
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const focusables = Array.from(dialogRef.current.querySelectorAll('button, [href], [tabindex]'))
        .filter((el) => !el.disabled && el.getAttribute('tabindex') !== '-1');
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!dialogRef.current.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
      else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      if (opener && typeof opener.focus === 'function') opener.focus({ preventScroll: true });
    };
  }, [onClose]);

  // Roving radio focus: arrow keys move selection and focus together.
  const onTabKey = (e) => {
    const i = formats.indexOf(fmt);
    let next = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = formats[(i + 1) % formats.length];
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = formats[(i - 1 + formats.length) % formats.length];
    if (!next) return;
    e.preventDefault();
    setFmt(next);
    tabRefs.current[next]?.focus();
  };

  const filename = () => 'carbon-footprint-' + k + '-' + fmt + '-' + slug(d.fy) + '.png';

  const onShare = async () => {
    if (!canvasRef.current || busy) return;
    setStatus('');
    const result = await shareCanvas(canvasRef.current, filename(), SHARE_ST.shareText);
    if (result === 'shared') setStatus(SHARE_ST.sheet.shared);
    else if (result === 'saved') setStatus(SHARE_ST.sheet.saved);
  };
  const onSave = async () => {
    if (!canvasRef.current || busy) return;
    setStatus('');
    const ok = await downloadCanvas(canvasRef.current, filename());
    if (ok) setStatus(SHARE_ST.sheet.saved);
  };

  return (
    <div className="st-sheet-scrim" onClick={onClose}>
      <div
        className="st-sheet"
        role="dialog"
        aria-modal="true"
        aria-label={SHARE_ST.sheet.title}
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="st-sheet-head">
          <div>
            <div className="st-sheet-title">{SHARE_ST.sheet.title}</div>
            <p className="st-sheet-sub">{SHARE_ST.sheet.sub}</p>
          </div>
          <button type="button" className="st-sheet-x" aria-label={SHARE_ST.sheet.close} onClick={onClose} ref={closeRef}>×</button>
        </div>

        <div className="st-sheet-tabs" role="radiogroup" aria-label={SHARE_ST.sheet.formatLabel}>
          {formats.map((f) => (
            <button
              key={f}
              type="button"
              role="radio"
              className={'st-sheet-tab' + (fmt === f ? ' on' : '')}
              aria-checked={fmt === f}
              tabIndex={fmt === f ? 0 : -1}
              onClick={() => setFmt(f)}
              onKeyDown={onTabKey}
              ref={(el) => { tabRefs.current[f] = el; }}
            >
              {SHARE_ST.sheet.formats[f]}
            </button>
          ))}
        </div>

        <div className={'st-sheet-preview st-sheet-' + fmt}>
          {url && <img src={url} alt={SHARE_ST.sheet.previewAlt} />}
          {busy && <span className="st-sheet-loading">{SHARE_ST.sheet.rendering}</span>}
        </div>
        <p className="st-sheet-fmtnote">{SHARE_ST.sheet.formatNote[fmt]}</p>

        <div className="st-sheet-actions">
          <button type="button" className="btn btn-primary fp-btn" onClick={onShare} disabled={busy}>
            {SHARE_ST.sheet.share} ↗
          </button>
          <button type="button" className="st-sheet-save" onClick={onSave} disabled={busy}>
            {SHARE_ST.sheet.save} ⤓
          </button>
        </div>
        <p className="st-sheet-hint">{canNativeShare ? SHARE_ST.sheet.shareHint : SHARE_ST.sheet.saveHint}</p>
        <span className="sr-only" role="status">{status}</span>
      </div>
    </div>
  );
}
