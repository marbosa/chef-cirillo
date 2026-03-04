import pool from '../config/database.js';
import { router } from '../router.js';
import { authenticate } from '../middlewares/authenticate.js';

// CREATE TABLE pomodoro_sessions (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   user_id UUID REFERENCES users(id) ON DELETE CASCADE,
//   cycle_id UUID REFERENCES cycles(id) ON DELETE SET NULL,
//   type VARCHAR(20) NOT NULL,
//   started_at TIMESTAMPTZ NOT NULL,
//   ended_at TIMESTAMPTZ,
//   duration_seconds INT NOT NULL,
//   completed BOOLEAN DEFAULT false,
//   cycle_number INT DEFAULT 1
// );

router.addRoute('POST', '/sessions', authenticate, (req, res) => {
    let rawBody = '';
    req.on('data', (chunk) => { rawBody += chunk ;});
    
    req.on('end', async () => {
        const types = ['pomodoro', 'short_break', 'long_break'];

        try {
            const body = JSON.parse(rawBody);
            const user_id = req.user.id;

            if (!body.type || !types.includes(body.type)) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Invalid type' }));
                return;
            } 

            if (!body.started_at) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'started_at is required' }));
                return;
            } 
            const date = new Date(body.started_at);
            if (isNaN(date.getTime())) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Invalid date format' }));
                return;
            }

            if (!body.duration_seconds || isNaN(body.duration_seconds) || Number(body.duration_seconds) <= 0) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Invalid duration_seconds' }));
                return;
            }

            if (body.cycle_number !== undefined && (isNaN(body.cycle_number) || Number(body.cycle_number) <= 0)) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Invalid cycle number' }));
                return; 
            }

            const columns = ['user_id', 'type', 'started_at', 'duration_seconds', 'cycle_number'];
            const vals = [user_id, body.type, body.started_at, body.duration_seconds, body.cycle_number ?? 1];

            if (body.cycle_id !== undefined) {
                try {
                    const result = await pool.query(
                        'SELECT id from cycles WHERE id = $1 AND user_id = $2',
                        [body.cycle_id, user_id]
                    );
                    if (result.rows.length === 0) {
                        res.writeHead(404);
                        res.end(JSON.stringify({ error: 'Cycle not found' }));
                        return;
                    }
                    columns.push('cycle_id');
                    vals.push(body.cycle_id);
                } catch {
                    res.writeHead(500);
                    res.end(JSON.stringify({ error: 'Could not validate cycle' }));
                    return;                
                }
            }

            const placeholders = vals.map((_, i) => `$${i + 1}`).join(', ');

            const result = await pool.query(
                `INSERT INTO pomodoro_sessions (${columns.join(', ')}) VALUES (${placeholders}) RETURNING *`,
                vals
            );

            res.writeHead(201);
            res.end(JSON.stringify({ message: 'Session created', session: result.rows[0]}));
        } catch {
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'Could not validate cycle' }));
            return;                
        }
    });
});
