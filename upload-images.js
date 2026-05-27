require('dotenv').config({ path: './server/.env' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const IMAGES_DIR = path.join(__dirname, '..'); // /Users/.../Yoga Poses/
const BUCKET = 'pose-images';

// ── Mapping: clean slug → local filename ────────────────────────────────────
// For existing 10 poses + all new poses
const IMAGE_MAP = [
  // ── Existing poses ──
  { slug: 'pigeon-pose',         file: 'Gemini_Pigeon.jpeg' },
  { slug: 'lizard-pose',         file: 'Gemini_Lizard.png' },
  { slug: 'low-lunge',           file: 'Gemini_low lunge.png' },
  { slug: 'dragon-pose',         file: 'Gemini_Dragon_rotated.png' },
  { slug: 'supported-pigeon',    file: 'Gemini_supported Pigeon.png' },
  { slug: 'shoelace-pose',       file: 'Gemini_Cowface.png' },
  { slug: 'king-pigeon',         file: 'Gemini_KingPigeon.png' },
  { slug: 'compass-pose',        file: 'Gemini_Compass Pose.png' },
  { slug: 'standing-figure-four',file: 'Gemini_ Eka Pada Utkatasana.png' },
  // supine-figure-four has no image yet — skipped

  // ── New poses (images ready, poses to be added later) ──
  { slug: 'bird-of-paradise',    file: 'Gemini_Bird of paradise.png' },
  { slug: 'bound-side-angle',    file: 'Gemini_Bound side angle.png' },
  { slug: 'chair-pose',          file: 'Gemini_Chair Pose.png' },    // prefer .png over .jpeg
  { slug: 'eagle-pose',          file: 'Gemini_Eagle.png' },         // prefer larger .png
  { slug: 'goddess-pose',        file: 'Gemini_Goddess.png' },
  { slug: 'half-moon-pose',      file: 'Gemini_Half moon pose.png' },
  { slug: 'king-dancer',         file: 'Gemini_King of dancer variation.png' },
  { slug: 'reverse-warrior',     file: 'Gemini_Reverse_Warrior.jpeg' },
  { slug: 'revolved-half-moon',  file: 'Gemini_Revolved_half moon.png' },
  { slug: 'squat-pose',          file: 'Gemini_Squat_pose.png' },
  { slug: 'standing-split',      file: 'Gemini_Standing split.png' },
  { slug: 'sugarcane-pose',      file: 'Gemini_Sugarcane.png' },
  { slug: 'tree-pose',           file: 'Gemini_Tree pose.png' },     // prefer .png
  { slug: 'warrior-1',           file: 'Gemini_Warrior1.jpeg' },
  { slug: 'warrior-3',           file: 'Gemini_Warrior3.png' },
  { slug: 'crescent-lunge',      file: 'Gemini_crescent lunge.png' },
  { slug: 'crow-pose',           file: 'Gemini_crow pose.png' },
  { slug: 'extended-side-angle', file: 'Gemini_extended_side_angle.png' },
  { slug: 'firefly-pose',        file: 'Gemini_firefly.png' },
  { slug: 'mountain-pose',       file: 'Gemini_mountain_pose.png' }, // prefer .png over tadasana.jpeg
  { slug: 'triangle-pose',       file: 'Gemini_triangle.jpeg' },
  { slug: 'wide-leg-forward-fold', file: 'Gemini_wide leg forward fold.jpeg' },
  { slug: 'lord-of-dance',       file: 'Gemini_lord of dance.png' },
];

function getMimeType(filename) {
  return filename.endsWith('.png') ? 'image/png' : 'image/jpeg';
}

async function ensureBucket() {
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets?.some(b => b.name === BUCKET);
  if (!exists) {
    const { error } = await supabase.storage.createBucket(BUCKET, { public: true });
    if (error) throw new Error(`Failed to create bucket: ${error.message}`);
    console.log(`✓ Created bucket: ${BUCKET}`);
  } else {
    console.log(`✓ Bucket exists: ${BUCKET}`);
  }
}

async function uploadAll() {
  await ensureBucket();

  const results = [];
  let uploaded = 0, skipped = 0, failed = 0;

  for (const { slug, file } of IMAGE_MAP) {
    const localPath = path.join(IMAGES_DIR, file);

    if (!fs.existsSync(localPath)) {
      console.log(`  SKIP  ${slug} (file not found: ${file})`);
      skipped++;
      continue;
    }

    const ext = path.extname(file);
    const storageName = `${slug}${ext}`;
    const fileBuffer = fs.readFileSync(localPath);
    const sizeMB = (fileBuffer.length / 1024 / 1024).toFixed(1);

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(storageName, fileBuffer, {
        contentType: getMimeType(file),
        upsert: true,
      });

    if (error) {
      console.log(`  FAIL  ${slug} — ${error.message}`);
      failed++;
      continue;
    }

    const { data: urlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(storageName);

    console.log(`  OK    ${slug} (${sizeMB}MB) → ${urlData.publicUrl}`);
    results.push({ slug, url: urlData.publicUrl });
    uploaded++;
  }

  console.log(`\n── Summary ──`);
  console.log(`  Uploaded: ${uploaded}`);
  console.log(`  Skipped:  ${skipped}`);
  console.log(`  Failed:   ${failed}`);

  return results;
}

async function updatePoseUrls(results) {
  console.log(`\n── Updating image_url for existing poses ──`);
  let updated = 0;

  for (const { slug, url } of results) {
    const { data, error } = await supabase
      .from('poses')
      .update({ image_url: url })
      .eq('slug', slug)
      .select('name');

    if (error) {
      console.log(`  SKIP  ${slug} (db error: ${error.message})`);
    } else if (data?.length > 0) {
      console.log(`  SET   ${data[0].name}`);
      updated++;
    }
    // silently skip slugs not yet in DB (new poses) — that's expected
  }

  console.log(`  Updated: ${updated} poses`);
}

async function main() {
  console.log('── Uploading pose images to Supabase Storage ──\n');
  const results = await uploadAll();
  await updatePoseUrls(results);
  console.log('\nDone.');
}

main().catch(console.error);
