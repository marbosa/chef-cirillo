import pool from '../config/database.js';
import { authenticate } from '../middlewares/authenticate.js';
import validateUUID from '../middlewares/validateUUID.js';
import { router } from '../router.js';

router.addRoute('GET', '/tasks', authenticate, async (req, res) => {
    const user = req.user;

    try {
        const result = await pool.query('SELECT * FROM tasks WHERE user_id = $1', [user.id]);
        res.writeHead(200);
        res.end(JSON.stringify({ tasks: result.rows }));
    } catch {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Could not fetch tasks' }));
    }
});

router.addRoute('GET', '/tasks/:id', authenticate, validateUUID, async (req, res) => {
    const id = req.params.id;
    const user = req.user;

    try {
        const result = await pool.query('SELECT * FROM tasks WHERE id = $1 AND user_id = $2', [id, user.id]);
        res.writeHead(200);
        res.end(JSON.stringify({ tasks: result.rows }));
    } catch {
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Could not fetch tasks' }));
    }
});

router.addRoute('POST', '/tasks', authenticate, (req, res) => {
    const user = req.user;
    let rawBody = '';

    req.on('data', (chunk) => { rawBody += chunk; });
    req.on('end', async () => {
        try {
            const body = JSON.parse(rawBody);

            if(!body.title || !body.title.trim()) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Title is required'}));
                return;
            }

            if (body.estimated_pomodoros !== undefined && (isNaN(body.estimated_pomodoros) || body.estimated_pomodoros < 1)) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'estimated_pomodoros must be a positive number' }));
                return;
            }

            const estimatedPomodoros = body.estimated_pomodoros !== undefined 
                ? Number(body.estimated_pomodoros) 
                : 1;

            const result = await pool.query(
                'INSERT INTO tasks (user_id, title, estimated_pomodoros) VALUES ($1, $2, $3) RETURNING *',
                [user.id, body.title, estimatedPomodoros]
            );

            if (result.rows.length === 0) {
                res.writeHead(404);
                res.end(JSON.stringify({ error: 'Could not create task'}));
                return;
            } 

            res.writeHead(201);
            res.end(JSON.stringify({ message: 'Created task', task: result.rows[0]}));
        } catch {
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'Could not create task'}));
        }
    });
});

router.addRoute('PATCH', '/tasks/:id', authenticate, validateUUID, async (req, res) => {
    const id = req.params.id;
    const user = req.user;
    let rawBody = '';

    req.on('data', (chunk) => { rawBody += chunk; });

    req.on('end', async () => {
        try {
        const body = JSON.parse(rawBody);
        const fields = [];
        const values = [];

        if (body.title !== undefined) {
            if (!body.title.trim()) {
            res.writeHead(400);
            res.end(JSON.stringify({ error: 'Title cannot be empty' }));
            return;
            }
            fields.push(`title = $${fields.length + 1}`);
            values.push(body.title.trim());
        }

        if (body.estimated_pomodoros !== undefined) {
            if (isNaN(body.estimated_pomodoros) || body.estimated_pomodoros < 1) {
            res.writeHead(400);
            res.end(JSON.stringify({ error: 'estimated_pomodoros must be a positive number' }));
            return;
            }
            fields.push(`estimated_pomodoros = $${fields.length + 1}`);
            values.push(Number(body.estimated_pomodoros));
        }

        if (body.status !== undefined) {
            const validStatuses = ['pending', 'in_progress', 'completed'];
            if (!validStatuses.includes(body.status)) {
            res.writeHead(400);
            res.end(JSON.stringify({ error: 'Invalid status' }));
            return;
            }
            fields.push(`status = $${fields.length + 1}`);
            values.push(body.status);
        }

        if (body.position !== undefined) {
            if (isNaN(body.position) || body.position < 0) {
            res.writeHead(400);
            res.end(JSON.stringify({ error: 'Position must be a positive number' }));
            return;
            }
            fields.push(`position = $${fields.length + 1}`);
            values.push(Number(body.position));
        }

        if (body.completed_pomodoros !== undefined) {
            if (isNaN(body.completed_pomodoros) || body.completed_pomodoros < 0) {
            res.writeHead(400);
            res.end(JSON.stringify({ error: 'completed_pomodoros must be a positive number' }));
            return;
            }
            fields.push(`completed_pomodoros = $${fields.length + 1}`);
            values.push(Number(body.completed_pomodoros));
        }

        if (fields.length === 0) {
            res.writeHead(400);
            res.end(JSON.stringify({ error: 'No fields to update' }));
            return;
        }

        const result = await pool.query(
            `UPDATE tasks SET ${fields.join(', ')} WHERE id = $${fields.length + 1} AND user_id = $${fields.length + 2} RETURNING *`,
            [...values, id, user.id]
        );

        if (result.rows.length === 0) {
            res.writeHead(404);
            res.end(JSON.stringify({ error: 'Task not found' }));
            return;
        }

        res.writeHead(200);
        res.end(JSON.stringify({ message: 'Task updated', task: result.rows[0] }));
        } catch {
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Could not update task' }));
        }
    });
});

router.addRoute('DELETE', '/tasks/:id', authenticate, validateUUID, async (req, res) => {
    const id = req.params.id;
    const user = req.user;

    try {
        await pool.query('DELETE FROM tasks WHERE id = $1 AND user_id = $2', [id, user.id]);
        res.writeHead(200);
        res.end(JSON.stringify({ message: 'Task deleted' }));
    } catch {
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Could not delete task' }));
    }
});
