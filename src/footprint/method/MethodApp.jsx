// The basis of preparation page. Reads the same stored audit as the
// dashboard (the visitor's own if one exists, otherwise the worked example)
// so the radiative-forcing sensitivity is computed from the numbers the
// visitor just left, then renders the written method and live factor tables.

import { useMemo } from 'react';
import { Grain, ScrollProgress, SkipLink } from '../../components/Chrome';
import { FootprintNav, FootprintFooter } from '../Nav';
import Method from '../Method';
import { buildSeedProfile } from '../data/seedProfile';
import { aggregate } from '../lib/engine';
import { loadOwnProfile } from '../lib/store';

export default function MethodApp() {
  const profile = useMemo(() => loadOwnProfile() || buildSeedProfile(), []);
  const agg = useMemo(() => aggregate(profile), [profile]);

  return (
    <>
      <SkipLink />
      <Grain />
      <ScrollProgress />
      <FootprintNav home="../../" />
      <main id="main-content">
        <Method agg={agg} periodLabel={profile.period.label} />
      </main>
      <FootprintFooter home="../../" />
    </>
  );
}
