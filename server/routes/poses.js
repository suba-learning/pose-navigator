const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// GET /api/poses — all poses for the home grid
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('poses')
    .select('id, slug, name, sanskrit, body_areas, flags, image_url')
    .order('name');

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET /api/poses/:id — one pose with related poses grouped by relationship type
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const [poseResult, edgesResult] = await Promise.all([
    supabase
      .from('poses')
      .select('id, slug, name, sanskrit, body_areas, flags, image_url')
      .eq('id', id)
      .single(),
    supabase
      .from('pose_relationships')
      .select(`
        relationship,
        explanation,
        to_pose:to_pose_id ( id, name, sanskrit, body_areas, image_url )
      `)
      .eq('from_pose_id', id),
  ]);

  if (poseResult.error) return res.status(404).json({ error: 'Pose not found' });

  const related = (edgesResult.data || []).reduce(
    (acc, edge) => {
      acc[edge.relationship].push({
        ...edge.to_pose,
        explanation: edge.explanation,
      });
      return acc;
    },
    { prepares: [], complements: [], unlocks: [] }
  );

  res.json({ ...poseResult.data, related });
});

module.exports = router;
