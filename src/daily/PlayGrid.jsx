// The play history behind the streak number.
//
// A streak of 4 tells you nothing about the fortnight around it. This is the
// calendar, read backwards from today: one cell per day, filled by how the day
// scored, hollow for a day missed, hairline for a day before the game existed.
// It is the reason to come back tomorrow, stated once and quietly.
//
// Deliberately not a month grid with a header and arrows. Nothing here is
// scheduled, there is no month to navigate to, and a booking-style calendar
// would promise controls this page does not have. A run of days reading right
// to left is the whole truth.

import { HISTORY, STATS } from './data';
import { historyMap } from './lib';

const DAYS = 28;

// The four buckets, worst to best. Guess the Footprint scores 0 to 3; Greenwash
// or Not stores 3 for a correct call and 0 for a wrong one, so it only ever
// uses the ends of the scale.
const TONE = ['miss', 'low', 'mid', 'high'];

export default function PlayGrid({ state, dayIndex }) {
  const played = historyMap(state);
  const first = dayIndex - DAYS + 1;

  const cells = [];
  let count = 0;
  for (let d = first; d <= dayIndex; d += 1) {
    const bucket = played.get(d);
    // Day 0 is launch day; anything earlier could not have been played.
    const kind = d < 0 ? 'void' : bucket == null ? 'skip' : TONE[bucket];
    if (bucket != null) count += 1;
    cells.push({ d, kind, today: d === dayIndex });
  }

  return (
    <div className="dy-grid-wrap">
      <div className="dy-grid-head">
        <span className="dy-grid-l">{HISTORY.label}</span>
        <span className="dy-grid-n">{count === 0 ? HISTORY.none : HISTORY.count(count, DAYS)}</span>
      </div>
      {/* One image with one sentence: a screen reader gets the summary, not
          twenty-eight unlabelled squares to walk through. */}
      <div className="dy-grid" role="img" aria-label={HISTORY.aria(count, DAYS)}>
        {cells.map((c) => (
          <span
            key={c.d}
            className={'dy-cell dy-cell-' + c.kind + (c.today ? ' is-today' : '')}
            aria-hidden="true"
          />
        ))}
      </div>
      <div className="dy-grid-foot">
        <span>{HISTORY.oldest}</span>
        <span>{state.last === dayIndex ? STATS.playedToday : HISTORY.today}</span>
      </div>
    </div>
  );
}
