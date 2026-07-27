// The Target Tracker (/targets/) — trajectory maths.
//
// Pure functions, no React, no data imports. Everything the page says about a
// company is derived here so the arithmetic can be read (and tested) on its
// own. The rule the whole page runs on: we only ever draw a line a company has
// actually stated, and we only ever compare it against emissions the company
// has actually reported. Nothing is interpolated into the reported series and
// nothing is invented to fill a gap.

// Tolerance band around the claimed line, in per cent. Inside it a company is
// reading as "on its own line"; the band exists because a single year of
// reported emissions is a noisy thing to judge a decade-long path by.
export const TOLERANCE_PCT = 5;

// Mt values print to 2 decimals, or 3 when a company is under 0.1 Mt and two
// decimals would round its whole footprint away.
export function fmtMt(mt) {
  if (mt === null || mt === undefined || Number.isNaN(mt)) return null;
  return Math.abs(mt) < 0.1 ? mt.toFixed(3) : mt.toFixed(2);
}

// "FY2025" / "CY2025", from the company's own reporting basis.
export function yearLabel(company, y) {
  return (company && company.yearBasis ? company.yearBasis : 'FY') + y;
}

// The company's own claimed trajectory, as anchor points in Mt.
//
//   (base year, baseline)  ->  each absolute interim  ->  (net zero year, 0)
//
// An interim is only used when it is absolute (intensity targets say nothing
// about a tonnage) and when it is cut from the same base year as the baseline
// we hold, because a cut against a different base year cannot be priced
// without that other year's level. Anything else is skipped rather than
// guessed. Returns null when there is no baseline or no net zero year, and the
// page then draws no claimed line at all.
export function claimedPath(company) {
  if (!company) return null;
  const c = company.commitment;
  const b = company.baseline;
  if (!c || !b || typeof b.mt !== 'number') return null;
  if (!c.netZeroYear) return null;

  const baseYear = (c.baseYear === null || c.baseYear === undefined) ? b.year : c.baseYear;
  if (baseYear === null || baseYear === undefined) return null;

  const pts = [{ y: baseYear, mt: b.mt }];

  (c.interim || []).forEach((i) => {
    if (!i || i.absolute !== true) return;
    if (typeof i.cutPct !== 'number' || typeof i.year !== 'number') return;
    // Only priceable against the baseline we hold.
    if (i.vsBaseYear !== undefined && i.vsBaseYear !== null && i.vsBaseYear !== b.year) return;
    pts.push({ y: i.year, mt: b.mt * (1 - i.cutPct / 100) });
  });

  pts.push({ y: c.netZeroYear, mt: 0 });

  // Ascending by year, one anchor per year (a later anchor wins, so the net
  // zero point always survives a stray interim on the same year).
  pts.sort((p, q) => p.y - q.y);
  const out = [];
  pts.forEach((p) => {
    if (out.length && out[out.length - 1].y === p.y) out[out.length - 1] = p;
    else out.push(p);
  });

  return out.length >= 2 ? out : null;
}

// Linear interpolation along the claimed path. Null outside the path's range,
// because extrapolating a company's target is putting words in its mouth.
export function claimedAt(path, y) {
  if (!path || path.length < 2 || typeof y !== 'number') return null;
  const first = path[0];
  const last = path[path.length - 1];
  if (y < first.y || y > last.y) return null;
  for (let i = 0; i < path.length - 1; i += 1) {
    const a = path[i];
    const b = path[i + 1];
    if (y >= a.y && y <= b.y) {
      if (b.y === a.y) return b.mt;
      const t = (y - a.y) / (b.y - a.y);
      return a.mt + t * (b.mt - a.mt);
    }
  }
  return last.mt;
}

// The latest reported point, by year.
export function latestReported(company) {
  const r = (company && company.reported) || [];
  if (!r.length) return null;
  return r.reduce((best, p) => (best === null || p.y > best.y ? p : best), null);
}

// Read the latest reported year against the claimed line for that same year.
//   'ahead'  below the line by more than the tolerance
//   'on'     inside the tolerance band either side
//   'behind' above the line by more than the tolerance
//   'na'     no claimed line, no reported point, or the point sits outside
//            the claimed line's range
export function assess(company) {
  const latest = latestReported(company);
  const path = claimedPath(company);
  if (!path || !latest) {
    return { track: 'na', latest: latest || null, claimed: null, deltaPct: null };
  }
  const claimed = claimedAt(path, latest.y);
  if (claimed === null) {
    return { track: 'na', latest, claimed: null, deltaPct: null };
  }
  if (claimed <= 0) {
    // The line has reached zero. Anything still emitting is behind it, and no
    // percentage gap is meaningful against a zero denominator.
    return {
      track: latest.mt <= 0 ? 'on' : 'behind', latest, claimed, deltaPct: null,
    };
  }
  const deltaPct = ((latest.mt - claimed) / claimed) * 100;
  let track = 'on';
  if (deltaPct > TOLERANCE_PCT) track = 'behind';
  else if (deltaPct < -TOLERANCE_PCT) track = 'ahead';
  return { track, latest, claimed, deltaPct };
}

// The scoreboard at the top of the page. Counts, nothing weighted, so a small
// company counts the same as a large one. That is a limitation and the method
// says so.
export function aggregate(companies) {
  const list = companies || [];
  const byTrack = {
    ahead: 0, on: 0, behind: 0, na: 0,
  };
  let withNetZero = 0;
  let with2030Interim = 0;
  let unverified = 0;

  list.forEach((co) => {
    const c = co.commitment || {};
    if (c.netZeroYear) withNetZero += 1;
    const has2030 = (c.interim || []).some(
      (i) => i && i.absolute === true && typeof i.year === 'number' && i.year <= 2031,
    );
    if (has2030) with2030Interim += 1;
    if (co.status === 'unverified') unverified += 1;
    byTrack[assess(co).track] += 1;
  });

  return {
    total: list.length,
    withNetZero,
    with2030Interim,
    byTrack,
    atOrAhead: byTrack.ahead + byTrack.on,
    behindOrNa: byTrack.behind + byTrack.na,
    unverified,
  };
}

// Chart domains, worked out once so the SVG stays dumb. Handles the
// intensity-only case (reported points but no stated absolute path).
export function chartDomain(company, path) {
  const reported = (company && company.reported) || [];
  const ys = [];
  const mts = [];
  reported.forEach((p) => { ys.push(p.y); mts.push(p.mt); });
  if (path) path.forEach((p) => { ys.push(p.y); mts.push(p.mt); });
  if (!ys.length) return null;

  const lastReported = reported.length ? Math.max(...reported.map((p) => p.y)) : null;
  const xMin = Math.min(...ys);
  const xMax = Math.max(...ys, lastReported === null ? -Infinity : lastReported + 1);
  const maxMt = Math.max(0, ...mts);
  return {
    xMin,
    xMax: xMax > xMin ? xMax : xMin + 1,
    yMin: 0,
    yMax: maxMt > 0 ? maxMt * 1.08 : 1,
  };
}

// Distinct GICS sectors present, alphabetical, for the ledger filter.
export function sectors(companies) {
  const seen = [];
  (companies || []).forEach((c) => {
    if (c.sector && seen.indexOf(c.sector) === -1) seen.push(c.sector);
  });
  return seen.sort((a, b) => a.localeCompare(b));
}
