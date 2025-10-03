# Retail Execution Audit System

A comprehensive web application for FMCG companies to create, execute, and monitor retail audits with dynamic templates, offline support, and real-time reporting.

## Features

### Template Management
- **5-Step Wizard**: Create audit templates with intuitive step-by-step guidance
- **Dynamic Sections**: Organize audits with customizable sections
- **8 Question Types**: Text, Numeric, Single/Multiple Choice, Dropdown, Date/Time, File Upload, Barcode Scanner
- **Conditional Logic**: Set up smart question flows based on responses
- **Scoring System**: Weighted scoring with compliance thresholds

### Audit Execution
- **Offline Support**: Complete audits without internet connection
- **Progress Saving**: Save and resume audits at any time
- **Media Capture**: Upload photos and files as evidence
- **Barcode Scanning**: Quick product validation

### Monitoring & Reporting
- **Real-time Dashboard**: Track completion rates and compliance scores
- **Advanced Filtering**: Filter by region, category, personnel
- **Exportable Reports**: Generate reports in PDF, Excel, CSV formats
- **Notifications**: Alerts for overdue audits and compliance failures

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Supabase** for authentication and database
- **Lucide React** for icons

### Backend
- **Express.js** REST API
- **Supabase** PostgreSQL database with JSONB support
- **JWT** authentication
- **CORS** enabled for frontend communication

## Project Structure

```
project/
├── src/                    # Frontend source code
│   ├── components/         # Reusable React components
│   ├── pages/             # Page components
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── TemplatesPage.tsx
│   │   ├── CreateTemplatePage.tsx
│   │   └── AuditsPage.tsx
│   ├── contexts/          # React contexts
│   │   └── AuthContext.tsx
│   ├── lib/               # Library configurations
│   │   └── supabase.ts
│   └── App.tsx            # Main app component
│
├── server/                # Backend API
│   └── src/
│       ├── routes/        # API routes
│       │   ├── auth.js
│       │   ├── templates.js
│       │   └── audits.js
│       ├── controllers/   # Request handlers
│       │   ├── authController.js
│       │   ├── templateController.js
│       │   └── auditController.js
│       ├── middleware/    # Express middleware
│       │   └── auth.js
│       ├── config/        # Configuration files
│       │   └── supabase.js
│       └── index.js       # Express server entry
│
└── README.md             # This file
```

## Database Schema

### Tables
- **users**: User accounts with roles (Admin, Auditor, Supervisor)
- **templates**: Audit templates with JSONB configuration
- **sections**: Reusable template sections
- **audits**: Audit instances with responses and scores
- **reports**: Generated audit reports

### Security
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Authenticated access required for all operations

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=your_jwt_secret
PORT=3001
CLIENT_URL=http://localhost:5173
```

### Installation

1. **Install frontend dependencies:**
```bash
npm install
```

2. **Install backend dependencies:**
```bash
cd server
npm install
cd ..
```

### Running the Application

1. **Start the backend server:**
```bash
cd server
npm run dev
```
Server will run on http://localhost:3001

2. **Start the frontend (in a new terminal):**
```bash
npm run dev
```
Frontend will run on http://localhost:5173

3. **Access the application:**
Open your browser and navigate to http://localhost:5173

### Building for Production

```bash
npm run build
```

Build output will be in the `dist/` directory.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Templates
- `GET /api/templates` - Get all templates
- `GET /api/templates/:id` - Get template by ID
- `POST /api/templates` - Create new template
- `PUT /api/templates/:id` - Update template
- `DELETE /api/templates/:id` - Delete template
- `PATCH /api/templates/:id/publish` - Publish template

### Audits
- `GET /api/audits` - Get all audits
- `GET /api/audits/:id` - Get audit by ID
- `POST /api/audits` - Create new audit
- `PUT /api/audits/:id` - Update audit
- `POST /api/audits/:id/submit` - Submit completed audit
- `DELETE /api/audits/:id` - Delete audit

## User Roles

- **Admin**: Full access to all features, can manage users and templates
- **Supervisor**: Can create templates and view team audits
- **Auditor**: Can execute assigned audits and view own data

## Future Enhancements

- React Native mobile app
- Advanced analytics and trend analysis
- Custom report builder
- Bulk audit assignment
- Integration with third-party systems
- Real-time collaboration features

## License

Proprietary - All rights reserved
