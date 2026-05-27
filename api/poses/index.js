const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { data, error } = await supabase
    .from('poses')
    .select('id, slug, name, sanskrit, body_areas, flags, image_url')
    .order('name');

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};
