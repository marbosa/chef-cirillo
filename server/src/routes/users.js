import bcrypt from 'bcrypt';
import pool from '../config/database.js';
import { authenticate } from '../middlewares/authenticate.js';
import { router } from '../router.js';
import { logger } from '../config/logger.js';

router.addRoute('GET', '/users/me', authenticate, async (req, res) => {
    const user = req.user;

    try {
        const query = await pool.query(
            'SELECT id, email, created_at, last_login_at FROM users WHERE id = $1',
            [user.id]
        );
        const result = query.rows[0];
        logger.info({ userId: user.id }, 'User fetched successfully');
        res.writeHead(200);
        res.end(JSON.stringify(result));
    } catch(err) {
        logger.error(err, 'Could not fetch user');
        res.writeHead(500);
        res.end(JSON.stringify({ message: 'Could not fetch user' }));
    }
});

router.addRoute('DELETE', '/users/me/delete', authenticate, async (req, res) => {
    const user = req.user;

    try {
        await pool.query(
            'DELETE FROM users WHERE id = $1',
            [user.id]
        );
        logger.info({ userId: user.id }, 'User deleted successfully');
        res.writeHead(200);
        res.end(JSON.stringify({ message: 'User deleted'}));
    } catch(err) {
        logger.error(err, 'Could not delete user');
        res.writeHead(500);
        res.end(JSON.stringify({ message: 'Could not delete user' }));
    }    
});

router.addRoute('PATCH', '/users/me/change-password', authenticate, async (req, res) => {
    const user = req.user;
    let rawBody = '';

    req.on('data', (chunk) => { rawBody += chunk; });

    req.on('end', async () => {
        try {
            const body = JSON.parse(rawBody);

            if(!body.newPassword || !body.password) {
                res.writeHead(400);
                res.end(JSON.stringify({ message: 'Passwords are required' }));
                return;
            }

            const result = await pool.query(
                'SELECT password_hash FROM users WHERE id = $1',
                [user.id]
            );

            if (result.rows.length === 0) {
                res.writeHead(404);
                res.end(JSON.stringify({ message: 'User not found' }));
                return;
            }

            const { password_hash } = result.rows[0];

            const passwordMatch = await bcrypt.compare(body.password, password_hash);            
            if (!passwordMatch) {
                res.writeHead(401);
                res.end(JSON.stringify({ message: 'Incorrect password' }));
                return;
            }

            const isSamePassword = await bcrypt.compare(body.newPassword, password_hash);

            if (isSamePassword) {
                res.writeHead(400);
                res.end(JSON.stringify({ message: 'New password must be different' }));
                return;
            }

            const newHash = await bcrypt.hash(body.newPassword, 10);

            await pool.query(
                'UPDATE users SET password_hash = $1 WHERE id = $2',
                [newHash, user.id]
            );
            
            logger.info({ userId: user.id }, 'Password changed successfully');
            res.writeHead(200);
            res.end(JSON.stringify({ message: 'Password changed successfully'}));                
        } catch(err) {
            logger.error(err, 'Invalid request');
            res.writeHead(500);
            res.end(JSON.stringify({ message: 'Invalid request'}));
        }
    });
});
