import 'dotenv/config';
import { query, dbPool } from './src/config/db.js';

async function fixDb() {
    try {
        console.log('Fixing constraints...');
        await query('ALTER TABLE carts DROP CONSTRAINT IF EXISTS carts_user_status_unique;');
        await query("CREATE UNIQUE INDEX IF NOT EXISTS idx_carts_user_active_unique ON carts(user_id) WHERE status = 'active';");
        console.log('Done!');
    } catch (e) {
        console.error(e);
    } finally {
        await dbPool.end();
        process.exit(0);
    }
}
fixDb();
