# Railway Database Setup and Migration Guide

This guide covers deploying FlowBooks Associate to Railway with PostgreSQL database and setting up automated migrations.

## Railway Setup

### 1. Create Railway Account and Project
1. Sign up at [railway.app](https://railway.app)
2. Create a new project
3. Add a PostgreSQL database service

### 2. Get Database Credentials
From your Railway PostgreSQL service dashboard, copy:
- Database URL (full connection string)
- Host, Port, Database name, Username, Password

### 3. Configure Environment Variables
In Railway project settings, add these environment variables:

```
DATABASE_URL=postgresql://username:password@host:port/database
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
NODE_ENV=production
```

## Migration Strategy

### Option 1: Drizzle ORM with Railway (Recommended)

#### Setup Drizzle for Migrations
```bash
npm install drizzle-orm pg @types/pg
npm install -D drizzle-kit
```

#### Configure Drizzle
Update `drizzle.config.ts`:

```typescript
import type { Config } from 'drizzle-kit';

export default {
  schema: './shared/schema.ts',
  out: './migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
} satisfies Config;
```

#### Create Migration Scripts
Add to `package.json`:

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate:pg",
    "db:migrate": "drizzle-kit push:pg",
    "db:studio": "drizzle-kit studio",
    "db:deploy": "npm run db:migrate"
  }
}
```

### Option 2: Direct SQL Migrations

#### Create Migration System
```bash
mkdir migrations
mkdir scripts
```

#### Migration Runner Script
Create `scripts/migrate.js`:

```javascript
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function runMigrations() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    await client.connect();
    
    // Create migrations table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Read migration files
    const migrationsDir = path.join(__dirname, '../migrations');
    const files = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    for (const file of files) {
      // Check if migration already executed
      const result = await client.query(
        'SELECT id FROM migrations WHERE filename = $1',
        [file]
      );

      if (result.rows.length === 0) {
        console.log(`Running migration: ${file}`);
        
        // Read and execute migration
        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
        await client.query(sql);
        
        // Mark as executed
        await client.query(
          'INSERT INTO migrations (filename) VALUES ($1)',
          [file]
        );
        
        console.log(`Completed migration: ${file}`);
      } else {
        console.log(`Skipping migration: ${file} (already executed)`);
      }
    }
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigrations();
```

#### Add Migration Scripts to package.json
```json
{
  "scripts": {
    "migrate": "node scripts/migrate.js",
    "migrate:create": "node scripts/create-migration.js"
  }
}
```

#### Create Migration Creator Script
Create `scripts/create-migration.js`:

```javascript
const fs = require('fs');
const path = require('path');

const migrationName = process.argv[2];
if (!migrationName) {
  console.error('Please provide a migration name');
  process.exit(1);
}

const timestamp = new Date().toISOString().replace(/[-:T]/g, '').split('.')[0];
const filename = `${timestamp}_${migrationName}.sql`;
const filepath = path.join(__dirname, '../migrations', filename);

const template = `-- Migration: ${migrationName}
-- Created: ${new Date().toISOString()}

-- Add your SQL here
`;

fs.writeFileSync(filepath, template);
console.log(`Created migration: ${filename}`);
```

## Initial Database Schema Migration

Create `migrations/001_initial_schema.sql`:

```sql
-- Initial FlowBooks Associate Schema
-- Created for Railway deployment

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  company TEXT,
  user_type TEXT NOT NULL CHECK (user_type IN ('solo', 'accountant')),
  monthly_expenses TEXT CHECK (monthly_expenses IN ('under-500', '500-2000', '2000-5000', 'over-5000')),
  current_tool TEXT,
  plan_type TEXT CHECK (plan_type IN ('monthly', 'annual')),
  client_count TEXT,
  phone_number TEXT,
  referral_source TEXT,
  marketing_emails BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Receipts table
CREATE TABLE IF NOT EXISTS receipts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  vendor TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  currency TEXT DEFAULT 'USD',
  date DATE NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  receipt_url TEXT,
  bank_transaction_id UUID,
  matched BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bank transactions table
CREATE TABLE IF NOT EXISTS bank_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  account_id TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  currency TEXT DEFAULT 'USD',
  date DATE NOT NULL,
  description TEXT NOT NULL,
  receipt_id UUID REFERENCES receipts(id),
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clients table (for accountants)
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  accountant_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_receipts_user_id ON receipts(user_id);
CREATE INDEX IF NOT EXISTS idx_receipts_date ON receipts(date);
CREATE INDEX IF NOT EXISTS idx_bank_transactions_user_id ON bank_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_bank_transactions_date ON bank_transactions(date);
CREATE INDEX IF NOT EXISTS idx_clients_accountant_id ON clients(accountant_id);

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add update triggers
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_receipts_updated_at BEFORE UPDATE ON receipts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bank_transactions_updated_at BEFORE UPDATE ON bank_transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Deployment Workflow

### Railway Deployment Configuration
Create `railway.toml`:

```toml
[build]
builder = "nixpacks"
buildCommand = "npm install && npm run build"

[deploy]
startCommand = "npm run migrate && npm start"
restartPolicyType = "on_failure"
restartPolicyMaxRetries = 10

[environments.production]
variables = { NODE_ENV = "production" }
```

### Update Package.json for Production
```json
{
  "scripts": {
    "start": "node server/index.js",
    "build": "tsc && vite build",
    "migrate": "node scripts/migrate.js",
    "postbuild": "cp -r server/. dist/server/"
  }
}
```

## Ongoing Migration Workflow

### When You Make Database Changes:

1. **Create New Migration**
```bash
npm run migrate:create add_new_feature
```

2. **Write Migration SQL**
Edit the generated migration file with your changes:
```sql
-- Add new column example
ALTER TABLE user_profiles ADD COLUMN subscription_status TEXT DEFAULT 'active';

-- Create new table example
CREATE TABLE expense_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

3. **Test Locally**
```bash
npm run migrate
```

4. **Deploy to Railway**
Push to GitHub - Railway will automatically:
- Run migrations via the start command
- Deploy the updated application

### Automatic Migration on Deploy
Railway will run migrations automatically because the start command is:
```bash
npm run migrate && npm start
```

## Database Connection for Node.js

Update `server/db.ts`:

```typescript
import { Client, Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export async function query(text: string, params?: any[]) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('Executed query', { text, duration, rows: res.rowCount });
  return res;
}

export async function getClient() {
  const client = await pool.connect();
  return client;
}

export default pool;
```

## Monitoring and Rollback

### Monitor Migration Status
Check Railway logs to ensure migrations run successfully:
```bash
railway logs
```

### Rollback Strategy
For rollbacks, create down migrations:
```bash
npm run migrate:create rollback_feature_name
```

### Backup Before Major Changes
Railway provides automatic backups, but for major migrations:
1. Create manual backup in Railway dashboard
2. Test migration on staging environment first
3. Run migration during low-traffic periods

## Best Practices

1. **Always test migrations locally first**
2. **Keep migrations small and focused**
3. **Use transactions for complex migrations**
4. **Add indexes after data migrations**
5. **Never delete columns in production without proper deprecation**
6. **Use feature flags for schema changes affecting application logic**

## Troubleshooting

### Common Issues:
- **SSL Connection**: Ensure SSL is configured for production
- **Migration Failures**: Check Railway logs and fix SQL syntax
- **Performance**: Add appropriate indexes for new queries
- **Rollbacks**: Always have a rollback plan for major changes

This setup provides a robust, automated migration system that keeps your Railway database in sync with your application changes.