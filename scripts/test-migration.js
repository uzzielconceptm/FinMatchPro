import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testMigrationSystem() {
  console.log('🧪 Testing Railway migration system...');
  
  // Check if DATABASE_URL is available
  if (!process.env.DATABASE_URL) {
    console.log('⚠️  DATABASE_URL not set - testing local simulation');
    
    // Test migration file structure
    const migrationsDir = path.join(__dirname, '../migrations');
    if (!fs.existsSync(migrationsDir)) {
      console.error('❌ Migrations directory not found');
      return false;
    }
    
    const files = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();
      
    console.log(`✅ Found ${files.length} migration files:`);
    files.forEach(file => console.log(`  → ${file}`));
    
    return true;
  }
  
  // Test actual database connection
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });
  
  try {
    await client.connect();
    console.log('✅ Database connection successful');
    
    // Test migrations table
    const result = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'migrations'
      )
    `);
    
    if (result.rows[0].exists) {
      console.log('✅ Migrations table exists');
      
      // Show executed migrations
      const migrations = await client.query('SELECT filename, executed_at FROM migrations ORDER BY executed_at');
      console.log(`✅ ${migrations.rows.length} migrations executed:`);
      migrations.rows.forEach(row => {
        console.log(`  → ${row.filename} (${row.executed_at})`);
      });
    } else {
      console.log('ℹ️  Migrations table will be created on first run');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    return false;
  } finally {
    await client.end();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  testMigrationSystem()
    .then(success => {
      if (success) {
        console.log('🎉 Migration system test completed successfully');
        process.exit(0);
      } else {
        console.log('❌ Migration system test failed');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('💥 Test error:', error);
      process.exit(1);
    });
}

export default testMigrationSystem;