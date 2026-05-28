require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const { createClient } = require('@supabase/supabase-js');
const fs   = require('fs');
const path = require('path');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
const IMAGES_DIR = path.join(__dirname, '..', '..');   // /Users/.../Yoga Poses/
const BUCKET     = 'pose-images';

// ── All 50 v1 pose slugs (used for edge deletion) ───────────────────────────
const V1_SLUGS = [
  'mountain-pose', 'chair-pose', 'warrior-1', 'warrior-2', 'warrior-3',
  'reverse-warrior', 'triangle-pose', 'extended-side-angle', 'half-moon-pose',
  'crescent-lunge', 'tree-pose', 'eagle-pose', 'goddess-pose',
  'wide-leg-forward-fold', 'standing-forward-fold', 'standing-split',
  'squat-pose', 'low-lunge', 'lizard-pose', 'cat-pose', 'cow-pose',
  'downward-dog', 'plank-pose', 'side-plank', 'sphinx-pose', 'cobra-pose',
  'upward-dog', 'bow-pose', 'camel-pose', 'bridge-pose', 'wheel-pose',
  'pigeon-pose', 'supported-pigeon', 'supine-figure-four', 'dragon-pose',
  'shoelace-pose', 'butterfly-pose', 'seated-forward-fold', 'head-to-knee',
  'boat-pose', 'compass-pose', 'reclined-twist', 'happy-baby',
  'legs-up-the-wall', 'shoulder-stand', 'headstand', 'crow-pose',
  'childs-pose', 'king-pigeon', 'lord-of-dance',
];

// ── 18 new images to upload ──────────────────────────────────────────────────
const IMAGE_MAP = [
  { slug: 'cat-pose',          file: 'Gemini_Cat Pose.png' },
  { slug: 'cow-pose',          file: 'Gemini_Cow Pose.png' },
  { slug: 'downward-dog',      file: 'Gemini_Downword dog.png' },
  { slug: 'plank-pose',        file: 'Gemini_Plank Pose.png' },
  { slug: 'side-plank',        file: 'Gemini_Side Plank.png' },
  { slug: 'sphinx-pose',       file: 'Gemini_Sphinx Pose.png' },
  { slug: 'cobra-pose',        file: 'Gemini_Cobra Pose.png' },
  { slug: 'upward-dog',        file: 'Gemini_Upward Dog.png' },
  { slug: 'bridge-pose',       file: 'Gemini_Bridge Pose.png' },
  { slug: 'wheel-pose',        file: 'Gemini_Wheel Pose.png' },
  { slug: 'head-to-knee',      file: 'Gemini_Head to Knee Pose.png' },
  { slug: 'boat-pose',         file: 'Gemini_Boat Pose.png' },
  { slug: 'reclined-twist',    file: 'Gemini_Reclined Twist.png' },
  { slug: 'happy-baby',        file: 'Gemini_happy baby.png' },
  { slug: 'legs-up-the-wall',  file: 'Gemini_Legs up the wall.png' },
  { slug: 'shoulder-stand',    file: 'Gemini_Shoulder Stand Pose.png' },
  { slug: 'headstand',         file: 'Gemini_Headstand.png' },
  { slug: 'childs-pose',       file: "Gemini_Child's Pose.png" },
];

// ── 18 new poses to insert ───────────────────────────────────────────────────
const NEW_POSES = [
  { slug: 'cat-pose', name: 'Cat Pose', sanskrit: 'Marjaryasana',
    body_areas: ['spine', 'core', 'neck'], flags: ['neck', 'wrist'] },

  { slug: 'cow-pose', name: 'Cow Pose', sanskrit: 'Bitilasana',
    body_areas: ['spine', 'core', 'neck', 'hip flexors'], flags: ['neck', 'wrist'] },

  { slug: 'downward-dog', name: 'Downward-Facing Dog', sanskrit: 'Adho Mukha Svanasana',
    body_areas: ['hamstrings', 'calves', 'shoulders', 'spine', 'wrists'],
    flags: ['wrist', 'shoulder injury', 'hamstring injury'] },

  { slug: 'plank-pose', name: 'Plank Pose', sanskrit: 'Phalakasana',
    body_areas: ['core', 'shoulders', 'wrists', 'spine'],
    flags: ['wrist', 'shoulder injury'] },

  { slug: 'side-plank', name: 'Side Plank', sanskrit: 'Vasisthasana',
    body_areas: ['core', 'shoulders', 'obliques', 'wrists'],
    flags: ['wrist', 'shoulder injury'] },

  { slug: 'sphinx-pose', name: 'Sphinx Pose', sanskrit: 'Salamba Bhujangasana',
    body_areas: ['spine', 'chest', 'hip flexors'], flags: ['lower back'] },

  { slug: 'cobra-pose', name: 'Cobra Pose', sanskrit: 'Bhujangasana',
    body_areas: ['spine', 'chest', 'hip flexors', 'shoulders'],
    flags: ['lower back', 'wrist', 'neck'] },

  { slug: 'upward-dog', name: 'Upward-Facing Dog', sanskrit: 'Urdhva Mukha Svanasana',
    body_areas: ['spine', 'chest', 'hip flexors', 'wrists'],
    flags: ['lower back', 'wrist'] },

  { slug: 'bridge-pose', name: 'Bridge Pose', sanskrit: 'Setu Bandha Sarvangasana',
    body_areas: ['spine', 'hip flexors', 'hamstrings', 'chest'],
    flags: ['neck', 'lower back'] },

  { slug: 'wheel-pose', name: 'Wheel Pose', sanskrit: 'Urdhva Dhanurasana',
    body_areas: ['spine', 'chest', 'hip flexors', 'shoulders', 'wrists'],
    flags: ['lower back', 'wrist', 'neck', 'shoulder injury'] },

  { slug: 'head-to-knee', name: 'Head to Knee Pose', sanskrit: 'Janu Sirsasana',
    body_areas: ['hamstrings', 'hip flexors', 'spine', 'groin'],
    flags: ['lower back', 'hamstring injury'] },

  { slug: 'boat-pose', name: 'Boat Pose', sanskrit: 'Navasana',
    body_areas: ['core', 'hip flexors', 'spine'], flags: ['lower back'] },

  { slug: 'reclined-twist', name: 'Reclined Twist', sanskrit: 'Supta Matsyendrasana',
    body_areas: ['spine', 'IT band', 'shoulders', 'hips'], flags: ['lower back'] },

  { slug: 'happy-baby', name: 'Happy Baby', sanskrit: 'Ananda Balasana',
    body_areas: ['hips', 'groin', 'inner thigh', 'lower back'], flags: [] },

  { slug: 'legs-up-the-wall', name: 'Legs Up the Wall', sanskrit: 'Viparita Karani',
    body_areas: ['hamstrings', 'lower back', 'hips'], flags: ['neck'] },

  { slug: 'shoulder-stand', name: 'Shoulder Stand', sanskrit: 'Sarvangasana',
    body_areas: ['spine', 'shoulders', 'neck', 'hamstrings'],
    flags: ['neck', 'shoulder injury'] },

  { slug: 'headstand', name: 'Headstand', sanskrit: 'Sirsasana',
    body_areas: ['core', 'shoulders', 'spine', 'neck'],
    flags: ['neck', 'shoulder injury', 'balance issues'] },

  { slug: 'childs-pose', name: "Child's Pose", sanskrit: 'Balasana',
    body_areas: ['hips', 'lower back', 'spine', 'shoulders'],
    flags: ['knee caution'] },
];

// ── ~298 v1 edges ────────────────────────────────────────────────────────────
const EDGES = [

  // ── Mountain Pose ─────────────────────────────────────────────────────────
  { from: 'mountain-pose', to: 'chair-pose', type: 'prepares',
    explanation: 'Chair Pose stress-tests Mountain\'s alignment under load. Sitting back into the bent-knee squat with arms overhead reveals every compensating pattern — heels lifting, knees collapsing, lower back rounding — that Mountain trains you to avoid. Use Chair to load the postural map Mountain builds.' },
  { from: 'mountain-pose', to: 'standing-forward-fold', type: 'prepares',
    explanation: 'Standing Forward Fold releases the hamstrings and calves that Mountain Pose asks to be long and active. Folding forward first lets those tissues decompress before Mountain asks them to work against gravity in a vertical line.' },
  { from: 'mountain-pose', to: 'tree-pose', type: 'complements',
    explanation: 'Tree Pose is Mountain with one hip opened. The same vertical axis, grounded foot, and quiet breath — Tree asks you to maintain all of it on a single leg. Together they define the two poles of standing practice: bilateral stability and single-leg balance.' },
  { from: 'mountain-pose', to: 'eagle-pose', type: 'complements',
    explanation: 'Eagle Pose wraps the limbs around Mountain\'s center of gravity. Without Mountain\'s vertical alignment and breath control as a reference, Eagle becomes a tangled squat. Mountain is where you return mid-Eagle when things unravel.' },
  { from: 'mountain-pose', to: 'warrior-1', type: 'unlocks',
    explanation: 'Warrior I begins as Mountain Pose and adds a step back with arms overhead. The shoulder-stacking and spinal length you establish in Mountain determine whether Warrior I feels open or compressed — Mountain is the baseline you return to mid-practice.' },
  { from: 'mountain-pose', to: 'warrior-3', type: 'unlocks',
    explanation: 'Warrior III lives at the intersection of Mountain\'s postural precision and single-leg balance. The hip-stacking, spine length, and body awareness cultivated in Mountain are the exact tools you need when the floor under one foot disappears.' },

  // ── Chair Pose ────────────────────────────────────────────────────────────
  { from: 'chair-pose', to: 'mountain-pose', type: 'prepares',
    explanation: 'Mountain Pose is the alignment reference Chair Pose is measured against. Grounding in Mountain first builds the postural map — vertical spine, active feet, engaged core — that Chair Pose then loads under demand.' },
  { from: 'chair-pose', to: 'standing-forward-fold', type: 'prepares',
    explanation: 'Standing Forward Fold releases the hamstrings and calves that Chair Pose compresses. The posterior chain decompression from the fold directly counterbalances the anterior loading of the squat.' },
  { from: 'chair-pose', to: 'eagle-pose', type: 'complements',
    explanation: 'Eagle Pose sits in a Chair Pose squat while wrapping the limbs into a focused compression. The leg strength and ankle stability built in Chair are exactly what Eagle\'s crossed-leg squat requires — Eagle is Chair made significantly more complex.' },
  { from: 'chair-pose', to: 'goddess-pose', type: 'complements',
    explanation: 'Goddess Pose and Chair Pose are both wide-knee loaded squat shapes but in different orientations. Chair loads a narrow squat; Goddess opens the hips wide. Together they give the quadriceps and hip flexors strength across both positions.' },
  { from: 'chair-pose', to: 'crow-pose', type: 'unlocks',
    explanation: 'Crow Pose needs strong hip flexors and the ability to round the spine into a shelf — both developed in Chair. The hip-crease engagement and forward lean from Chair translate directly into the lift-off mechanics of Bakasana.' },
  { from: 'chair-pose', to: 'warrior-3', type: 'unlocks',
    explanation: 'Warrior III shares Chair\'s demand for standing leg strength and forward-lean balance. The engaged core, lifted chest, and bent-knee power from Chair are what allow the torso to tip forward into Warrior III\'s horizontal line.' },

  // ── Warrior I ─────────────────────────────────────────────────────────────
  { from: 'warrior-1', to: 'low-lunge', type: 'prepares',
    explanation: 'The back hip flexor is the hidden tension in Warrior I — it tilts the pelvis, compresses the lower back, and blocks the chest from opening. Low Lunge addresses that tissue directly before asking the hip flexor to work against gravity in Warrior I.' },
  { from: 'warrior-1', to: 'crescent-lunge', type: 'prepares',
    explanation: 'Crescent Lunge prepares Warrior I by opening the back hip flexor with the heel lifted, creating more traction through the psoas before asking it to work with the heel grounded in Warrior I.' },
  { from: 'warrior-1', to: 'warrior-2', type: 'complements',
    explanation: 'Warrior I and Warrior II are the two foundational lunge stances — one with hips squared forward, the other with hips open to the side. Practicing both gives the hip a complete exploration of bent-knee strength in every direction.' },
  { from: 'warrior-1', to: 'reverse-warrior', type: 'complements',
    explanation: 'Reverse Warrior opens the side body of the front-leg side — the tissue that Warrior I compresses as you square the hips forward. Moving between the two gives that side a complete cycle of work and release.' },
  { from: 'warrior-1', to: 'warrior-3', type: 'unlocks',
    explanation: 'Warrior III is Warrior I tipped forward onto one leg. The back body engagement, the lifted chest, the active standing leg — all of it transfers directly. When Warrior I feels strong and aligned, Warrior III becomes a natural extension.' },
  { from: 'warrior-1', to: 'lord-of-dance', type: 'unlocks',
    explanation: 'Lord of the Dance begins with the single-leg stability and hip flexor work that Warrior I develops. The standing-leg strength and the opening across the front body in Warrior I create the foundation for Natarajasana\'s balance and backbend.' },

  // ── Warrior II ────────────────────────────────────────────────────────────
  { from: 'warrior-2', to: 'warrior-1', type: 'prepares',
    explanation: 'Warrior I establishes the front-leg bend, back body engagement, and hip awareness that Warrior II then opens sideways. Coming through Warrior I first gives the hips and legs the activation they need before the lateral demand of Virabhadrasana II.' },
  { from: 'warrior-2', to: 'goddess-pose', type: 'prepares',
    explanation: 'Goddess Pose opens the inner thighs and groins in a wide-knee position before Warrior II asks the hips to hold steady in the lateral lunge. The hip opening from Goddess directly reduces groin tension in Warrior II.' },
  { from: 'warrior-2', to: 'reverse-warrior', type: 'complements',
    explanation: 'Reverse Warrior and Warrior II are natural partners in a standing flow — Warrior II holds the stance level while Reverse Warrior reaches the front arm back to open the side body. Moving between them gives the front-leg side a cycle of stability and release.' },
  { from: 'warrior-2', to: 'extended-side-angle', type: 'complements',
    explanation: 'Extended Side Angle grows directly from Warrior II — the same bent-knee stance, the same arm direction, just with the torso tilting toward the front leg. Warrior II and Extended Side Angle together explore both the upright and lateral expressions of the same standing stance.' },
  { from: 'warrior-2', to: 'triangle-pose', type: 'unlocks',
    explanation: 'Triangle Pose is Warrior II with the front leg straightened and the torso reaching long. The hip opening and lateral body alignment built in Warrior II carry directly into Triangle — straightening the knee reveals how much the hip has actually opened.' },
  { from: 'warrior-2', to: 'half-moon-pose', type: 'unlocks',
    explanation: 'Half Moon Pose takes the lateral hip opening and body line of Warrior II off the ground. The wide-leg stance and hip abduction strength from Warrior II are the exact foundation Half Moon balances on with one leg lifted.' },

  // ── Warrior III ───────────────────────────────────────────────────────────
  { from: 'warrior-3', to: 'warrior-1', type: 'prepares',
    explanation: 'Warrior I is the two-footed grounding pose Warrior III tips forward from. The hip alignment, back body engagement, and standing-leg strength established in Warrior I are exactly what Warrior III calls on when the torso becomes parallel to the floor.' },
  { from: 'warrior-3', to: 'standing-split', type: 'prepares',
    explanation: 'Standing Split is the natural progression from Warrior III — same single-leg base, now releasing the torso fully forward and lifting the back leg high. The hamstring and hip work from Warrior III prepare the body for Standing Split\'s deeper range.' },
  { from: 'warrior-3', to: 'half-moon-pose', type: 'complements',
    explanation: 'Half Moon and Warrior III both demand single-leg stability, but Half Moon opens the hip laterally while Warrior III keeps the hips square. Practicing both builds stability across multiple planes of hip loading.' },
  { from: 'warrior-3', to: 'standing-split', type: 'complements',
    explanation: 'Warrior III and Standing Split share the same single-leg structure but explore opposite energies — Warrior III holds the body horizontal with strength, Standing Split releases into gravity and length. Together they develop the standing leg\'s full range from power to surrender.' },
  { from: 'warrior-3', to: 'lord-of-dance', type: 'unlocks',
    explanation: 'Lord of the Dance adds a backbend and quad stretch to Warrior III\'s single-leg foundation. The standing-leg stability and forward-balance awareness cultivated in Warrior III are prerequisites for the more demanding balance of Natarajasana.' },
  { from: 'warrior-3', to: 'headstand', type: 'unlocks',
    explanation: 'Headstand requires the same core engagement, shoulder stability, and body awareness that Warrior III builds on one leg. The hip-over-base stacking sense from Warrior III transfers into finding and maintaining the center of gravity in an inverted position.' },

  // ── Reverse Warrior ───────────────────────────────────────────────────────
  { from: 'reverse-warrior', to: 'warrior-2', type: 'prepares',
    explanation: 'Warrior II is the direct home base of Reverse Warrior — you reach the front arm back from the Warrior II position. Building stability and hip opening in Warrior II first means Reverse Warrior can focus on side-body extension rather than fighting for the stance.' },
  { from: 'reverse-warrior', to: 'extended-side-angle', type: 'prepares',
    explanation: 'Extended Side Angle needs the side-body length that Reverse Warrior opens. Reaching back in Reverse Warrior creates space on the front-leg side that Extended Side Angle then fills when the torso tilts toward the front leg.' },
  { from: 'reverse-warrior', to: 'triangle-pose', type: 'complements',
    explanation: 'Triangle and Reverse Warrior both work the lateral hip and side body in a wide-leg stance but from different angles. Triangle straightens the front leg into length; Reverse Warrior keeps the knee bent and reaches back. Together they cover the full length of the lateral chain.' },
  { from: 'reverse-warrior', to: 'extended-side-angle', type: 'complements',
    explanation: 'Reverse Warrior and Extended Side Angle are natural partners in Warrior II flow — one reaches back to open the side body, the other reaches forward to deepen the lateral hip. Together they give the front-leg side a full cycle of extension and compression.' },
  { from: 'reverse-warrior', to: 'half-moon-pose', type: 'unlocks',
    explanation: 'Half Moon Pose lifts Reverse Warrior\'s lateral hip opening off the ground into a single-leg balance. The hip abduction strength and body line developed in Reverse Warrior translate directly into Half Moon\'s one-legged demand.' },
  { from: 'reverse-warrior', to: 'wheel-pose', type: 'unlocks',
    explanation: 'Wheel Pose takes the backbending energy awakened in Reverse Warrior and extends it into a full arch. The side-body opening and spinal extension initiated in Reverse Warrior are the beginning of the arc that Wheel Pose completes.' },

  // ── Triangle Pose ─────────────────────────────────────────────────────────
  { from: 'triangle-pose', to: 'warrior-2', type: 'prepares',
    explanation: 'Warrior II is the bent-knee stance Triangle grows out of — when you straighten the front knee, you arrive in Triangle. Time in Warrior II develops the hip opening and side-body awareness that Triangle then asks to work with a lengthened leg.' },
  { from: 'triangle-pose', to: 'wide-leg-forward-fold', type: 'prepares',
    explanation: 'Wide-Leg Forward Fold opens the inner thighs and hamstrings symmetrically before Triangle asks them to work asymmetrically with one side extended. The adductor release directly reduces the strain on the back hip in Trikonasana.' },
  { from: 'triangle-pose', to: 'reverse-warrior', type: 'complements',
    explanation: 'Reverse Warrior and Triangle Pose both work the lateral hip in a wide-leg stance but from different angles — Triangle straightens into length, Reverse Warrior reaches back into extension. Together they give the front-leg side a complete range of lateral movement.' },
  { from: 'triangle-pose', to: 'half-moon-pose', type: 'complements',
    explanation: 'Half Moon Pose is Triangle lifted off the ground and balanced on one leg. The hip abduction, hamstring length, and side-body line of Triangle transfer directly into Half Moon — they are two levels of the same lateral hip pattern.' },
  { from: 'triangle-pose', to: 'extended-side-angle', type: 'unlocks',
    explanation: 'Extended Side Angle adds the bent-knee depth of Warrior II to Triangle\'s lateral body line. The hamstring length and hip abduction built in Triangle directly open the space that Extended Side Angle fills when the front knee bends.' },
  { from: 'triangle-pose', to: 'standing-split', type: 'unlocks',
    explanation: 'Standing Split takes Triangle\'s hamstring length and single-leg hip engagement into a full forward fold with one leg lifted high. The posterior chain opening from consistent Triangle practice is a direct preparation for the range Standing Split requires.' },

  // ── Extended Side Angle ───────────────────────────────────────────────────
  { from: 'extended-side-angle', to: 'warrior-2', type: 'prepares',
    explanation: 'Warrior II is the foundation Extended Side Angle grows from — same wide stance, same bent front knee. Time in Warrior II opens the hips and establishes the lateral body line before Extended Side Angle adds the deeper tilt toward the front leg.' },
  { from: 'extended-side-angle', to: 'triangle-pose', type: 'prepares',
    explanation: 'Triangle Pose prepares the hamstrings and lateral hip in the straightened-leg version of Extended Side Angle\'s stance. The side-body length and hip abduction from Triangle carry directly into the tilted position of Utthita Parsvakonasana.' },
  { from: 'extended-side-angle', to: 'reverse-warrior', type: 'complements',
    explanation: 'Reverse Warrior and Extended Side Angle are natural partners in Warrior II flow — one reaches back, the other reaches forward. Together they give the front-leg side a full cycle of side-body extension and compression within the same stance.' },
  { from: 'extended-side-angle', to: 'half-moon-pose', type: 'complements',
    explanation: 'Half Moon and Extended Side Angle both explore the lateral hip but at different intensities. Extended Side Angle grounds both feet; Half Moon lifts one leg into the same lateral opening. Together they build the hip stability that the lateral plane demands.' },
  { from: 'extended-side-angle', to: 'compass-pose', type: 'unlocks',
    explanation: 'Compass Pose requires the same hamstring length and lateral hip opening that Extended Side Angle builds in a standing lunge. The hip flexor space and side-body length from Extended Side Angle are direct prerequisites for Surya Yantrasana\'s seated geometry.' },
  { from: 'extended-side-angle', to: 'crow-pose', type: 'unlocks',
    explanation: 'Crow Pose needs the hip flexor space and forward-lean balance that Extended Side Angle develops through consistent practice. The hip crease engagement and arm-to-leg connection from the pose\'s lower arm translate into Crow\'s lift-off mechanics.' },

  // ── Half Moon Pose ────────────────────────────────────────────────────────
  { from: 'half-moon-pose', to: 'warrior-2', type: 'prepares',
    explanation: 'Warrior II builds the hip opening and leg stability that Half Moon then balances on. The bent-knee Warrior II stance develops the glutes and outer hip that Half Moon needs to hold the lifted leg in line.' },
  { from: 'half-moon-pose', to: 'triangle-pose', type: 'prepares',
    explanation: 'Triangle Pose establishes the hip abduction, hamstring length, and side-body line that Half Moon balances on. Coming to Half Moon through Triangle means the shape is already in the body — you\'re just lifting it off the ground.' },
  { from: 'half-moon-pose', to: 'standing-split', type: 'complements',
    explanation: 'Standing Split and Half Moon share the same single-leg foundation but travel in different directions — Half Moon opens the hip to the side, Standing Split drives it straight back. Together they give the standing hip a full circumferential range.' },
  { from: 'half-moon-pose', to: 'warrior-3', type: 'complements',
    explanation: 'Half Moon and Warrior III both require single-leg stability but open the hip in different planes — Half Moon laterally, Warrior III to the back. Together they develop the standing hip\'s capacity to load in every direction.' },
  { from: 'half-moon-pose', to: 'lord-of-dance', type: 'unlocks',
    explanation: 'Lord of the Dance adds a backbend and quad stretch on top of Half Moon\'s single-leg balance. The hip stability and body awareness from Half Moon create the foundation for Natarajasana\'s more demanding combination of balance and spinal extension.' },
  { from: 'half-moon-pose', to: 'wheel-pose', type: 'unlocks',
    explanation: 'Wheel Pose grows from the openness Half Moon creates across the hip flexors and side body. The lateral hip engagement and spinal extension begun in Half Moon are part of the pathway toward the full backbend of Urdhva Dhanurasana.' },

  // ── Crescent Lunge ────────────────────────────────────────────────────────
  { from: 'crescent-lunge', to: 'low-lunge', type: 'prepares',
    explanation: 'Low Lunge addresses the psoas and hip flexors of the back leg directly — the tissue that limits depth in Crescent Lunge. Coming through Low Lunge first releases that restriction before Crescent asks the arms to reach overhead and the spine to lengthen.' },
  { from: 'crescent-lunge', to: 'warrior-1', type: 'prepares',
    explanation: 'Warrior I is the grounded version of Crescent Lunge — the same stance with the back heel pressing down. Settling into Warrior I first builds the hip awareness and back-leg engagement that Crescent then asks for with a lifted heel.' },
  { from: 'crescent-lunge', to: 'warrior-1', type: 'complements',
    explanation: 'Crescent Lunge and Warrior I ask the same hip flexor tissue to open but differ at the back foot: Crescent\'s lifted heel creates more hip flexor traction, Warrior I\'s flat foot demands more stability and trunk strength. Together they cover both ends of the lunge spectrum.' },
  { from: 'crescent-lunge', to: 'lizard-pose', type: 'complements',
    explanation: 'Lizard Pose takes Crescent Lunge\'s hip flexor work deeper by lowering the back knee and bringing the front foot outside the hand. The hip opening and groin length from Crescent directly prepare the tissue that Lizard then targets more intensely.' },
  { from: 'crescent-lunge', to: 'warrior-3', type: 'unlocks',
    explanation: 'Warrior III lifts Crescent Lunge into a single-leg balance with the torso horizontal. The standing-leg strength and hip flexor openness built in Crescent Lunge transfer directly into Warrior III\'s more demanding geometry.' },
  { from: 'crescent-lunge', to: 'lord-of-dance', type: 'unlocks',
    explanation: 'Lord of the Dance builds on the hip flexor opening and single-leg stability that Crescent Lunge develops. The front-body length and balance work from Crescent are direct preparation for Natarajasana\'s quad stretch and backbend.' },

  // ── Tree Pose ─────────────────────────────────────────────────────────────
  { from: 'tree-pose', to: 'mountain-pose', type: 'prepares',
    explanation: 'Mountain Pose is the structural reference for Tree — both feet on the ground, spine vertical, breath steady. Anchoring in Mountain before lifting one foot builds the grounding habit that Tree Pose depends on.' },
  { from: 'tree-pose', to: 'eagle-pose', type: 'prepares',
    explanation: 'Eagle Pose compresses the hip inward before Tree opens it outward. Coming to Eagle first activates the hip stabilizers in a compressed pattern, so when Tree opens the hip those muscles are already warm and engaged.' },
  { from: 'tree-pose', to: 'eagle-pose', type: 'complements',
    explanation: 'Eagle Pose and Tree Pose are the two great single-leg balances — Tree opens the hip, Eagle wraps and compresses it. Together they give the standing hip both directions of work: opening and integration.' },
  { from: 'tree-pose', to: 'warrior-3', type: 'complements',
    explanation: 'Warrior III takes Tree\'s single-leg stability and tips the upper body forward. The ankle strength and hip engagement from Tree are the same tools Warrior III calls on — just working in a completely different plane.' },
  { from: 'tree-pose', to: 'standing-split', type: 'unlocks',
    explanation: 'Standing Split extends Tree\'s single-leg balance into a full forward fold with one leg lifted high. The hip stability and grounded foot strength from Tree are prerequisites — without them, the lifted leg pulls the standing hip out of alignment.' },
  { from: 'tree-pose', to: 'lord-of-dance', type: 'unlocks',
    explanation: 'Lord of the Dance adds a backbend and quad stretch on top of Tree\'s single-leg balance foundation. The standing leg stability and postural awareness built in Tree directly determine how graceful and safe Natarajasana becomes.' },

  // ── Eagle Pose ────────────────────────────────────────────────────────────
  { from: 'eagle-pose', to: 'chair-pose', type: 'prepares',
    explanation: 'Chair Pose builds the bent-knee squat strength that Eagle sits in. The ankle stability and quadriceps endurance from Chair are what allow Eagle to settle low and hold the crossed-leg compression without toppling.' },
  { from: 'eagle-pose', to: 'tree-pose', type: 'prepares',
    explanation: 'Tree Pose builds the single-leg balance and hip engagement that Eagle then wraps into compression. Coming to Tree first establishes the standing-leg stability that Eagle\'s crossed-leg squat depends on.' },
  { from: 'eagle-pose', to: 'tree-pose', type: 'complements',
    explanation: 'Tree Pose and Eagle Pose are the two great single-leg balances — Eagle wraps and compresses while Tree expands and opens. Together they give the standing hip both directions of work across an entire practice.' },
  { from: 'eagle-pose', to: 'warrior-3', type: 'complements',
    explanation: 'Warrior III and Eagle Pose both require single-leg stability and hip engagement, but in completely different body shapes. Eagle wraps and compresses; Warrior III extends on a horizontal plane. Together they build standing balance across every direction.' },
  { from: 'eagle-pose', to: 'standing-split', type: 'unlocks',
    explanation: 'Standing Split lifts Eagle\'s hip engagement into a full forward fold with one leg extended. The single-leg strength and hip stability built through Eagle\'s demanding balance directly support Standing Split\'s range of motion.' },
  { from: 'eagle-pose', to: 'crow-pose', type: 'unlocks',
    explanation: 'Crow Pose needs the hip flexor space and arm-balance confidence that Eagle\'s crossed-arm grip begins to develop. The core engagement and balance under challenge from Eagle translate into Crow\'s lift-off requirements.' },

  // ── Goddess Pose ──────────────────────────────────────────────────────────
  { from: 'goddess-pose', to: 'wide-leg-forward-fold', type: 'prepares',
    explanation: 'Wide-Leg Forward Fold opens the inner thighs and adductors that Goddess Pose loads in compression. Folding forward first lets those muscles release passively before asking them to work isometrically in the wide-knee squat of Goddess.' },
  { from: 'goddess-pose', to: 'warrior-2', type: 'prepares',
    explanation: 'Warrior II builds the hip and leg strength in an asymmetric stance before Goddess asks both legs to work symmetrically in the wide-knee squat. Warrior II develops the lateral hip engagement Goddess then uses with both sides equally.' },
  { from: 'goddess-pose', to: 'warrior-2', type: 'complements',
    explanation: 'Warrior II and Goddess Pose are both wide-leg bent-knee stances, but Warrior II is asymmetric while Goddess is symmetric. Together they develop hip strength across both the lateral and bilateral planes of the wide stance.' },
  { from: 'goddess-pose', to: 'squat-pose', type: 'complements',
    explanation: 'Garland Pose and Goddess Pose are two expressions of the wide-hip squat family. Goddess is upright with turned-out knees; Garland descends into a deep forward fold. Together they explore both the standing and grounded ends of the wide-leg spectrum.' },
  { from: 'goddess-pose', to: 'crow-pose', type: 'unlocks',
    explanation: 'Crow Pose benefits from the deep inner thigh engagement and hip flexor strength that Goddess Pose builds. The wide-hip, forward-lean pattern from Goddess creates the hip flexion range that Crow needs for its lift-off.' },
  { from: 'goddess-pose', to: 'boat-pose', type: 'unlocks',
    explanation: 'Boat Pose requires the hip flexor strength and core engagement that Goddess develops under isometric load. The inner thigh and hip flexor work from Goddess transfers into Navasana\'s demand for sustained hip-flexion strength.' },

  // ── Wide-Leg Forward Fold ─────────────────────────────────────────────────
  { from: 'wide-leg-forward-fold', to: 'standing-forward-fold', type: 'prepares',
    explanation: 'Standing Forward Fold opens the hamstrings and calves symmetrically before Wide-Leg asks them to work in a wider stance. The posterior chain release from Uttanasana directly reduces the tension that limits depth in the wide-legged version.' },
  { from: 'wide-leg-forward-fold', to: 'butterfly-pose', type: 'prepares',
    explanation: 'Butterfly Pose opens the inner thighs and groins in a passive seated position before Wide-Leg Forward Fold asks those tissues to release against gravity in a standing position. Baddha Konasana prepares the adductors specifically for the wide-leg demand.' },
  { from: 'wide-leg-forward-fold', to: 'goddess-pose', type: 'complements',
    explanation: 'Goddess Pose and Wide-Leg Forward Fold share the same wide-leg stance but explore opposite movements — Goddess builds strength in the loaded position, Wide-Leg Fold releases into length. Moving between them creates a complete cycle of work and recovery for the inner thighs.' },
  { from: 'wide-leg-forward-fold', to: 'triangle-pose', type: 'complements',
    explanation: 'Wide-Leg Forward Fold and Triangle Pose both live in the lateral hip and hamstring plane. Wide-Leg opens the inner thighs symmetrically; Triangle takes that openness into an asymmetric side stretch. They reinforce each other in the same practice.' },
  { from: 'wide-leg-forward-fold', to: 'seated-forward-fold', type: 'unlocks',
    explanation: 'Seated Forward Fold takes the hamstring and adductor release from Wide-Leg Forward Fold into a fully supported floor position. The posterior chain opening from the standing fold directly enables the depth available in Paschimottanasana.' },
  { from: 'wide-leg-forward-fold', to: 'compass-pose', type: 'unlocks',
    explanation: 'Compass Pose requires both the inner thigh openness and hamstring length that Wide-Leg Forward Fold develops. The wide-hip, long-leg awareness from the fold creates the space that Surya Yantrasana\'s demanding geometry needs.' },

  // ── Standing Forward Fold ─────────────────────────────────────────────────
  { from: 'standing-forward-fold', to: 'mountain-pose', type: 'prepares',
    explanation: 'Mountain Pose establishes the vertical alignment and grounded foot that Standing Forward Fold hinges from. Rooting in Mountain first ensures the fold begins at the hip crease rather than at the lower back.' },
  { from: 'standing-forward-fold', to: 'downward-dog', type: 'prepares',
    explanation: 'Downward Dog actively stretches the hamstrings and calves while loading the shoulders — it prepares the posterior chain in a loaded position before Standing Forward Fold asks for a passive release of the same tissues.' },
  { from: 'standing-forward-fold', to: 'wide-leg-forward-fold', type: 'complements',
    explanation: 'Wide-Leg Forward Fold and Standing Forward Fold both release the posterior chain from a standing position but with different base stances. Together they cover both the narrow and wide-leg expressions of the standing hamstring release.' },
  { from: 'standing-forward-fold', to: 'seated-forward-fold', type: 'complements',
    explanation: 'Seated Forward Fold takes Standing Forward Fold to the floor, adding the passive weight of the body over extended legs. Together these two forward folds cover both the standing and seated ends of the hamstring lengthening spectrum.' },
  { from: 'standing-forward-fold', to: 'standing-split', type: 'unlocks',
    explanation: 'Standing Split extends Standing Forward Fold\'s hip hinge into a full leg lift with one foot off the floor. The hamstring length and hip flexion range from Uttanasana are the direct preparation for Standing Split\'s range and balance challenge.' },
  { from: 'standing-forward-fold', to: 'wheel-pose', type: 'unlocks',
    explanation: 'Wheel Pose requires the hamstring and hip flexor flexibility that opens up through consistent forward fold practice. When the posterior chain can release fully in a fold, the anterior chain has the space to extend fully into a backbend.' },

  // ── Standing Split ────────────────────────────────────────────────────────
  { from: 'standing-split', to: 'warrior-3', type: 'prepares',
    explanation: 'Warrior III is the strengthening counterpart to Standing Split\'s release. Coming through Warrior III first builds the hamstring and glute activation in the standing leg — the same engagement that controls the descent into Standing Split.' },
  { from: 'standing-split', to: 'half-moon-pose', type: 'prepares',
    explanation: 'Half Moon Pose builds the single-leg hip stability and lateral body line that Standing Split then extends straight back. The standing-leg strength from Half Moon directly supports the control needed in Standing Split.' },
  { from: 'standing-split', to: 'warrior-3', type: 'complements',
    explanation: 'Warrior III and Standing Split share the same single-leg structure but opposite energies — Warrior III holds the body level with strength, Standing Split releases into gravity. Together they develop the standing leg\'s full range from power to surrender.' },
  { from: 'standing-split', to: 'standing-forward-fold', type: 'complements',
    explanation: 'Standing Forward Fold and Standing Split are two depths of the same hip hinge — one with both feet grounded, one with a leg lifted high. Practicing both explores the full range of the hamstring and hip in the standing fold.' },
  { from: 'standing-split', to: 'lord-of-dance', type: 'unlocks',
    explanation: 'Lord of the Dance builds on the single-leg balance and hip extension developed in Standing Split. The hamstring openness and standing-leg awareness from Standing Split create the foundation for Natarajasana\'s more complex combination of balance and backbend.' },
  { from: 'standing-split', to: 'headstand', type: 'unlocks',
    explanation: 'Headstand requires the same hip-over-base stacking awareness and leg-lifting strength that Standing Split builds. The core control and single-hip engagement from Standing Split translate into finding balance in an inverted position.' },

  // ── Squat Pose (Garland) ──────────────────────────────────────────────────
  { from: 'squat-pose', to: 'wide-leg-forward-fold', type: 'prepares',
    explanation: 'Wide-Leg Forward Fold opens the inner thighs and adductors that a deep squat demands. The hip crease release from the fold directly reduces the tension that keeps heels from lowering to the floor in Malasana.' },
  { from: 'squat-pose', to: 'goddess-pose', type: 'prepares',
    explanation: 'Goddess Pose builds the inner thigh and hip strength in the wide-knee position before Malasana asks the hips to descend into a deep squat. The isometric work of Goddess prepares the tissues for the deeper demand of the full squat.' },
  { from: 'squat-pose', to: 'goddess-pose', type: 'complements',
    explanation: 'Goddess Pose and Garland Pose are two expressions of the same wide-hip bent-knee family. Goddess is upright and strength-building; Garland descends into a deep fold. Together they explore both the standing and grounded ends of the wide-leg hip spectrum.' },
  { from: 'squat-pose', to: 'butterfly-pose', type: 'complements',
    explanation: 'Butterfly Pose and Garland Pose both explore the deep inner thigh and hip opening, but from different positions. Garland is a standing compression; Butterfly is a seated passive release. Together they address the inner thighs in both loaded and unloaded positions.' },
  { from: 'squat-pose', to: 'crow-pose', type: 'unlocks',
    explanation: 'Crow Pose grows directly out of a squat: the same hip flexion, the same spinal rounding, the same inner thigh engagement. The depth and ease in Garland Pose are exactly what allow the arms to become a shelf and the feet to leave the floor in Bakasana.' },
  { from: 'squat-pose', to: 'boat-pose', type: 'unlocks',
    explanation: 'Boat Pose requires the hip flexion range and inner thigh engagement that deep squatting develops. The hip crease strength and forward-lean balance from Garland translate into Navasana\'s demand for sustained hip-flexion strength against gravity.' },

  // ── Low Lunge ─────────────────────────────────────────────────────────────
  { from: 'low-lunge', to: 'downward-dog', type: 'prepares',
    explanation: 'Downward Dog actively stretches the hip flexors and back body in the position they need to be open for Low Lunge. Coming to Down Dog first warms the tissues and establishes the spinal length before Low Lunge asks the hip flexor to release under load.' },
  { from: 'low-lunge', to: 'childs-pose', type: 'prepares',
    explanation: 'Child\'s Pose releases the hips and lower back before Low Lunge asks the hip flexors to open into a deep stretch. The grounding and hip-crease release from Balasana create space that the lunge then develops further.' },
  { from: 'low-lunge', to: 'crescent-lunge', type: 'complements',
    explanation: 'Crescent Lunge and Low Lunge both work the hip flexor of the back leg but with different spine positions. Low Lunge keeps the torso low and focused on the hip; Crescent reaches overhead for more spinal and front-body length. Together they cover both ends of the lunge family.' },
  { from: 'low-lunge', to: 'lizard-pose', type: 'complements',
    explanation: 'Lizard Pose deepens Low Lunge by moving the front foot outside the hand, creating a more intense hip and groin opening. The hip flexor release from Low Lunge directly enables the deeper range Lizard Pose requires.' },
  { from: 'low-lunge', to: 'warrior-1', type: 'unlocks',
    explanation: 'Warrior I builds on the hip flexor opening and leg alignment that Low Lunge develops. When the back hip flexor has released in Low Lunge, Warrior I can find the squared hips, lifted chest, and open expression the pose is designed for.' },
  { from: 'low-lunge', to: 'pigeon-pose', type: 'unlocks',
    explanation: 'Pigeon Pose requires the hip flexor opening of the back leg and the front-leg hip rotation that Low Lunge prepares. The hip crease release and groin length from Low Lunge directly enable the depth available in Kapotasana.' },

  // ── Lizard Pose ───────────────────────────────────────────────────────────
  { from: 'lizard-pose', to: 'low-lunge', type: 'prepares',
    explanation: 'Low Lunge opens the hip flexor and groin before Lizard places the front foot outside the hand, demanding more range. The hip-crease release from Low Lunge directly reduces the resistance Lizard Pose encounters.' },
  { from: 'lizard-pose', to: 'downward-dog', type: 'prepares',
    explanation: 'Downward Dog actively lengthens the hamstrings and hip flexors before Lizard asks them to release into a deep hip-opening stretch. Moving through Down Dog first warms and prepares the targeted tissues.' },
  { from: 'lizard-pose', to: 'crescent-lunge', type: 'complements',
    explanation: 'Crescent Lunge and Lizard Pose both work in the deep hip-flexor stretch family, but Crescent adds the upright arm reach while Lizard goes deeper into the hip and groin. Together they cover both the vertical and horizontal dimensions of the deep lunge.' },
  { from: 'lizard-pose', to: 'dragon-pose', type: 'complements',
    explanation: 'Dragon Pose holds the same deep hip-opening position as Lizard for a longer yin duration. Lizard\'s active stretch and Dragon\'s yin hold together develop the hip flexor and groin tissue across both active and passive release methods.' },
  { from: 'lizard-pose', to: 'pigeon-pose', type: 'unlocks',
    explanation: 'Pigeon Pose requires the deep hip flexor and groin opening that Lizard Pose develops. The front-hip rotation and back-leg extension from Lizard directly prepare the tissues for Kapotasana\'s hip-opening depth.' },
  { from: 'lizard-pose', to: 'compass-pose', type: 'unlocks',
    explanation: 'Compass Pose requires deep hamstring length and hip flexor space — the same tissues Lizard targets in the deep lunge. The lateral hip opening and posterior chain work from Lizard are direct preparation for Surya Yantrasana.' },

  // ── Cat Pose ──────────────────────────────────────────────────────────────
  { from: 'cat-pose', to: 'childs-pose', type: 'prepares',
    explanation: 'Child\'s Pose releases the lower back and hips before Cat Pose asks the spine to flex and round actively. The passive decompression of Balasana creates the baseline openness that Cat then mobilizes through movement.' },
  { from: 'cat-pose', to: 'reclined-twist', type: 'prepares',
    explanation: 'Reclined Twist passively rotates the spine before Cat Pose asks it to flex and extend through its full range. The lateral spinal release from the twist prepares the spine\'s muscles for the dynamic movement of Cat/Cow.' },
  { from: 'cat-pose', to: 'cow-pose', type: 'complements',
    explanation: 'Cat and Cow are the two poles of spinal mobility — Cat flexes the spine, Cow extends it. Moving between them in breath-linked repetition creates a complete spinal wave that warms the entire back body.' },
  { from: 'cat-pose', to: 'downward-dog', type: 'complements',
    explanation: 'Downward Dog and Cat Pose both round and lengthen the spine but in different positions. Cat rounds from all fours; Down Dog extends the spine with the hips lifted. Together they give the spine both the flexion and the length it needs.' },
  { from: 'cat-pose', to: 'downward-dog', type: 'unlocks',
    explanation: 'Consistent Cat/Cow practice builds the spinal mobility and shoulder awareness that Downward Dog requires. The gentle spinal wave and wrist loading from Cat directly prepare the body for Down Dog\'s more demanding version of the same shape.' },
  { from: 'cat-pose', to: 'plank-pose', type: 'unlocks',
    explanation: 'Plank Pose requires the core engagement and wrist loading that Cat Pose begins to develop. The spinal and shoulder awareness from Cat/Cow practice translates into the stable, straight-body demand of Plank.' },

  // ── Cow Pose ──────────────────────────────────────────────────────────────
  { from: 'cow-pose', to: 'childs-pose', type: 'prepares',
    explanation: 'Child\'s Pose releases the lower back before Cow Pose asks it to extend and arch. The hip and spine decompression from Balasana creates the space Cow then opens in the opposite direction.' },
  { from: 'cow-pose', to: 'sphinx-pose', type: 'prepares',
    explanation: 'Sphinx Pose opens the chest and spine in extension before Cow Pose asks for a deeper spinal arch from the same all-fours position. The gentle front-body opening from Sphinx directly prepares the tissues Cow will ask to move.' },
  { from: 'cow-pose', to: 'cat-pose', type: 'complements',
    explanation: 'Cat and Cow are linked in the spinal mobility sequence — Cat rounds the back, Cow arches it. Together they create a complete breath-linked spinal wave that mobilizes every vertebra and warms the entire back.' },
  { from: 'cow-pose', to: 'cobra-pose', type: 'complements',
    explanation: 'Cobra Pose extends Cow\'s spinal arch into a prone backbend with more chest opening. The spinal extension pattern established in Cow carries directly into the more intense front-body opening of Bhujangasana.' },
  { from: 'cow-pose', to: 'upward-dog', type: 'unlocks',
    explanation: 'Upward Dog takes the spinal extension and chest opening of Cow Pose off all fours and into a full arm-supported backbend. The front-body length and spinal mobility from Cow practice directly open the path to Urdhva Mukha Svanasana.' },
  { from: 'cow-pose', to: 'camel-pose', type: 'unlocks',
    explanation: 'Camel Pose is the kneeling culmination of the spinal extension pattern that Cow Pose begins. The chest opening and hip flexor awareness awakened in Cow directly prepare the body for Ustrasana\'s deeper backbend.' },

  // ── Downward Dog ──────────────────────────────────────────────────────────
  { from: 'downward-dog', to: 'childs-pose', type: 'prepares',
    explanation: 'Child\'s Pose releases the lower back, hips, and shoulders before Downward Dog asks them to work actively in the inverted V shape. The passive decompression of Balasana creates space that Down Dog then expands through active loading.' },
  { from: 'downward-dog', to: 'plank-pose', type: 'prepares',
    explanation: 'Plank Pose builds the shoulder, core, and wrist strength that Downward Dog requires to maintain its shape. Coming to Plank first activates the stabilizing muscles that Down Dog asks to hold under the weight of the body.' },
  { from: 'downward-dog', to: 'plank-pose', type: 'complements',
    explanation: 'Downward Dog and Plank Pose are the two poles of the vinyasa base — Plank is horizontal and loaded, Down Dog is inverted and lengthening. Moving between them in breath is the fundamental action of every vinyasa flow.' },
  { from: 'downward-dog', to: 'headstand', type: 'unlocks',
    explanation: 'Downward Dog builds the shoulder girdle strength, spinal awareness, and hip-over-base alignment that Headstand requires. The inverted hip position and shoulder loading from Down Dog are direct preparation for the demands of Sirsasana.' },

  // ── Plank Pose ────────────────────────────────────────────────────────────
  { from: 'plank-pose', to: 'downward-dog', type: 'prepares',
    explanation: 'Downward Dog actively lengthens the spine and warms the shoulders before Plank asks them to hold a rigid straight-body position. Moving through Down Dog first establishes the shoulder alignment and back-body length Plank requires.' },
  { from: 'plank-pose', to: 'cat-pose', type: 'prepares',
    explanation: 'Cat Pose warms the spine and activates the core before Plank asks the body to hold it rigid. The breath-linked spinal movement of Cat builds the body awareness that translates into good Plank form.' },
  { from: 'plank-pose', to: 'side-plank', type: 'complements',
    explanation: 'Side Plank and Plank are the two foundational arm-balance positions — Plank holds the body level facing down, Side Plank rotates to one side. Together they develop shoulder and core strength in every plane of the prone position.' },
  { from: 'plank-pose', to: 'downward-dog', type: 'complements',
    explanation: 'Plank and Downward Dog are the two poles of the vinyasa base — Plank is horizontal and loaded, Down Dog is inverted and lengthening. Moving between them in breath is the fundamental action of every vinyasa practice.' },
  { from: 'plank-pose', to: 'crow-pose', type: 'unlocks',
    explanation: 'Crow Pose needs the wrist loading tolerance and core engagement that Plank Pose builds over time. The arm-straight, body-weight-on-hands relationship from Plank is the direct preparation for Crow\'s bent-arm lift-off.' },
  { from: 'plank-pose', to: 'upward-dog', type: 'unlocks',
    explanation: 'Upward Dog grows from Plank — the wrist loading, shoulder engagement, and straight-arm support that Plank builds are exactly what Upward Dog asks for in a backbend position. Plank is the strength foundation for Urdhva Mukha Svanasana.' },

  // ── Side Plank ────────────────────────────────────────────────────────────
  { from: 'side-plank', to: 'plank-pose', type: 'prepares',
    explanation: 'Plank Pose builds the bilateral shoulder and core strength that Side Plank then demands unilaterally. Grounding both shoulders in Plank first ensures the pressing arm is ready for the full weight of Side Plank.' },
  { from: 'side-plank', to: 'downward-dog', type: 'prepares',
    explanation: 'Downward Dog warms the shoulders and lengthens the side body before Side Plank asks both to work in a rotated, one-arm-supported position. Down Dog prepares the lateral chain and shoulder girdle that Vasisthasana loads.' },
  { from: 'side-plank', to: 'plank-pose', type: 'complements',
    explanation: 'Side Plank and Plank are the two fundamental prone arm-balance positions, best practiced together. Plank builds bilateral strength; Side Plank develops lateral stability and oblique engagement. Together they create complete core and shoulder strength.' },
  { from: 'side-plank', to: 'downward-dog', type: 'complements',
    explanation: 'Downward Dog and Side Plank share the same inverted-arm loading relationship with the shoulder. Down Dog distributes load across two arms; Side Plank focuses all of it on one. Together they develop shoulder strength under both even and uneven load.' },
  { from: 'side-plank', to: 'wheel-pose', type: 'unlocks',
    explanation: 'Wheel Pose requires the shoulder girdle strength, lateral body openness, and wrist tolerance that Side Plank builds. The one-arm pressing strength and oblique engagement from Vasisthasana translate into the upside-down pressing demand of Urdhva Dhanurasana.' },
  { from: 'side-plank', to: 'crow-pose', type: 'unlocks',
    explanation: 'Crow Pose benefits from the unilateral shoulder strength and balance under arm load that Side Plank develops. The hip engagement and core compression from Side Plank carry into the lifted, compact shape of Bakasana.' },

  // ── Sphinx Pose ───────────────────────────────────────────────────────────
  { from: 'sphinx-pose', to: 'childs-pose', type: 'prepares',
    explanation: 'Child\'s Pose releases the lower back and spine before Sphinx asks them to extend into a gentle backbend. The hip and spinal decompression from Balasana creates the baseline from which the backbend can grow safely.' },
  { from: 'sphinx-pose', to: 'cat-pose', type: 'prepares',
    explanation: 'Cat Pose warms the spine through flexion before Sphinx Pose asks it to extend. The spinal wave from Cat/Cow builds the body awareness and mobility that Sphinx then uses in its prone extension.' },
  { from: 'sphinx-pose', to: 'cobra-pose', type: 'complements',
    explanation: 'Sphinx and Cobra are two levels of the same prone backbend — Sphinx uses the forearms for support, Cobra adds arm-pressing to deepen the arch. Together they develop the spine\'s extension range progressively, from gentle to more intense.' },
  { from: 'sphinx-pose', to: 'bow-pose', type: 'complements',
    explanation: 'Bow Pose and Sphinx Pose both open the front body but ask different things of the spine. Sphinx grounds down passively; Bow actively lifts the chest and legs into a full backbend. Together they cover both the gentle and intense ends of prone back extension.' },
  { from: 'sphinx-pose', to: 'cobra-pose', type: 'unlocks',
    explanation: 'Cobra Pose grows from Sphinx\'s foundation — once the forearms establish the spinal arch, Sphinx shows the direction that straightening the arms takes you. The front-body opening and spinal extension from Sphinx prepare the body for Cobra\'s deeper demand.' },
  { from: 'sphinx-pose', to: 'camel-pose', type: 'unlocks',
    explanation: 'Camel Pose is the kneeling version of the full backbend that Sphinx starts to prepare. The chest opening and hip flexor lengthening from Sphinx practice build the front-body openness that Ustrasana requires to be safe and sustainable.' },

  // ── Cobra Pose ────────────────────────────────────────────────────────────
  { from: 'cobra-pose', to: 'sphinx-pose', type: 'prepares',
    explanation: 'Sphinx Pose opens the chest and spine in the same direction as Cobra but with more support. Using the forearms in Sphinx builds the spinal extension pattern before Cobra asks the same action with straight arms and more lift.' },
  { from: 'cobra-pose', to: 'cat-pose', type: 'prepares',
    explanation: 'Cat Pose warms the spine and activates the back muscles before Cobra asks them to extend. The Cat/Cow spinal mobility sequence prepares the spine for the more sustained extension of Bhujangasana.' },
  { from: 'cobra-pose', to: 'upward-dog', type: 'complements',
    explanation: 'Cobra and Upward Dog are two intensities of the same prone backbend — Cobra\'s legs stay lower and the chest lift is smaller; Upward Dog lifts the thighs off the floor for a deeper extension. Together they explore the full range of the prone backbend.' },
  { from: 'cobra-pose', to: 'bow-pose', type: 'complements',
    explanation: 'Bow Pose and Cobra both open the front body in a prone position but through different mechanics. Cobra uses arm-pressing; Bow uses leg-lifting and the clasp of the feet. Together they develop front-body opening from two complementary approaches.' },
  { from: 'cobra-pose', to: 'bow-pose', type: 'unlocks',
    explanation: 'Bow Pose is the intensified version of Cobra — same front-body opening, added quad stretch and backbend depth. The spinal extension and chest opening built in Cobra are the direct preparation for the more demanding lift of Dhanurasana.' },
  { from: 'cobra-pose', to: 'camel-pose', type: 'unlocks',
    explanation: 'Camel Pose extends Cobra\'s prone backbend into an upright kneeling position. The hip flexor and chest opening developed in Cobra are the same tissues Camel asks to release — just from a different starting position.' },

  // ── Upward Dog ────────────────────────────────────────────────────────────
  { from: 'upward-dog', to: 'cobra-pose', type: 'prepares',
    explanation: 'Cobra Pose builds the spinal extension and shoulder strength in a lower position before Upward Dog asks the thighs to lift completely off the floor. Cobra establishes the backbend pattern; Upward Dog intensifies it.' },
  { from: 'upward-dog', to: 'plank-pose', type: 'prepares',
    explanation: 'Plank Pose builds the wrist and shoulder strength that Upward Dog requires at full arm extension. Moving through Plank first ensures the pressing muscles are engaged and ready for the more demanding backbend position.' },
  { from: 'upward-dog', to: 'cobra-pose', type: 'complements',
    explanation: 'Upward Dog and Cobra are two expressions of the same prone backbend — in vinyasa they are often used interchangeably. Cobra is lower and more supported; Upward Dog is lifted and more intense. Each provides a different quality of front-body opening.' },
  { from: 'upward-dog', to: 'bow-pose', type: 'complements',
    explanation: 'Upward Dog and Bow Pose both lift the chest high in prone backbends but through different muscular approaches. Upward Dog is arm-powered; Bow is leg-and-core-powered. Together they develop full front-body opening from two different directions.' },
  { from: 'upward-dog', to: 'wheel-pose', type: 'unlocks',
    explanation: 'Wheel Pose requires the shoulder girdle strength and spinal extension that Upward Dog builds. The straight-arm pressing and hip flexor length from Upward Dog are direct preparation for the inverted pressing demand of Urdhva Dhanurasana.' },
  { from: 'upward-dog', to: 'camel-pose', type: 'unlocks',
    explanation: 'Camel Pose takes the chest-opening and hip flexor lengthening of Upward Dog into a kneeling position. The front-body space developed in Upward Dog makes Ustrasana accessible — the tissues have already opened in the direction Camel requires.' },

  // ── Bow Pose ──────────────────────────────────────────────────────────────
  { from: 'bow-pose', to: 'cobra-pose', type: 'prepares',
    explanation: 'Cobra Pose opens the chest and spine in the same direction Bow Pose requires, but with less intensity. The spinal extension and front-body opening from Cobra prepare the spine for the quad stretch and deeper lift of Dhanurasana.' },
  { from: 'bow-pose', to: 'camel-pose', type: 'prepares',
    explanation: 'Camel Pose opens the hip flexors and quadriceps in a kneeling backbend before Bow asks them to stretch in a prone position. The front-body space from Camel directly reduces the resistance Bow encounters in the quad and hip flexor.' },
  { from: 'bow-pose', to: 'camel-pose', type: 'complements',
    explanation: 'Bow Pose and Camel Pose are two expressions of the same deep backbend — one prone on the floor, one kneeling upright. Together they develop the full front-body opening that deep backbending requires, each bringing a different quality of support and intensity.' },
  { from: 'bow-pose', to: 'upward-dog', type: 'complements',
    explanation: 'Upward Dog and Bow Pose are complementary prone backbends — Upward Dog opens the chest with arm pressing, Bow adds a quad stretch by grasping the feet. Together they develop both the upper and lower front body in prone extension.' },
  { from: 'bow-pose', to: 'wheel-pose', type: 'unlocks',
    explanation: 'Wheel Pose is the full-body backbend progression from Bow — the same front-body opening, now with the arms reaching back to press the floor. The spinal extension and hip flexor release from Bow practice directly prepare the body for Urdhva Dhanurasana.' },
  { from: 'bow-pose', to: 'king-pigeon', type: 'unlocks',
    explanation: 'King Pigeon Pose takes the quad stretch and spinal extension of Bow Pose and combines them with a one-leg hip rotation. The front-body openness and backbend flexibility developed in Bow directly enable the deeper combined demand of Eka Pada Rajakapotasana.' },

  // ── Camel Pose ────────────────────────────────────────────────────────────
  { from: 'camel-pose', to: 'cobra-pose', type: 'prepares',
    explanation: 'Cobra Pose opens the chest and spine in extension before Camel asks for the same movement in an upright kneeling position. The front-body opening and spinal extension mechanics from Cobra carry directly into Ustrasana.' },
  { from: 'camel-pose', to: 'bridge-pose', type: 'prepares',
    explanation: 'Bridge Pose opens the hip flexors and spine in an accessible supine position before Camel asks for the same extension while kneeling. The chest and hip opening from Bridge prepare the tissues Camel will work with more intensity.' },
  { from: 'camel-pose', to: 'bow-pose', type: 'complements',
    explanation: 'Camel and Bow Pose are two expressions of the deep backbend — Camel kneeling, Bow prone. Together they develop front-body opening and spinal extension across different starting positions, each offering a different challenge and support structure.' },
  { from: 'camel-pose', to: 'upward-dog', type: 'complements',
    explanation: 'Upward Dog and Camel both require strong hip flexor opening and spinal extension. Upward Dog builds this from a prone pushing position; Camel builds it from an upright kneeling position. Together they develop the front-body length from multiple angles.' },
  { from: 'camel-pose', to: 'wheel-pose', type: 'unlocks',
    explanation: 'Wheel Pose is the full inversion of the backbend arc that Camel opens. The hip flexor and chest opening from consistent Camel practice are the direct prerequisites for finding the space that Urdhva Dhanurasana requires.' },
  { from: 'camel-pose', to: 'king-pigeon', type: 'unlocks',
    explanation: 'King Pigeon combines Camel\'s deep backbend with Pigeon\'s hip rotation — it requires both the front-body opening and the hip flexibility that Camel develops. Ustrasana is one of the most direct preparations for the combined demands of Eka Pada Rajakapotasana.' },

  // ── Bridge Pose ───────────────────────────────────────────────────────────
  { from: 'bridge-pose', to: 'reclined-twist', type: 'prepares',
    explanation: 'Reclined Twist releases the spine and hips before Bridge Pose asks them to extend and arch. The lateral spinal release and hip decompression from the twist create the mobility that Bridge then develops in extension.' },
  { from: 'bridge-pose', to: 'supported-pigeon', type: 'prepares',
    explanation: 'Supported Pigeon opens the hip rotators and hip flexors before Bridge asks the pelvis to tilt into extension. The hip opening from Supported Pigeon directly reduces the anterior hip tension that limits Bridge\'s height.' },
  { from: 'bridge-pose', to: 'wheel-pose', type: 'complements',
    explanation: 'Bridge Pose and Wheel Pose are two levels of the same supine backbend — Bridge is a grounded, supported version; Wheel lifts into full arm extension. Together they explore the full range of the supine backbend from accessible to advanced.' },
  { from: 'bridge-pose', to: 'shoulder-stand', type: 'complements',
    explanation: 'Bridge and Shoulder Stand are natural partners in the supine sequence — Bridge opens the spine into extension, Shoulder Stand takes the legs overhead into inversion. Together they give the spine both the backbend and the inversion in the supine family.' },
  { from: 'bridge-pose', to: 'wheel-pose', type: 'unlocks',
    explanation: 'Wheel Pose grows from Bridge — the same hip-extension and chest-opening direction, now with the arms pressing to lift completely off the floor. The spinal extension and hip flexor opening from Bridge practice directly prepare the body for Urdhva Dhanurasana.' },
  { from: 'bridge-pose', to: 'shoulder-stand', type: 'unlocks',
    explanation: 'Shoulder Stand takes the supine position one step further — the spine goes from Bridge\'s extension into inversion. The shoulder and neck awareness developed safely in Bridge is essential preparation for the weight Shoulder Stand places on those areas.' },

  // ── Wheel Pose ────────────────────────────────────────────────────────────
  { from: 'wheel-pose', to: 'bridge-pose', type: 'prepares',
    explanation: 'Bridge Pose opens the spine, chest, and hip flexors in the same direction as Wheel but with far less intensity. Using Bridge to prepare ensures the tissues are open before Wheel asks for the full arm-extended backbend.' },
  { from: 'wheel-pose', to: 'camel-pose', type: 'prepares',
    explanation: 'Camel Pose opens the hip flexors and chest in an upright kneeling position before Wheel asks them to release in an inverted arch. The front-body length from Camel is one of the most direct preparations for the demanding geometry of Urdhva Dhanurasana.' },
  { from: 'wheel-pose', to: 'supported-pigeon', type: 'complements',
    explanation: 'Supported Pigeon releases the hip flexors after Wheel\'s intense front-body opening. The passive hip-crease decompression from Supported Pigeon counterbalances the compression Wheel creates in the hip and lower back.' },
  { from: 'wheel-pose', to: 'bow-pose', type: 'complements',
    explanation: 'Bow Pose and Wheel Pose are both deep backbends — Bow is prone and accessible, Wheel is the full inverted expression. Together they develop the complete backbend range, from the floor-level prone shape to the full lifted arch.' },
  { from: 'wheel-pose', to: 'king-pigeon', type: 'unlocks',
    explanation: 'King Pigeon Pose combines the backbend of Wheel with the hip rotation of Pigeon — it\'s one of the most demanding combinations in the practice. The full front-body opening from Wheel practice creates the space King Pigeon requires in both the spine and the hip.' },
  { from: 'wheel-pose', to: 'lord-of-dance', type: 'unlocks',
    explanation: 'Lord of the Dance combines the single-leg balance of standing poses with the backbend arc of Wheel. The spinal extension and front-body openness from Wheel practice directly support the more expansive demand of Natarajasana.' },

  // ── Pigeon Pose ───────────────────────────────────────────────────────────
  { from: 'pigeon-pose', to: 'low-lunge', type: 'prepares',
    explanation: 'Low Lunge opens the hip flexor of the back leg and begins the front-hip rotation that Pigeon requires. Coming through Low Lunge first prepares both sides of the hip before Pigeon asks one to rotate deeply and the other to lengthen fully.' },
  { from: 'pigeon-pose', to: 'lizard-pose', type: 'prepares',
    explanation: 'Lizard Pose deepens the hip opening from Low Lunge, targeting the hip rotators and groin that Pigeon requires. The lateral hip work from Lizard directly prepares the depth Kapotasana demands.' },
  { from: 'pigeon-pose', to: 'dragon-pose', type: 'complements',
    explanation: 'Dragon Pose holds the pigeon hip-opening position for a longer duration with passive release. Active Pigeon and Yin Dragon together develop the hip rotators and hip flexors through both active engagement and passive surrender.' },
  { from: 'pigeon-pose', to: 'supported-pigeon', type: 'complements',
    explanation: 'Supported Pigeon uses props to make Pigeon accessible and sustainable for longer holds. The two versions together allow the same hip to be explored at different intensities and durations, developing both active and passive hip range.' },
  { from: 'pigeon-pose', to: 'king-pigeon', type: 'unlocks',
    explanation: 'King Pigeon adds a full backbend to Pigeon\'s hip rotation, requiring the front-body openness that consistent Pigeon practice develops. The hip rotation established in Pigeon is the essential foundation for King Pigeon\'s combined demand.' },
  { from: 'pigeon-pose', to: 'compass-pose', type: 'unlocks',
    explanation: 'Compass Pose requires deep hip rotation and hamstring length — the exact combination that Pigeon Pose develops. The front-hip rotation and back-leg extension from Pigeon translate directly into Surya Yantrasana\'s seated geometry.' },

  // ── Supported Pigeon ──────────────────────────────────────────────────────
  { from: 'supported-pigeon', to: 'supine-figure-four', type: 'prepares',
    explanation: 'Supine Figure Four opens the hip rotators in a gentle, supported position before Supported Pigeon asks them to release under the weight of the body. The accessible hip-crease opening from Figure Four prepares the tissues Supported Pigeon develops further.' },
  { from: 'supported-pigeon', to: 'low-lunge', type: 'prepares',
    explanation: 'Low Lunge opens the hip flexors before Supported Pigeon asks the front-hip rotators to release in a deep fold. The back-leg hip flexor opening from Low Lunge reduces the anterior hip tension that can block depth in Pigeon.' },
  { from: 'supported-pigeon', to: 'pigeon-pose', type: 'complements',
    explanation: 'Supported Pigeon and Pigeon Pose are the same hip-opening shape at different intensities. Supported uses props to hold the position for longer; Pigeon is the full expression. Together they allow the hip to be explored at different depths and durations.' },
  { from: 'supported-pigeon', to: 'dragon-pose', type: 'complements',
    explanation: 'Dragon Pose and Supported Pigeon both offer sustained, passive hip opening from similar positions. Dragon targets the hip flexor and front crease; Supported Pigeon focuses on the external rotators. Together they cover the hip\'s range from front to back.' },
  { from: 'supported-pigeon', to: 'pigeon-pose', type: 'unlocks',
    explanation: 'Full Pigeon Pose removes the prop support and deepens the hip rotation. The range and release developed in Supported Pigeon directly enables the depth available in the unsupported version.' },
  { from: 'supported-pigeon', to: 'king-pigeon', type: 'unlocks',
    explanation: 'King Pigeon combines the hip rotation of Pigeon with a full backbend. The consistent hip-rotation work from Supported Pigeon practice is the foundation that makes King Pigeon\'s combined demand achievable.' },

  // ── Supine Figure Four ────────────────────────────────────────────────────
  { from: 'supine-figure-four', to: 'reclined-twist', type: 'prepares',
    explanation: 'Reclined Twist releases the spine and outer hip before Supine Figure Four targets the deep hip rotators. The general hip decompression and spinal release from the twist prepare the outer hip tissue that Figure Four then focuses.' },
  { from: 'supine-figure-four', to: 'happy-baby', type: 'prepares',
    explanation: 'Happy Baby opens the hips and groins in a gentle inner-rotation before Supine Figure Four opens the hip rotators in external rotation. Together they prepare the hip joint from multiple directions.' },
  { from: 'supine-figure-four', to: 'supported-pigeon', type: 'complements',
    explanation: 'Supported Pigeon and Supine Figure Four are two levels of the same hip-rotation opening — Figure Four is the gentler, more accessible version; Supported Pigeon asks for more depth. Together they give the hip rotators a progressive, sustainable opening.' },
  { from: 'supine-figure-four', to: 'dragon-pose', type: 'complements',
    explanation: 'Dragon Pose targets the same deep hip-flexor and hip-rotator tissues as Supine Figure Four but in a floor lunge rather than a supine position. Together they develop the outer hip and hip rotators from both supine and prone angles.' },
  { from: 'supine-figure-four', to: 'pigeon-pose', type: 'unlocks',
    explanation: 'Pigeon Pose requires the deep hip rotation that Supine Figure Four begins to open. The hip-rotator release from consistent Figure Four practice directly unlocks the range needed for the full depth of Kapotasana.' },
  { from: 'supine-figure-four', to: 'shoelace-pose', type: 'unlocks',
    explanation: 'Shoelace Pose stacks the knees and opens both hip rotators simultaneously at depth. Supine Figure Four builds the single-leg hip-rotation range that Shoelace then develops in a more demanding seated position.' },

  // ── Dragon Pose ───────────────────────────────────────────────────────────
  { from: 'dragon-pose', to: 'low-lunge', type: 'prepares',
    explanation: 'Low Lunge opens the hip flexor and hip rotators before Dragon Pose asks them to release for an extended yin hold. The active stretch from Low Lunge prepares the tissues for Dragon\'s deeper, time-based release.' },
  { from: 'dragon-pose', to: 'lizard-pose', type: 'prepares',
    explanation: 'Lizard Pose deepens the hip opening from Low Lunge, targeting the specific tissues Dragon holds in a yin position. The active hip-flexor and groin opening from Lizard prepares the body for Dragon\'s longer, more sustained hold.' },
  { from: 'dragon-pose', to: 'pigeon-pose', type: 'complements',
    explanation: 'Pigeon Pose is the natural partner to Dragon — both open deep in the hip complex but from slightly different angles. Dragon targets the hip flexor and front crease; Pigeon targets the external rotators. Together they develop the full hip through both dimensions.' },
  { from: 'dragon-pose', to: 'supported-pigeon', type: 'complements',
    explanation: 'Supported Pigeon and Dragon Pose both offer sustained, passive hip opening from similar positions. Dragon is the active deep lunge hold; Supported Pigeon folds and releases. Together they cover the hip\'s range from front to back through sustained holds.' },
  { from: 'dragon-pose', to: 'compass-pose', type: 'unlocks',
    explanation: 'Compass Pose requires deep hip-flexor openness and lateral hip range — the exact tissues Dragon Pose releases over long holds. The accumulated hip-crease space from Dragon practice creates the freedom Compass Pose needs.' },
  { from: 'dragon-pose', to: 'king-pigeon', type: 'unlocks',
    explanation: 'King Pigeon demands the deep hip-rotation and hip-flexor range that Dragon Pose develops through yin practice. The tissues that yield slowly to Dragon\'s long hold are the same ones King Pigeon needs to be fully open.' },

  // ── Shoelace Pose ─────────────────────────────────────────────────────────
  { from: 'shoelace-pose', to: 'pigeon-pose', type: 'prepares',
    explanation: 'Pigeon Pose opens the hip rotators one side at a time before Shoelace stacks both knees and asks both hips to open simultaneously. Pigeon\'s single-leg hip rotation is the most direct preparation for Shoelace\'s bilateral demand.' },
  { from: 'shoelace-pose', to: 'supine-figure-four', type: 'prepares',
    explanation: 'Supine Figure Four opens the hip rotators gently before Shoelace asks for the same range in a more demanding seated position. The hip-crease release from Figure Four directly enables the depth Shoelace requires.' },
  { from: 'shoelace-pose', to: 'seated-forward-fold', type: 'complements',
    explanation: 'Seated Forward Fold and Shoelace both require deep hip rotation combined with a forward fold. Seated Forward Fold opens the hamstrings in a neutral hip position; Shoelace adds external rotation to the forward fold demand. Together they develop the seated forward fold from multiple hip positions.' },
  { from: 'shoelace-pose', to: 'head-to-knee', type: 'complements',
    explanation: 'Head to Knee Pose and Shoelace share the hip-rotation-plus-forward-fold family. Head to Knee opens one hip at a time with a straight leg; Shoelace stacks both knees in deeper rotation. Together they develop hip-rotation and hamstring length progressively.' },
  { from: 'shoelace-pose', to: 'compass-pose', type: 'unlocks',
    explanation: 'Compass Pose grows from the deep hip-rotation opening that Shoelace develops. The stacked-knee position of Shoelace opens the same hip rotators that Compass Pose requires, along with the hamstring length to extend the leg.' },
  { from: 'shoelace-pose', to: 'seated-forward-fold', type: 'unlocks',
    explanation: 'Shoelace Pose opens the hip rotators deeply, and when they release, Seated Forward Fold becomes significantly deeper. The hip-rotation freedom from consistent Shoelace practice unlocks a new level of forward fold depth.' },

  // ── Butterfly Pose ────────────────────────────────────────────────────────
  { from: 'butterfly-pose', to: 'reclined-twist', type: 'prepares',
    explanation: 'Reclined Twist releases the spine and hips before Butterfly Pose asks the inner thighs and groins to open. The general hip decompression creates baseline mobility that Butterfly then develops further.' },
  { from: 'butterfly-pose', to: 'happy-baby', type: 'prepares',
    explanation: 'Happy Baby opens the hips and groins before Butterfly asks them to open in the seated position. The gentle inner and outer hip opening from Happy Baby prepares the groin tissue that Butterfly then targets.' },
  { from: 'butterfly-pose', to: 'seated-forward-fold', type: 'complements',
    explanation: 'Seated Forward Fold and Butterfly Pose are natural partners in seated hip and hamstring work. Butterfly opens the inner thighs; Seated Forward Fold extends the hamstrings. Together they address the entire posterior and medial hip complex.' },
  { from: 'butterfly-pose', to: 'squat-pose', type: 'complements',
    explanation: 'Garland Pose and Butterfly Pose both open the inner thighs and groins, but from different positions. Garland is a standing compression; Butterfly is a seated passive opening. Together they develop the inner thigh range from both directions.' },
  { from: 'butterfly-pose', to: 'wide-leg-forward-fold', type: 'unlocks',
    explanation: 'Wide-Leg Forward Fold requires the inner thigh and groin opening that Butterfly develops. The adductor release from consistent Butterfly practice directly enables the depth and width of Upavishta Konasana.' },
  { from: 'butterfly-pose', to: 'compass-pose', type: 'unlocks',
    explanation: 'Compass Pose requires the inner thigh and groin openness that Butterfly builds. The medial hip range developed in Butterfly creates the space that Compass Pose needs to achieve its demanding seated geometry.' },

  // ── Seated Forward Fold ───────────────────────────────────────────────────
  { from: 'seated-forward-fold', to: 'butterfly-pose', type: 'prepares',
    explanation: 'Butterfly Pose opens the inner thighs and groins before Seated Forward Fold asks the hamstrings and posterior hip to release fully. The hip opening from Butterfly reduces the outward-rotation pull that limits depth in Paschimottanasana.' },
  { from: 'seated-forward-fold', to: 'wide-leg-forward-fold', type: 'prepares',
    explanation: 'Wide-Leg Forward Fold opens the inner thighs and creates hip space before Seated Forward Fold asks both legs together to extend and fold. The adductor release from the wide-leg fold directly enables more depth in the seated version.' },
  { from: 'seated-forward-fold', to: 'head-to-knee', type: 'complements',
    explanation: 'Head to Knee Pose and Seated Forward Fold are partners in the seated forward fold family — one asymmetric, one symmetric. Head to Knee adds a twist and single-leg hip rotation; Seated Forward Fold is the even, bilateral release. Together they develop the hamstrings and posterior hip from multiple angles.' },
  { from: 'seated-forward-fold', to: 'shoelace-pose', type: 'complements',
    explanation: 'Shoelace Pose and Seated Forward Fold are both deep hip-fold poses that complement each other. Shoelace adds external rotation to the forward fold; Seated Forward Fold is neutral. Together they explore the seated hip fold from different hip positions.' },
  { from: 'seated-forward-fold', to: 'compass-pose', type: 'unlocks',
    explanation: 'Compass Pose requires both the hamstring length and hip-rotation openness that Seated Forward Fold develops. The posterior chain release from consistent Paschimottanasana practice is a direct prerequisite for Surya Yantrasana\'s leg-extension geometry.' },
  { from: 'seated-forward-fold', to: 'boat-pose', type: 'unlocks',
    explanation: 'Boat Pose requires the hip flexor strength and body awareness developed through Seated Forward Fold practice. The abdominal engagement needed to fold forward in Paschimottanasana is the same engagement Navasana calls for to hold the legs up.' },

  // ── Head to Knee ──────────────────────────────────────────────────────────
  { from: 'head-to-knee', to: 'seated-forward-fold', type: 'prepares',
    explanation: 'Seated Forward Fold opens the hamstrings and posterior hip evenly before Head to Knee Pose adds the asymmetry and internal rotation of one bent knee. The bilateral hamstring release from Paschimottanasana reduces the resistance Head to Knee encounters.' },
  { from: 'head-to-knee', to: 'butterfly-pose', type: 'prepares',
    explanation: 'Butterfly Pose opens the inner thighs and groins before Head to Knee Pose asks one hip to rotate inward while the other leg extends. The groin and medial hip release from Butterfly prepares the inner tissues that Head to Knee targets on the bent-leg side.' },
  { from: 'head-to-knee', to: 'shoelace-pose', type: 'complements',
    explanation: 'Shoelace Pose and Head to Knee both explore the hip-rotation-plus-forward-fold combination. Head to Knee has one straight leg; Shoelace stacks both knees in deeper rotation. Together they develop hip-rotation and hamstring length progressively.' },
  { from: 'head-to-knee', to: 'seated-forward-fold', type: 'complements',
    explanation: 'Head to Knee and Seated Forward Fold are partners — one asymmetric, one symmetric. Practicing both develops the hamstrings and posterior hip from both even and uneven positions, addressing the imbalances that often exist between sides.' },
  { from: 'head-to-knee', to: 'compass-pose', type: 'unlocks',
    explanation: 'Compass Pose requires the hamstring length and hip rotation that Head to Knee develops specifically on each side. The single-leg posterior chain release from Janu Sirsasana practice directly opens the path to Surya Yantrasana.' },
  { from: 'head-to-knee', to: 'standing-split', type: 'unlocks',
    explanation: 'Standing Split requires the hamstring length that Head to Knee develops in a seated position. The posterior chain opening from consistent Head to Knee practice translates directly into the range Standing Split requires on one leg.' },

  // ── Boat Pose ─────────────────────────────────────────────────────────────
  { from: 'boat-pose', to: 'seated-forward-fold', type: 'prepares',
    explanation: 'Seated Forward Fold activates the hip flexors and warms the posterior chain before Boat Pose asks those same hip flexors to work concentrically to lift the legs. The hip-flexion awareness from the fold prepares the muscles Navasana loads.' },
  { from: 'boat-pose', to: 'plank-pose', type: 'prepares',
    explanation: 'Plank Pose builds the core strength and spinal rigidity that Boat Pose requires. The ability to hold the core engaged with the spine long from Plank translates directly into Navasana\'s demand for sustained hold.' },
  { from: 'boat-pose', to: 'squat-pose', type: 'complements',
    explanation: 'Garland Pose and Boat Pose are complementary core and hip practices — Garland opens the hips passively while Boat builds hip-flexor strength actively. Together they develop the deep hip crease from both the opening and the loading direction.' },
  { from: 'boat-pose', to: 'crow-pose', type: 'complements',
    explanation: 'Crow Pose and Boat Pose both require sustained core engagement and hip-flexion strength. Boat builds the straight-leg hip flexion endurance; Crow takes it into an arm balance. Together they develop core compression and hip engagement across both floor and arm-support positions.' },
  { from: 'boat-pose', to: 'crow-pose', type: 'unlocks',
    explanation: 'Crow Pose grows from the hip-flexion strength and core engagement that Boat Pose develops. The hip-crease drawing-in action that holds Navasana is exactly the same action that brings the knees to the upper arms in Bakasana.' },
  { from: 'boat-pose', to: 'compass-pose', type: 'unlocks',
    explanation: 'Compass Pose requires hip flexor strength and core engagement while managing a complex arm-and-leg geometry. The hip-flexion strength and balance awareness built in Boat Pose contribute directly to the challenges of Surya Yantrasana.' },

  // ── Compass Pose ──────────────────────────────────────────────────────────
  { from: 'compass-pose', to: 'pigeon-pose', type: 'prepares',
    explanation: 'Pigeon Pose opens the hip rotators and hip flexors that Compass Pose requires to achieve its seated geometry. The front-hip rotation and back-leg extension from Pigeon directly prepare the range Compass needs.' },
  { from: 'compass-pose', to: 'seated-forward-fold', type: 'prepares',
    explanation: 'Seated Forward Fold opens the hamstrings in a neutral hip position before Compass asks them to extend with the hip in a specific external rotation. The posterior chain length from Paschimottanasana is a prerequisite for Compass\'s leg extension.' },
  { from: 'compass-pose', to: 'shoelace-pose', type: 'complements',
    explanation: 'Shoelace Pose and Compass both involve deep hip rotation in a seated position. Shoelace works both hips simultaneously in a stacked position; Compass extends one leg with a shoulder connection. Together they develop the hip-rotation range comprehensively.' },
  { from: 'compass-pose', to: 'head-to-knee', type: 'complements',
    explanation: 'Head to Knee and Compass share the single-side hamstring-plus-hip-rotation family. Head to Knee opens in a simpler geometry; Compass adds the shoulder-under-leg connection and the leg extension. Together they build the range progressively.' },
  { from: 'compass-pose', to: 'king-pigeon', type: 'unlocks',
    explanation: 'King Pigeon requires the hip-rotation depth and front-body openness that Compass Pose helps develop. The hip flexibility and spatial body awareness from Compass practice contribute to the combined demand of Eka Pada Rajakapotasana.' },
  { from: 'compass-pose', to: 'lord-of-dance', type: 'unlocks',
    explanation: 'Lord of the Dance requires the hip flexibility and spatial body awareness that Compass Pose develops. The hip-rotation range and body-geometry understanding from Compass contribute to the balancing and backbending demands of Natarajasana.' },

  // ── Reclined Twist ────────────────────────────────────────────────────────
  { from: 'reclined-twist', to: 'happy-baby', type: 'prepares',
    explanation: 'Happy Baby opens the hips and groins before Reclined Twist asks the spine to rotate while the hips remain grounded. The hip decompression from Happy Baby allows the twist to come from the spine rather than from forcing the hips.' },
  { from: 'reclined-twist', to: 'supine-figure-four', type: 'prepares',
    explanation: 'Supine Figure Four opens the outer hip before Reclined Twist asks it to move across the midline. The hip-rotator release from Figure Four reduces the resistance the outer hip creates during the twist.' },
  { from: 'reclined-twist', to: 'happy-baby', type: 'complements',
    explanation: 'Happy Baby and Reclined Twist are natural partners in the supine hip-and-spine sequence. Happy Baby opens the hips from below; Reclined Twist wrings out the spine from the side. Together they create a full supine hip and spinal release.' },
  { from: 'reclined-twist', to: 'legs-up-the-wall', type: 'complements',
    explanation: 'Legs Up the Wall and Reclined Twist are complementary restorative poses — Twist releases the rotational tension in the spine, Legs Up the Wall decompresses the lower back and legs. Together they provide a complete supine restoration.' },
  { from: 'reclined-twist', to: 'bridge-pose', type: 'unlocks',
    explanation: 'Bridge Pose requires the spinal mobility and hip openness that Reclined Twist helps develop. The rotational mobility from the twist prepares the spine for Bridge\'s extension pattern, and the hip decompression reduces the tension that limits Bridge\'s height.' },
  { from: 'reclined-twist', to: 'shoulder-stand', type: 'unlocks',
    explanation: 'Shoulder Stand requires the spinal flexibility and shoulder awareness that Reclined Twist helps develop. The spinal mobilization from consistent Reclined Twist practice contributes to the range of motion Sarvangasana requires.' },

  // ── Happy Baby ────────────────────────────────────────────────────────────
  { from: 'happy-baby', to: 'reclined-twist', type: 'prepares',
    explanation: 'Reclined Twist opens the outer hip and lower back before Happy Baby asks the inner thighs and groins to release in a wide-hip position. The spinal and outer-hip release from the twist prepares the body for Happy Baby\'s inner-hip demand.' },
  { from: 'happy-baby', to: 'legs-up-the-wall', type: 'prepares',
    explanation: 'Legs Up the Wall releases the hamstrings and lower back before Happy Baby asks the hips to open wide with the knees toward the armpits. The decompression from the inversion creates space that Happy Baby then develops.' },
  { from: 'happy-baby', to: 'reclined-twist', type: 'complements',
    explanation: 'Reclined Twist and Happy Baby are natural partners in the supine sequence — twist releases the rotational tension, Happy Baby opens the inner hips and groins. Together they address the hips from both the rotational and the inner-thigh direction.' },
  { from: 'happy-baby', to: 'supine-figure-four', type: 'complements',
    explanation: 'Supine Figure Four and Happy Baby both open the hips in a gentle supine position. Figure Four targets the outer hip rotators; Happy Baby opens the inner hip and groin. Together they address the hip joint from both the internal and external rotation direction.' },
  { from: 'happy-baby', to: 'shoulder-stand', type: 'unlocks',
    explanation: 'Shoulder Stand requires the hip and groin openness that Happy Baby develops. The inner-hip space from Happy Baby allows the pelvis to tilt more easily when the legs go overhead in Sarvangasana.' },
  { from: 'happy-baby', to: 'squat-pose', type: 'unlocks',
    explanation: 'Garland Pose builds on the hip opening that Happy Baby develops — both require the hip and groin space to let the knees draw wide. The inner-thigh release from Happy Baby directly enables the deep hip-crease opening of Malasana.' },

  // ── Legs Up the Wall ──────────────────────────────────────────────────────
  { from: 'legs-up-the-wall', to: 'reclined-twist', type: 'prepares',
    explanation: 'Reclined Twist releases the lower back and outer hip before Legs Up the Wall asks the hamstrings and lower back to release in an inverted position. The spinal release from the twist prepares the body for the sustained hold of Viparita Karani.' },
  { from: 'legs-up-the-wall', to: 'happy-baby', type: 'prepares',
    explanation: 'Happy Baby opens the hips and groins before Legs Up the Wall asks the legs to extend upward. The hip and hamstring release from Happy Baby creates space that allows the legs to extend more easily in the inversion.' },
  { from: 'legs-up-the-wall', to: 'happy-baby', type: 'complements',
    explanation: 'Happy Baby and Legs Up the Wall are complementary restorative poses — Happy Baby opens the hips actively, Legs Up the Wall rests the legs passively. Together they create a complete lower-body and spine restoration.' },
  { from: 'legs-up-the-wall', to: 'supported-pigeon', type: 'complements',
    explanation: 'Supported Pigeon and Legs Up the Wall are both restorative hip-and-spine poses. Supported Pigeon releases the hip flexors and rotators; Legs Up the Wall decompresses the lower back and drains the legs. Together they provide a complete restorative hip and spine practice.' },
  { from: 'legs-up-the-wall', to: 'shoulder-stand', type: 'unlocks',
    explanation: 'Shoulder Stand is the active inversion that follows Legs Up the Wall\'s passive one. The body\'s familiarity with the inverted hip-over-shoulder position from Viparita Karani directly helps the transition into the more demanding inversion of Sarvangasana.' },
  { from: 'legs-up-the-wall', to: 'headstand', type: 'unlocks',
    explanation: 'Headstand grows from the comfort with inversion that Legs Up the Wall builds. The hip-over-shoulder awareness and blood-flow adaptation from Viparita Karani prepare the body for the more demanding challenge of Sirsasana.' },

  // ── Shoulder Stand ────────────────────────────────────────────────────────
  { from: 'shoulder-stand', to: 'bridge-pose', type: 'prepares',
    explanation: 'Bridge Pose opens the chest and spine in extension before Shoulder Stand asks the neck to support the body in inversion. The spinal awareness and shoulder engagement from Bridge are essential preparation for the weight and position of Sarvangasana.' },
  { from: 'shoulder-stand', to: 'legs-up-the-wall', type: 'prepares',
    explanation: 'Legs Up the Wall familiarizes the body with the inverted hip-over-shoulder position before Shoulder Stand asks the same position with full body weight on the shoulders and neck. The inversion adaptation from Viparita Karani directly prepares the body.' },
  { from: 'shoulder-stand', to: 'headstand', type: 'complements',
    explanation: 'Headstand and Shoulder Stand are the two primary inversions — Headstand balances on the crown, Shoulder Stand supports on the shoulders. Together they develop inversion confidence and the strength to hold the body inverted through two different support points.' },
  { from: 'shoulder-stand', to: 'legs-up-the-wall', type: 'complements',
    explanation: 'Legs Up the Wall and Shoulder Stand are two levels of the same supine inversion — Legs Up is passive and restorative, Shoulder Stand is active and strength-building. Together they develop the inversion practice from gentle to more demanding.' },
  { from: 'shoulder-stand', to: 'headstand', type: 'unlocks',
    explanation: 'Headstand is the natural progression from Shoulder Stand\'s inversion confidence. The neck awareness, shoulder engagement, and hip-over-base stacking from consistent Shoulder Stand practice are direct preparation for the demands of Sirsasana.' },
  { from: 'shoulder-stand', to: 'king-pigeon', type: 'unlocks',
    explanation: 'King Pigeon requires the back-opening and hip flexibility that a consistent inversion practice develops. The spinal and shoulder awareness from Shoulder Stand practice contributes to the full-body openness that King Pigeon demands.' },

  // ── Headstand ─────────────────────────────────────────────────────────────
  { from: 'headstand', to: 'downward-dog', type: 'prepares',
    explanation: 'Downward Dog builds the shoulder girdle strength and inverted hip awareness that Headstand requires. The weight-bearing through the arms and the hip-over-shoulder alignment from Down Dog are direct preparation for the demands of Sirsasana.' },
  { from: 'headstand', to: 'shoulder-stand', type: 'prepares',
    explanation: 'Shoulder Stand familiarizes the body with full inversion and builds the neck and shoulder awareness that Headstand requires. Coming through Shoulder Stand first ensures the body can safely support itself in an inverted position before adding the head-balance demand.' },
  { from: 'headstand', to: 'shoulder-stand', type: 'complements',
    explanation: 'Headstand and Shoulder Stand are the two fundamental inversions — together they develop a complete inversion practice. Shoulder Stand works the posterior chain in the inversion; Headstand develops the anterior core and balance. Together they create balanced inversion strength.' },
  { from: 'headstand', to: 'legs-up-the-wall', type: 'complements',
    explanation: 'Legs Up the Wall and Headstand are two levels of the inversion family — Legs Up is passive and accessible, Headstand is the full demanding version. Together they allow the inversion practice to be adapted to the body\'s readiness on any given day.' },
  { from: 'headstand', to: 'lord-of-dance', type: 'unlocks',
    explanation: 'Lord of the Dance requires the same core engagement, spatial body awareness, and shoulder stability that Headstand builds. The balance sophistication and full-body coordination from Sirsasana practice contribute to the complex demands of Natarajasana.' },
  { from: 'headstand', to: 'king-pigeon', type: 'unlocks',
    explanation: 'King Pigeon requires the full-body openness and spatial body awareness that a mature inversion practice develops. The core strength and body-space relationship from consistent Headstand practice contribute to the deep combined demand of Eka Pada Rajakapotasana.' },

  // ── Crow Pose ─────────────────────────────────────────────────────────────
  { from: 'crow-pose', to: 'plank-pose', type: 'prepares',
    explanation: 'Plank Pose builds the wrist and shoulder strength that Crow Pose requires for its arm balance. The straight-arm pressing and core engagement from Plank are the direct physical prerequisites for Bakasana\'s lift-off.' },
  { from: 'crow-pose', to: 'squat-pose', type: 'prepares',
    explanation: 'Garland Pose opens the hips and groins that Crow needs to slide the knees high onto the upper arms. The deep hip-flexion and inner-thigh opening from Malasana creates the space that allows Crow to tuck the body into its compact lift-off shape.' },
  { from: 'crow-pose', to: 'boat-pose', type: 'complements',
    explanation: 'Boat Pose and Crow Pose both require sustained core engagement and hip-flexion strength. Boat builds that strength with the legs extended; Crow takes it into an arm balance. Together they develop core and hip-flexor strength from both floor and arm-support positions.' },
  { from: 'crow-pose', to: 'side-plank', type: 'complements',
    explanation: 'Side Plank and Crow Pose are both arm balances that challenge the wrist, shoulder, and core from different angles. Side Plank develops lateral stability; Crow develops the hip-flexion and rounded-spine balance. Together they build arm balance from multiple directions.' },
  { from: 'crow-pose', to: 'king-pigeon', type: 'unlocks',
    explanation: 'King Pigeon requires the same arm-balance awareness and core engagement that Crow Pose develops. The comfort with body weight over the hands and the spatial awareness from Crow contribute to King Pigeon\'s demanding combined geometry.' },
  { from: 'crow-pose', to: 'headstand', type: 'unlocks',
    explanation: 'Headstand grows from the core strength, shoulder engagement, and balance under pressure that Crow Pose develops. The hip-over-hands balance awareness from Crow directly transfers into learning to stack the hip over the shoulders and head in Sirsasana.' },

  // ── Child's Pose ──────────────────────────────────────────────────────────
  { from: 'childs-pose', to: 'reclined-twist', type: 'prepares',
    explanation: 'Reclined Twist releases the spine and outer hips before Child\'s Pose asks the hips to fold deeply forward onto the heels. The spinal mobilization from the twist prepares the body for the deep hip-crease compression of Balasana.' },
  { from: 'childs-pose', to: 'happy-baby', type: 'prepares',
    explanation: 'Happy Baby opens the hips and inner thighs before Child\'s Pose asks the knees to fold wide in a hip-crease compression. The inner-hip release from Happy Baby creates space that allows Child\'s Pose to be deeper and more comfortable.' },
  { from: 'childs-pose', to: 'reclined-twist', type: 'complements',
    explanation: 'Reclined Twist and Child\'s Pose are complementary rest poses — Twist releases rotational tension in the spine, Child\'s Pose releases the posterior chain in a forward fold. Together they create a complete spine and hip restoration.' },
  { from: 'childs-pose', to: 'legs-up-the-wall', type: 'complements',
    explanation: 'Legs Up the Wall and Child\'s Pose are two classic restorative shapes — Child\'s Pose compresses the hip crease and lengthens the back body, Legs Up the Wall decompresses the lower back and drains the legs. Together they offer the body complete rest.' },
  { from: 'childs-pose', to: 'cat-pose', type: 'unlocks',
    explanation: 'Cat Pose builds directly from Child\'s Pose — both begin in a kneeling position and both mobilize the spine. Child\'s Pose releases the spine passively; Cat then activates it dynamically. The hip and spine opening from Child\'s Pose directly enables Cat\'s full spinal wave.' },
  { from: 'childs-pose', to: 'downward-dog', type: 'unlocks',
    explanation: 'Downward Dog grows from Child\'s Pose\'s hip-and-spine opening. The hip-crease release and spinal length established in Child\'s Pose are the foundation from which Down Dog\'s inverted V can extend fully. Many practitioners transition directly between these two poses.' },

  // ── King Pigeon ───────────────────────────────────────────────────────────
  { from: 'king-pigeon', to: 'pigeon-pose', type: 'prepares',
    explanation: 'Pigeon Pose opens the hip rotators and begins the front-body opening that King Pigeon requires. The hip-rotation depth from Pigeon practice is the essential foundation for adding King Pigeon\'s backbend component.' },
  { from: 'king-pigeon', to: 'wheel-pose', type: 'prepares',
    explanation: 'Wheel Pose opens the chest, hip flexors, and spine in the direction King Pigeon requires for its backbend component. The front-body length from consistent Wheel practice directly prepares the body for King Pigeon\'s combined demand.' },
  { from: 'king-pigeon', to: 'compass-pose', type: 'complements',
    explanation: 'Compass Pose and King Pigeon both require deep hip rotation combined with complex body geometry. Compass develops the hip flexibility and spatial awareness; King Pigeon adds the backbend. Together they develop the hip-rotation range comprehensively.' },
  { from: 'king-pigeon', to: 'bow-pose', type: 'complements',
    explanation: 'Bow Pose and King Pigeon both combine a quad stretch with a backbend. Bow is prone and accessible; King Pigeon adds hip rotation and is one of the most demanding poses. Together they develop the backbend-plus-quad-stretch combination at two levels of intensity.' },
  { from: 'king-pigeon', to: 'lord-of-dance', type: 'unlocks',
    explanation: 'Lord of the Dance requires the same combination of hip flexibility and backbend openness that King Pigeon develops. The front-body length and hip-rotation range from King Pigeon practice contribute directly to the full expression of Natarajasana.' },
  { from: 'king-pigeon', to: 'headstand', type: 'unlocks',
    explanation: 'Headstand requires the core strength and spatial body awareness that King Pigeon\'s demanding geometry helps develop. The full-body openness and balance sophistication from consistent King Pigeon practice contribute to the demands of Sirsasana.' },

  // ── Lord of the Dance ─────────────────────────────────────────────────────
  { from: 'lord-of-dance', to: 'warrior-3', type: 'prepares',
    explanation: 'Warrior III builds the single-leg balance and hip engagement that Lord of the Dance then asks to hold while reaching into a backbend. The standing-leg strength and forward-balance awareness from Warrior III are the foundation Natarajasana requires.' },
  { from: 'lord-of-dance', to: 'camel-pose', type: 'prepares',
    explanation: 'Camel Pose opens the hip flexors and spine in the direction Lord of the Dance requires for its backbend component. The chest opening and quad-stretch direction from Camel directly prepare the front body for Natarajasana\'s deeper demand.' },
  { from: 'lord-of-dance', to: 'half-moon-pose', type: 'complements',
    explanation: 'Half Moon Pose and Lord of the Dance both explore single-leg balance in different planes — Half Moon opens laterally, Lord of the Dance reaches back into a backbend. Together they develop single-leg stability across multiple directions.' },
  { from: 'lord-of-dance', to: 'king-pigeon', type: 'complements',
    explanation: 'King Pigeon and Lord of the Dance both combine hip flexibility and backbending, but from different starting positions. King Pigeon is a grounded deep opener; Lord of the Dance is a standing balance. Together they develop the backbend-hip-flexibility combination at two intensity levels.' },
  { from: 'lord-of-dance', to: 'king-pigeon', type: 'unlocks',
    explanation: 'King Pigeon is the grounded version of the full-body opening that Lord of the Dance performs standing. The backbend depth and hip-rotation range from Natarajasana practice directly contribute to the intense combined demand of Eka Pada Rajakapotasana.' },
  { from: 'lord-of-dance', to: 'wheel-pose', type: 'unlocks',
    explanation: 'Wheel Pose takes the backbending arc of Lord of the Dance and expands it into a full-body arch with both hands on the floor. The spinal extension and front-body length from Natarajasana practice are direct preparation for Urdhva Dhanurasana\'s demanding geometry.' },
];

// ── Upload images ────────────────────────────────────────────────────────────
async function uploadImages() {
  console.log('── Step 1: Uploading 18 new images ──\n');
  const results = [];
  for (const { slug, file } of IMAGE_MAP) {
    const localPath = path.join(IMAGES_DIR, file);
    if (!fs.existsSync(localPath)) {
      console.log(`  SKIP  ${slug} (not found: ${file})`); continue;
    }
    const ext  = path.extname(file).toLowerCase();
    const name = `${slug}${ext}`;
    const buf  = fs.readFileSync(localPath);
    const mime = ext === '.png' ? 'image/png' : 'image/jpeg';
    const { error } = await supabase.storage.from(BUCKET)
      .upload(name, buf, { contentType: mime, upsert: true });
    if (error) { console.log(`  FAIL  ${slug}: ${error.message}`); continue; }
    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(name);
    console.log(`  OK    ${slug} → ${urlData.publicUrl}`);
    results.push({ slug, url: urlData.publicUrl });
  }
  return results;
}

// ── Insert new poses ─────────────────────────────────────────────────────────
async function insertPoses(uploadResults) {
  console.log('\n── Step 2: Inserting 18 new poses ──\n');
  const urlMap = Object.fromEntries(uploadResults.map(r => [r.slug, r.url]));
  for (const pose of NEW_POSES) {
    const image_url = urlMap[pose.slug] || null;
    const { data, error } = await supabase.from('poses')
      .upsert({ ...pose, image_url }, { onConflict: 'slug' })
      .select('id, name');
    if (error) console.log(`  FAIL  ${pose.slug}: ${error.message}`);
    else       console.log(`  OK    ${data[0].name}`);
  }
}

// ── Delete all outgoing edges for 50 v1 poses ────────────────────────────────
async function deleteOldEdges() {
  console.log('\n── Step 3: Deleting old outgoing edges for all 50 v1 poses ──\n');
  const { data: poses, error: fetchErr } = await supabase
    .from('poses').select('id, slug').in('slug', V1_SLUGS);
  if (fetchErr) throw fetchErr;

  const ids = poses.map(p => p.id);
  console.log(`  Found ${poses.length} v1 poses in DB`);

  const { error: delErr, count } = await supabase
    .from('pose_relationships')
    .delete()
    .in('from_pose_id', ids);

  if (delErr) { console.log(`  FAIL: ${delErr.message}`); throw delErr; }
  console.log(`  Deleted existing outgoing edges for ${ids.length} poses`);
  return poses;
}

// ── Insert all 298 fresh edges ───────────────────────────────────────────────
async function insertEdges(v1Poses) {
  console.log('\n── Step 4: Inserting all v1 edges ──\n');
  const slugToId = Object.fromEntries(v1Poses.map(p => [p.slug, p.id]));

  // Some edge targets may be non-v1 poses already in DB — fetch them too
  const allTargetSlugs = [...new Set(EDGES.map(e => e.to))];
  const missingTargets = allTargetSlugs.filter(s => !slugToId[s]);
  if (missingTargets.length > 0) {
    const { data: extra } = await supabase.from('poses').select('id, slug').in('slug', missingTargets);
    for (const p of (extra || [])) slugToId[p.slug] = p.id;
  }

  let ok = 0, fail = 0;
  for (const e of EDGES) {
    const fromId = slugToId[e.from];
    const toId   = slugToId[e.to];
    if (!fromId || !toId) {
      console.log(`  MISS  ${e.from} → ${e.to} (slug not found)`); fail++; continue;
    }
    const { error } = await supabase.from('pose_relationships').upsert(
      { from_pose_id: fromId, to_pose_id: toId, relationship: e.type, explanation: e.explanation },
      { onConflict: 'from_pose_id,to_pose_id,relationship' }
    );
    if (error) { console.log(`  FAIL  ${e.from} → ${e.to}: ${error.message}`); fail++; }
    else       { console.log(`  OK    ${e.from} → ${e.to} (${e.type})`); ok++; }
  }
  console.log(`\n  Edges: ${ok} OK, ${fail} failed`);
}

async function main() {
  const uploaded = await uploadImages();
  await insertPoses(uploaded);
  const v1Poses  = await deleteOldEdges();
  await insertEdges(v1Poses);
  console.log('\n✓ v1 build complete.');
}

main().catch(console.error);
