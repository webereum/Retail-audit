# Retail Execution Audit System - Implementation Guide

## Overview

This system includes:
- **Web Application**: React + TypeScript for template creation and management
- **Backend API**: Node.js + Express + MongoDB for data storage
- **Mobile App**: React Native (Expo) for field audit execution

## System Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│   Web App       │────────▶│  Express API     │────────▶│    MongoDB      │
│  (React/Vite)   │         │  (Node.js)       │         │   Database      │
└─────────────────┘         └──────────────────┘         └─────────────────┘
                                     ▲
                                     │
                            ┌────────┴────────┐
                            │   Mobile App    │
                            │  (React Native) │
                            └─────────────────┘
```

## Prerequisites

- Node.js 18+
- MongoDB 6+ (locally or cloud)
- npm or yarn
- Expo CLI (for mobile development)

## Setup Instructions

### 1. Install MongoDB

**Option A: Local Installation**
```bash
# macOS (using Homebrew)
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0

# Ubuntu/Debian
sudo apt-get install mongodb-org
sudo systemctl start mongod

# Windows
# Download from https://www.mongodb.com/try/download/community
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string
4. Update `.env` with: `MONGODB_URI=mongodb+srv://...`

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Start the backend server
npm run dev
```

Server will run on: http://localhost:3001

### 3. Web Application Setup

```bash
# From project root
npm install

# Build the application
npm run build

# Start development server (for testing)
npm run dev
```

Web app will run on: http://localhost:5173

### 4. Mobile App Setup

```bash
# Navigate to mobile directory
cd mobile

# Install dependencies
npm install

# Start Expo
npm start

# Options:
# - Press 'a' for Android emulator
# - Press 'i' for iOS simulator
# - Scan QR code with Expo Go app
```

## Configuration

### Environment Variables

Create/update `.env` in the project root:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/retail-audit

# Server Configuration
PORT=3001
CLIENT_URL=http://localhost:5173

# API URL for frontend
VITE_API_URL=http://localhost:3001/api
```

### Mobile App Configuration

Update API URL in mobile app files if needed:
- `mobile/src/screens/TemplateListScreen.tsx`
- `mobile/src/screens/AuditFormScreen.tsx`

Change `const API_URL = 'http://localhost:3001/api'` to your backend URL.

**For Android Emulator**: Use `http://10.0.2.2:3001/api`
**For iOS Simulator**: Use `http://localhost:3001/api`
**For Physical Device**: Use your computer's IP (e.g., `http://192.168.1.100:3001/api`)

## Usage Flow

### 1. Create Template (Web)

1. Navigate to http://localhost:5173
2. Click "Login" (static - any credentials work)
3. Go to "Templates" → "Create Template"
4. Follow the 5-step wizard:
   - **Step 1**: Template Setup (name, description, category)
   - **Step 2**: Define Sections (add logical groupings)
   - **Step 3**: Add Questions (8 types available)
   - **Step 4**: Configure Logic (optional)
   - **Step 5**: Scoring & Publish

### 2. Execute Audit (Mobile)

1. Open mobile app
2. Pull to refresh templates list
3. Select a published template
4. Fill out the audit form section by section
5. Submit the audit
6. Data is saved to MongoDB

### 3. View Results (Web)

1. Go to "Audits" in web dashboard
2. View submitted audits with scores
3. Filter by status (Pending/In Progress/Completed)

## Question Types

The system supports 8 question types:

1. **Text Input**: Free-form text responses
2. **Numeric Input**: Numbers with optional min/max validation
3. **Single Choice**: Radio button selection
4. **Multiple Choice**: Checkbox selections
5. **Dropdown**: Select from list
6. **Date/Time**: Date picker
7. **File Upload**: Photo/document upload
8. **Barcode Scanner**: Product barcode scanning

## Database Schema

### Templates Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  category: String,
  sections: [{
    section_id: String,
    title: String,
    description: String,
    order: Number,
    questions: [{
      question_id: String,
      text: String,
      type: String,
      options: [String],
      mandatory: Boolean,
      validation: Object
    }]
  }],
  scoring_rules: {
    enabled: Boolean,
    weights: Map,
    threshold: Number
  },
  is_published: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Audits Collection
```javascript
{
  _id: ObjectId,
  template_id: ObjectId (ref: Template),
  template_name: String,
  status: String,
  assigned_to: String,
  location: {
    store_name: String,
    address: String,
    coordinates: { latitude: Number, longitude: Number }
  },
  responses: Map,
  score: Number,
  submitted_at: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### Templates
- `GET /api/templates` - Get all templates
- `GET /api/templates/:id` - Get template by ID
- `POST /api/templates` - Create new template
- `PUT /api/templates/:id` - Update template
- `PATCH /api/templates/:id/publish` - Publish template
- `DELETE /api/templates/:id` - Delete template

### Audits
- `GET /api/audits` - Get all audits
- `GET /api/audits/:id` - Get audit by ID
- `POST /api/audits` - Create new audit
- `PUT /api/audits/:id` - Update audit
- `POST /api/audits/:id/submit` - Submit completed audit
- `DELETE /api/audits/:id` - Delete audit

## Scoring System

When scoring is enabled:

1. Each section is assigned a weight (total must equal 100%)
2. Questions are scored based on completion
3. Final score = Σ(section_score × section_weight)
4. Compliance threshold determines pass/fail

Example:
- Section 1 (50%): 8/10 questions answered = 40 points
- Section 2 (50%): 10/10 questions answered = 50 points
- Total Score: 90%
- Threshold: 80% → **Compliant**

## Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongosh

# Or
mongo
```

### Port Already in Use
```bash
# Kill process on port 3001
# macOS/Linux
lsof -ti:3001 | xargs kill -9

# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### Mobile App Can't Connect
1. Ensure backend is running
2. Check API_URL in mobile screens
3. Use correct IP for your setup:
   - Android Emulator: `10.0.2.2:3001`
   - iOS Simulator: `localhost:3001`
   - Physical Device: Your computer's local IP

### CORS Errors
The backend is configured to accept requests from `http://localhost:5173`. Update `CLIENT_URL` in `.env` if using a different port.

## Production Deployment

### Backend
- Deploy to services like Heroku, Railway, Render, or AWS
- Use MongoDB Atlas for cloud database
- Set environment variables on hosting platform

### Web App
- Build: `npm run build`
- Deploy `dist/` folder to Netlify, Vercel, or any static hosting
- Update `VITE_API_URL` to production API

### Mobile App
```bash
# Build for production
cd mobile
expo build:android
expo build:ios

# Or use EAS Build
eas build --platform all
```

## Features Implemented

✅ Full 5-step template creation wizard
✅ Section and question management with drag-and-drop
✅ 8 question types with validation
✅ Conditional logic framework
✅ Weighted scoring system with compliance threshold
✅ MongoDB data persistence
✅ RESTful API with Express
✅ React Native mobile app
✅ Template synchronization (web → mobile)
✅ Audit form submission
✅ Static authentication (login UI only)
✅ Responsive design

## Next Steps / Future Enhancements

- Implement real authentication (JWT tokens)
- Add offline mode for mobile app
- Implement file upload functionality
- Add barcode scanner integration
- Create reporting and analytics dashboard
- Add user management and roles
- Implement conditional logic execution
- Add data export (PDF, Excel, CSV)
- Real-time notifications
- Audit assignment workflow

## Support

For issues or questions:
1. Check MongoDB connection
2. Verify all services are running
3. Check browser console for errors
4. Review API responses in Network tab
5. Check server logs for backend errors

## License

Proprietary - All rights reserved
