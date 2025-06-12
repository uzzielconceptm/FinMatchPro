import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    await client.connect();
    console.log('Connected to database');
    
    // Create migrations table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('Migrations table ready');

    // Read migration files
    const migrationsDir = path.join(__dirname, '../migrations');
    
    if (!fs.existsSync(migrationsDir)) {
      console.log('No migrations directory found, creating...');
      fs.mkdirSync(migrationsDir, { recursive: true });
      return;
    }

    const files = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    if (files.length === 0) {
      console.log('No migration files found');
      return;
    }

    console.log(`Found ${files.length} migration files`);

    for (const file of files) {
      // Check if migration already executed
      const result = await client.query(
        'SELECT id FROM migrations WHERE filename = $1',
        [file]
      );

      if (result.rows.length === 0) {
        console.log(`Running migration: ${file}`);
        
        try {
          // Read and execute migration
          const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
          await client.query('BEGIN');
          await client.query(sql);
          
          // Mark as executed
          await client.query(
            'INSERT INTO migrations (filename) VALUES ($1)',
            [file]
          );
          
          await client.query('COMMIT');
          console.log(`✓ Completed migration: ${file}`);
        } catch (error) {
          await client.query('ROLLBACK');
          console.error(`✗ Failed migration: ${file}`, error);
          throw error;
        }
      } else {
        console.log(`→ Skipping migration: ${file} (already executed)`);
      }
    }
    
    console.log('All migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations();
}

export default runMigrations;