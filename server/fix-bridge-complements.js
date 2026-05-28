require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

// Bridge Pose currently has Shoulder Stand + Wheel Pose in BOTH
// "complements" and "unlocks".  Fix: remove them from complements,
// add Happy Baby + Legs Up the Wall as the true alongside-it pairing.

async function main() {
  const { data: poses } = await supabase
    .from('poses')
    .select('id, slug')
    .in('slug', ['bridge-pose', 'shoulder-stand', 'wheel-pose', 'happy-baby', 'legs-up-the-wall']);

  const id = Object.fromEntries(poses.map(p => [p.slug, p.id]));

  // ── Delete the two wrong complement edges ─────────────────────────────────
  const toDelete = [
    { to: id['shoulder-stand'], label: 'bridge → shoulder-stand (complements)' },
    { to: id['wheel-pose'],     label: 'bridge → wheel-pose (complements)'     },
  ];

  for (const { to, label } of toDelete) {
    const { error } = await supabase
      .from('pose_relationships')
      .delete()
      .eq('from_pose_id', id['bridge-pose'])
      .eq('to_pose_id', to)
      .eq('relationship', 'complements');
    console.log(error ? `  FAIL  ${label}: ${error.message}` : `  DEL   ${label}`);
  }

  // ── Insert the two correct complement edges ───────────────────────────────
  const toInsert = [
    {
      from_pose_id: id['bridge-pose'],
      to_pose_id:   id['happy-baby'],
      relationship: 'complements',
      explanation:  'Happy Baby is a natural companion to Bridge in the supine sequence. Bridge arches the spine into extension and loads the posterior chain; Happy Baby immediately grounds it back into a neutral hip opener. They work the lower back and pelvis from opposite directions, making them a complete supine pair.',
    },
    {
      from_pose_id: id['bridge-pose'],
      to_pose_id:   id['legs-up-the-wall'],
      relationship: 'complements',
      explanation:  'Legs Up the Wall and Bridge are both supine poses that decompress and restore. Bridge loads the posterior chain in active extension; Legs Up the Wall drains the legs and releases the lower back passively. Together they create a complete supine cycle of effort and recovery.',
    },
  ];

  for (const row of toInsert) {
    const { error } = await supabase
      .from('pose_relationships')
      .upsert(row, { onConflict: 'from_pose_id,to_pose_id,relationship' });
    const label = `bridge → ${poses.find(p => p.id === row.to_pose_id)?.slug} (complements)`;
    console.log(error ? `  FAIL  ${label}: ${error.message}` : `  INS   ${label}`);
  }

  console.log('\nDone.');
}

main().catch(console.error);
