import pool from '../config/database.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const seed = async () => {
    await pool.query('DELETE FROM session_tasks');
    await pool.query('DELETE FROM pomodoro_sessions');
    await pool.query('DELETE FROM cycles');
    await pool.query('DELETE FROM tasks');
    await pool.query('DELETE FROM users');

    const passwordHash = await bcrypt.hash('123456', 10);

    const user1 = await pool.query(
        'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING *', 
        ['mario@cirillo.com', passwordHash]
    );

    const user2 = await pool.query(
        'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING *',
        ['luigi@cirillo.com', passwordHash]
    );

    const u1 = user1.rows[0];
    const u2 = user2.rows[0];

    const task1 = await pool.query(
        'INSERT INTO tasks (user_id, title, estimated_pomodoros) VALUES ($1, $2, $3) RETURNING *',
        [u1.id, 'Estudar node.js', 4]
    );

    const task2 = await pool.query(
        'INSERT INTO tasks (user_id, title, estimated_pomodoros) VALUES ($1, $2, $3) RETURNING *',
        [u1.id, 'Fazer exercícios', 2]
    );

    const task3 = await pool.query(
        'INSERT INTO tasks (user_id, title, estimated_pomodoros) VALUES ($1, $2, $3) RETURNING *',
        [u2.id, 'Ler documentação', 3]
    );

    const cycle1 = await pool.query(
        'INSERT INTO cycles (user_id, pomodoros_completed) VALUES ($1, $2) RETURNING *',
        [u1.id, 4]
    );

    const cycle2 = await pool.query(
        'INSERT INTO cycles (user_id, pomodoros_completed) VALUES ($1, $2) RETURNING *',
        [u1.id, 2]
    );

    const cycle3 = await pool.query(
        'INSERT INTO cycles (user_id, pomodoros_completed) VALUES ($1, $2) RETURNING *',
        [u2.id, 3]
    );

    const session1 = await pool.query(
        `INSERT INTO pomodoro_sessions (user_id, cycle_id, type, started_at, ended_at, duration_seconds, completed, cycle_number)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [u1.id, cycle1.rows[0].id, 'pomodoro', '2026-03-01T09:00:00Z', '2026-03-01T09:25:00Z', 1500, true, 1]
    );

    const session2 = await pool.query(
        `INSERT INTO pomodoro_sessions (user_id, cycle_id, type, started_at, ended_at, duration_seconds, completed, cycle_number)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [u1.id, cycle1.rows[0].id, 'short_break', '2026-03-01T09:25:00Z', '2026-03-01T09:30:00Z', 300, true, 1]
    );

    const session3 = await pool.query(
        `INSERT INTO pomodoro_sessions (user_id, cycle_id, type, started_at, ended_at, duration_seconds, completed, cycle_number)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [u1.id, cycle1.rows[0].id, 'pomodoro', '2026-03-01T09:30:00Z', '2026-03-01T09:55:00Z', 1500, true, 2]
    );

    const session4 = await pool.query(
        `INSERT INTO pomodoro_sessions (user_id, cycle_id, type, started_at, ended_at, duration_seconds, completed, cycle_number)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [u2.id, cycle3.rows[0].id, 'pomodoro', '2026-03-01T10:00:00Z', '2026-03-01T10:25:00Z', 1500, true, 1]
    );

    await pool.query(
        'INSERT INTO session_tasks (session_id, task_id) VALUES ($1, $2)',
        [session1.rows[0].id, task1.rows[0].id]
    );

    await pool.query(
        'INSERT INTO session_tasks (session_id, task_id) VALUES ($1, $2)',
        [session3.rows[0].id, task2.rows[0].id]
    );

    await pool.query(
        'INSERT INTO session_tasks (session_id, task_id) VALUES ($1, $2)',
        [session4.rows[0].id, task3.rows[0].id]
    );

    console.log('Seed completed');
    await pool.end();
};

seed().catch(err => {
    console.error('Seed failed:', err);
    pool.end();
});
