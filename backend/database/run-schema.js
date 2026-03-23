import { readFileSync } from 'fs';
import { resolve } from 'path';
import 'dotenv/config';
import { query } from '../src/config/db.js';

async function runSchema() {
    try {
        console.log('🧊 Running schema.sql on database...');
        const sqlPath = resolve(process.cwd(), 'database/schema.sql');
        const sql = readFileSync(sqlPath, 'utf8');
        
        await query(sql);
        console.log('✅ Schema executed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Failed to execute schema:', err);
        process.exit(1);
    }
}

runSchema();
