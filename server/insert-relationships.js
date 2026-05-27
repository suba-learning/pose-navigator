require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

// Spreadsheet column semantics:
//   "Prepares You"   → FROM (you-are-here) → TO (listed), type 'prepares'
//   "Alongside It"   → FROM (you-are-here) → TO (listed), type 'complements'
//   "What It Unlocks"→ FROM (you-are-here) → TO (listed), type 'unlocks'
// Only edges where both slugs exist in the DB are included.

const edges = [
  // ── Mountain Pose ─────────────────────────────────────────────────────────
  { from: 'mountain-pose', to: 'chair-pose', type: 'prepares',
    explanation: 'Chair Pose stress-tests Mountain Pose\'s alignment principles. Practicing Chair activates the inner thighs, core, and spinal lift in a demanding way — return to Mountain after and those muscles are awake, making Tadasana three-dimensional rather than passive.' },

  { from: 'mountain-pose', to: 'tree-pose', type: 'complements',
    explanation: 'Tree Pose is Mountain with one hip opened. The same vertical axis, the same grounded foot, the same quiet breath — Tree asks you to maintain all of it on a single leg. Together they define the two poles of standing practice: bilateral stability and single-leg balance.' },

  { from: 'mountain-pose', to: 'warrior-1', type: 'complements',
    explanation: 'Warrior I begins as Mountain Pose and adds a step back with arms overhead. The shoulder-stacking and spinal length you establish in Mountain determine whether Warrior I feels open or compressed. Mountain is the baseline you return to mid-practice to recalibrate.' },

  { from: 'mountain-pose', to: 'warrior-3', type: 'unlocks',
    explanation: 'Warrior III lives at the intersection of Mountain\'s postural precision and single-leg balance. The hip-stacking, spine length, and body awareness cultivated in Mountain are the exact tools you need when the floor under one foot disappears.' },

  { from: 'mountain-pose', to: 'eagle-pose', type: 'unlocks',
    explanation: 'Eagle Pose wraps the arms and legs around a Mountain Pose center of gravity. Without Mountain\'s vertical alignment and breath control as a reference point, Eagle becomes a tangled squat. Mountain is where you return in your mind mid-Eagle when things unravel.' },

  // ── Warrior I ─────────────────────────────────────────────────────────────
  { from: 'warrior-1', to: 'low-lunge', type: 'prepares',
    explanation: 'The back hip flexor is the hidden tension in Warrior I — it tilts the pelvis, compresses the lower back, and blocks the chest from opening. Low Lunge addresses that tissue directly. Spend time here before asking the hip flexor to work against gravity in Warrior I.' },

  { from: 'warrior-1', to: 'crescent-lunge', type: 'complements',
    explanation: 'Crescent Lunge and Warrior I work the same hip flexor tissue but with different foot positions. Crescent\'s lifted back heel creates more hip flexor traction; Warrior I\'s flat back foot demands more stability and trunk strength. Together they cover both ends of the lunge spectrum.' },

  { from: 'warrior-1', to: 'warrior-3', type: 'unlocks',
    explanation: 'Warrior III is Warrior I tipped forward onto one leg. The back body engagement, the lifted chest, the active standing leg — all of it transfers directly. When Warrior I feels strong and aligned, Warrior III becomes a natural extension rather than a completely different pose.' },

  { from: 'warrior-1', to: 'reverse-warrior', type: 'unlocks',
    explanation: 'Reverse Warrior opens the side body of the front-leg side — the tissue that Warrior I compresses as you square the hips forward. Moving between the two in a single practice gives that side body a complete cycle of work and release.' },

  // ── Triangle Pose ─────────────────────────────────────────────────────────
  { from: 'triangle-pose', to: 'wide-leg-forward-fold', type: 'prepares',
    explanation: 'Wide-Leg Forward Fold opens the inner thighs and hamstrings symmetrically before Triangle asks them to work asymmetrically with one side extended. The adductor release in the fold directly reduces the strain on the back hip in Trikonasana.' },

  { from: 'triangle-pose', to: 'half-moon-pose', type: 'complements',
    explanation: 'Half Moon Pose is Triangle lifted off the ground and balanced on one leg. The hip abduction, hamstring length, and side-body line of Triangle transfer directly into Half Moon. Together they form a two-level exploration of the same lateral hip pattern.' },

  { from: 'triangle-pose', to: 'bird-of-paradise', type: 'unlocks',
    explanation: 'Bird of Paradise requires the hamstring length and hip external rotation that consistent Triangle practice builds. The standing leg strength and side-body opening from Triangle also directly support the demanding bind and balance of Svarga Dvijasana.' },

  { from: 'triangle-pose', to: 'bound-side-angle', type: 'unlocks',
    explanation: 'Bound Side Angle adds a full shoulder-hip bind to Triangle\'s lateral foundation. The hamstring openness and stable hip position developed in Triangle create the space the bind needs — without that groundwork, the bind compresses rather than opens.' },

  // ── Half Moon Pose ────────────────────────────────────────────────────────
  { from: 'half-moon-pose', to: 'triangle-pose', type: 'prepares',
    explanation: 'Triangle Pose establishes the hip abduction, hamstring length, and side-body line that Half Moon balances on. Coming to Half Moon through Triangle means the shape is already in the body — you\'re just lifting it off the ground.' },

  { from: 'half-moon-pose', to: 'revolved-half-moon', type: 'complements',
    explanation: 'Revolved Half Moon is Half Moon with a full spinal twist — same single-leg balance, opposite rotation. Half Moon opens the hip laterally; Revolved Half Moon asks it to close and rotate. Together they move the hip and spine through every plane.' },

  { from: 'half-moon-pose', to: 'standing-split', type: 'complements',
    explanation: 'Standing Split and Half Moon share the same single-leg foundation but differ in direction: Half Moon opens the hip to the side, Standing Split drives it straight back. Together they give the standing hip a complete circumferential exploration.' },

  { from: 'half-moon-pose', to: 'bird-of-paradise', type: 'unlocks',
    explanation: 'Bird of Paradise adds a standing leg-extension bind on top of Half Moon\'s lateral balance. The single-leg stability and hip abduction strength built in Half Moon directly underpin the more demanding balance geometry of Bird of Paradise.' },

  { from: 'half-moon-pose', to: 'sugarcane-pose', type: 'unlocks',
    explanation: 'Sugarcane Pose is Half Moon with the lifted leg bent into a quad stretch. The balance and hip-opening precision you build in Half Moon are what keep the pelvis stable when the back knee bends and pulls the spine into extension.' },

  // ── Chair Pose ────────────────────────────────────────────────────────────
  { from: 'chair-pose', to: 'mountain-pose', type: 'prepares',
    explanation: 'Mountain Pose is the alignment reference Chair Pose is measured against. Grounding in Mountain first builds the postural map — vertical spine, active feet, engaged core — that Chair Pose then loads under demand.' },

  { from: 'chair-pose', to: 'squat-pose', type: 'prepares',
    explanation: 'Garland Pose opens the ankles and groins that Chair Pose demands. Many practitioners\' knees track inward or heels lift in Chair because the ankles are tight. Squatting first addresses that restriction at its source.' },

  { from: 'chair-pose', to: 'warrior-1', type: 'complements',
    explanation: 'Chair Pose and Warrior I both build quadriceps strength in a bent-knee position. Chair loads both legs symmetrically; Warrior I introduces asymmetry and hip opening. Together they cover the full spectrum of standing leg demand.' },

  { from: 'chair-pose', to: 'eagle-pose', type: 'complements',
    explanation: 'Eagle Pose sits in a Chair Pose squat while wrapping the limbs into a focused compression. The leg strength and ankle stability built in Chair are exactly what Eagle\'s crossed-leg squat requires — Eagle is Chair made significantly more complex.' },

  { from: 'chair-pose', to: 'crow-pose', type: 'unlocks',
    explanation: 'Crow Pose needs strong hip flexors and the ability to round the spine into a shelf — both developed in Chair. The hip-crease engagement and forward lean from Chair translate directly into the lift-off mechanics of Bakasana.' },

  { from: 'chair-pose', to: 'firefly-pose', type: 'unlocks',
    explanation: 'Firefly Pose requires deep hip flexion, inner thigh engagement, and arm-to-leg connection that Chair Pose begins to build. The forward-lean pattern from Chair — when extended and refined — becomes the counterbalance mechanics of Tittibhasana.' },

  // ── Tree Pose ─────────────────────────────────────────────────────────────
  { from: 'tree-pose', to: 'mountain-pose', type: 'prepares',
    explanation: 'Mountain Pose is the structural reference for Tree — both feet on the ground, spine vertical, breath steady. Anchoring in Mountain before lifting one foot builds the grounding habit that Tree Pose depends on.' },

  { from: 'tree-pose', to: 'eagle-pose', type: 'complements',
    explanation: 'Eagle Pose is Tree Pose with the arms and legs wrapped rather than opened. Both ask for single-leg balance and hip engagement, but Eagle compresses while Tree expands. Together they give the standing hip both directions of work.' },

  { from: 'tree-pose', to: 'warrior-3', type: 'complements',
    explanation: 'Warrior III takes Tree\'s single-leg stability and tips the entire upper body forward. The ankle strength and hip engagement from Tree are the same tools Warrior III calls on — just working in a completely different plane.' },

  { from: 'tree-pose', to: 'standing-split', type: 'unlocks',
    explanation: 'Standing Split extends Tree\'s single-leg balance into a full forward fold with one leg lifted. The hip stability and grounded foot strength from Tree are prerequisites — without them, the lifted leg pulls the standing hip out of alignment.' },

  { from: 'tree-pose', to: 'lord-of-dance', type: 'unlocks',
    explanation: 'Lord of the Dance adds a backbend and quad stretch on top of Tree\'s single-leg balance foundation. The standing leg stability and postural awareness built in Tree directly determine how graceful — and safe — Natarajasana becomes.' },

  // ── Lord of the Dance ─────────────────────────────────────────────────────
  { from: 'lord-of-dance', to: 'low-lunge', type: 'prepares',
    explanation: 'The quad and hip flexor of the lifted leg are under intense stretch in Natarajasana. Low Lunge addresses those tissues directly — the psoas, rectus femoris, the front of the hip — before asking them to stretch against the combined forces of a backbend and single-leg balance.' },

  { from: 'lord-of-dance', to: 'king-dancer', type: 'complements',
    explanation: 'King Dancer is a variation of Natarajasana with a different grip — typically a two-handed overhead clasp versus the one-handed ankle hold. Together they explore different shoulder openings and spinal patterns within the same foundational balance and quad stretch.' },

  { from: 'lord-of-dance', to: 'warrior-3', type: 'complements',
    explanation: 'Warrior III shares Lord of the Dance\'s single-leg challenge but moves in the opposite direction — forward hip hinge rather than backbend. Together they develop comprehensive standing-leg strength: stability in both extension planes.' },

  { from: 'lord-of-dance', to: 'sugarcane-pose', type: 'unlocks',
    explanation: 'Sugarcane Pose asks for Half Moon balance plus the quad stretch of Natarajasana — it\'s where the two practices converge. The backbend awareness and single-leg stability from Lord of the Dance contribute directly to Sugarcane\'s integration of balance and spinal extension.' },

  // ── Crow Pose ─────────────────────────────────────────────────────────────
  { from: 'crow-pose', to: 'chair-pose', type: 'prepares',
    explanation: 'Chair Pose builds the hip flexor strength and forward-lean coordination that Crow Pose requires for lift-off. The engagement of drawing the hip creases toward the torso — practiced in Chair — is the primary action that gets the feet off the floor in Bakasana.' },

  { from: 'crow-pose', to: 'firefly-pose', type: 'unlocks',
    explanation: 'Firefly Pose extends Crow\'s arm balance into straight arms with legs projected forward. The wrist loading, core compression, and hip-to-arm connection established in Crow are the direct prerequisites for Tittibhasana\'s more demanding arm-balance geometry.' },

  // ── Firefly Pose ──────────────────────────────────────────────────────────
  { from: 'firefly-pose', to: 'squat-pose', type: 'prepares',
    explanation: 'Garland Pose opens the hips and groins that Firefly needs to slide the legs high onto the arms. Deep squat practice — particularly the inner thigh opening and groin space — creates the hip flexion range that Tittibhasana demands.' },

  { from: 'firefly-pose', to: 'crow-pose', type: 'complements',
    explanation: 'Crow Pose and Firefly Pose are arm balances rooted in the same hip-to-arm shelf but with different leg geometry. Crow builds the compressed, folded version; Firefly extends it forward. Practicing both develops arm balance strength across the full range of hip positions.' },
];

async function main() {
  // Fetch all pose slugs → ids
  const { data: poses, error: poseErr } = await supabase
    .from('poses')
    .select('id, slug');
  if (poseErr) throw poseErr;

  const slugToId = Object.fromEntries(poses.map(p => [p.slug, p.id]));

  console.log(`Inserting ${edges.length} relationships...\n`);
  let inserted = 0, failed = 0;

  for (const e of edges) {
    const fromId = slugToId[e.from];
    const toId   = slugToId[e.to];

    if (!fromId) { console.log(`  MISS  from slug not found: ${e.from}`); failed++; continue; }
    if (!toId)   { console.log(`  MISS  to slug not found: ${e.to}`);     failed++; continue; }

    const { error } = await supabase
      .from('pose_relationships')
      .upsert({
        from_pose_id: fromId,
        to_pose_id:   toId,
        relationship: e.type,
        explanation:  e.explanation,
      }, { onConflict: 'from_pose_id,to_pose_id,relationship' });

    if (error) {
      console.log(`  FAIL  ${e.from} → ${e.to} (${e.type}): ${error.message}`);
      failed++;
    } else {
      console.log(`  OK    ${e.from} → ${e.to} (${e.type})`);
      inserted++;
    }
  }

  console.log(`\n── Summary ──`);
  console.log(`  Inserted/updated: ${inserted}`);
  console.log(`  Failed: ${failed}`);
}

main().catch(console.error);
