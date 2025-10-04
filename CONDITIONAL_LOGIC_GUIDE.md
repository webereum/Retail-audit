# Conditional Logic Implementation Guide

## Overview
This retail audit application now supports intelligent conditional logic for survey questions, allowing dynamic show/hide behavior based on user responses.

## Features Implemented

### 1. Backend Enhancements
- **New Question Types Added:**
  - `yes_no` - Simple Yes/No questions with visual green/red buttons
  - `rating_scale` - Star ratings (1-5 scale by default, configurable up to 10)
  - `image_upload` - Photo capture capability

- **Conditional Logic Model:**
  ```javascript
  {
    rule_id: String,
    source_question_id: String,
    condition_type: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than',
    condition_value: Mixed,
    action: 'show' | 'hide' | 'require',
    target_question_ids: [String]
  }
  ```

### 2. Sample Template Endpoint
- **GET** `/api/samples/retail-execution`
- Returns a complete retail execution audit template with:
  - 15 questions across 6 sections
  - 10 pre-configured conditional logic rules
  - Examples of all question types

### 3. Admin Panel - Conditional Logic Builder

**Location:** Step 4 of template creation wizard

**Features:**
- Visual rule builder with drag-and-drop interface
- Smart condition suggestions based on question type
- Real-time preview of active rules
- "Load Sample" button to import retail execution template
- Rule summary display showing all logic in plain English

**Example Rules:**
- IF "Product available?" = "No" THEN show "Why unavailable?"
- IF "Stock quantity" < 5 THEN show "Did you inform staff?"
- IF "Product placement" = "Bottom shelf" THEN show "Can it be moved?"

### 4. Mobile App Updates

**Conditional Logic Engine:**
- Real-time evaluation of conditions as user answers
- Dynamic show/hide of questions
- Validation only applies to visible questions
- Visual indicator when smart logic is active

**New Question Components:**
- `YesNoComponent` - Large green/red buttons
- `RatingScaleComponent` - Numbered rating buttons (1-5 scale)
- `ImageUploadComponent` - Camera placeholder for photo capture

### 5. Beautiful Audit Detail View

**Features:**
- Gradient header with status badges
- Color-coded responses:
  - Yes/No: Green checkmark / Red X with background
  - Ratings: Amber star buttons showing selected rating
  - Multiple choice: Dark pills for each selection
  - Single choice: Dark button for selection
- Section-based organization
- Question type indicators
- Conditional logic badge showing if smart questions were used

## How to Use

### Creating a Template with Conditional Logic

1. **Navigate to Templates → Create New Template**
2. **Step 1:** Enter template name and description
3. **Step 2:** Add sections (e.g., Availability, Pricing, etc.)
4. **Step 3:** Add questions with new types:
   - Select "Yes/No" for binary questions
   - Select "Rating Scale" for satisfaction/quality ratings
5. **Step 4:** Configure conditional logic:
   - Click "Add Conditional Rule"
   - Select source question
   - Choose condition (equals, not equals, etc.)
   - Enter condition value
   - Select action (show/hide)
   - Check target questions to control
6. **Step 5:** Configure scoring and publish

### Loading Sample Template

Click the **"Load Sample"** button on Step 4 to instantly import a complete retail execution template with:
- Product availability tracking
- Shelf visibility assessment
- POSM compliance checks
- Pricing verification
- Competitor analysis
- Store quality ratings

### Mobile App Usage

1. Field users receive the template on their mobile device
2. Badge indicates "⚡ Smart Questions Enabled"
3. Answer questions normally
4. Questions automatically show/hide based on responses
5. Submit when complete

### Viewing Audit Results

1. **Navigate to Audits**
2. Click on any completed audit
3. View beautiful formatted responses with:
   - Color-coded answers
   - Visual indicators for each question type
   - Section organization
   - Score display (if enabled)

## Question Type Reference

| Type | Mobile Display | Admin Display |
|------|----------------|---------------|
| yes_no | Green/Red buttons | Green ✓ / Red ✗ badges |
| rating_scale | Numbered buttons (1-5) | Amber star scale |
| single_choice | Radio-style buttons | Dark pill badge |
| multiple_choice | Checkbox-style buttons | Multiple dark pills |
| numeric_input | Number keyboard | Large bold number |
| text_input | Text area | Plain text |
| image_upload | Camera button | 📷 indicator |

## Conditional Logic Examples

### Example 1: Product Availability
```
IF "Is our product available on the shelf?" = "No"
THEN show "Why is the product unavailable?"
```

### Example 2: Low Stock Alert
```
IF "Estimate the stock quantity on display" < 5
THEN show "Did you inform store staff to replenish?"
```

### Example 3: Shelf Position
```
IF "Product placement" = "Bottom shelf"
THEN show "Can the product be moved to a better shelf?"
```

### Example 4: POSM Compliance
```
IF "Is our POSM properly placed?" = "No"
THEN show "Which POSM materials are missing?"
```

### Example 5: Pricing Issues
```
IF "Is product sold at correct MRP?" ≠ "Yes"
THEN show "What is the actual selling price?"
```

## API Integration

### Get Sample Template
```javascript
const response = await fetch('http://localhost:3001/api/samples/retail-execution');
const { template } = await response.json();
```

### Submit Audit with Responses
```javascript
await axios.post(`${API_URL}/audits/${auditId}/submit`, {
  responses: {
    section_id: {
      question_id: answer
    }
  }
});
```

## Technical Notes

- Conditional logic evaluates in real-time using React `useMemo`
- All questions are visible by default
- Rules can show or hide multiple questions simultaneously
- Questions hidden by rules are excluded from validation
- The logic engine supports AND/OR operators through multiple rules
- Question visibility state persists across re-renders

## Future Enhancements

- Skip-to-section logic
- Complex rule combinations (AND/OR groups)
- Time-based conditional questions
- GPS-based conditional questions
- Photo evidence requirement based on responses
- Auto-scoring adjustments based on conditional paths
