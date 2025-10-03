import { supabase } from '../config/supabase.js';

export const getAllAudits = async (req, res) => {
  try {
    const { status, assigned_to } = req.query;
    const userId = req.user?.user_id || req.user?.id;

    let query = supabase
      .from('audits')
      .select('*, templates(name, category), users(name, email)')
      .eq('assigned_to', assigned_to || userId);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ audits: data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch audits', details: error.message });
  }
};

export const getAuditById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('audits')
      .select('*, templates(*), users(name, email)')
      .eq('audit_id', id)
      .maybeSingle();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    if (!data) {
      return res.status(404).json({ error: 'Audit not found' });
    }

    res.json({ audit: data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch audit', details: error.message });
  }
};

export const createAudit = async (req, res) => {
  try {
    const { template_id, assigned_to, location } = req.body;
    const userId = req.user?.user_id || req.user?.id;

    const { data, error } = await supabase
      .from('audits')
      .insert([{
        template_id,
        assigned_to: assigned_to || userId,
        location: location || {},
        status: 'Pending'
      }])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ audit: data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create audit', details: error.message });
  }
};

export const updateAudit = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from('audits')
      .update(updates)
      .eq('audit_id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ audit: data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update audit', details: error.message });
  }
};

export const submitAudit = async (req, res) => {
  try {
    const { id } = req.params;
    const { responses } = req.body;

    const { data: audit, error: auditError } = await supabase
      .from('audits')
      .select('*, templates(*)')
      .eq('audit_id', id)
      .maybeSingle();

    if (auditError || !audit) {
      return res.status(404).json({ error: 'Audit not found' });
    }

    const score = calculateScore(responses, audit.templates.sections, audit.templates.scoring_rules);

    const { data, error } = await supabase
      .from('audits')
      .update({
        responses,
        score,
        status: 'Completed',
        submitted_at: new Date().toISOString()
      })
      .eq('audit_id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ audit: data, message: 'Audit submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit audit', details: error.message });
  }
};

const calculateScore = (responses, sections, scoringRules) => {
  if (!scoringRules || !scoringRules.weights) {
    return null;
  }

  let totalScore = 0;
  const sectionScores = {};

  sections.forEach(section => {
    const sectionId = section.section_id || section.id;
    const sectionResponses = responses[sectionId] || {};
    const questions = section.questions || [];

    let sectionPoints = 0;
    let maxPoints = 0;

    questions.forEach(question => {
      const answer = sectionResponses[question.question_id];
      maxPoints += 10;

      if (answer) {
        if (question.type === 'single_choice' || question.type === 'multiple_choice') {
          sectionPoints += 10;
        } else if (answer !== '') {
          sectionPoints += 10;
        }
      }
    });

    const sectionWeight = scoringRules.weights[sectionId] || 0;
    const sectionScore = maxPoints > 0 ? (sectionPoints / maxPoints) * sectionWeight : 0;
    sectionScores[sectionId] = sectionScore;
    totalScore += sectionScore;
  });

  return parseFloat(totalScore.toFixed(2));
};

export const deleteAudit = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('audits')
      .delete()
      .eq('audit_id', id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Audit deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete audit', details: error.message });
  }
};
