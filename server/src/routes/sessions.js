import pool from '../config/database.js';
import { router } from '../router.js';
import { authenticate } from '../middlewares/authenticate.js';
import validateUUID from '../middlewares/validateUUID.js';
import { logger } from '../config/logger.js';

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
            logger.info({ userId: user_id, type: body.type }, 'Session created successfully');
            res.writeHead(201);
            res.end(JSON.stringify({ message: 'Session created', session: result.rows[0]}));
        } catch(err) {
            logger.error(err, 'Could not validate cycle');
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'Could not validate cycle' }));
            return;                
        }
    });
});

// router.addRoute('GET', '/sessions/history', authenticate, async (req, res) => {
//     try {
//         const user_id = req.user.id;

//         const result = await pool.query('SELECT * FROM pomodoro_sessions WHERE user_id = $1', [user_id]);

//         res.writeHead(200);
//         res.end(JSON.stringify({ message: 'sessions founds', sessions: result.rows }));
//     } catch {
//         res.writeHead(500);
//         res.end(JSON.stringify({ message: 'not found sessions'}));
// }
// });

router.addRoute('PATCH', '/sessions/:id', authenticate, validateUUID, async (req, res) => {
    let rawBody = '';
    req.on('data', (chunk) => rawBody += chunk);

    req.on('end', async () => {
        try {
            const fields = [];
            const values = [];
            const id = req.params.id;
            const user_id = req.user.id;
            const body = JSON.parse(rawBody);

            if (body.ended_at !== undefined) {
                const date = new Date(body.ended_at);
                if (isNaN(date.getTime())) {
                    res.writeHead(400);
                    res.end(JSON.stringify({ error: 'Invalid date format' }));
                    return;
                }            
                fields.push(`ended_at = $${fields.length + 1}`);
                values.push(date);
            }

            if (body.completed !== undefined) {
                if (typeof body.completed !== 'boolean') {
                    res.writeHead(400);
                    res.end(JSON.stringify({ error: 'Invalid completed format' }));
                    return;
                }
                    fields.push(`completed = $${ fields.length + 1 }`);
                    values.push(body.completed);
            }

            if (fields.length === 0) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'No fields to update' }));
                return;
            }

            const result = await pool.query(
                `UPDATE pomodoro_sessions SET ${fields.join(', ')} WHERE id = $${fields.length + 1} AND user_id = $${fields.length + 2} RETURNING *`,
                [...values, id, user_id]
            );

            if (result.rows.length === 0){
                res.writeHead(404);
                res.end(JSON.stringify({ error: 'session not found'}));
                return;
            }

            logger.info({ userId: user_id, sessionId: id }, 'Session updated successfully');
            res.writeHead(200);
            res.end(JSON.stringify({ message: 'Session updated successfully', session: result.rows}));
        } catch(err) {
            logger.error(err, 'Could not update session');
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'Could not update session' }));
        }
    });
});

router.addRoute('POST', '/sessions/:id/tasks', authenticate, validateUUID, (req, res) => {
    let rawBody = '';
    req.on('data', (chunk) => { rawBody += chunk; });
    req.on('end', async () => {
        try {
            const body = JSON.parse(rawBody);
            const id = req.params.id;
            const user_id = req.user.id;

            if (!body.task_id) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'task_id is required' }));
                return;
            }

            const sessionExist = await pool.query(
                'SELECT id FROM pomodoro_sessions WHERE id = $1 AND user_id = $2',
                [id, user_id]
            );
            if (sessionExist.rows.length === 0) {
                res.writeHead(404);
                res.end(JSON.stringify({ error: 'Session not found' }));
                return;
            }

            const taskExist = await pool.query(
                'SELECT id FROM tasks WHERE id = $1 AND user_id = $2',
                [body.task_id, user_id]
            );
            if (taskExist.rows.length === 0) {
                res.writeHead(404);
                res.end(JSON.stringify({ error: 'Task not found' }));
                return;
            }

            const result = await pool.query(
                'INSERT INTO session_tasks (session_id, task_id) VALUES ($1, $2) RETURNING *',
                [id, body.task_id]
            );

            logger.info({ userId: user_id, sessionId: id, taskId: body.task_id }, 'Task linked to session successfully');
            res.writeHead(201);
            res.end(JSON.stringify({ message: 'Task linked to session', result: result.rows[0] }));
        } catch(err) {
            logger.error(err, 'Could not link task to session');
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'Could not link task to session' }));
        }
    });
});

router.addRoute('DELETE', '/sessions/:sessionId/tasks/:taskId', authenticate, validateUUID, async (req, res) => {
    try {
        const session_id = req.params.sessionId;
        const task_id = req.params.taskId;
        const user_id = req.user.id;

        if (!task_id) {
            res.writeHead(400);
            res.end(JSON.stringify({ error: 'task_id is required' }));
            return;
        }

        const sessionExist = await pool.query(
            'SELECT id FROM pomodoro_sessions WHERE id = $1 AND user_id = $2',
            [session_id, user_id]
        );
        if (sessionExist.rows.length === 0) {
            res.writeHead(404);
            res.end(JSON.stringify({ error: 'Session not found' }));
            return;
        }

        const taskExist = await pool.query(
            'SELECT id FROM tasks WHERE id = $1 AND user_id = $2',
            [task_id, user_id]
        );
        if (taskExist.rows.length === 0) {
            res.writeHead(404);
            res.end(JSON.stringify({ error: 'Task not found' }));
            return;
        }

        await pool.query(
            'DELETE FROM session_tasks WHERE session_id = $1 AND task_id = $2',
            [session_id, task_id]
        );

        logger.info({ userId: user_id, sessionId: session_id, taskId: task_id }, 'Task unlinked from session successfully');
        res.writeHead(200);
        res.end(JSON.stringify({ message: 'Task unlinked from session'}));
    } catch(err) {
        logger.error(err, 'Could not unlink task from session');
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Could not unlink task from session' }));
    }
});

router.addRoute('GET', '/sessions/history', authenticate, async (req, res) => {
    const { sort, view, offset, limit } = req.query;
    const userId = req.user.id;

    const sortOptions = {
        most_recent: 'date DESC',
        oldest: 'date ASC',
        shortest_duration: 'total_seconds ASC',
        longest_duration: 'total_seconds DESC',
        a_z: 'title ASC',
        z_a: 'title DESC',
    };

    const viewOptions = {
        day: 'AND DATE(ps.started_at) = CURRENT_DATE',
        week: "AND ps.started_at >= NOW() - INTERVAL '7 days'",
        month: "AND ps.started_at >= NOW() - INTERVAL '30 days'",
    };

    try {
        if (sort && !sortOptions[sort]) {
            res.writeHead(400);
            res.end(JSON.stringify({ error: 'Invalid sort option' }));
            return;
        }

        if (view && !viewOptions[view]) {
            res.writeHead(400);
            res.end(JSON.stringify({ error: 'Invalid sort option' }));
            return;
        }

        const parsedOffset = Number(offset) || 0;
        const parsedLimit = Number(limit) || 10;

        const result = await pool.query(
            `
                SELECT
                    DATE(ps.started_at) as date,
                    t.title as title,
                    SUM(ps.duration_seconds) as total_seconds
                FROM pomodoro_sessions ps
                JOIN session_tasks st ON ps.id = st.session_id
                JOIN tasks t ON st.task_id = t.id
                WHERE ps.user_id = $1 ${ view ? viewOptions[view] : '' }
                GROUP BY DATE(ps.started_at), t.title
                ORDER BY ${ sort ? sortOptions[sort] : 'date DESC'}
                LIMIT $2 OFFSET $3
            `,
            [userId, parsedLimit, parsedOffset]
        );

        logger.info({ userId, sort, view, count: result.rows.length }, 'Session history fetched successfully');
        res.writeHead(200);
        res.end(JSON.stringify({ result: result.rows }));
    } catch(err) {
        logger.error(err, 'not found history');
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'not found history'}));
    }
});
