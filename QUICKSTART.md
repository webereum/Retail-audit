# Quick Start Guide - Retail Audit System

## 🚀 Get Started in 5 Minutes

### Step 1: Install MongoDB

```bash
# macOS
brew install mongodb-community
brew services start mongodb-community

# Ubuntu
sudo apt-get install mongodb
sudo systemctl start mongod

# Windows - Download from: https://www.mongodb.com/try/download/community
```

### Step 2: Start Backend Server

```bash
cd server
npm install
npm run dev
```

✅ Backend running on http://localhost:3001

### Step 3: Start Web Application

```bash
# From project root
npm install
npm run dev
```

✅ Web app running on http://localhost:5173

### Step 4: Start Mobile App

```bash
cd mobile
npm install
npm start
```

✅ Scan QR code with Expo Go app or press 'a'/'i' for emulator

## 📱 Using the System

### Create a Template (Web):

1. Open http://localhost:5173
2. Login with any credentials (static auth)
3. Navigate to Templates → Create Template
4. Follow 5-step wizard:
   - Basic info
   - Add sections
   - Add questions
   - Configure logic (optional)
   - Enable scoring & publish

### Complete an Audit (Mobile):

1. Open mobile app
2. Select a published template
3. Answer all questions
4. Submit audit
5. View success confirmation

### View Results (Web):

1. Go to Audits page
2. See all submitted audits with scores
3. Filter by status

## 🔧 Common Issues

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
- Update API_URL in mobile screens to your computer's IP
- Android Emulator: use `10.0.2.2:3001`
- Physical device: use `192.168.x.x:3001`

## 📊 Default Configuration

- MongoDB: `mongodb://localhost:27017/retail-audit`
- Backend API: `http://localhost:3001`
- Web App: `http://localhost:5173`
- Static Login: Any credentials work

## 💡 Tips

- Templates must be published to appear in mobile app
- Pull to refresh in mobile app to sync latest templates
- Scoring is optional - toggle in Step 5 of wizard
- All data persists in MongoDB automatically

## 📚 Full Documentation

See `IMPLEMENTATION_GUIDE.md` for complete documentation.

---

**Need Help?** Check MongoDB connection, verify ports, and review console logs.
