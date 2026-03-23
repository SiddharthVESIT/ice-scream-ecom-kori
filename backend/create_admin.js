import 'dotenv/config';
import bcrypt from 'bcrypt';
import { query } from './src/config/db.js';

async function createAdmin() {
    const passwordHash = await bcrypt.hash('admin123', 12);
    const sql = `
        INSERT INTO users (full_name, email, password_hash, role)
        VALUES ('Admin', 'admin@kori.com', $1, 'admin')
        ON CONFLICT (email) DO UPDATE SET password_hash = $1, role = 'admin'
    `;
    await query(sql, [passwordHash]);
    console.log('✅ Admin user created/updated successfully.');
    process.exit(0);
}

createAdmin().catch(console.error);
