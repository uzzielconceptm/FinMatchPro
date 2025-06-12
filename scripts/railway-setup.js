import { Client } from 'pg';
import runMigrations from './migrate.js';

async function setupRailwayDatabase() {
  console.log('🚂 Setting up Railway PostgreSQL database...');
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable not set');
    console.log('Please set your Railway PostgreSQL connection string in environment variables');
    process.exit(1);
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    // Test database connection
    await client.connect();
    console.log('✅ Connected to Railway PostgreSQL');
    
    // Check database version and basic info
    const versionResult = await client.query('SELECT version()');
    console.log('📊 Database version:', versionResult.rows[0].version.split(',')[0]);
    
    // Check if uuid-ossp extension is available
    const extensionResult = await client.query(`
      SELECT EXISTS(
        SELECT 1 FROM pg_available_extensions 
        WHERE name = 'uuid-ossp'
      )
    `);
    
    if (extensionResult.rows[0].exists) {
      console.log('✅ UUID extension available');
    } else {
      console.log('⚠️  UUID extension not available - migrations may need adjustment');
    }
    
    await client.end();
    
    // Run all migrations
    console.log('🔄 Running database migrations...');
    await runMigrations();
    
    console.log('🎉 Railway database setup completed successfully!');
    console.log('🌐 Your FlowBooks Associate application is ready for Railway deployment');
    
  } catch (error) {
    console.error('❌ Railway setup failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Verify DATABASE_URL is correct Railway PostgreSQL connection string');
    console.log('2. Ensure Railway PostgreSQL service is running');
    console.log('3. Check network connectivity to Railway');
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  setupRailwayDatabase();
}

export default setupRailwayDatabase;