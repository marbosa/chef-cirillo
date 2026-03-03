import pool from '../config/database.js';
import { router } from '../router.js';
import { authenticate } from '../middlewares/authenticate.js';

router.addRoute('POST', '/cycles', authenticate, async (req, res) => {
    try {
        const user_id = req.user.id;
        
        const result = await pool.query('INSERT INTO cycles (user_id) VALUES ($1) RETURNING *', [user_id]);
        
        if (result.rows.length === 0) {
            res.writeHead(404);
            res.end(JSON.stringify({ error: 'Could not create cycle' }));
            return;
        }

        res.writeHead(201);
        res.end(JSON.stringify({ message: 'Cycle started', cycle: result.rows[0] }));
    } catch {
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Could not create cycle' }));
    }
});
