# Deployment Guide - Retail Execution Audit System

## Pre-Deployment Checklist

- [ ] Supabase project created and configured
- [ ] Database schema migrated
- [ ] Environment variables set
- [ ] Frontend and backend dependencies installed
- [ ] Application tested locally

## Environment Variables

### Frontend (.env in root)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Backend (server/.env or environment)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
JWT_SECRET=your-secure-random-string-min-32-chars
PORT=3001
CLIENT_URL=https://your-frontend-domain.com
```

## Deployment Options

### Option 1: Vercel (Frontend) + Heroku (Backend)

#### Frontend on Vercel

1. **Connect Repository:**
   ```bash
   cd project
   vercel
   ```

2. **Configure Build Settings:**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Add Environment Variables:**
   - Go to Project Settings → Environment Variables
   - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

4. **Deploy:**
   ```bash
   vercel --prod
   ```

#### Backend on Heroku

1. **Create Heroku App:**
   ```bash
   cd server
   heroku create your-audit-api
   ```

2. **Set Environment Variables:**
   ```bash
   heroku config:set VITE_SUPABASE_URL=your-url
   heroku config:set VITE_SUPABASE_ANON_KEY=your-key
   heroku config:set JWT_SECRET=your-secret
   heroku config:set CLIENT_URL=https://your-vercel-app.vercel.app
   ```

3. **Create Procfile:**
   ```
   web: node src/index.js
   ```

4. **Deploy:**
   ```bash
   git init
   git add .
   git commit -m "Initial deployment"
   heroku git:remote -a your-audit-api
   git push heroku main
   ```

### Option 2: Netlify (Frontend) + Railway (Backend)

#### Frontend on Netlify

1. **Connect Repository:**
   - Go to Netlify Dashboard
   - Click "New site from Git"
   - Connect your repository

2. **Build Settings:**
   - Base directory: (leave empty)
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Environment Variables:**
   - Site settings → Build & deploy → Environment
   - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

#### Backend on Railway

1. **Create New Project:**
   - Go to Railway.app
   - Click "New Project"
   - Select "Deploy from GitHub repo"

2. **Configure:**
   - Root directory: `server`
   - Start command: `npm start`

3. **Environment Variables:**
   - Add all required variables in Railway dashboard

### Option 3: AWS (Complete Stack)

#### Frontend on S3 + CloudFront

1. **Build Application:**
   ```bash
   npm run build
   ```

2. **Create S3 Bucket:**
   ```bash
   aws s3 mb s3://retail-audit-app
   aws s3 sync dist/ s3://retail-audit-app
   ```

3. **Configure CloudFront:**
   - Create distribution pointing to S3 bucket
   - Set default root object to `index.html`
   - Add error page redirect to `index.html` (for SPA routing)

#### Backend on EC2/ECS

1. **Create EC2 Instance:**
   - Launch Ubuntu instance
   - Configure security group (allow port 3001)

2. **Deploy Application:**
   ```bash
   scp -r server/ user@ec2-instance:/home/user/
   ssh user@ec2-instance
   cd server
   npm install --production
   pm2 start src/index.js --name audit-api
   pm2 save
   pm2 startup
   ```

### Option 4: Digital Ocean (Complete Stack)

#### Frontend on App Platform

1. **Create App:**
   - Go to Digital Ocean → Apps
   - Create app from GitHub
   - Select Static Site

2. **Build Settings:**
   - Build command: `npm run build`
   - Output directory: `dist`

#### Backend on Droplet

1. **Create Droplet:**
   - Ubuntu 22.04 LTS
   - Choose appropriate size

2. **Setup:**
   ```bash
   # SSH into droplet
   apt update && apt upgrade
   apt install nodejs npm
   npm install -g pm2

   # Clone and setup
   git clone your-repo
   cd server
   npm install --production

   # Create .env file
   nano .env
   # Add environment variables

   # Start with PM2
   pm2 start src/index.js --name audit-api
   pm2 save
   pm2 startup
   ```

## Database Setup (Supabase)

### 1. Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Choose organization and project name
4. Wait for project creation

### 2. Run Migration

1. Go to SQL Editor in Supabase Dashboard
2. Copy the migration SQL from `SETUP.md`
3. Execute the script

### 3. Enable Authentication

1. Go to Authentication → Settings
2. Disable email confirmation (for development)
3. Configure any OAuth providers if needed

### 4. Get API Credentials

1. Go to Project Settings → API
2. Copy Project URL and anon public key
3. Add to your environment variables

## Post-Deployment Steps

### 1. Test Authentication

- Register a new user
- Login with credentials
- Verify JWT tokens are working

### 2. Test API Endpoints

```bash
# Health check
curl https://your-api-domain.com/api/health

# Test auth
curl -X POST https://your-api-domain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

### 3. Configure CORS

Ensure backend CORS is configured to accept requests from your frontend domain:

```javascript
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
```

### 4. Setup Monitoring

- **Sentry**: Error tracking
- **LogRocket**: Session replay
- **Datadog**: Performance monitoring

### 5. Configure CI/CD

**GitHub Actions Example:**

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Heroku
        run: git push heroku main
```

## SSL/HTTPS

All modern platforms (Vercel, Netlify, Heroku, Railway) provide automatic SSL certificates.

For custom domains:
1. Add custom domain in platform settings
2. Update DNS records as instructed
3. Wait for SSL certificate provisioning (usually automatic)

## Performance Optimization

### Frontend

1. **Enable Caching:**
   - Configure CDN caching headers
   - Use service workers for offline support

2. **Optimize Assets:**
   ```bash
   npm run build -- --minify
   ```

3. **Enable Compression:**
   - Gzip/Brotli compression (usually automatic on platforms)

### Backend

1. **Add Redis for Caching:**
   ```bash
   npm install redis
   ```

2. **Enable Request Rate Limiting:**
   ```bash
   npm install express-rate-limit
   ```

3. **Use PM2 Cluster Mode:**
   ```bash
   pm2 start src/index.js -i max
   ```

## Backup and Recovery

### Database Backups (Supabase)

- Automatic daily backups included
- Manual backups: Project Settings → Database → Backups

### Application Backups

1. **Version Control:**
   - Keep code in Git repository
   - Tag releases

2. **Environment Variables:**
   - Document all environment variables
   - Use secret management tools

## Monitoring and Maintenance

### Health Checks

Set up monitoring for:
- `/api/health` endpoint
- Database connectivity
- Authentication service
- Frontend availability

### Logging

- Backend: Use Winston or Pino
- Frontend: Use Sentry or LogRocket
- Database: Enable Supabase query logs

### Updates

```bash
# Update dependencies
npm update

# Security audit
npm audit fix

# Rebuild and deploy
npm run build
```

## Rollback Strategy

1. **Frontend:**
   - Vercel/Netlify: Use deployment history to rollback
   - S3: Keep previous builds in separate folders

2. **Backend:**
   - Heroku: `heroku releases:rollback`
   - PM2: Keep previous versions and switch

3. **Database:**
   - Use Supabase point-in-time recovery
   - Restore from backup

## Support and Troubleshooting

### Common Issues

**Issue: CORS errors in production**
- Solution: Check CLIENT_URL environment variable matches frontend domain

**Issue: Database connection fails**
- Solution: Verify Supabase credentials and project is active

**Issue: Authentication not working**
- Solution: Check JWT_SECRET is set and Auth is enabled in Supabase

**Issue: Build fails**
- Solution: Check Node.js version matches local environment

## Security Checklist

- [ ] All environment variables are secrets (not committed to git)
- [ ] HTTPS enabled on all domains
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] SQL injection protection (using Supabase client)
- [ ] XSS protection (React default)
- [ ] CSP headers configured
- [ ] Regular security audits (`npm audit`)

## Scaling Considerations

### Horizontal Scaling

- Use load balancers
- Multiple backend instances
- Database connection pooling

### Vertical Scaling

- Upgrade server resources
- Optimize database queries
- Implement caching layer

## Costs Estimate (Monthly)

### Small Scale (< 1000 users)
- Supabase: Free tier
- Vercel: Free tier
- Heroku/Railway: $7-25
- **Total: $0-25/month**

### Medium Scale (1000-10000 users)
- Supabase: $25
- Vercel: $20
- Railway/Heroku: $50
- **Total: $95/month**

### Large Scale (> 10000 users)
- Supabase: $100+
- AWS/DO: $200+
- CDN: $50+
- **Total: $350+/month**

## Next Steps After Deployment

1. **User Onboarding:** Create sample templates and tutorials
2. **Analytics:** Integrate Google Analytics or Mixpanel
3. **Feedback:** Add in-app feedback mechanism
4. **Documentation:** Create user guides and video tutorials
5. **Mobile App:** Begin React Native development
