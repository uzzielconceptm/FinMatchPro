# Railway Deployment Guide for FlowBooks Associate

This guide provides step-by-step instructions for deploying FlowBooks Associate to Railway with PostgreSQL database and automated migrations.

## Prerequisites

- Railway account at [railway.app](https://railway.app)
- GitHub repository with your FlowBooks Associate code
- Gmail credentials for email notifications

## Step 1: Create Railway Project

1. **Sign up/Login to Railway**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub (recommended)

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your FlowBooks Associate repository

3. **Add PostgreSQL Database**
   - In your project dashboard, click "New"
   - Select "Database" → "PostgreSQL"
   - Railway will provision a PostgreSQL instance

## Step 2: Configure Environment Variables

In your Railway project settings, add these variables:

### Required Variables
```
DATABASE_URL=postgresql://postgres:password@host:port/database
GMAIL_USER=your-gmail@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password
NODE_ENV=production
```

### Get Database URL
1. Go to your PostgreSQL service in Railway
2. Navigate to "Connect" tab
3. Copy the "Postgres Connection URL"
4. Set this as your `DATABASE_URL` variable

### Setup Gmail App Password
1. Enable 2FA on your Gmail account
2. Go to Google Account settings
3. Security → App passwords
4. Generate password for "Mail"
5. Use this password as `GMAIL_APP_PASSWORD`

## Step 3: Deploy with Automatic Migrations

Railway will automatically:
1. Build your application
2. Run database migrations via `railway.toml` configuration
3. Start the application

The `railway.toml` file configures deployment:
```toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "node scripts/migrate.js && npm start"
restartPolicyType = "on_failure"
restartPolicyMaxRetries = 10

[environments.production]
variables = { NODE_ENV = "production" }
```

## Step 4: Managing Database Updates

### Creating New Migrations

When you need to update the database schema:

1. **Create Migration File**
   ```bash
   node scripts/create-migration.js add_new_feature
   ```

2. **Edit Migration SQL**
   ```sql
   -- Example: Add new column
   ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS new_field TEXT;
   
   -- Example: Create new table
   CREATE TABLE IF NOT EXISTS new_table (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   
   -- Example: Add index
   CREATE INDEX IF NOT EXISTS idx_new_table_user_id ON new_table(user_id);
   ```

3. **Test Locally** (if you have local PostgreSQL)
   ```bash
   export DATABASE_URL="your-local-postgres-url"
   node scripts/migrate.js
   ```

4. **Deploy to Railway**
   ```bash
   git add .
   git commit -m "Add database migration for new feature"
   git push origin main
   ```

Railway will automatically:
- Detect the new commit
- Run migrations before starting the app
- Deploy the updated application

### Migration Best Practices

1. **Always use IF NOT EXISTS**
   ```sql
   ALTER TABLE users ADD COLUMN IF NOT EXISTS new_field TEXT;
   CREATE TABLE IF NOT EXISTS new_table (...);
   CREATE INDEX IF NOT EXISTS idx_name ON table(column);
   ```

2. **Use Transactions for Complex Changes**
   ```sql
   BEGIN;
   -- Multiple related changes
   ALTER TABLE users ADD COLUMN status TEXT;
   UPDATE users SET status = 'active' WHERE status IS NULL;
   ALTER TABLE users ALTER COLUMN status SET NOT NULL;
   COMMIT;
   ```

3. **Add Indexes After Data Changes**
   ```sql
   -- First: Add column and populate data
   ALTER TABLE users ADD COLUMN category_id UUID;
   -- Then: Add index
   CREATE INDEX IF NOT EXISTS idx_users_category_id ON users(category_id);
   ```

## Step 5: Monitoring and Troubleshooting

### Check Deployment Status
1. Go to Railway project dashboard
2. Click on your service
3. View "Deployments" tab for build/deploy logs

### View Migration Logs
```bash
# In Railway dashboard, go to your service and check logs
# Look for migration output:
# ✓ Completed migration: 001_initial_schema.sql
# ✓ Completed migration: 002_add_sessions.sql
```

### Common Issues and Solutions

**Migration Fails**
- Check SQL syntax in migration file
- Ensure proper IF NOT EXISTS clauses
- Verify foreign key references exist

**Database Connection Issues**
- Verify DATABASE_URL is correctly set
- Check PostgreSQL service is running
- Ensure SSL configuration for production

**Build Failures**
- Check Node.js version compatibility
- Verify all dependencies are in package.json
- Review build logs in Railway dashboard

### Rollback Strategy

For critical issues, Railway provides:

1. **Instant Rollback**
   - Go to Deployments tab
   - Click on previous successful deployment
   - Click "Redeploy"

2. **Database Rollback**
   - Create reverse migration
   - Test thoroughly before applying

## Step 6: Production Checklist

Before going live:

- [ ] All environment variables configured
- [ ] Database migrations tested
- [ ] Email notifications working
- [ ] SSL/HTTPS enabled (Railway handles this)
- [ ] Custom domain configured (optional)
- [ ] Database backups enabled
- [ ] Monitoring set up

## Environment Variables Reference

```bash
# Core Application
NODE_ENV=production

# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Email Service
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password

# Optional: Custom Configuration
CUSTOM_DOMAIN=your-domain.com
```

## Ongoing Maintenance

### Regular Tasks
1. **Monitor Resource Usage** - Check Railway dashboard
2. **Review Logs** - Look for errors or performance issues
3. **Database Maintenance** - Monitor size and performance
4. **Update Dependencies** - Keep packages up to date

### Scaling
Railway automatically handles:
- Traffic spikes
- Database connections
- Resource allocation

For high-traffic scenarios, consider:
- Database connection pooling (already implemented)
- CDN for static assets
- Load balancing (Railway Pro)

## Support and Resources

- **Railway Documentation**: [docs.railway.app](https://docs.railway.app)
- **PostgreSQL Documentation**: [postgresql.org/docs](https://postgresql.org/docs)
- **FlowBooks Migration Scripts**: Located in `/scripts/` directory

This setup provides a robust, scalable deployment that automatically handles database updates and maintains data integrity across all deployments.