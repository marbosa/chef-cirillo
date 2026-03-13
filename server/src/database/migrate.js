import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import path from 'path';
import pool from '../config/database.js';
import { logger } from '../config/logger.js';


const migrate = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS migrations (
                id SERIAL PRIMARY KEY,
                name VARCHAR(50) NOT NULL,
                run_at TIMESTAMPTZ DEFAULT NOW()
            );
        `);

        const migrationsPath = path.join('/app', 'src/database/migrations');
        const migrations = fs.readdirSync(migrationsPath).sort();
        
        for (const file of migrations) {
            const result = await pool.query('SELECT * FROM migrations WHERE name = $1', [file]);

            if(result.rows.length > 0) continue;
            const sql = fs.readFileSync(path.join(migrationsPath, file), 'utf8');

            await pool.query(sql);
            await pool.query('INSERT INTO migrations (name) VALUES ($1)', [file]);
            logger.info(`Migration ${file} executed successfully`);
        }

        await pool.end();
        logger.info('All migrations completed');
    } catch(err) {
        await pool.end();
        logger.error(err, 'Migration failed');
    }
};

migrate();
