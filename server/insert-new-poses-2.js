require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs   = require('fs');
const path = require('path');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
const IMAGES_DIR = path.join(__dirname, '..', '..');   // /Users/.../Yoga Poses/
const BUCKET     = 'pose-images';
const BASE_URL   = 'https://azyvjtesdkhfrcrgzcle.supabase.co/storage/v1/object/public/pose-images/';

// ── 1. Image upload map ──────────────────────────────────────────────────────
const IMAGE_MAP = [
  { slug: 'warrior-2',           file: 'Gemini_Warrior II.png' },
  { slug: 'revolved-triangle',   file: 'Gemini_Revolved Triangle.png' },
  { slug: 'revolved-side-angle', file: 'Gemini_Revolved Side Angle.png' },
  { slug: 'camel-pose',          file: 'Gemini_Camel Pose.png' },
  { slug: 'bow-pose',            file: 'Gemini_Bow Pose.png' },
  { slug: 'standing-forward-fold', file: 'Gemini_Standing_forward_fold.png' },
  { slug: 'butterfly-pose',      file: 'Gemini_butterfly.png' },
  { slug: 'seated-forward-fold', file: 'Gemini_sitting_forward_fold.png' },
  { slug: 'wild-thing',          file: 'Gemini_Wild Thing.png' },
  { slug: 'full-split',          file: 'Gemini_Seated_split.png' },
];

// ── 2. New pose records ──────────────────────────────────────────────────────
const newPoses = [
  { slug: 'warrior-2',
    name: 'Warrior II', sanskrit: 'Virabhadrasana II',
    body_areas: ['hips', 'legs', 'shoulders', 'groin'],
    flags: ['knee caution'] },

  { slug: 'revolved-triangle',
    name: 'Revolved Triangle', sanskrit: 'Parivrtta Trikonasana',
    body_areas: ['hamstrings', 'IT band', 'spine', 'side body'],
    flags: ['lower back', 'balance issues'] },

  { slug: 'revolved-side-angle',
    name: 'Revolved Side Angle', sanskrit: 'Parivrtta Parsvakonasana',
    body_areas: ['hips', 'legs', 'spine', 'side body'],
    flags: ['knee caution', 'lower back', 'balance issues'] },

  { slug: 'camel-pose',
    name: 'Camel Pose', sanskrit: 'Ustrasana',
    body_areas: ['hip flexors', 'spine', 'chest', 'quadriceps'],
    flags: ['lower back', 'knee caution', 'neck'] },

  { slug: 'bow-pose',
    name: 'Bow Pose', sanskrit: 'Dhanurasana',
    body_areas: ['spine', 'hip flexors', 'quadriceps', 'chest'],
    flags: ['lower back', 'knee caution', 'neck'] },

  { slug: 'standing-forward-fold',
    name: 'Standing Forward Fold', sanskrit: 'Uttanasana',
    body_areas: ['hamstrings', 'calves', 'lower back'],
    flags: ['lower back', 'hamstring injury'] },

  { slug: 'butterfly-pose',
    name: 'Butterfly Pose', sanskrit: 'Baddha Konasana',
    body_areas: ['hips', 'groin', 'inner thigh', 'adductors'],
    flags: ['knee caution'] },

  { slug: 'seated-forward-fold',
    name: 'Seated Forward Fold', sanskrit: 'Paschimottanasana',
    body_areas: ['hamstrings', 'lower back', 'calves'],
    flags: ['lower back', 'hamstring injury'] },

  { slug: 'wild-thing',
    name: 'Wild Thing', sanskrit: 'Camatkarasana',
    body_areas: ['chest', 'hip flexors', 'shoulders', 'spine'],
    flags: ['lower back', 'wrist', 'shoulder injury'] },

  { slug: 'full-split',
    name: 'Full Split', sanskrit: 'Hanumanasana',
    body_areas: ['hamstrings', 'hip flexors', 'groin'],
    flags: ['hamstring injury'] },
];

// ── 3. Relationships that were skipped (targets now exist) ───────────────────
const newEdges = [
  // Wide-Leg Forward Fold
  { from: 'wide-leg-forward-fold', to: 'standing-forward-fold', type: 'prepares',
    explanation: 'Standing Forward Fold (Uttanasana) opens the hamstrings and calves symmetrically before Wide-Leg Forward Fold asks them to work in a wider stance. The hamstring release in Uttanasana directly reduces the posterior tilt that limits depth in the wide-legged version.' },
  { from: 'wide-leg-forward-fold', to: 'butterfly-pose', type: 'prepares',
    explanation: 'Butterfly Pose opens the inner thighs and groins in a passive, seated position before Wide-Leg Forward Fold asks those same tissues to release against gravity. Baddha Konasana prepares the adductors specifically for the wide-leg demand.' },

  // Extended Side Angle
  { from: 'extended-side-angle', to: 'warrior-2', type: 'prepares',
    explanation: 'Warrior II is the direct foundation for Extended Side Angle — the same wide-leg stance, the same front-knee bend, the same arm opening. Settling into Warrior II first establishes the hip and leg position that Extended Side Angle then extends and deepens.' },
  { from: 'extended-side-angle', to: 'revolved-side-angle', type: 'complements',
    explanation: 'Revolved Side Angle and Extended Side Angle share the same bent-knee lunge base but move in opposite directions — one opens laterally, the other twists. Together they give the hip and spine a complete rotational range of motion within the same stance.' },

  // Reverse Warrior
  { from: 'reverse-warrior', to: 'warrior-2', type: 'prepares',
    explanation: 'Warrior II is the natural home base for Reverse Warrior — you reach the front arm back from the Warrior II position. Building stability and hip opening in Warrior II first means Reverse Warrior can focus on the side-body extension rather than fighting for the stance.' },
  { from: 'reverse-warrior', to: 'wild-thing', type: 'unlocks',
    explanation: 'Wild Thing grows out of the backbending energy of Reverse Warrior. The lateral spine opening and hip flexor release built in Reverse Warrior directly prepare the body for the fuller backbend and hip flip of Camatkarasana.' },

  // Goddess Pose
  { from: 'goddess-pose', to: 'warrior-2', type: 'complements',
    explanation: 'Warrior II and Goddess Pose are both wide-leg, bent-knee stances that load the inner thighs and hips. Goddess opens the hips symmetrically; Warrior II introduces asymmetry and directional focus. Together they develop hip strength across both planes of the wide stance.' },

  // Crescent Lunge
  { from: 'crescent-lunge', to: 'warrior-2', type: 'complements',
    explanation: 'Warrior II and Crescent Lunge both work in the lunge family but with different back foot positions and hip orientations. Crescent builds front-body length and hip flexor openness; Warrior II develops lateral hip stability. They are natural pairs in a standing sequence.' },

  // Garland Pose
  { from: 'squat-pose', to: 'seated-forward-fold', type: 'complements',
    explanation: 'Seated Forward Fold and Garland Pose both explore hip flexion and hamstring length, but from different starting positions. Garland is the standing compressed version; Seated Forward Fold is the floor-based extended version. Together they cover the full hip flexion spectrum.' },

  // Revolved Half Moon
  { from: 'revolved-half-moon', to: 'revolved-triangle', type: 'prepares',
    explanation: 'Revolved Triangle establishes the spinal rotation and hamstring length that Revolved Half Moon then performs on one leg. The twist mechanics, hip position, and hamstring opening from Revolved Triangle transfer directly into the balance demands of Parivrtta Ardha Chandrasana.' },

  // Bound Side Angle
  { from: 'bound-side-angle', to: 'revolved-side-angle', type: 'complements',
    explanation: 'Revolved Side Angle and Bound Side Angle both involve a deep hip bend with a directional spine challenge — one twists, one binds. Together they develop the full rotational and lateral range of the hip within the same lunge stance.' },

  // King Dancer (Variation)
  { from: 'king-dancer', to: 'camel-pose', type: 'prepares',
    explanation: 'Camel Pose opens the hip flexors, quadriceps, and chest in a kneeling backbend before King Dancer asks those same tissues to perform while standing on one leg. The spinal extension and front-body opening from Ustrasana directly prepare the body for Natarajasana.' },
  { from: 'king-dancer', to: 'bow-pose', type: 'unlocks',
    explanation: 'Bow Pose takes the quad stretch and backbend of King Dancer to the floor, adding more leverage and a deeper spinal extension. The hip flexor openness and backbend tolerance developed in King Dancer translate directly into the floor-based intensity of Dhanurasana.' },

  // Standing Split
  { from: 'standing-split', to: 'full-split', type: 'unlocks',
    explanation: 'Full Split (Hanumanasana) is the floor-based culmination of the hamstring and hip flexor opening that Standing Split builds on one leg. The range of motion Standing Split develops standing — hamstring lengthening in the lifted leg, hip flexor release in the standing leg — is the exact range Hanumanasana requires.' },
];

async function uploadImages() {
  console.log('── Uploading images ──\n');
  const results = [];
  for (const { slug, file } of IMAGE_MAP) {
    const localPath = path.join(IMAGES_DIR, file);
    if (!fs.existsSync(localPath)) { console.log(`  SKIP  ${slug} (file not found: ${file})`); continue; }

    const ext        = path.extname(file).toLowerCase();
    const storageName = `${slug}${ext}`;
    const buffer     = fs.readFileSync(localPath);
    const mime       = ext === '.png' ? 'image/png' : 'image/jpeg';

    const { error } = await supabase.storage.from(BUCKET)
      .upload(storageName, buffer, { contentType: mime, upsert: true });

    if (error) { console.log(`  FAIL  ${slug}: ${error.message}`); continue; }
    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(storageName);
    console.log(`  OK    ${slug} → ${urlData.publicUrl}`);
    results.push({ slug, url: urlData.publicUrl });
  }
  return results;
}

async function insertPoses(uploadResults) {
  console.log('\n── Inserting poses ──\n');
  const urlMap = Object.fromEntries(uploadResults.map(r => [r.slug, r.url]));

  for (const pose of newPoses) {
    const image_url = urlMap[pose.slug] || null;
    const { data, error } = await supabase.from('poses')
      .upsert({ ...pose, image_url }, { onConflict: 'slug' })
      .select('id, name');

    if (error) console.log(`  FAIL  ${pose.slug}: ${error.message}`);
    else       console.log(`  OK    ${data[0].name}`);
  }
}

async function insertRelationships() {
  console.log('\n── Inserting relationships ──\n');
  const { data: poses } = await supabase.from('poses').select('id, slug');
  const slugToId = Object.fromEntries(poses.map(p => [p.slug, p.id]));

  let ok = 0, fail = 0;
  for (const e of newEdges) {
    const fromId = slugToId[e.from];
    const toId   = slugToId[e.to];
    if (!fromId || !toId) { console.log(`  MISS  ${e.from} → ${e.to}`); fail++; continue; }

    const { error } = await supabase.from('pose_relationships').upsert(
      { from_pose_id: fromId, to_pose_id: toId, relationship: e.type, explanation: e.explanation },
      { onConflict: 'from_pose_id,to_pose_id,relationship' }
    );
    if (error) { console.log(`  FAIL  ${e.from} → ${e.to}: ${error.message}`); fail++; }
    else       { console.log(`  OK    ${e.from} → ${e.to} (${e.type})`); ok++; }
  }
  console.log(`\n  Relationships: ${ok} OK, ${fail} failed`);
}

async function main() {
  const uploaded = await uploadImages();
  await insertPoses(uploaded);
  await insertRelationships();
  console.log('\nDone.');
}

main().catch(console.error);
