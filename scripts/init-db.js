// scripts/init-db.js
import fs from 'fs';
import pgclient from '../src/db.js';

async function init() {
  // 1. Read your SQL file
  const sql = fs.readFileSync(new URL('../src/schema.sql', import.meta.url), 'utf8');
  // 2. Connect
  await pgclient.connect();
  console.log('✅ Connected to Postgres');
  // 3. Execute all statements
  await pgclient.query(sql);
  console.log('✅ Schema initialized');
  process.exit(0);
}

init().catch(err => {
  console.error('❌ Failed to initialize schema:', err);
  process.exit(1);
});
