import { router } from '../router.js';
import pool from '../config/database.js';
import bcrypt from 'bcrypt';

router.addRoute('POST', '/auth/register', (req, res) => {
    let body = '';

    req.on('data', (chunk) => { body += chunk; });
    
    req.on('end', async () => {
        body = JSON.parse(body);

        if (!body.email || !body.password) {
            res.writeHead(400);
            res.end(JSON.stringify({ error: 'mail and password are required'}));
            return;
        };

        const user = {
            email: body.email,
            passwordHash: await bcrypt.hash(body.password, 10)
        };

        try {
            await pool.query( 'INSERT INTO users (email, password_hash) VALUES ($1, $2)', [user.email, user.passwordHash]);
            res.writeHead(201);
            res.end(JSON.stringify({ message: 'Account created' }));
        } catch(err) {
            if(err.code === '23505') {
                res.writeHead(409);
                res.end(JSON.stringify({ error: 'Email already in use'}));
            } else {
                res.writeHead(500);
                res.end(JSON.stringify({ error: 'Could not create account'}));
            }
        }
    });
});

router.addRoute('POST', '/auth/login', (req, res) => {
    res.end('login');
});

router.addRoute('POST', '/auth/logout', (req, res) => {
    res.end('logout');
});
