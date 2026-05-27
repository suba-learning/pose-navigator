const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { id } = req.query;

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
};
