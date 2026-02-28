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
            res.end(JSON.stringify({ error: 'Email and password are required'}));
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
    let body = '';

    req.on('data', (chunk) => { body += chunk; });

    req.on('end', async () => {
        body = JSON.parse(body);

        if (!body.email || !body.password) {
            res.writeHead(400);
            res.end(JSON.stringify({ error: 'Email and password are required'}));
            return;
        };

        try {
            const result = await pool.query('SELECT * FROM users WHERE email = $1', [body.email]);
            const user = result.rows[0];

            if(!user) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Invalid credentials'}));
                return;
            }

            if(await bcrypt.compare(body.password, user.password_hash)) {
                res.writeHead(200); 
                res.end(JSON.stringify({ message: 'Login successful' }));                
            } else {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Invalid credentials'}));
            }
        } catch {
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'Could not login'}));
        }
    });
});

router.addRoute('POST', '/auth/logout', (req, res) => {
    res.end('logout');
});
