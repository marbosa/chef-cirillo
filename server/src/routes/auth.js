import { router } from '../router.js';
import pool from '../config/database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authRateLimiter } from '../middlewares/rateLimiter.js';

router.addRoute('POST', '/auth/register', authRateLimiter, (req, res) => {
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
            const result = await pool.query(
                'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email', 
                [user.email, user.passwordHash]
            );
            const newUser = result.rows[0];

            const token = jwt.sign(
                { id: newUser.id, email: newUser.email },
                process.env.JWT_SECRET,
                { expiresIn:  process.env.JWT_EXPIRES_IN }
            );

            res.writeHead(201);
            res.end(JSON.stringify({ message: 'Account created', token }));
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

router.addRoute('POST', '/auth/login', authRateLimiter, (req, res) => {
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
                
                const token = jwt.sign(
                    { id: user.id, email: user.email },
                    process.env.JWT_SECRET,
                    { expiresIn:  process.env.JWT_EXPIRES_IN }
                );

                res.writeHead(200); 
                res.end(JSON.stringify({ message: 'Login successful', token })); 

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
    res.writeHead(200); 
    res.end(JSON.stringify({ message: 'Logout successful' }));                
});
