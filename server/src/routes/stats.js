import pool from '../config/database.js';
import { router } from '../router.js';
import { authenticate } from '../middlewares/authenticate.js';

router.addRoute('GET', '/stats/me', authenticate, async (req, res) => {
    const userId = req.user.id;

    try {
        const sessionStats = await pool.query(
            `
                SELECT 
                    SUM(CASE WHEN type = 'pomodoro'     THEN duration_seconds ELSE 0 END) as focused_time,
                    SUM(CASE WHEN type = 'short_break'       THEN duration_seconds ELSE 0 END) as break_time,
                    SUM(CASE WHEN type = 'long_break'    THEN duration_seconds ELSE 0 END) as long_break_time,
                    COUNT(CASE WHEN completed = true THEN 1 END) as completed_sessions,
                    COUNT(DISTINCT DATE(started_at)) as focused_days
                FROM pomodoro_sessions
                WHERE user_id = $1
            `, [userId]
        );

        const taskStats = await pool.query(
            'SELECT COUNT(*) FROM tasks WHERE user_id = $1 AND status = $2',
            [userId, 'completed']
        );

        const stats = {
            focusedTime: sessionStats.rows[0].focused_time,
            shortBreakTime: sessionStats.rows[0].break_time,
            longBreakTime: sessionStats.rows[0].long_break_time,
            completedSessions: sessionStats.rows[0].completed_sessions,
            focusedDays: sessionStats.rows[0].focused_days,
            completedTasks: taskStats.rows[0].count
        };

        res.writeHead(200);
        res.end(JSON.stringify({ stats: stats }));
    } catch {
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'not found stats'}));
    }
});
