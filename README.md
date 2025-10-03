# Retail Execution Audit System

A comprehensive full-stack solution for FMCG companies to create, execute, and monitor retail audits dynamically with real-time data synchronization and mobile field execution.

## 🚀 Quick Start

```bash
# 1. Start MongoDB
brew services start mongodb-community  # macOS
# or: sudo systemctl start mongod      # Linux

# 2. Start Backend
cd server && npm install && npm run dev

# 3. Start Web App
npm install && npm run dev

# 4. Start Mobile App
cd mobile && npm install && npm start
```

See [QUICKSTART.md](QUICKSTART.md) for detailed 5-minute setup guide.

## 📋 Features

### ✅ Fully Implemented

- **5-Step Template Wizard** with sections and questions
- **8 Question Types**: Text, Numeric, Single/Multiple Choice, Dropdown, Date/Time, File Upload, Barcode
- **Weighted Scoring System** with compliance thresholds
- **MongoDB Backend** with RESTful API
- **React Native Mobile App** for field execution
- **Real-time Template Sync** from web to mobile
- **Dynamic Form Generation** on mobile
- **Audit Submission** with score calculation
- **Static Authentication** (login UI only)
- **Professional UI/UX** across all platforms

### 🔄 Architecture

```
Web App (React) ←→ Express API ←→ MongoDB
                        ↓
            Mobile App (React Native)
```

## 📱 Platforms

- **Web Application**: Create and manage templates, view audit results (React + TypeScript)
- **Mobile App**: Execute audits in the field (React Native + Expo)
- **Backend API**: RESTful API with MongoDB storage (Node.js + Express)

## 🛠️ Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for fast development and building
- Tailwind CSS for styling
- React Router for navigation
- Lucide React for icons

### Mobile
- React Native with Expo
- TypeScript for type safety
- React Navigation
- Axios for API calls

### Backend
- Node.js with Express
- MongoDB with Mongoose ODM
- REST API design
- CORS enabled

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [QUICKSTART.md](QUICKSTART.md) | Get started in 5 minutes |
| [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md) | Complete setup and usage guide |
| [SYSTEM_SUMMARY.md](SYSTEM_SUMMARY.md) | Technical overview and architecture |
| [API.md](API.md) | API endpoint documentation |
| [mobile/README.md](mobile/README.md) | Mobile app specific guide |

## 🎯 Usage Flow

1. **Create Template** (Web)
   - Open web app and login
   - Navigate to Templates → Create Template
   - Follow 5-step wizard to define sections, questions, and scoring
   - Publish template

2. **Execute Audit** (Mobile)
   - Open mobile app
   - Pull to refresh template list
   - Select published template
   - Fill out dynamic form
   - Submit audit

3. **View Results** (Web)
   - Navigate to Audits page
   - See submitted audits with scores
   - Filter by status and category

## 🗄️ Database Schema

### Templates Collection
Dynamic structure supporting any combination of sections and questions with flexible scoring rules.

```javascript
{
  name, description, category,
  sections: [{ title, questions: [...] }],
  scoring_rules: { enabled, weights, threshold },
  is_published, timestamps
}
```

### Audits Collection
Links to templates with flexible response storage and calculated scores.

```javascript
{
  template_id, status, location,
  responses: Map,
  score, submitted_at, timestamps
}
```

See [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md) for detailed schemas.

## 📊 Question Types

1. **Text Input** - Free-form text responses
2. **Numeric Input** - Numbers with min/max validation
3. **Single Choice** - Radio button selection
4. **Multiple Choice** - Checkbox selection
5. **Dropdown** - Select from list
6. **Date/Time** - Date picker
7. **File Upload** - Photo/document upload (UI ready)
8. **Barcode Scanner** - Product scanning (text input)

## 🔐 Authentication

Current implementation uses **static authentication** (any credentials work) for development purposes.

**For Production**: Implement JWT authentication, password hashing with bcrypt, and role-based access control.

## 🚢 Deployment

### Backend
- Deploy to Railway, Render, or Heroku
- Use MongoDB Atlas for cloud database
- Set environment variables

### Web App
```bash
npm run build
# Deploy dist/ to Netlify, Vercel, or any static hosting
```

### Mobile App
```bash
cd mobile
eas build --platform all
```

See [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md) for detailed deployment instructions.

## 📈 Scoring System

- Assign weights to sections (must total 100%)
- Questions scored based on completion
- **Formula**: `Final Score = Σ(section_score × section_weight)`
- Compliance determined by threshold (e.g., 80%)

**Example:**
- Section 1 (60%): 8/10 answered → 48 points
- Section 2 (40%): 10/10 answered → 40 points
- Total: 88% → ✅ Compliant (threshold: 80%)

## 📱 Mobile Configuration

Update API URL in mobile screens for your environment:
- **Android Emulator**: `http://10.0.2.2:3001/api`
- **iOS Simulator**: `http://localhost:3001/api`
- **Physical Device**: `http://your-computer-ip:3001/api`

## 🧪 Testing

```bash
# Build verification
npm run build

# TypeScript check
npm run typecheck

# Backend test
cd server && npm run dev
```

## Project Structure

```
project/
├── src/                          # Web application
│   ├── components/
│   │   ├── Layout.tsx
│   │   └── TemplateWizard/      # 5-step wizard components
│   ├── pages/                    # All page components
│   ├── contexts/                 # Auth context (static)
│   └── lib/
├── server/                       # Backend API
│   └── src/
│       ├── models/               # MongoDB models
│       ├── controllers/          # Request handlers
│       ├── routes/               # API routes
│       └── config/               # Database config
└── mobile/                       # React Native app
    ├── App.tsx
    └── src/screens/              # Mobile screens
```

## 🔮 Future Enhancements

- Real authentication with JWT
- Offline mode for mobile app
- File upload with camera integration
- Barcode scanner with device camera
- Reporting dashboard with analytics
- Data export (PDF, Excel, CSV)
- User management and roles
- Conditional logic execution
- Real-time notifications
- GPS location capture

## 🆘 Troubleshooting

**MongoDB not running?**
```bash
brew services start mongodb-community  # macOS
sudo systemctl start mongod           # Linux
```

**Port 3001 in use?**
```bash
lsof -ti:3001 | xargs kill -9  # macOS/Linux
```

**Mobile can't connect?**
- Verify backend is running
- Update API_URL to your computer's IP
- Check firewall settings

See [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md) for more troubleshooting.

## 📄 License

Proprietary - All rights reserved

---

**System Status**: ✅ Fully Functional
**Documentation**: 📚 Complete
**Production Ready**: 🔧 Needs security enhancements

Built with ❤️ for FMCG field operations
