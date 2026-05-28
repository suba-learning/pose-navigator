require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

// Fill in missing edges for the first-row poses (Bird of Paradise + Bound Side Angle).
// All target poses already exist in the DB — no orphan risk.
//
// Bird of Paradise  → unlocks → Compass Pose, Sugarcane Pose
// Bound Side Angle  → prepares → Crescent Lunge, Lizard Pose, Shoelace Pose

async function main() {
  const { data: poses, error: fetchError } = await supabase
    .from('poses')
    .select('id, slug')
    .in('slug', [
      'bird-of-paradise',
      'bound-side-angle',
      'compass-pose',
      'sugarcane-pose',
      'crescent-lunge',
      'lizard-pose',
      'shoelace-pose',
    ]);

  if (fetchError) { console.error('Fetch error:', fetchError.message); process.exit(1); }

  const id = Object.fromEntries(poses.map(p => [p.slug, p.id]));

  const edges = [
    // ── Bird of Paradise → UNLOCKS ────────────────────────────────────────────
    {
      from_pose_id: id['bird-of-paradise'],
      to_pose_id:   id['compass-pose'],
      relationship: 'unlocks',
      explanation:
        'Compass Pose takes the shoulder-behind-leg bind that Bird of Paradise establishes in standing and transfers it to a seated context, where the hamstring must extend fully without the structural support of a standing balance. The lateral hip opening and shoulder mobility developed in Bird of Paradise make the geometry of Compass directly accessible.',
    },
    {
      from_pose_id: id['bird-of-paradise'],
      to_pose_id:   id['sugarcane-pose'],
      relationship: 'unlocks',
      explanation:
        'Sugarcane Pose layers a deep quad-bind onto a lateral hip-opening balance — the same shoulder mobility and single-leg stability that Bird of Paradise demands. Practising Bird of Paradise primes both the lateral hip and the shoulder range that Sugarcane requires, making the bind reachable without collapsing the standing base.',
    },

    // ── Bound Side Angle → PREPARES ───────────────────────────────────────────
    {
      from_pose_id: id['bound-side-angle'],
      to_pose_id:   id['crescent-lunge'],
      relationship: 'prepares',
      explanation:
        'Crescent Lunge opens the hip flexors in a deep lunge — the same front-hip orientation Bound Side Angle demands. Establishing length through the hip flexors and groin in Crescent Lunge makes the lateral reach and bind of Bound Side Angle considerably more accessible.',
    },
    {
      from_pose_id: id['bound-side-angle'],
      to_pose_id:   id['lizard-pose'],
      relationship: 'prepares',
      explanation:
        'Lizard Pose loads the front hip, groin, and inner thigh in a deep low-lunge position, directly preparing the hip position Bound Side Angle requires. It also builds the strength to sustain a low, open hip under load — essential for maintaining the bind without the pelvis collapsing inward.',
    },
    {
      from_pose_id: id['bound-side-angle'],
      to_pose_id:   id['shoelace-pose'],
      relationship: 'prepares',
      explanation:
        'Shoelace / Cow Face Legs opens the shoulder joint in external rotation from the opposite direction of the bind, creating the chest and shoulder space that makes the reach-around in Bound Side Angle accessible. When the bind is the limiting factor rather than the hip, Shoelace is the direct preparation.',
    },
  ];

  console.log(`Inserting ${edges.length} edges…\n`);

  for (const edge of edges) {
    const fromSlug = poses.find(p => p.id === edge.from_pose_id)?.slug;
    const toSlug   = poses.find(p => p.id === edge.to_pose_id)?.slug;
    const label    = `${fromSlug} → ${toSlug} (${edge.relationship})`;

    const { error } = await supabase
      .from('pose_relationships')
      .upsert(edge, { onConflict: 'from_pose_id,to_pose_id,relationship' });

    console.log(error ? `  FAIL  ${label}: ${error.message}` : `  INS   ${label}`);
  }

  console.log('\nDone.');
}

main().catch(console.error);
