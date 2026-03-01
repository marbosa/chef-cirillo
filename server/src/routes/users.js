import { router } from '../router.js';
import pool from '../config/database.js';
import { authenticate } from '../middlewares/authenticate.js';

router.addRoute('GET', '/users/me', authenticate, async (req, res) => {
    const user = req.user;

    try {
        const query = await pool.query(
            'SELECT id, email, created_at, last_login_at FROM users WHERE id = $1',
            [user.id]
        );
        const result = query.rows[0];
        res.writeHead(200);
        res.end(JSON.stringify(result));
    } catch {
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Could not fetch user'}));
    }
});
