-- =====================
-- SCHEMA
-- =====================

create extension if not exists "pgcrypto";

create table poses (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name        text not null,
  sanskrit    text,
  body_areas  text[],
  flags       text[],
  image_url   text,
  created_at  timestamptz default now()
);

create type relationship_type as enum ('prepares', 'complements', 'unlocks');

create table pose_relationships (
  id           uuid primary key default gen_random_uuid(),
  from_pose_id uuid references poses(id) on delete cascade,
  to_pose_id   uuid references poses(id) on delete cascade,
  relationship relationship_type not null,
  explanation  text,
  created_at   timestamptz default now(),
  unique (from_pose_id, to_pose_id, relationship)
);

-- =====================
-- POSES (10 poses)
-- =====================

insert into poses (slug, name, sanskrit, body_areas, flags) values
  ('pigeon-pose',        'Pigeon Pose',             'Eka Pada Rajakapotasana',  array['hip flexors','piriformis','IT band','glutes'],          array['knee caution','hip replacement']),
  ('lizard-pose',        'Lizard Pose',              'Utthan Pristhasana',       array['hip flexors','groin','inner thigh'],                    array[]::text[]),
  ('supine-figure-four', 'Figure Four (Supine)',     'Supta Kapotasana',         array['piriformis','glutes','external rotators'],              array[]::text[]),
  ('low-lunge',          'Low Lunge',                'Anjaneyasana',             array['hip flexors','quadriceps','psoas'],                     array[]::text[]),
  ('dragon-pose',        'Dragon Pose',              'Dragon (Yin)',             array['hip flexors','groin','quadriceps'],                     array['knee caution']),
  ('supported-pigeon',   'Supported Pigeon',         'Supported Kapotasana',    array['piriformis','glutes','external rotators'],              array['knee caution','hip replacement']),
  ('shoelace-pose',      'Shoelace / Cow Face Legs', 'Gomukhasana legs',        array['glutes','IT band','external rotators','piriformis'],    array['knee caution']),
  ('king-pigeon',        'King Pigeon',              'Rajakapotasana II',        array['hip flexors','quadriceps','spine','shoulders'],         array['knee caution','lower back','wrist']),
  ('compass-pose',       'Compass Pose',             'Surya Yantrasana',        array['hamstrings','IT band','side body','hip flexors'],       array['hamstring injury']),
  ('standing-figure-four', 'Thread the Needle',     'Eka Pada Utkatasana',     array['glutes','piriformis','external rotators','balance'],    array['knee caution','balance issues']);

-- =====================
-- RELATIONSHIPS (9 edges from Pigeon Pose)
-- =====================

insert into pose_relationships (from_pose_id, to_pose_id, relationship, explanation)
select
  f.id,
  t.id,
  r.relationship::relationship_type,
  r.explanation
from (values
  ('pigeon-pose', 'lizard-pose',          'prepares',     'Lizard opens the hip flexors and groin before asking them to externally rotate in Pigeon. The hip flexor in the back leg is often the hidden barrier in Pigeon — address it first here.'),
  ('pigeon-pose', 'supine-figure-four',   'prepares',     'Figure Four targets the same external rotation as Pigeon but with the spine fully supported. Use it to introduce the hip pattern before asking the body to hold it against gravity.'),
  ('pigeon-pose', 'low-lunge',            'prepares',     'Low Lunge addresses the hip flexor tightness in the back leg that limits depth in Pigeon. Spend time here if your back hip is pulling you out of alignment.'),
  ('pigeon-pose', 'dragon-pose',          'complements',  'Dragon works the same hip flexor tissue as Pigeon but from a yin angle — sustained, passive, with a different compression pattern. Together they cover the full hip complex.'),
  ('pigeon-pose', 'supported-pigeon',     'complements',  'Supported Pigeon offers the same external rotation with less compression at the front of the hip. Use it when Pigeon feels too intense or on recovery days.'),
  ('pigeon-pose', 'shoelace-pose',        'complements',  'Shoelace targets the lateral hip and glutes — the structures that Pigeon misses. Together they cover the full circumference of the hip joint.'),
  ('pigeon-pose', 'king-pigeon',          'unlocks',      'King Pigeon adds a full backbend on top of the external rotation you built in Pigeon. Do not rush this progression — the spine and hip flexors both need preparation.'),
  ('pigeon-pose', 'compass-pose',         'unlocks',      'Compass requires the hamstring length that consistent Pigeon practice builds. The external rotation pattern also transfers directly into setting up the bind.'),
  ('pigeon-pose', 'standing-figure-four', 'unlocks',      'Standing Figure Four takes the hip opening from the floor into balance. The external rotation is identical — Pigeon teaches the shape, this pose asks you to hold it upright.')
) as r(from_slug, to_slug, relationship, explanation)
join poses f on f.slug = r.from_slug
join poses t on t.slug = r.to_slug;
