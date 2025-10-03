# Setup Guide - Retail Execution Audit System

This guide will help you set up the complete Retail Execution Audit System.

## Quick Start

### 1. Database Setup (Supabase)

The database will need to be configured when Supabase is available. The schema includes:

**Tables to be created:**
- `users` - User accounts and authentication
- `templates` - Audit templates with JSONB configuration
- `sections` - Template sections and questions
- `audits` - Audit instances with responses
- `reports` - Generated reports

**Security:**
- Row Level Security (RLS) enabled on all tables
- Role-based access policies
- Authenticated-only access

### 2. Environment Configuration

Create a `.env` file in the project root:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Backend Configuration
JWT_SECRET=your_secure_random_string
PORT=3001
CLIENT_URL=http://localhost:5173
```

**Getting Supabase Credentials:**
1. Go to your Supabase project dashboard
2. Navigate to Settings → API
3. Copy the Project URL and anon/public key
4. Paste them into your `.env` file

### 3. Install Dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd server
npm install
cd ..
```

### 4. Run the Application

**Terminal 1 - Backend Server:**
```bash
cd server
npm run dev
```
The API will be available at http://localhost:3001

**Terminal 2 - Frontend:**
```bash
npm run dev
```
The web app will be available at http://localhost:5173

## Database Migration Script

When Supabase is available, run this SQL migration:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(50) NOT NULL CHECK (role IN ('Admin', 'Auditor', 'Supervisor')),
  assigned_regions JSONB DEFAULT '[]'::jsonb,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMPTZ
);

-- Templates Table
CREATE TABLE IF NOT EXISTS templates (
  template_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  sections JSONB DEFAULT '[]'::jsonb,
  scoring_rules JSONB DEFAULT '{}'::jsonb,
  created_by UUID REFERENCES users(user_id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  is_published BOOLEAN DEFAULT FALSE
);

-- Sections Table
CREATE TABLE IF NOT EXISTS sections (
  section_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_id UUID REFERENCES templates(template_id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  questions JSONB DEFAULT '[]'::jsonb
);

-- Audits Table
CREATE TABLE IF NOT EXISTS audits (
  audit_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_id UUID REFERENCES templates(template_id) ON DELETE SET NULL,
  status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Completed')),
  assigned_to UUID REFERENCES users(user_id) ON DELETE SET NULL,
  location JSONB DEFAULT '{}'::jsonb,
  responses JSONB DEFAULT '{}'::jsonb,
  score NUMERIC(5,2),
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Reports Table
CREATE TABLE IF NOT EXISTS reports (
  report_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  audit_id UUID REFERENCES audits(audit_id) ON DELETE CASCADE,
  generated_by UUID REFERENCES users(user_id) ON DELETE SET NULL,
  data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_templates_published ON templates(is_published);
CREATE INDEX IF NOT EXISTS idx_audits_assigned_to ON audits(assigned_to);
CREATE INDEX IF NOT EXISTS idx_audits_status ON audits(assigned_to, status);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON users FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view published templates" ON templates FOR SELECT TO authenticated USING (is_published = TRUE OR created_by = auth.uid());
CREATE POLICY "Users can create templates" ON templates FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
CREATE POLICY "Users can update own templates" ON templates FOR UPDATE TO authenticated USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can view own audits" ON audits FOR SELECT TO authenticated USING (assigned_to = auth.uid());
CREATE POLICY "Users can create audits" ON audits FOR INSERT TO authenticated WITH CHECK (assigned_to = auth.uid());
CREATE POLICY "Users can update own audits" ON audits FOR UPDATE TO authenticated USING (assigned_to = auth.uid()) WITH CHECK (assigned_to = auth.uid());
```

## Testing the Application

### 1. Register a New User
1. Navigate to http://localhost:5173
2. Click "Sign up"
3. Fill in the registration form
4. Choose a role (Admin, Auditor, Supervisor)

### 2. Login
1. Enter your email and password
2. You'll be redirected to the dashboard

### 3. Create a Template
1. From the dashboard, click "Create Template"
2. Follow the 5-step wizard:
   - Step 1: Enter template name, description, and category
   - Step 2: Add sections to organize your audit
   - Step 3: Add questions to each section
   - Step 4: Configure conditional logic (optional)
   - Step 5: Set up scoring and publish

### 4. Execute an Audit
1. Navigate to "Audits" from the dashboard
2. Click "Start" on a pending audit
3. Answer all questions
4. Upload photos/evidence if required
5. Submit the audit

### 5. View Reports
1. Go to the dashboard to see audit statistics
2. View completed audits with scores
3. Filter audits by status

## Production Deployment

### Build the Frontend
```bash
npm run build
```
This creates a `dist/` folder with optimized static files.

### Deploy Options

**Frontend (Static Hosting):**
- Vercel
- Netlify
- AWS S3 + CloudFront
- Azure Static Web Apps

**Backend:**
- Heroku
- AWS EC2/ECS
- Google Cloud Run
- Digital Ocean

**Database:**
- Supabase (recommended)
- Self-hosted PostgreSQL

## Troubleshooting

### Issue: "Missing Supabase environment variables"
**Solution:** Ensure `.env` file exists with correct Supabase credentials.

### Issue: Backend not connecting to database
**Solution:** Verify Supabase URL and keys are correct. Check network connectivity.

### Issue: Authentication not working
**Solution:** Ensure Supabase Auth is enabled in your project settings.

### Issue: CORS errors
**Solution:** Check that CLIENT_URL in backend matches your frontend URL.

## Next Steps

After basic setup:

1. **Customize the UI**: Modify Tailwind classes and components
2. **Add More Question Types**: Extend the template wizard
3. **Implement Offline Mode**: Add service workers for PWA
4. **Build Mobile App**: Use React Native (coming soon)
5. **Add Analytics**: Integrate reporting dashboards
6. **Set Up CI/CD**: Automate testing and deployment

## Support

For issues or questions:
1. Check the README.md file
2. Review the database schema documentation
3. Consult the API endpoint documentation

## Architecture Overview

```
┌─────────────────┐
│   React Frontend│
│  (Vite + TS)   │
└────────┬────────┘
         │
         │ HTTP/REST
         │
┌────────▼────────┐
│  Express.js API │
│   (Node.js)     │
└────────┬────────┘
         │
         │ Supabase Client
         │
┌────────▼────────┐
│   Supabase      │
│  PostgreSQL DB  │
│  + Auth + RLS   │
└─────────────────┘
```

The system uses:
- **Supabase Auth** for user authentication
- **PostgreSQL with JSONB** for flexible template storage
- **Row Level Security** for data protection
- **REST API** for frontend-backend communication
