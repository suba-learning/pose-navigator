require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

// Sheet 3 — relationships for the 14 previously-empty poses.
// Only edges where both slugs exist in DB are included.
// Skipped: Warrior II, Revolved Triangle, Revolved Side Angle, Camel, Bow Pose,
//          Standing Forward Fold, Butterfly, Seated Forward Fold, Wild Thing,
//          Hand to Big Toe, Hanumanasana — need silhouettes first.

const edges = [

  // ── Wide-Leg Forward Fold ─────────────────────────────────────────────────
  { from: 'wide-leg-forward-fold', to: 'triangle-pose', type: 'complements',
    explanation: 'Wide-Leg Forward Fold and Triangle Pose both live in the lateral hip and hamstring plane. Wide-Leg opens the inner thighs symmetrically; Triangle takes that openness into an asymmetric side stretch. They reinforce each other in the same practice.' },

  { from: 'wide-leg-forward-fold', to: 'goddess-pose', type: 'complements',
    explanation: 'Goddess Pose and Wide-Leg Forward Fold share the same wide-legged stance — one standing strong and opening the inner thighs in compression, the other folding forward to release them. Together they cover both poles of the wide-leg hip opening.' },

  // ── Warrior III ───────────────────────────────────────────────────────────
  { from: 'warrior-3', to: 'warrior-1', type: 'prepares',
    explanation: 'Warrior I is the foundation Warrior III tips forward from. The hip alignment, back body engagement, and standing leg strength established in Warrior I are exactly what Warrior III calls on when the torso becomes parallel to the floor.' },

  { from: 'warrior-3', to: 'chair-pose', type: 'prepares',
    explanation: 'Chair Pose builds the quadriceps and hip flexor strength that holds Warrior III level. The forward-lean habit in Chair — spine long, hip creases drawing in — is the same action that keeps Warrior III from collapsing at the hip.' },

  { from: 'warrior-3', to: 'standing-split', type: 'complements',
    explanation: 'Standing Split and Warrior III share the same single-leg standing base but travel in different directions. Warrior III is about a level torso and power; Standing Split releases into gravity and length. Together they give the standing hip the full range of work and ease.' },

  { from: 'warrior-3', to: 'half-moon-pose', type: 'complements',
    explanation: 'Half Moon and Warrior III both demand single-leg stability, but Half Moon opens the hip laterally while Warrior III keeps the hips square. Practicing both builds stability across multiple planes of hip loading.' },

  // ── Extended Side Angle ───────────────────────────────────────────────────
  { from: 'extended-side-angle', to: 'triangle-pose', type: 'prepares',
    explanation: 'Triangle Pose is Extended Side Angle without the bent front knee — it asks the hamstring to lengthen fully while the side body stays long. Time in Triangle prepares both the hamstring and the lateral chain that Extended Side Angle loads.' },

  { from: 'extended-side-angle', to: 'half-moon-pose', type: 'complements',
    explanation: 'Half Moon and Extended Side Angle both explore the lateral hip in a wide-leg stance, but Half Moon lifts one leg and adds balance. The side-body length and hip-abduction strength from Extended Side Angle transfer directly into Half Moon.' },

  { from: 'extended-side-angle', to: 'bird-of-paradise', type: 'unlocks',
    explanation: 'Bird of Paradise grows directly out of Extended Side Angle — it adds a bind and then lifts the front leg toward standing. The hamstring length, hip opening, and shoulder connection built in Extended Side Angle are the prerequisites for that transition.' },

  { from: 'extended-side-angle', to: 'bound-side-angle', type: 'unlocks',
    explanation: 'Bound Side Angle is Extended Side Angle with the arms wrapped underneath the front thigh and behind the back. The hip opening and side-body space from Extended Side Angle create room for the bind — without that foundation, the bind pulls rather than opens.' },

  // ── Reverse Warrior ───────────────────────────────────────────────────────
  { from: 'reverse-warrior', to: 'extended-side-angle', type: 'complements',
    explanation: 'Reverse Warrior and Extended Side Angle are natural pairs in a Warrior II flow — one reaches back to open the side body, the other reaches forward to deepen the lateral hip. Together they give the front-leg side a full cycle of extension and compression.' },

  { from: 'reverse-warrior', to: 'triangle-pose', type: 'complements',
    explanation: 'Triangle Pose and Reverse Warrior both work the lateral hip and side body in a wide-leg stance, but from different angles. Triangle straightens the front leg; Reverse Warrior keeps the knee bent. Together they cover the full length of the lateral chain.' },

  // ── Eagle Pose ────────────────────────────────────────────────────────────
  { from: 'eagle-pose', to: 'chair-pose', type: 'prepares',
    explanation: 'Chair Pose builds the bent-knee squat strength that Eagle sits in. The ankle stability and quadriceps endurance from Chair are what allow Eagle to settle low and hold the crossed-leg compression without toppling.' },

  { from: 'eagle-pose', to: 'tree-pose', type: 'complements',
    explanation: 'Tree Pose and Eagle Pose are the two great balance poses — one expanding and opening the hip, the other wrapping and compressing it. Together they give the standing hip a complete exploration: openness in Tree, focused integration in Eagle.' },

  { from: 'eagle-pose', to: 'warrior-3', type: 'complements',
    explanation: 'Warrior III and Eagle Pose both require single-leg stability and hip engagement, but in completely different body shapes. Eagle wraps and compresses; Warrior III extends and balances on a horizontal plane. Together they build standing balance across every direction.' },

  // ── Goddess Pose ──────────────────────────────────────────────────────────
  { from: 'goddess-pose', to: 'wide-leg-forward-fold', type: 'prepares',
    explanation: 'Wide-Leg Forward Fold releases the inner thighs and adductors that Goddess Pose loads. Folding forward first lets those muscles release passively before asking them to work isometrically in the wide-knee squat of Utkata Konasana.' },

  { from: 'goddess-pose', to: 'squat-pose', type: 'prepares',
    explanation: 'Garland Pose (Malasana) opens the ankles and deepens the hip flexion range that Goddess Pose works. The groin and inner thigh space created in a deep squat carries directly into the stability of Goddess.' },

  { from: 'goddess-pose', to: 'wide-leg-forward-fold', type: 'complements',
    explanation: 'Goddess and Wide-Leg Forward Fold are natural complements in the same wide-legged stance — Goddess builds strength in the loaded position, Wide-Leg Fold releases it into length. Moving between them in a practice creates a complete cycle of work and recovery for the inner thighs.' },

  { from: 'goddess-pose', to: 'firefly-pose', type: 'unlocks',
    explanation: 'Firefly Pose requires the deep inner thigh and hip flexor opening that Goddess Pose builds over time. The wide-hip, deep-knee position of Goddess teaches the body the range of motion that Tittibhasana then takes into an arm balance.' },

  // ── Crescent Lunge ────────────────────────────────────────────────────────
  { from: 'crescent-lunge', to: 'low-lunge', type: 'prepares',
    explanation: 'Low Lunge addresses the psoas and hip flexors of the back leg directly — the tissue that limits depth in Crescent Lunge. Coming through Low Lunge first releases that restriction before Crescent asks the arms to reach overhead and the spine to lengthen.' },

  { from: 'crescent-lunge', to: 'warrior-1', type: 'complements',
    explanation: 'Crescent Lunge and Warrior I ask the same hip flexor tissue to open but differ at the back foot: Crescent\'s heel is lifted for more hip flexor traction, Warrior I\'s heel is grounded for more stability. They complement each other in the same practice.' },

  // ── Garland Pose ──────────────────────────────────────────────────────────
  { from: 'squat-pose', to: 'wide-leg-forward-fold', type: 'prepares',
    explanation: 'Wide-Leg Forward Fold opens the inner thighs and adductors that a deep squat demands. The hip crease release from the fold directly reduces the tension that keeps heels from lowering to the floor in Malasana.' },

  { from: 'squat-pose', to: 'goddess-pose', type: 'complements',
    explanation: 'Goddess Pose and Garland Pose are two expressions of the same wide-hip, bent-knee family. Goddess is upright and strength-building; Garland descends into a deep fold. Together they explore both the standing and grounded ends of the wide-leg hip spectrum.' },

  { from: 'squat-pose', to: 'crow-pose', type: 'unlocks',
    explanation: 'Crow Pose grows directly out of a squat: the same hip flexion, the same rounding of the spine, the same inner thigh engagement. The depth and ease you build in Garland Pose are exactly what allow the arms to become a shelf and the feet to leave the floor in Bakasana.' },

  { from: 'squat-pose', to: 'firefly-pose', type: 'unlocks',
    explanation: 'Firefly Pose requires the inner thigh opening and deep hip flexion that Garland Pose develops. Squatting with the inner thighs wide and the spine long is the closest floor-based approximation of what Tittibhasana asks the hips to do in the air.' },

  // ── Standing Split ────────────────────────────────────────────────────────
  { from: 'standing-split', to: 'warrior-3', type: 'prepares',
    explanation: 'Warrior III is the strengthening counterpart to Standing Split\'s release. Coming through Warrior III first builds the hamstring and glute activation in the standing leg — the same engagement that controls the descent into Standing Split.' },

  { from: 'standing-split', to: 'half-moon-pose', type: 'prepares',
    explanation: 'Half Moon Pose builds the single-leg hip stability and hamstring length that Standing Split depends on. The lateral hip opening and standing-leg strength from Half Moon directly support the balance and lift in Standing Split.' },

  // ── Revolved Half Moon ────────────────────────────────────────────────────
  { from: 'revolved-half-moon', to: 'half-moon-pose', type: 'prepares',
    explanation: 'Half Moon Pose establishes the single-leg balance, hip abduction, and body-line that Revolved Half Moon then twists. Without a stable Half Moon foundation, the rotation in Parivrtta Ardha Chandrasana destabilizes the hip rather than opening the spine.' },

  { from: 'revolved-half-moon', to: 'standing-split', type: 'complements',
    explanation: 'Standing Split and Revolved Half Moon share the same single-leg standing structure. Standing Split explores straight-back hip extension; Revolved Half Moon explores rotation. Together they move the standing hip through two orthogonal planes.' },

  { from: 'revolved-half-moon', to: 'warrior-3', type: 'complements',
    explanation: 'Warrior III and Revolved Half Moon both balance on one leg with the torso inclined, but Warrior III is about horizontal extension while Revolved Half Moon adds a lateral opening and spinal twist. Together they develop multi-planar single-leg stability.' },

  // ── Sugarcane Pose ────────────────────────────────────────────────────────
  { from: 'sugarcane-pose', to: 'half-moon-pose', type: 'prepares',
    explanation: 'Half Moon Pose is the base shape of Sugarcane — before bending the lifted leg into the backbend, you need the lateral balance and hip-abduction stability that Half Moon builds. Sugarcane is Half Moon with an added quad stretch and spinal extension.' },

  { from: 'sugarcane-pose', to: 'lord-of-dance', type: 'prepares',
    explanation: 'Lord of the Dance shares Sugarcane\'s quad stretch and backbend demands but in a forward-facing balance. Practicing Natarajasana first opens the hip flexors and builds the single-leg stability that Sugarcane then asks for in a lateral orientation.' },

  { from: 'sugarcane-pose', to: 'revolved-half-moon', type: 'complements',
    explanation: 'Revolved Half Moon and Sugarcane Pose share the same base shape — single-leg balance with one leg extended back. Revolved Half Moon twists the spine; Sugarcane bends the back leg into a backbend. Together they explore the two advanced dimensions of the Half Moon family.' },

  { from: 'sugarcane-pose', to: 'king-dancer', type: 'complements',
    explanation: 'King Dancer and Sugarcane both combine a quad stretch with single-leg balance, but from different orientations — King Dancer faces forward into a backbend, Sugarcane opens to the side. Together they develop both dimensions of the standing balance-backbend family.' },

  // ── Bird of Paradise ──────────────────────────────────────────────────────
  { from: 'bird-of-paradise', to: 'extended-side-angle', type: 'prepares',
    explanation: 'Extended Side Angle is the unbound gateway to Bird of Paradise — the same hip position, side-body length, and shoulder angle, without the bind. Consistent Extended Side Angle practice opens the hamstring and hip flexor that Bird of Paradise needs to extend the leg fully upright.' },

  { from: 'bird-of-paradise', to: 'bound-side-angle', type: 'prepares',
    explanation: 'Bound Side Angle is the transition pose to Bird of Paradise — the bind is established on the ground before lifting. Practicing the bound version of Side Angle teaches the shoulder rotation and hip connection that Bird of Paradise then asks you to maintain while standing upright.' },

  { from: 'bird-of-paradise', to: 'standing-split', type: 'complements',
    explanation: 'Standing Split and Bird of Paradise are both high leg-extensions from a single-leg standing base. Standing Split extends back; Bird of Paradise extends to the side with a bind. Together they develop the hamstring length and balance across the full range of leg-lift directions.' },

  { from: 'bird-of-paradise', to: 'half-moon-pose', type: 'complements',
    explanation: 'Half Moon Pose and Bird of Paradise share the same lateral hip opening but at different levels of intensity. Half Moon builds the lateral stability; Bird of Paradise adds a bind and a full leg extension. Half Moon is where you return when Bird of Paradise needs refinement.' },

  // ── Bound Side Angle ──────────────────────────────────────────────────────
  { from: 'bound-side-angle', to: 'extended-side-angle', type: 'prepares',
    explanation: 'Extended Side Angle opens the hip and side body in the unbound version of this pose — the same shape, without the shoulder and hip bind. Building hip flexor space and side-body length in Extended Side Angle is the direct preparation for adding the bind.' },

  { from: 'bound-side-angle', to: 'bird-of-paradise', type: 'unlocks',
    explanation: 'Bird of Paradise is the standing evolution of Bound Side Angle — the bind is established in the lunge, then the front leg straightens and you rise to standing. The shoulder rotation, hip opening, and bind connection all carry directly from Bound Side Angle.' },

  { from: 'bound-side-angle', to: 'compass-pose', type: 'unlocks',
    explanation: 'Compass Pose requires the same shoulder-behind-the-leg bind that Bound Side Angle establishes in a standing lunge. The hamstring length and shoulder rotation developed in Bound Side Angle directly enable the seated geometry of Surya Yantrasana.' },

  // ── King Dancer (Variation) ───────────────────────────────────────────────
  { from: 'king-dancer', to: 'low-lunge', type: 'prepares',
    explanation: 'Low Lunge opens the hip flexors and quad of the back leg — the tissue under intense stretch in King Dancer. Spending time in Low Lunge before practicing Natarajasana addresses the front of the hip directly, rather than discovering tightness mid-balance.' },

  { from: 'king-dancer', to: 'sugarcane-pose', type: 'complements',
    explanation: 'Sugarcane Pose and King Dancer both combine a quad stretch with single-leg balance, but from different orientations. Together they explore the full range of the standing backbend-balance family, each asking the body for slightly different spinal and hip positioning.' },

  { from: 'king-dancer', to: 'lord-of-dance', type: 'unlocks',
    explanation: 'Lord of the Dance is the full expression of Natarajasana — deeper backbend, fuller quad stretch, more demanding balance. King Dancer Variation builds the hip flexor openness, shoulder awareness, and single-leg stability that the complete pose requires.' },
];

async function main() {
  const { data: poses } = await supabase.from('poses').select('id, slug');
  const slugToId = Object.fromEntries(poses.map(p => [p.slug, p.id]));

  console.log(`Inserting ${edges.length} relationships...\n`);
  let inserted = 0, failed = 0;

  for (const e of edges) {
    const fromId = slugToId[e.from];
    const toId   = slugToId[e.to];
    if (!fromId || !toId) {
      console.log(`  MISS  ${e.from} → ${e.to}`); failed++; continue;
    }
    const { error } = await supabase.from('pose_relationships').upsert({
      from_pose_id: fromId, to_pose_id: toId,
      relationship: e.type, explanation: e.explanation,
    }, { onConflict: 'from_pose_id,to_pose_id,relationship' });

    if (error) { console.log(`  FAIL  ${e.from} → ${e.to}: ${error.message}`); failed++; }
    else        { console.log(`  OK    ${e.from} → ${e.to} (${e.type})`); inserted++; }
  }

  console.log(`\n── Summary ──`);
  console.log(`  Inserted/updated: ${inserted}`);
  console.log(`  Failed: ${failed}`);
}

main().catch(console.error);
