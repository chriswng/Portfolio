import { useId } from 'react';

// The site mark: "The Segmented Split". An outer ring cut clean through by a
// horizontal slot, leaving two mirrored hemispheres. Drawn with currentColor
// so it takes the colour of whatever link it sits in. The canvas twin lives in
// footprint/lib/emblem.js (drawMark) for the share cards; keep the two in sync.
//
// `label` gives the enclosing link an accessible name (role="img"); omit it
// when the link already carries its own aria-label and the mark is decorative.
export default function Mark({ className, label }) {
  const raw = useId();
  const cut = 'mark-cut-' + raw.replace(/[^a-zA-Z0-9]/g, '');
  const labelled = Boolean(label);
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      role={labelled ? 'img' : undefined}
      aria-label={labelled ? label : undefined}
      aria-hidden={labelled ? undefined : true}
      focusable="false"
    >
      <mask id={cut} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
        <rect width="24" height="24" fill="#fff" />
        <rect y="10.2" width="24" height="3.6" fill="#000" />
      </mask>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.4" mask={`url(#${cut})`} />
    </svg>
  );
}
