require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const BASE = 'https://azyvjtesdkhfrcrgzcle.supabase.co/storage/v1/object/public/pose-images/';

const newPoses = [
  {
    slug: 'mountain-pose',
    name: 'Mountain Pose',
    sanskrit: 'Tadasana',
    body_areas: ['feet', 'legs', 'core', 'posture'],
    flags: [],
    image_url: BASE + 'mountain-pose.png',
  },
  {
    slug: 'chair-pose',
    name: 'Chair Pose',
    sanskrit: 'Utkatasana',
    body_areas: ['quadriceps', 'glutes', 'ankles', 'shoulders'],
    flags: ['knee caution', 'lower back'],
    image_url: BASE + 'chair-pose.png',
  },
  {
    slug: 'warrior-1',
    name: 'Warrior I',
    sanskrit: 'Virabhadrasana I',
    body_areas: ['hip flexors', 'psoas', 'quadriceps', 'shoulders'],
    flags: ['knee caution'],
    image_url: BASE + 'warrior-1.jpeg',
  },
  {
    slug: 'crescent-lunge',
    name: 'Crescent Lunge',
    sanskrit: 'Anjaneyasana',
    body_areas: ['hip flexors', 'psoas', 'quadriceps', 'shoulders'],
    flags: ['knee caution'],
    image_url: BASE + 'crescent-lunge.png',
  },
  {
    slug: 'extended-side-angle',
    name: 'Extended Side Angle',
    sanskrit: 'Utthita Parsvakonasana',
    body_areas: ['hip flexors', 'groin', 'side body', 'obliques'],
    flags: ['knee caution'],
    image_url: BASE + 'extended-side-angle.png',
  },
  {
    slug: 'reverse-warrior',
    name: 'Reverse Warrior',
    sanskrit: 'Viparita Virabhadrasana',
    body_areas: ['hip flexors', 'side body', 'obliques', 'quadriceps'],
    flags: ['knee caution'],
    image_url: BASE + 'reverse-warrior.jpeg',
  },
  {
    slug: 'triangle-pose',
    name: 'Triangle Pose',
    sanskrit: 'Trikonasana',
    body_areas: ['hamstrings', 'IT band', 'side body', 'obliques'],
    flags: ['lower back'],
    image_url: BASE + 'triangle-pose.jpeg',
  },
  {
    slug: 'wide-leg-forward-fold',
    name: 'Wide-Leg Forward Fold',
    sanskrit: 'Prasarita Padottanasana',
    body_areas: ['hamstrings', 'inner thigh', 'groin', 'adductors'],
    flags: [],
    image_url: BASE + 'wide-leg-forward-fold.jpeg',
  },
  {
    slug: 'half-moon-pose',
    name: 'Half Moon Pose',
    sanskrit: 'Ardha Chandrasana',
    body_areas: ['hips', 'hamstrings', 'IT band', 'outer hip'],
    flags: ['balance issues', 'lower back'],
    image_url: BASE + 'half-moon-pose.png',
  },
  {
    slug: 'revolved-half-moon',
    name: 'Revolved Half Moon',
    sanskrit: 'Parivrtta Ardha Chandrasana',
    body_areas: ['hips', 'hamstrings', 'spine', 'IT band'],
    flags: ['balance issues', 'lower back'],
    image_url: BASE + 'revolved-half-moon.png',
  },
  {
    slug: 'warrior-3',
    name: 'Warrior III',
    sanskrit: 'Virabhadrasana III',
    body_areas: ['hamstrings', 'glutes', 'core', 'back'],
    flags: ['balance issues'],
    image_url: BASE + 'warrior-3.png',
  },
  {
    slug: 'standing-split',
    name: 'Standing Split',
    sanskrit: 'Urdhva Prasarita Eka Padasana',
    body_areas: ['hamstrings', 'hip flexors', 'glutes', 'calf'],
    flags: ['hamstring injury', 'balance issues'],
    image_url: BASE + 'standing-split.png',
  },
  {
    slug: 'tree-pose',
    name: 'Tree Pose',
    sanskrit: 'Vrksasana',
    body_areas: ['hip external rotators', 'groin', 'inner thigh'],
    flags: ['balance issues', 'knee caution'],
    image_url: BASE + 'tree-pose.png',
  },
  {
    slug: 'eagle-pose',
    name: 'Eagle Pose',
    sanskrit: 'Garudasana',
    body_areas: ['hips', 'glutes', 'shoulders', 'upper back'],
    flags: ['balance issues', 'knee caution'],
    image_url: BASE + 'eagle-pose.png',
  },
  {
    slug: 'goddess-pose',
    name: 'Goddess Pose',
    sanskrit: 'Utkata Konasana',
    body_areas: ['hips', 'groin', 'quadriceps', 'inner thigh'],
    flags: ['knee caution'],
    image_url: BASE + 'goddess-pose.png',
  },
  {
    slug: 'squat-pose',
    name: 'Garland Pose',
    sanskrit: 'Malasana',
    body_areas: ['hips', 'groin', 'ankles', 'lower back'],
    flags: ['knee caution'],
    image_url: BASE + 'squat-pose.png',
  },
  {
    slug: 'crow-pose',
    name: 'Crow Pose',
    sanskrit: 'Bakasana',
    body_areas: ['wrists', 'core', 'hip flexors', 'triceps'],
    flags: ['wrist'],
    image_url: BASE + 'crow-pose.png',
  },
  {
    slug: 'firefly-pose',
    name: 'Firefly Pose',
    sanskrit: 'Tittibhasana',
    body_areas: ['hamstrings', 'wrists', 'core', 'inner thigh'],
    flags: ['wrist', 'hamstring injury'],
    image_url: BASE + 'firefly-pose.png',
  },
  {
    slug: 'bird-of-paradise',
    name: 'Bird of Paradise',
    sanskrit: 'Svarga Dvijasana',
    body_areas: ['hamstrings', 'hip flexors', 'shoulders', 'side body'],
    flags: ['hamstring injury', 'balance issues', 'shoulder injury'],
    image_url: BASE + 'bird-of-paradise.png',
  },
  {
    slug: 'bound-side-angle',
    name: 'Bound Side Angle',
    sanskrit: 'Baddha Parsvakonasana',
    body_areas: ['hip flexors', 'groin', 'shoulders', 'side body'],
    flags: ['knee caution', 'shoulder injury'],
    image_url: BASE + 'bound-side-angle.png',
  },
  {
    slug: 'sugarcane-pose',
    name: 'Sugarcane Pose',
    sanskrit: 'Ardha Chandra Chapasana',
    body_areas: ['hip flexors', 'quadriceps', 'side body', 'IT band'],
    flags: ['balance issues', 'lower back', 'knee caution'],
    image_url: BASE + 'sugarcane-pose.png',
  },
  {
    slug: 'lord-of-dance',
    name: 'Lord of the Dance',
    sanskrit: 'Natarajasana',
    body_areas: ['hip flexors', 'quadriceps', 'shoulders', 'spine'],
    flags: ['balance issues', 'lower back', 'knee caution', 'shoulder injury'],
    image_url: BASE + 'lord-of-dance.png',
  },
  {
    slug: 'king-dancer',
    name: 'King Dancer (Variation)',
    sanskrit: 'Natarajasana variation',
    body_areas: ['hip flexors', 'quadriceps', 'shoulders', 'chest'],
    flags: ['balance issues', 'lower back', 'shoulder injury'],
    image_url: BASE + 'king-dancer.png',
  },
];

async function main() {
  console.log(`Inserting ${newPoses.length} new poses...\n`);

  let inserted = 0;
  let skipped = 0;
  let failed = 0;

  for (const pose of newPoses) {
    const { data, error } = await supabase
      .from('poses')
      .upsert(pose, { onConflict: 'slug', ignoreDuplicates: false })
      .select('id, name');

    if (error) {
      console.log(`  FAIL  ${pose.slug}: ${error.message}`);
      failed++;
    } else {
      console.log(`  OK    ${data[0].name} (${data[0].id})`);
      inserted++;
    }
  }

  console.log(`\n── Summary ──`);
  console.log(`  Inserted/updated: ${inserted}`);
  console.log(`  Failed: ${failed}`);
  console.log('\nDone.');
}

main().catch(console.error);
