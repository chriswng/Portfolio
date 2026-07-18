// ============================================================================
// OPENWEAVE — fashion brand transparency lookup.
//
// A practical, editorial tool. You search a brand you recognise and get its
// real corporate parent, its market segment, and a plain reading of what it
// discloses. No fictional brands, no invented metrics, no spinning artwork.
// The one quantified signal is the Fashion Transparency Index 2023 score; the
// rest is honestly marked "Needs research" until a source is confirmed.
//
// Structure: Hero (search) -> Lookup -> Compare -> Directory -> What the
// signals mean -> Research backlog -> Footer.
// ============================================================================
import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import {
  BRANDS, BRAND_BY_ID, SEGMENTS, SIGNAL_FIELDS, STATUS, COPY, SOURCES,
  ftiBand, groupFamily,
} from './data';

const MAX_COMPARE = 3;

// --------------------------------------------------------------------- search
// Forgiving matcher: lowercase, partial, alias and parent-company aware.
function normalise(s) {
  return (s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function searchBrands(query, limit = 8) {
  const q = normalise(query);
  if (!q) return [];
  const scored = [];
  for (const b of BRANDS) {
    const name = normalise(b.name);
    const aliasHit = b.aliases.some((a) => normalise(a).includes(q));
    const parent = normalise(b.parent);
    const group = normalise(b.group);
    let score = 0;
    if (name === q) score = 100;
    else if (name.startsWith(q)) score = 85;
    else if (name.includes(q)) score = 70;
    else if (b.aliases.some((a) => normalise(a).startsWith(q))) score = 65;
    else if (aliasHit) score = 55;
    else if (parent.startsWith(q) || group.startsWith(q)) score = 45;
    else if (parent.includes(q) || group.includes(q)) score = 35;
    else if (normalise(b.knownFor).includes(q)) score = 20;
    if (score > 0) {
      // recognition nudges ties so household names surface first
      score += b.recognition === 'high' ? 4 : 0;
      scored.push({ b, score });
    }
  }
  scored.sort((x, y) => y.score - x.score || x.b.name.localeCompare(y.b.name));
  return scored.slice(0, limit).map((s) => s.b);
}

// Highlight the matched run inside a brand name for the autocomplete.
function Highlight({ text, query }) {
  const trimmed = (query || '').trim();
  if (!trimmed) return text;
  const start = text.toLowerCase().indexOf(trimmed[0].toLowerCase());
  const idx = text.toLowerCase().indexOf(normalise(query));
  if (idx < 0 || start < 0) return text;
  return (
    <>
      {text.slice(0, start)}
      <mark>{text.slice(start, start + trimmed.length)}</mark>
      {text.slice(start + trimmed.length)}
    </>
  );
}

// ------------------------------------------------------------------- pills
const STATUS_CLASS = {
  disclosed: 'disclosed', partial: 'partial', parent: 'parent',
  notFound: 'notFound', research: 'research',
};

function StatusPill({ status }) {
  const meta = STATUS[status] || STATUS.research;
  return <span className={`ow-pill ${STATUS_CLASS[status] || 'research'}`}>{meta.label}</span>;
}

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="21" y2="21" />
  </svg>
);

// =========================================================================
// Chrome
// =========================================================================
function TopBar() {
  return (
    <header className="ow-topbar">
      <a className="ow-wordmark" href="#top" aria-label={`${COPY.brand}, back to top`}>
        <b>{COPY.brand}</b>
        <span>{COPY.strap}</span>
      </a>
      <a className="ow-back" href={COPY.backHref}>{COPY.backLabel}</a>
    </header>
  );
}

function ScrollProgress() {
  const ref = useRef(null);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const h = document.documentElement;
        const max = h.scrollHeight - h.clientHeight;
        const p = max > 0 ? h.scrollTop / max : 0;
        if (ref.current) ref.current.style.transform = `scaleX(${p})`;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);
  return <div className="ow-progress" ref={ref} style={{ width: '100%', transform: 'scaleX(0)' }} aria-hidden="true" />;
}

function SecHead({ c }) {
  return (
    <div className="ow-sechead">
      <span className="idx">{c.idx}</span>
      <h2>{c.title}</h2>
      <span className="sub">{c.sub}</span>
    </div>
  );
}

// =========================================================================
// Hero + search
// =========================================================================
function SearchField({ onSelect, id = 'ow-search-input', label }) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const boxRef = useRef(null);
  const results = useMemo(() => searchBrands(q), [q]);
  const listId = `${id}-ac`;

  useEffect(() => {
    const onDoc = (e) => { if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const choose = (b) => {
    if (!b) return;
    onSelect(b.id);
    setQ('');
    setOpen(false);
  };

  const submit = () => {
    if (results.length) choose(results[Math.min(active, results.length - 1)]);
  };

  const onKey = (e) => {
    if (!open && results.length && e.key === 'ArrowDown') { setOpen(true); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); submit(); }
    else if (e.key === 'Escape') { setOpen(false); }
  };

  return (
    <div className="ow-search" ref={boxRef}>
      <label className="ow-search-label" htmlFor={id}>{label || COPY.hero.searchLabel}</label>
      <div className="ow-search-box">
        <SearchIcon />
        <input
          id={id}
          type="text"
          autoComplete="off"
          spellCheck="false"
          value={q}
          placeholder={COPY.hero.searchPlaceholder}
          role="combobox"
          aria-expanded={open && results.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          onChange={(e) => { setQ(e.target.value); setOpen(true); setActive(0); }}
          onFocus={() => q && setOpen(true)}
          onKeyDown={onKey}
        />
        <button className="ow-search-go" onClick={submit} aria-label="Look up brand">Look up</button>
      </div>
      {open && q && (
        <div className="ow-ac" id={listId} role="listbox">
          {results.length === 0 && (
            <div className="ow-ac-empty">No match for “{q}”. Try a shorter spelling or a parent company.</div>
          )}
          {results.map((b, i) => (
            <button
              key={b.id}
              className="ow-ac-item"
              role="option"
              aria-selected={i === active}
              onMouseEnter={() => setActive(i)}
              onClick={() => choose(b)}
            >
              <span className="ow-ac-name"><Highlight text={b.name} query={q} /></span>
              <span className="ow-ac-meta">{b.parent !== b.name ? b.parent : b.segmentLabel}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SwingTagStack() {
  const tags = [
    { cls: 's1', name: 'Uniqlo', parent: 'Fast Retailing', rows: [['Parent', 'Fast Retailing'], ['Segment', 'Basics'], ['FTI 2023', 'Needs research']] },
    { cls: 's2', name: 'Gucci', parent: 'Kering', rows: [['Parent', 'Kering'], ['Segment', 'Luxury'], ['FTI 2023', '80 / 100']] },
    { cls: 's3', name: 'Kmart', parent: 'Wesfarmers', rows: [['Parent', 'Wesfarmers'], ['Segment', 'Value'], ['FTI 2023', '76 / 100']] },
  ];
  return (
    <div className="ow-tagstack" aria-hidden="true">
      {tags.map((t) => (
        <div className={`ow-swing ${t.cls}`} key={t.name}>
          <div className="tag-brand">{t.name}</div>
          <div className="tag-parent">{t.parent}</div>
          <div className="tag-rule" />
          {t.rows.map(([k, v]) => (
            <div className="tag-row" key={k}><span>{k}</span><span>{v}</span></div>
          ))}
        </div>
      ))}
    </div>
  );
}

function Hero({ onSelect }) {
  return (
    <section className="ow-hero" id="top">
      <div className="ow-wrap ow-hero-grid">
        <div>
          <span className="ow-kicker">{COPY.hero.kicker}</span>
          <h1>{COPY.hero.headA} <em>{COPY.hero.headB}</em></h1>
          <p className="stand">{COPY.hero.stand}</p>
          <SearchField onSelect={onSelect} id="ow-hero-search" />
          <div className="ow-examples">
            <span className="lbl">{COPY.hero.examplesLabel}</span>
            {COPY.hero.examples.map((name) => {
              const b = searchBrands(name, 1)[0];
              return (
                <button key={name} className="ow-chip" onClick={() => b && onSelect(b.id)}>{name}</button>
              );
            })}
          </div>
          <p className="ow-hero-count">{COPY.hero.countTemplate.replace('{n}', BRANDS.length)}</p>
        </div>
        <SwingTagStack />
      </div>
    </section>
  );
}

// =========================================================================
// Brand lookup card (the care label)
// =========================================================================
function TransparencyRow({ brand }) {
  if (brand.fti != null) {
    const band = brand.ftiBand || ftiBand(brand.fti);
    return (
      <div className="ow-fti">
        <div className="ow-fti-score">{brand.fti}<small> / 100</small></div>
        <div className="ow-fti-meta">
          <div className="band">{band ? band.label : 'Disclosure score'}</div>
          <div className="note">{brand.ftiNote || (band ? band.note : '')}</div>
        </div>
        <div className="ow-meter"><i style={{ width: `${brand.fti}%` }} /></div>
      </div>
    );
  }
  const outside = brand.ftiScope === 'outside';
  return (
    <div className="ow-fti">
      <div className="ow-fti-score na">{outside ? 'n/a' : 'TBC'}</div>
      <div className="ow-fti-meta">
        <div className="band">{outside ? 'Not assessed' : 'Needs research'}</div>
        <div className="note">{brand.ftiNote || 'No verified Fashion Transparency Index 2023 score on file yet.'}</div>
      </div>
    </div>
  );
}

function BrandCard({ brand, inCompare, onToggleCompare }) {
  const family = groupFamily(brand.parent).filter((b) => b.id !== brand.id);
  return (
    <article className="ow-card">
      <div className="ow-card-head">
        <div className="ow-card-tagcode">
          {brand.segmentLabel} · {brand.au ? 'Australian relevant' : brand.country}
        </div>
        <h3 className="ow-card-name">{brand.name}</h3>
        <div className="ow-card-knownfor">{brand.knownFor}</div>
      </div>

      <div className="ow-card-facts">
        <div className="ow-fact">
          <span className="k">{COPY.lookup.parentLabel}</span>
          <span className="v">{brand.parent}</span>
        </div>
        <div className="ow-fact">
          <span className="k">{COPY.lookup.segmentLabel}</span>
          <span className="v">{brand.segmentLabel}</span>
        </div>
        <div className="ow-fact">
          <span className="k">{COPY.lookup.hqLabel}</span>
          <span className="v">{brand.country}</span>
        </div>
      </div>

      <div className="ow-signals">
        <div className="ow-signals-h">
          <span className="t">Disclosure signals</span>
        </div>
        <TransparencyRow brand={brand} />
        <div className="ow-signal-list">
          {SIGNAL_FIELDS.filter((f) => f.id !== 'transparency').map((f) => (
            <div className="ow-signal" key={f.id}>
              <div>
                <span className="sname">{f.label}</span>
                <span className="shelp">{f.help}</span>
              </div>
              <StatusPill status={brand.signals[f.id] || 'research'} />
            </div>
          ))}
        </div>
      </div>

      <div className="ow-card-actions">
        {brand.reportUrl ? (
          <a className="ow-btn" href={brand.reportUrl} target="_blank" rel="noopener noreferrer">
            {COPY.lookup.reportLabel} ↗
          </a>
        ) : (
          <span className="ow-btn" aria-disabled="true" style={{ opacity: 0.5, cursor: 'default' }}>
            {COPY.lookup.reportMissing}
          </span>
        )}
        <button className={`ow-btn ${inCompare ? 'on' : ''}`} onClick={() => onToggleCompare(brand.id)}>
          {inCompare ? COPY.lookup.compareRemove : COPY.lookup.compareAdd}
        </button>
        {family.length > 0 && (
          <span className="ow-btn" style={{ cursor: 'default', borderStyle: 'dashed' }}>
            {COPY.lookup.familyLabel}: {family.map((b) => b.name).join(', ')}
          </span>
        )}
      </div>
    </article>
  );
}

function LookupSection({ selected, compareIds, onSelect, onToggleCompare, forwardRef }) {
  const brand = selected ? BRAND_BY_ID[selected] : null;
  return (
    <section className="ow-section" id="lookup" ref={forwardRef}>
      <div className="ow-wrap">
        <SecHead c={COPY.lookup} />
        <p className="ow-lede">{COPY.lookup.lede}</p>
        <SearchField onSelect={onSelect} id="ow-lookup-search" label="Search again" />
        <div style={{ height: '1.6rem' }} />
        {brand ? (
          <BrandCard
            brand={brand}
            inCompare={compareIds.includes(brand.id)}
            onToggleCompare={onToggleCompare}
          />
        ) : (
          <div className="ow-empty">
            <h3>{COPY.lookup.emptyTitle}</h3>
            <p>{COPY.lookup.emptyBody}</p>
          </div>
        )}
      </div>
    </section>
  );
}

// =========================================================================
// Compare
// =========================================================================
function MiniCard({ brand, onRemove }) {
  const ftiText = brand.fti != null
    ? `${brand.fti} / 100`
    : (brand.ftiScope === 'outside' ? 'Not assessed' : 'Needs research');
  const rows = [
    ['Parent', brand.parent],
    ['Segment', brand.segmentLabel],
    ['HQ', brand.country],
    ['FTI 2023', ftiText],
  ];
  return (
    <div className="ow-mini">
      <button className="x" onClick={() => onRemove(brand.id)} aria-label={`Remove ${brand.name} from compare`}>✕</button>
      <h4>{brand.name}</h4>
      <div className="mp">{brand.knownFor}</div>
      {rows.map(([k, v]) => (
        <div className="ow-mini-row" key={k}><span className="k">{k}</span><span>{v}</span></div>
      ))}
    </div>
  );
}

function CompareSection({ compareIds, onRemove, onClear }) {
  const brands = compareIds.map((id) => BRAND_BY_ID[id]).filter(Boolean);
  return (
    <section className="ow-section" id="compare">
      <div className="ow-wrap">
        <SecHead c={COPY.compare} />
        <p className="ow-lede">{COPY.compare.lede}</p>
        {brands.length === 0 ? (
          <div className="ow-empty"><p>{COPY.compare.empty}</p></div>
        ) : (
          <>
            <div className="ow-compare-row">
              {brands.map((b) => <MiniCard key={b.id} brand={b} onRemove={onRemove} />)}
            </div>
            <div style={{ marginTop: '1.4rem' }}>
              <button className="ow-btn" onClick={onClear}>{COPY.compare.clear}</button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

// =========================================================================
// Directory
// =========================================================================
function DirTag({ brand, onSelect }) {
  return (
    <button className="ow-tag" onClick={() => onSelect(brand.id)}>
      <div className="top">
        <span className="name">{brand.name}{brand.au && <span className="aub">AU</span>}</span>
        {brand.fti != null
          ? <span className="score">{brand.fti}</span>
          : <span className="score na">{brand.ftiScope === 'outside' ? 'n/a' : 'TBC'}</span>}
      </div>
      <span className="seg">{brand.segmentLabel}</span>
      <span className="parent">{brand.parent}</span>
    </button>
  );
}

function Directory({ onSelect }) {
  const [seg, setSeg] = useState('all');
  const [auOnly, setAuOnly] = useState(false);
  const [sort, setSort] = useState('name');

  const list = useMemo(() => {
    let out = BRANDS.slice();
    if (seg !== 'all') out = out.filter((b) => b.segment === seg);
    if (auOnly) out = out.filter((b) => b.au);
    out.sort((a, b) => {
      if (sort === 'fti') {
        const av = a.fti == null ? -1 : a.fti;
        const bv = b.fti == null ? -1 : b.fti;
        return bv - av || a.name.localeCompare(b.name);
      }
      if (sort === 'recognition') {
        const r = (x) => (x.recognition === 'high' ? 0 : 1);
        return r(a) - r(b) || a.name.localeCompare(b.name);
      }
      if (sort === 'segment') {
        return a.segmentLabel.localeCompare(b.segmentLabel) || a.name.localeCompare(b.name);
      }
      return a.name.localeCompare(b.name);
    });
    return out;
  }, [seg, auOnly, sort]);

  return (
    <section className="ow-section" id="directory">
      <div className="ow-wrap">
        <SecHead c={COPY.directory} />
        <p className="ow-lede">{COPY.directory.lede}</p>

        <div className="ow-toolbar">
          <div className="ow-filters">
            <button className="ow-chip" aria-pressed={seg === 'all'} onClick={() => setSeg('all')}>{COPY.directory.filterAll}</button>
            {SEGMENTS.map((s) => (
              <button key={s.id} className="ow-chip" aria-pressed={seg === s.id} onClick={() => setSeg(s.id)}>{s.label}</button>
            ))}
            <button className="ow-chip" aria-pressed={auOnly} onClick={() => setAuOnly((v) => !v)}>{COPY.directory.auOnly}</button>
          </div>
          <div className="ow-sortwrap">
            <label htmlFor="ow-sort">{COPY.directory.sortLabel}</label>
            <select id="ow-sort" className="ow-select" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="name">{COPY.directory.sort.name}</option>
              <option value="fti">{COPY.directory.sort.fti}</option>
              <option value="recognition">{COPY.directory.sort.recognition}</option>
              <option value="segment">{COPY.directory.sort.segment}</option>
            </select>
          </div>
        </div>

        <p className="ow-count">{COPY.directory.resultTemplate.replace('{n}', list.length)}</p>

        <div className="ow-dir-grid">
          {list.map((b) => <DirTag key={b.id} brand={b} onSelect={onSelect} />)}
        </div>
      </div>
    </section>
  );
}

// =========================================================================
// What the signals mean
// =========================================================================
function SignalsExplainer() {
  return (
    <section className="ow-section" id="signals">
      <div className="ow-wrap">
        <SecHead c={COPY.signals} />
        <p className="ow-lede">{COPY.signals.lede}</p>
        <div className="ow-explain">
          {COPY.signals.cards.map((c) => (
            <div className="ow-explain-card" key={c.h}>
              <h3>{c.h}</h3>
              <p>{c.b}</p>
            </div>
          ))}
        </div>
        <p className="ow-note"><b>Read this first.</b> {COPY.signals.disclaimer}</p>
      </div>
    </section>
  );
}

// =========================================================================
// Research backlog
// =========================================================================
function Backlog() {
  const needScore = BRANDS.filter((b) => b.needsResearch).length;
  const fieldCount = BRANDS.reduce((n, b) => (
    n + Object.values(b.signals).filter((s) => s === STATUS.research.id).length
  ), 0);
  const stats = [
    { n: needScore, l: 'brands still need a verified transparency score' },
    { n: fieldCount, l: 'disclosure fields awaiting a checked source' },
    { n: BRANDS.length, l: 'brands and companies on file with verified ownership' },
  ];
  return (
    <section className="ow-section" id="backlog">
      <div className="ow-wrap">
        <SecHead c={COPY.backlog} />
        <p className="ow-lede">{COPY.backlog.lede}</p>
        <div className="ow-backlog-stats">
          {stats.map((s) => (
            <div className="ow-stat" key={s.l}>
              <div className="n">{s.n}</div>
              <div className="l">{s.l}</div>
            </div>
          ))}
        </div>
        <div className="ow-file">
          <p>{COPY.backlog.fileNote}</p>
          <a className="path" href={COPY.backlog.fileHref} target="_blank" rel="noopener noreferrer">
            {COPY.backlog.filePath} ↗
          </a>
          <p>{COPY.backlog.howTo}</p>
        </div>
      </div>
    </section>
  );
}

// =========================================================================
// Footer
// =========================================================================
function Footer() {
  return (
    <footer className="ow-footer">
      <div className="ow-wrap">
        <div className="ow-footer-grid">
          <div>
            <h4>Method</h4>
            <p className="method">{COPY.footer.method}</p>
          </div>
          <div>
            <h4>{COPY.footer.sourcesLabel}</h4>
            {SOURCES.map((s) => (
              <a className="src" key={s.url} href={s.url} target="_blank" rel="noopener noreferrer">{s.label} ↗</a>
            ))}
          </div>
        </div>
        <div className="ow-footer-base">
          <span>{COPY.footer.made}</span>
          <a className="ow-top" href="#top">↑ {COPY.footer.top}</a>
        </div>
      </div>
    </footer>
  );
}

// =========================================================================
// Shell
// =========================================================================
export default function FashionApp() {
  const [selected, setSelected] = useState(null);
  const [compareIds, setCompareIds] = useState([]);
  const lookupRef = useRef(null);

  const select = useCallback((id) => {
    setSelected(id);
    requestAnimationFrame(() => {
      if (lookupRef.current) lookupRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, []);

  const toggleCompare = useCallback((id) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_COMPARE) return [...prev.slice(1), id];
      return [...prev, id];
    });
  }, []);

  const removeCompare = useCallback((id) => setCompareIds((p) => p.filter((x) => x !== id)), []);
  const clearCompare = useCallback(() => setCompareIds([]), []);

  return (
    <>
      <a className="skip-link" href="#lookup">Skip to the brand lookup</a>
      <div className="ow-grain" aria-hidden="true" />
      <ScrollProgress />
      <TopBar />
      <main className="ow-main">
        <Hero onSelect={select} />
        <LookupSection
          selected={selected}
          compareIds={compareIds}
          onSelect={select}
          onToggleCompare={toggleCompare}
          forwardRef={lookupRef}
        />
        <CompareSection compareIds={compareIds} onRemove={removeCompare} onClear={clearCompare} />
        <Directory onSelect={select} />
        <SignalsExplainer />
        <Backlog />
      </main>
      <Footer />
    </>
  );
}
