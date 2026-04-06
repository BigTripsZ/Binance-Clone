import { Pool } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

// Read environment variables from .env.development.local
const envPath = path.join(process.cwd(), '.env.development.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envLines = envContent.split('\n');

envLines.forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    const value = valueParts.join('=').replace(/^['"]|['"]$/g, '');
    process.env[key.trim()] = value;
  }
});

const dbUrl = process.env.DATABASE_URL;
console.log('[v0] DATABASE_URL:', dbUrl ? 'Connected ✓' : 'Not found ✗');

if (!dbUrl) {
  console.error('[v0] ERROR: DATABASE_URL is not set');
  process.exit(1);
}

const pool = new Pool({
  connectionString: dbUrl,
});

async function runMigration() {
  try {
    // Read the SQL migration file
    const migrationPath = path.join(process.cwd(), 'scripts', '01-create-admin-tables.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log('[v0] Starting database migration...');
    
    // Execute the SQL
    await pool.query(sql);
    
    console.log('[v0] Migration completed successfully!');
    console.log('[v0] Tables created:');
    console.log('[v0] - admin_data');
    console.log('[v0] - withdrawal_transactions');
    
    // Verify tables were created
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('[v0] Tables in database:');
    result.rows.forEach(row => {
      console.log('[v0]   -', row.table_name);
    });
    
    await pool.end();
  } catch (error) {
    console.error('[v0] Migration failed:', error.message);
    process.exit(1);
  }
}

runMigration();
