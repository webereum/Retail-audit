# API Documentation - Retail Execution Audit System

Base URL: `http://localhost:3001/api` (development)
Production: `https://your-api-domain.com/api`

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe",
  "role": "Auditor"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "session": {
    "access_token": "jwt-token",
    "refresh_token": "refresh-token"
  },
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```

### Logout
```http
POST /auth/logout
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Logout successful"
}
```

### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "user_metadata": {
      "name": "John Doe",
      "role": "Auditor"
    }
  }
}
```

## Templates

### Get All Templates
```http
GET /templates?category=Merchandising&published=true
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "templates": [
    {
      "template_id": "uuid",
      "name": "Shelf Compliance Audit",
      "description": "Check shelf organization",
      "category": "Merchandising",
      "is_published": true,
      "created_at": "2025-10-03T10:00:00Z",
      "sections": [],
      "scoring_rules": {}
    }
  ]
}
```

### Get Template by ID
```http
GET /templates/{id}
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "template": {
    "template_id": "uuid",
    "name": "Shelf Compliance Audit",
    "description": "Check shelf organization",
    "category": "Merchandising",
    "sections": [
      {
        "section_id": "uuid",
        "title": "Product Placement",
        "description": "Verify product positioning",
        "order": 1,
        "questions": [
          {
            "question_id": "q1",
            "text": "Is shelf organized per planogram?",
            "type": "single_choice",
            "options": ["Yes", "No"],
            "mandatory": true
          }
        ]
      }
    ],
    "scoring_rules": {
      "weights": {
        "section_1": 50,
        "section_2": 50
      },
      "threshold": 80,
      "critical_questions": ["q1"]
    },
    "is_published": true
  }
}
```

### Create Template
```http
POST /templates
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Audit Template",
  "description": "Description of the template",
  "category": "Stock",
  "sections": [
    {
      "title": "Section 1",
      "description": "First section",
      "order": 1,
      "questions": [
        {
          "question_id": "q1",
          "text": "Question text",
          "type": "text_input",
          "mandatory": true
        }
      ]
    }
  ],
  "scoring_rules": {
    "weights": {},
    "threshold": 75
  }
}
```

**Response (201):**
```json
{
  "template": {
    "template_id": "uuid",
    "name": "New Audit Template",
    "is_published": false,
    "created_at": "2025-10-03T10:00:00Z"
  }
}
```

### Update Template
```http
PUT /templates/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Template Name",
  "description": "Updated description"
}
```

**Response (200):**
```json
{
  "template": {
    "template_id": "uuid",
    "name": "Updated Template Name",
    "updated_at": "2025-10-03T11:00:00Z"
  }
}
```

### Publish Template
```http
PATCH /templates/{id}/publish
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "template": {
    "template_id": "uuid",
    "is_published": true
  },
  "message": "Template published successfully"
}
```

### Delete Template
```http
DELETE /templates/{id}
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Template deleted successfully"
}
```

## Audits

### Get All Audits
```http
GET /audits?status=Completed&assigned_to=uuid
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "audits": [
    {
      "audit_id": "uuid",
      "template_id": "uuid",
      "status": "Completed",
      "assigned_to": "user-uuid",
      "location": {
        "store_name": "Store #123",
        "address": "123 Main St",
        "coordinates": {
          "lat": 40.7128,
          "lng": -74.0060
        }
      },
      "responses": {
        "section_1": {
          "q1": "Yes",
          "q2": "file://path/to/photo.jpg"
        }
      },
      "score": 85.5,
      "submitted_at": "2025-10-03T12:00:00Z",
      "created_at": "2025-10-03T09:00:00Z",
      "templates": {
        "name": "Shelf Compliance Audit",
        "category": "Merchandising"
      }
    }
  ]
}
```

### Get Audit by ID
```http
GET /audits/{id}
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "audit": {
    "audit_id": "uuid",
    "template_id": "uuid",
    "status": "In Progress",
    "responses": {},
    "templates": {
      "name": "Shelf Compliance Audit",
      "sections": []
    }
  }
}
```

### Create Audit
```http
POST /audits
Authorization: Bearer <token>
Content-Type: application/json

{
  "template_id": "template-uuid",
  "assigned_to": "user-uuid",
  "location": {
    "store_name": "Store #456",
    "address": "456 Market St"
  }
}
```

**Response (201):**
```json
{
  "audit": {
    "audit_id": "uuid",
    "template_id": "template-uuid",
    "status": "Pending",
    "created_at": "2025-10-03T10:00:00Z"
  }
}
```

### Update Audit
```http
PUT /audits/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "In Progress",
  "responses": {
    "section_1": {
      "q1": "Yes"
    }
  }
}
```

**Response (200):**
```json
{
  "audit": {
    "audit_id": "uuid",
    "status": "In Progress",
    "responses": {
      "section_1": {
        "q1": "Yes"
      }
    }
  }
}
```

### Submit Audit
```http
POST /audits/{id}/submit
Authorization: Bearer <token>
Content-Type: application/json

{
  "responses": {
    "section_1": {
      "q1": "Yes",
      "q2": "file://path/to/photo.jpg"
    },
    "section_2": {
      "q3": "85",
      "q4": "Good condition"
    }
  }
}
```

**Response (200):**
```json
{
  "audit": {
    "audit_id": "uuid",
    "status": "Completed",
    "score": 92.5,
    "submitted_at": "2025-10-03T14:00:00Z"
  },
  "message": "Audit submitted successfully"
}
```

### Delete Audit
```http
DELETE /audits/{id}
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Audit deleted successfully"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid request data",
  "details": "Template name is required"
}
```

### 401 Unauthorized
```json
{
  "error": "Access token required"
}
```

### 403 Forbidden
```json
{
  "error": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Template not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "Database connection failed"
}
```

## Rate Limiting

- **Rate Limit:** 100 requests per 15 minutes per IP
- **Headers:**
  - `X-RateLimit-Limit`: Maximum requests
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset timestamp

## Question Types

### Text Input
```json
{
  "question_id": "q1",
  "text": "Enter notes",
  "type": "text_input",
  "mandatory": false
}
```

### Numeric Input
```json
{
  "question_id": "q2",
  "text": "Enter quantity",
  "type": "numeric_input",
  "validation": {
    "min": 0,
    "max": 1000
  },
  "mandatory": true
}
```

### Single Choice
```json
{
  "question_id": "q3",
  "text": "Select condition",
  "type": "single_choice",
  "options": ["Excellent", "Good", "Fair", "Poor"],
  "mandatory": true
}
```

### Multiple Choice
```json
{
  "question_id": "q4",
  "text": "Select all issues",
  "type": "multiple_choice",
  "options": ["Missing items", "Damaged", "Expired", "Misplaced"],
  "mandatory": false
}
```

### File Upload
```json
{
  "question_id": "q5",
  "text": "Upload photo",
  "type": "file_upload",
  "accept": ["image/jpeg", "image/png"],
  "mandatory": true
}
```

### Date/Time
```json
{
  "question_id": "q6",
  "text": "Select date",
  "type": "date_time",
  "mandatory": false
}
```

### Barcode Scanner
```json
{
  "question_id": "q7",
  "text": "Scan product barcode",
  "type": "barcode_scanner",
  "mandatory": true
}
```

## Scoring Calculation

The system calculates scores based on:

1. **Question Responses:** Each answered question earns points
2. **Section Weights:** Sections can have different importance
3. **Critical Questions:** Must be answered correctly
4. **Compliance Threshold:** Pass/fail criteria

**Example:**
```json
{
  "scoring_rules": {
    "weights": {
      "section_1": 60,
      "section_2": 40
    },
    "threshold": 80,
    "critical_questions": ["q1", "q5"]
  }
}
```

**Formula:**
```
Section Score = (Answered Questions / Total Questions) × Section Weight
Total Score = Sum of all Section Scores
Compliance = Total Score ≥ Threshold
```

## WebSocket Support (Future)

Real-time updates for:
- Audit status changes
- New audit assignments
- Score calculations
- Team notifications

```javascript
const ws = new WebSocket('wss://your-api-domain.com/ws');
ws.send(JSON.stringify({
  type: 'subscribe',
  channel: 'audits',
  user_id: 'uuid'
}));
```

## Postman Collection

Import this collection for easy testing:
```json
{
  "info": {
    "name": "Retail Audit API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": []
}
```
