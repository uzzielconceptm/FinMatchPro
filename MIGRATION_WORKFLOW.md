# Railway Migration Workflow for FlowBooks Associate

## Overview

This document outlines the complete workflow for managing database migrations when deploying FlowBooks Associate to Railway with PostgreSQL.

## Migration System Components

### Scripts
- `scripts/migrate.js` - Runs all pending migrations
- `scripts/create-migration.js` - Creates new migration files
- `scripts/test-migration.js` - Tests migration system integrity
- `scripts/railway-setup.js` - Initial Railway database setup

### Configuration
- `railway.toml` - Railway deployment configuration with migration automation
- `migrations/` - Directory containing all SQL migration files
- `.github/workflows/railway-deploy.yml` - CI/CD pipeline for automated deployment

## Development Workflow

### 1. Creating Database Changes

When you need to modify the database schema:

```bash
# Create new migration
node scripts/create-migration.js your_feature_name

# Edit the generated SQL file
# Example: migrations/20250612_your_feature_name.sql
```

### 2. Writing Migration SQL

Use these patterns for safe migrations:

```sql
-- Add columns safely
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS new_field TEXT;

-- Create tables with checks
CREATE TABLE IF NOT EXISTS new_table (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes safely
CREATE INDEX IF NOT EXISTS idx_new_table_user_id ON new_table(user_id);

-- Update data with conditions
UPDATE user_profiles 
SET status = 'active' 
WHERE status IS NULL;
```

### 3. Testing Migrations

```bash
# Test migration system locally
node scripts/test-migration.js

# If you have local PostgreSQL, test actual migration
export DATABASE_URL="postgresql://localhost:5432/test_db"
node scripts/migrate.js
```

### 4. Deploying to Railway

```bash
# Commit changes
git add migrations/
git commit -m "Add migration: your feature description"

# Push to main branch
git push origin main
```

Railway automatically:
1. Detects the push to main branch
2. Runs CI/CD pipeline
3. Executes migrations before starting the app
4. Deploys the updated application

## Railway Deployment Process

### Automatic Migration Execution

Railway executes this sequence on every deployment:

1. **Build Phase**: Compile TypeScript and bundle assets
2. **Migration Phase**: `node scripts/migrate.js`
3. **Start Phase**: `npm start`

### Migration Safety Features

- **Transaction Wrapping**: Each migration runs in a transaction
- **Duplicate Prevention**: Migrations table tracks executed files
- **Rollback on Failure**: Failed migrations don't affect the database
- **Idempotent Operations**: Use `IF NOT EXISTS` for safe re-runs

## Managing Database Updates

### Regular Update Cycle

1. **Local Development**
   ```bash
   node scripts/create-migration.js add_user_preferences
   # Edit migration file
   git add . && git commit -m "Add user preferences"
   ```

2. **Staging Deployment**
   ```bash
   git push origin staging  # If you have staging branch
   # Verify migration works correctly
   ```

3. **Production Deployment**
   ```bash
   git push origin main
   # Railway automatically runs migrations and deploys
   ```

### Emergency Rollback

If a migration causes issues:

1. **Immediate Rollback**
   - Go to Railway dashboard
   - Navigate to Deployments
   - Select previous working deployment
   - Click "Redeploy"

2. **Database Rollback** (if needed)
   ```bash
   # Create reverse migration
   node scripts/create-migration.js rollback_problematic_feature
   
   # Add reverse SQL operations
   # ALTER TABLE users DROP COLUMN IF EXISTS problematic_field;
   
   # Deploy fix
   git add . && git commit -m "Rollback: remove problematic feature"
   git push origin main
   ```

## Best Practices

### Migration File Naming
```
YYYYMMDDHHMMSS_descriptive_name.sql
20250612152230_add_user_sessions.sql
20250612152245_update_user_indexes.sql
```

### SQL Best Practices

1. **Always Use Safety Checks**
   ```sql
   -- Good
   ALTER TABLE users ADD COLUMN IF NOT EXISTS status TEXT;
   
   -- Avoid
   ALTER TABLE users ADD COLUMN status TEXT;
   ```

2. **Handle Data Migration Carefully**
   ```sql
   -- Safe data migration
   BEGIN;
   ALTER TABLE users ADD COLUMN full_name TEXT;
   UPDATE users SET full_name = first_name || ' ' || last_name;
   -- Don't drop old columns immediately
   COMMIT;
   ```

3. **Create Indexes After Data Changes**
   ```sql
   -- First: modify data
   ALTER TABLE users ADD COLUMN category_id UUID;
   UPDATE users SET category_id = get_default_category();
   
   -- Then: add index
   CREATE INDEX IF NOT EXISTS idx_users_category_id ON users(category_id);
   ```

### Testing Strategy

1. **Local Testing**
   - Test migrations on local PostgreSQL when possible
   - Verify application works with schema changes
   - Check for performance impacts

2. **Staging Environment**
   - Use Railway staging environment if available
   - Test with production-like data volume
   - Verify rollback procedures

3. **Production Deployment**
   - Deploy during low-traffic periods
   - Monitor logs during deployment
   - Have rollback plan ready

## Monitoring and Maintenance

### Checking Migration Status

```bash
# In Railway dashboard, check service logs for:
# ✓ Completed migration: 001_initial_schema.sql
# ✓ Completed migration: 002_add_sessions.sql
# 🚀 Starting FlowBooks Associate...
```

### Database Health Monitoring

The application includes health check endpoint:
```
GET /api/health
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2025-06-12T15:30:00.000Z"
}
```

### Performance Monitoring

Monitor these metrics in Railway dashboard:
- Database connection count
- Query response times
- Migration execution time
- Application startup time

## Troubleshooting

### Common Migration Issues

1. **Migration Fails Due to Syntax Error**
   - Check SQL syntax in migration file
   - Verify table/column names exist
   - Ensure proper data types

2. **Foreign Key Constraint Violations**
   - Ensure referenced tables exist
   - Check data integrity before adding constraints
   - Use proper CASCADE options

3. **Index Creation Fails**
   - Verify column exists before creating index
   - Check for conflicting index names
   - Ensure sufficient disk space

### Recovery Procedures

1. **Failed Migration**
   - Railway automatically rolls back transaction
   - Fix migration file
   - Redeploy to retry

2. **Database Connection Issues**
   - Verify DATABASE_URL in Railway environment
   - Check PostgreSQL service status
   - Review SSL configuration

3. **Performance Degradation**
   - Analyze slow queries
   - Review new indexes
   - Consider migration optimization

This workflow ensures safe, reliable database updates with minimal downtime and maximum reliability for your Railway deployment.