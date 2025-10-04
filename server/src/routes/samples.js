import express from 'express';

const router = express.Router();

router.get('/retail-execution', (req, res) => {
  const sampleTemplate = {
    name: 'Retail Execution Audit',
    description: 'Comprehensive retail audit for availability, visibility, pricing, and compliance',
    category: 'Merchandising',
    sections: [
      {
        section_id: 'availability',
        title: 'Product Availability',
        description: 'Check product availability and stock levels',
        order: 1,
        questions: [
          {
            question_id: 'q1',
            text: 'Is our product available on the shelf?',
            type: 'yes_no',
            mandatory: true
          },
          {
            question_id: 'q2',
            text: 'Why is the product unavailable?',
            type: 'single_choice',
            options: ['Out of stock', 'Not ordered', 'Delisted', 'Other'],
            mandatory: true
          },
          {
            question_id: 'q3',
            text: 'Estimate the stock quantity on display.',
            type: 'numeric_input',
            mandatory: true,
            validation: { min: 0, max: 1000 }
          },
          {
            question_id: 'q4',
            text: 'Did you inform store staff to replenish?',
            type: 'yes_no',
            mandatory: true
          }
        ]
      },
      {
        section_id: 'visibility',
        title: 'Shelf Visibility & Placement',
        description: 'Evaluate product placement and visibility',
        order: 2,
        questions: [
          {
            question_id: 'q5',
            text: 'Is the product placed at eye level or in a prime location?',
            type: 'single_choice',
            options: ['Eye level', 'Mid-shelf', 'Bottom shelf', 'Top shelf'],
            mandatory: true
          },
          {
            question_id: 'q6',
            text: 'Can the product be moved to a better shelf?',
            type: 'yes_no',
            mandatory: true
          },
          {
            question_id: 'q7',
            text: 'How many facings does our product have?',
            type: 'numeric_input',
            mandatory: true,
            validation: { min: 0, max: 50 }
          },
          {
            question_id: 'q8',
            text: 'Upload a photo of the product shelf.',
            type: 'image_upload',
            mandatory: true
          }
        ]
      },
      {
        section_id: 'branding',
        title: 'Branding & Compliance',
        description: 'Check POSM and branding materials',
        order: 3,
        questions: [
          {
            question_id: 'q9',
            text: 'Is our POSM (posters, wobblers, shelf strips) properly placed and visible?',
            type: 'yes_no',
            mandatory: true
          },
          {
            question_id: 'q10',
            text: 'Which POSM materials are missing?',
            type: 'multiple_choice',
            options: ['Posters', 'Wobblers', 'Shelf strips', 'Standees', 'Danglers'],
            mandatory: false
          }
        ]
      },
      {
        section_id: 'pricing',
        title: 'Pricing Compliance',
        description: 'Verify pricing accuracy',
        order: 4,
        questions: [
          {
            question_id: 'q11',
            text: 'Is the product being sold at the correct MRP?',
            type: 'single_choice',
            options: ['Yes', 'Higher than MRP', 'Lower than MRP'],
            mandatory: true
          },
          {
            question_id: 'q12',
            text: 'What is the actual selling price?',
            type: 'numeric_input',
            mandatory: false,
            validation: { min: 0 }
          }
        ]
      },
      {
        section_id: 'competitor',
        title: 'Competitor Analysis',
        description: 'Track competitor presence',
        order: 5,
        questions: [
          {
            question_id: 'q13',
            text: 'Which competitor products are present next to ours?',
            type: 'multiple_choice',
            options: ['Brand A', 'Brand B', 'Brand C', 'Brand D', 'None'],
            mandatory: true
          }
        ]
      },
      {
        section_id: 'store_quality',
        title: 'Store Quality',
        description: 'Assess store conditions',
        order: 6,
        questions: [
          {
            question_id: 'q14',
            text: 'Rate the overall cleanliness of the outlet.',
            type: 'rating_scale',
            mandatory: true,
            validation: { min: 1, max: 5 }
          },
          {
            question_id: 'q15',
            text: 'Was store staff aware of current promotions?',
            type: 'yes_no',
            mandatory: true
          }
        ]
      }
    ],
    conditional_logic: [
      {
        rule_id: 'r1',
        source_question_id: 'q1',
        condition_type: 'equals',
        condition_value: 'No',
        action: 'show',
        target_question_ids: ['q2']
      },
      {
        rule_id: 'r2',
        source_question_id: 'q1',
        condition_type: 'equals',
        condition_value: 'Yes',
        action: 'hide',
        target_question_ids: ['q2']
      },
      {
        rule_id: 'r3',
        source_question_id: 'q3',
        condition_type: 'less_than',
        condition_value: 5,
        action: 'show',
        target_question_ids: ['q4']
      },
      {
        rule_id: 'r4',
        source_question_id: 'q3',
        condition_type: 'greater_than',
        condition_value: 5,
        action: 'hide',
        target_question_ids: ['q4']
      },
      {
        rule_id: 'r5',
        source_question_id: 'q5',
        condition_type: 'equals',
        condition_value: 'Bottom shelf',
        action: 'show',
        target_question_ids: ['q6']
      },
      {
        rule_id: 'r6',
        source_question_id: 'q5',
        condition_type: 'not_equals',
        condition_value: 'Bottom shelf',
        action: 'hide',
        target_question_ids: ['q6']
      },
      {
        rule_id: 'r7',
        source_question_id: 'q9',
        condition_type: 'equals',
        condition_value: 'No',
        action: 'show',
        target_question_ids: ['q10']
      },
      {
        rule_id: 'r8',
        source_question_id: 'q9',
        condition_type: 'equals',
        condition_value: 'Yes',
        action: 'hide',
        target_question_ids: ['q10']
      },
      {
        rule_id: 'r9',
        source_question_id: 'q11',
        condition_type: 'not_equals',
        condition_value: 'Yes',
        action: 'show',
        target_question_ids: ['q12']
      },
      {
        rule_id: 'r10',
        source_question_id: 'q11',
        condition_type: 'equals',
        condition_value: 'Yes',
        action: 'hide',
        target_question_ids: ['q12']
      }
    ],
    scoring_rules: {
      enabled: true,
      threshold: 75,
      critical_questions: ['q1', 'q9', 'q11']
    },
    is_published: false
  };

  res.json({ template: sampleTemplate });
});

export default router;
