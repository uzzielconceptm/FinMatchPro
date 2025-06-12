# Railway Quick Start Guide for FlowBooks Associate

## Step 1: Create Railway Account and Project

1. **Sign up at Railway**
   - Go to [railway.app](https://railway.app)
   - Click "Login" and sign up with GitHub
   - This will automatically connect your GitHub repositories

2. **Create New Project**
   - Click "New Project" from your Railway dashboard
   - Select "Deploy from GitHub repo"
   - Choose your FlowBooks Associate repository
   - Railway will automatically detect it's a Node.js project

## Step 2: Add PostgreSQL Database

1. **Add Database Service**
   - In your Railway project dashboard, click "New"
   - Select "Database" → "PostgreSQL"
   - Railway will provision a PostgreSQL instance (takes 1-2 minutes)

2. **Get Database Connection String**
   - Click on your PostgreSQL service
   - Go to "Connect" tab
   - Copy the "Postgres Connection URL"
   - It looks like: `postgresql://postgres:password@host:port/railway`

## Step 3: Configure Environment Variables

In your Railway project, go to your web service and add these variables:

### Required Variables
```bash
DATABASE_URL=postgresql://postgres:password@host:port/railway
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
NODE_ENV=production
```

### How to Add Variables
1. Click on your web service (the one with your code)
2. Go to "Variables" tab
3. Click "New Variable"
4. Add each variable name and value

### Get Gmail App Password
1. Enable 2-factor authentication on your Gmail account
2. Go to Google Account → Security → App passwords
3. Generate password for "Mail" application
4. Use this 16-character password (not your regular Gmail password)

## Step 4: Deploy with Automatic Migrations

Railway will automatically:
1. Build your application using the `railway.toml` configuration
2. Run database migrations via `node scripts/migrate.js`
3. Start your application with `npm start`

The deployment process takes 3-5 minutes and you'll see:
```
✓ Database migrations completed
✓ FlowBooks Associate starting on port 5000
```

## Step 5: Access Your Application

1. **Get Your Railway URL**
   - In your web service, go to "Settings" tab
   - Copy the "Public Domain" URL
   - It looks like: `https://your-app-name.railway.app`

2. **Test Your Application**
   - Open the Railway URL in your browser
   - You should see the FlowBooks Associate landing page
   - Test the signup forms to verify database integration

## Step 6: Custom Domain (Optional)

1. **Add Custom Domain**
   - In Railway service settings, go to "Domains"
   - Click "Custom Domain"
   - Enter your domain (e.g., `flowbooks.yourdomain.com`)

2. **Configure DNS**
   - Add CNAME record pointing to your Railway domain
   - Railway automatically handles SSL certificates

## Troubleshooting

### Common Issues

**Build Fails**
- Check the "Deployments" tab for error logs
- Verify all dependencies are in package.json
- Ensure Node.js version compatibility

**Database Connection Issues**
- Verify DATABASE_URL is set correctly
- Check PostgreSQL service is running in Railway
- Review environment variables format

**Email Not Working**
- Verify Gmail app password is correct (16 characters)
- Check GMAIL_USER and GMAIL_APP_PASSWORD variables
- Test with a simple email first

### Checking Logs
1. Go to your web service in Railway
2. Click "Logs" tab
3. Look for migration success messages:
   ```
   ✓ Completed migration: 001_initial_schema.sql
   ✓ All migrations completed successfully
   ```

## Next Steps After Deployment

1. **Test All Features**
   - Free trial signup
   - Subscription signup
   - Email notifications
   - Database health check at `/api/health`

2. **Monitor Performance**
   - Check Railway metrics dashboard
   - Monitor database connections
   - Review application logs

3. **Set Up Monitoring**
   - Configure alerts in Railway
   - Set up uptime monitoring
   - Review resource usage

Your FlowBooks Associate application will be live at your Railway URL within 5 minutes of completing these steps!