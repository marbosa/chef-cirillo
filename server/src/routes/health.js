import { router } from '../router.js';
import pool from '../config/database.js';
import { logger } from '../config/logger.js';

router.addRoute('GET', '/health', async (req, res) => {
    try {
        const uptime = process.uptime();
        await pool.query('SELECT 1');
        res.writeHead(200);
        res.end(JSON.stringify({ result: { database: 'ok', uptime: uptime } }));
    } catch(err) {
        logger.error(err, 'Health check failed');
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'error'}));
    }
});
