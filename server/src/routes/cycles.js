import pool from '../config/database.js';
import { router } from '../router.js';
import { authenticate } from '../middlewares/authenticate.js';
import validateUUID from '../middlewares/validateUUID.js';
import { logger } from '../config/logger.js';

router.addRoute('POST', '/cycles', authenticate, async (req, res) => {
    try {
        const user_id = req.user.id;
        
        const result = await pool.query('INSERT INTO cycles (user_id) VALUES ($1) RETURNING *', [user_id]);

        if (result.rows.length === 0) {
            res.writeHead(404);
            res.end(JSON.stringify({ error: 'Could not create cycle' }));
            return;
        }

        logger.info({ userId: user_id, cycleId: result.rows[0].id }, 'Cycle started successfully');
        res.writeHead(201);
        res.end(JSON.stringify({ message: 'Cycle started', cycle: result.rows[0] }));
    } catch(err) {
        logger.error(err, 'Could not create cycle');
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Could not create cycle' }));
    }
});

router.addRoute('PATCH', '/cycles/:id', authenticate, validateUUID, (req, res) => {
    let rawBody = '';
    const cycle_id = req.params.id;

    req.on('data', (chunk) => { rawBody += chunk; });
    req.on('end', async () => {
        try {
            const fields = [];
            const values = [];
            const user_id = req.user.id;
            const body = JSON.parse(rawBody);

            if (body.ended_at !== undefined) {
                try {
                    const date = new Date(body.ended_at);
                    if (isNaN(date.getTime())) throw new Error();
                    fields.push(`ended_at = $${fields.length + 1}`);
                    values.push(date);
                } catch {
                    res.writeHead(400);
                    res.end(JSON.stringify({ error: 'Invalid date format' }));
                    return;
                }
            }

            if (body.pomodoros_completed !== undefined) {
                if (isNaN(Number(body.pomodoros_completed)) || Number(body.pomodoros_completed) < 0) {
                    res.writeHead(400);
                    res.end(JSON.stringify({ error: 'Pomodoros_completed need be at least positive numbers' }));
                    return;
                }
                fields.push(`pomodoros_completed = $${ fields.length + 1 }`);
                values.push(body.pomodoros_completed);
            }

            if (body.was_reset !== undefined) {
                if (typeof body.was_reset !== 'boolean') {
                    res.writeHead(400);
                    res.end(JSON.stringify({ error: 'was_reset need be booleand' }));
                    return;
                }
                fields.push(`was_reset = $${ fields.length + 1 }`);
                values.push(body.was_reset);
            }

            if (fields.length === 0) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'no fields to update' }));
                return;
            }

            const result = await pool.query(
                `UPDATE cycles SET ${fields.join(', ')} WHERE id = $${fields.length + 1} AND user_id = $${fields.length + 2} RETURNING *`,
                [...values, cycle_id, user_id]
            );

            
            if (result.rows.length === 0) {
                res.writeHead(404);
                res.end(JSON.stringify({ error: 'Cycle not updates' }));
                return;
            }

            logger.info({ userId: user_id, cycleId: cycle_id }, 'Cycle updated successfully');
            res.writeHead(200);
            res.end(JSON.stringify({ message: 'Cycle updated', task: result.rows[0] }));
        } catch(err) {
            logger.error(err, 'Could not update cycle');
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'Could not update cycle' }));
        }
    });
});

router.addRoute('GET', '/cycles/history', authenticate, async (req, res) => {
    try {
        const user_id = req.user.id;
        
        const result = await pool.query('SELECT * FROM cycles WHERE user_id = $1', [user_id]);

        logger.info({ userId: user_id, count: result.rows.length }, 'Cycles fetched successfully');
        res.writeHead(200);
        res.end(JSON.stringify({ message: 'Cycles found', cycles: result.rows }));
    } catch(err) {
        logger.error(err, 'Could not fetch cycles');
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Could not found cycles' }));
    }
});
