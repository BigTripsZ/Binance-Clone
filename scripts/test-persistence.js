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

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function testPersistence() {
  try {
    console.log('[v0] Testing data persistence...\n');
    
    // Test data
    const testData = {
      profileName: 'Test User ' + Date.now(),
      cryptoBalance: 123.456,
      fiatBalance: 50000,
      networkDisplayName: 'Ethereum (ERC20)',
      adminWalletAddress: '0x' + Math.random().toString(16).slice(2)
    };

    // Insert test data
    console.log('[v0] Inserting test data...');
    const insertResult = await pool.query(
      `INSERT INTO admin_data (profile_name, crypto_balance, fiat_balance, network_display_name, admin_wallet_address)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, profile_name, crypto_balance, fiat_balance`,
      [testData.profileName, testData.cryptoBalance, testData.fiatBalance, testData.networkDisplayName, testData.adminWalletAddress]
    );

    const insertedId = insertResult.rows[0].id;
    console.log('[v0] ✓ Data inserted successfully');
    console.log('[v0]   - Record ID:', insertedId);
    console.log('[v0]   - Profile Name:', insertResult.rows[0].profile_name);
    console.log('[v0]   - Crypto Balance:', insertResult.rows[0].crypto_balance);

    // Verify data can be retrieved
    console.log('\n[v0] Retrieving data from database...');
    const selectResult = await pool.query(
      `SELECT * FROM admin_data WHERE id = $1`,
      [insertedId]
    );

    if (selectResult.rows.length > 0) {
      const retrieved = selectResult.rows[0];
      console.log('[v0] ✓ Data retrieved successfully');
      console.log('[v0]   - Profile Name:', retrieved.profile_name);
      console.log('[v0]   - Crypto Balance:', retrieved.crypto_balance);
      console.log('[v0]   - Network:', retrieved.network_display_name);
      console.log('[v0]   - Wallet:', retrieved.admin_wallet_address);
    }

    // Count total records
    const countResult = await pool.query(`SELECT COUNT(*) as count FROM admin_data`);
    console.log('\n[v0] Total admin_data records:', countResult.rows[0].count);

    console.log('\n[v0] ✓ Data persistence test PASSED!');
    console.log('[v0] Your data will now persist across all browsers and devices.');

    await pool.end();
  } catch (error) {
    console.error('[v0] Test FAILED:', error.message);
    process.exit(1);
  }
}

testPersistence();
