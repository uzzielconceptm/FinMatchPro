const fs = require('fs');
const path = require('path');

const migrationName = process.argv[2];
if (!migrationName) {
  console.error('Please provide a migration name');
  console.error('Usage: npm run migrate:create <migration_name>');
  process.exit(1);
}

const timestamp = new Date().toISOString().replace(/[-:T]/g, '').split('.')[0];
const filename = `${timestamp}_${migrationName}.sql`;
const migrationsDir = path.join(__dirname, '../migrations');
const filepath = path.join(migrationsDir, filename);

// Ensure migrations directory exists
if (!fs.existsSync(migrationsDir)) {
  fs.mkdirSync(migrationsDir, { recursive: true });
}

const template = `-- Migration: ${migrationName}
-- Created: ${new Date().toISOString()}

-- Add your SQL here
-- Example:
-- ALTER TABLE user_profiles ADD COLUMN new_field TEXT;
-- CREATE INDEX idx_example ON table_name(column_name);

`;

fs.writeFileSync(filepath, template);
console.log(`Created migration: ${filename}`);
console.log(`Path: ${filepath}`);
console.log('Edit the file and add your SQL, then run: npm run migrate');