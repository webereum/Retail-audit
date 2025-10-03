import { supabase } from '../config/supabase.js';

export const getAllTemplates = async (req, res) => {
  try {
    const { category, published } = req.query;

    let query = supabase
      .from('templates')
      .select('*');

    if (category) {
      query = query.eq('category', category);
    }

    if (published !== undefined) {
      query = query.eq('is_published', published === 'true');
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ templates: data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch templates', details: error.message });
  }
};

export const getTemplateById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('templates')
      .select('*, sections(*)')
      .eq('template_id', id)
      .maybeSingle();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    if (!data) {
      return res.status(404).json({ error: 'Template not found' });
    }

    res.json({ template: data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch template', details: error.message });
  }
};

export const createTemplate = async (req, res) => {
  try {
    const { name, description, category, sections, scoring_rules } = req.body;
    const userId = req.user?.user_id || req.user?.id;

    const { data, error } = await supabase
      .from('templates')
      .insert([{
        name,
        description,
        category,
        sections: sections || [],
        scoring_rules: scoring_rules || {},
        created_by: userId
      }])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ template: data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create template', details: error.message });
  }
};

export const updateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from('templates')
      .update(updates)
      .eq('template_id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ template: data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update template', details: error.message });
  }
};

export const deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('templates')
      .delete()
      .eq('template_id', id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Template deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete template', details: error.message });
  }
};

export const publishTemplate = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('templates')
      .update({ is_published: true })
      .eq('template_id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ template: data, message: 'Template published successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to publish template', details: error.message });
  }
};
