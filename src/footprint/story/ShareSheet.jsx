import { useEffect, useMemo, useRef, useState } from 'react';
import { SHARE_ST } from '../data/storyCopy';
import { renderShare, shareCanvas, downloadCanvas, canShareImage } from '../lib/shareCard';

const slug = (s) => String(s || '').replace(/[^a-z0-9-]+/gi, '-').toLowerCase();

// The share sheet: draw the chosen card, show it, then let the visitor send it
// to a story, a post or LinkedIn, or save the PNG. The card is only ever drawn
// in this browser; "Share" hands the file to the native share sheet where it
// exists (mobile), and falls back to a download everywhere else.
export default function ShareSheet({ kind, data, linkedIn, onClose }) {
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

  const [fmt, setFmt] = useState('story');
  const [url, setUrl] = useState('');
  const [busy, setBusy] = useState(true);
  const [status, setStatus] = useState('');
  const canvasRef = useRef(null);
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const canNativeShare = useMemo(() => canShareImage(), []);

  // Draw a fresh preview whenever the format changes.
  useEffect(() => {
    let alive = true;
    let objUrl = '';
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
        objUrl = URL.createObjectURL(blob);
        setUrl(objUrl);
        setBusy(false);
      }, 'image/png');
    })();
    return () => { alive = false; if (objUrl) URL.revokeObjectURL(objUrl); };
  }, [fmt, k, d, li]);

  // Modal chrome: focus in, scroll lock, Escape to close, focus back on exit.
  useEffect(() => {
    const opener = document.activeElement;
    closeRef.current?.focus();
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      if (opener && typeof opener.focus === 'function') opener.focus({ preventScroll: true });
    };
  }, [onClose]);

  const filename = () => 'carbon-footprint-' + k + '-' + fmt + '-' + slug(d.fy) + '.png';

  const onShare = async () => {
    if (!canvasRef.current || busy) return;
    setStatus('');
    const result = await shareCanvas(canvasRef.current, filename(), d.title || '');
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

        <div className="st-sheet-tabs" role="group" aria-label="Format">
          {formats.map((f) => (
            <button
              key={f}
              type="button"
              className={'st-sheet-tab' + (fmt === f ? ' on' : '')}
              aria-pressed={fmt === f}
              onClick={() => setFmt(f)}
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
