# Migrate FlowBooks Associate from Replit to Railway

## Migration Overview

Moving your FlowBooks Associate application from Replit to Railway for production hosting with PostgreSQL database.

## Step 1: Push Code to GitHub

### Current Repository Status
- Repository: https://github.com/uzzielconceptm/FinMatchPro
- All Railway migration files are ready
- Database schema and authentication configured

### Push Latest Changes
```bash
# In your Replit terminal, commit the Railway setup
git add .
git commit -m "Add Railway deployment with PostgreSQL migrations"
git push origin main
```

## Step 2: Create Railway Project

### Access Railway
1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub (connects automatically to your repositories)

### Deploy from GitHub
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose `uzzielconceptm/FinMatchPro`
4. Railway detects Node.js project automatically

## Step 3: Add PostgreSQL Database

### Create Database Service
1. In Railway project dashboard, click "New"
2. Select "Database" → "PostgreSQL"
3. Wait 1-2 minutes for provisioning

### Get Connection String
1. Click PostgreSQL service
2. Go to "Connect" tab
3. Copy "Postgres Connection URL"

## Step 4: Configure Environment Variables

### Required Variables for Railway
```
DATABASE_URL=postgresql://postgres:password@host:port/railway
NODE_ENV=production
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-char-app-password
```

### Add Variables
1. Click your web service (not database)
2. Go to "Variables" tab
3. Add each variable above

## Step 5: Deploy and Verify

### Automatic Deployment
Railway automatically:
1. Builds your application
2. Runs database migrations via `railway.toml`
3. Starts the server
4. Provides HTTPS domain

### Check Deployment Status
1. Go to "Deployments" tab
2. Watch for migration success:
   ```
   ✓ Completed migration: 001_initial_schema.sql
   ✓ Completed migration: 20250612152230_add_user_session_tracking.sql
   🚀 Starting FlowBooks Associate...
   ```

### Get Live URL
1. Go to web service "Settings"
2. Copy "Public Domain"
3. Format: `https://your-app.railway.app`

## Step 6: Test Production Application

### Verify Core Features
- Landing page loads correctly
- Free trial signup creates database users
- Subscription signup with password authentication
- Email notifications send properly
- Health check: `/api/health` shows database connected

### Database Verification
Your PostgreSQL database now contains:
- `user_profiles` table with authentication
- `receipts` table for expense tracking
- `bank_transactions` table for imports
- `clients` table for accountant mode
- `user_sessions` table for session management

## Migration Benefits

### Replit vs Railway Comparison

**Replit (Development)**
- Great for development and prototyping
- Limited production capabilities
- Shared hosting environment

**Railway (Production)**
- Dedicated PostgreSQL database
- Automatic SSL/HTTPS
- Professional hosting infrastructure
- Built-in monitoring and scaling
- Custom domain support
- Better performance and reliability

### What Changes
- Database: From Replit's limited storage to PostgreSQL
- Hosting: From Replit shared hosting to Railway cloud
- Domain: From replit.dev to railway.app (or custom domain)
- Performance: Significantly improved loading times
- Scalability: Automatic scaling based on traffic

## Post-Migration Tasks

### Update Domain References
If you have any hardcoded URLs, update them to your new Railway domain.

### Custom Domain (Optional)
1. In Railway service settings, go to "Domains"
2. Add custom domain
3. Configure DNS CNAME record
4. Railway handles SSL automatically

### Monitoring Setup
1. Review Railway metrics dashboard
2. Set up alerts for downtime or errors
3. Monitor database performance

## Future Updates

### Continuous Deployment
Every push to `main` branch automatically:
1. Triggers Railway deployment
2. Runs database migrations
3. Updates live application

### Database Updates
Use the migration system:
```bash
node scripts/create-migration.js feature_name
# Edit SQL file
git commit -m "Add database migration"
git push origin main
```

Railway handles migrations automatically on deployment.

## Rollback Plan

If issues occur:
1. Railway dashboard → Deployments
2. Select previous working deployment
3. Click "Redeploy"

Database migrations are transaction-safe and can be rolled back with reverse migrations.

## Support

- Railway Documentation: docs.railway.app
- PostgreSQL Setup: Check RAILWAY_SETUP.md
- Migration Guide: MIGRATION_WORKFLOW.md

Your FlowBooks Associate application will be production-ready on Railway within 10 minutes of completing these steps.