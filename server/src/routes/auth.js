import { router } from '../router.js';
import pool from '../config/database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { authRateLimiter } from '../middlewares/rateLimiter.js';
import { logger } from '../config/logger.js';
import { authenticate } from '../middlewares/authenticate.js';
import { transporter } from '../config/mailer.js';

router.addRoute('POST', '/auth/register', authRateLimiter, (req, res) => {
    let body = '';

    req.on('data', (chunk) => { body += chunk; });
    
    req.on('end', async () => {
        body = JSON.parse(body || '{}');

        if (!body.email || !body.password) {
            res.writeHead(400);
            res.end(JSON.stringify({ message: 'Email and password are required'}));
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

            const accessToken = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn:  process.env.JWT_EXPIRES_IN }
            );

            const refreshToken = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_REFRESH_SECRET,
                { expiresIn:  process.env.JWT_REFRESH_EXPIRES_IN }
            );

            logger.info({ userId: newUser.id }, 'Account created successfully');
            res.writeHead(201);
            res.end(JSON.stringify({ message: 'Account created', accessToken, refreshToken }));
        } catch(err) {
            if(err.code === '23505') {
                res.writeHead(409);
                res.end(JSON.stringify({ message: 'Email already in use'}));
            } else {
                logger.error(err, 'Could not create account');
                res.writeHead(500);
                res.end(JSON.stringify({ message: 'Could not create account'}));
            }
        }
    });
});

router.addRoute('POST', '/auth/login', authRateLimiter, (req, res) => {
    let body = '';

    req.on('data', (chunk) => { body += chunk; });

    req.on('end', async () => {
        body = JSON.parse(body || '{}');

        if (!body.email || !body.password) {
            res.writeHead(400);
            res.end(JSON.stringify({ message: 'Email and password are required'}));
            return;
        };

        try {
            const result = await pool.query('SELECT * FROM users WHERE email = $1', [body.email]);
            const user = result.rows[0];

            if(!user) {
                res.writeHead(400);
                res.end(JSON.stringify({ message: 'Invalid credentials'}));
                return;
            }

            if(await bcrypt.compare(body.password, user.password_hash)) {
                const accessToken = jwt.sign(
                    { id: user.id, email: user.email },
                    process.env.JWT_SECRET,
                    { expiresIn:  process.env.JWT_EXPIRES_IN }
                );

                const refreshToken = jwt.sign(
                    { id: user.id, email: user.email },
                    process.env.JWT_REFRESH_SECRET,
                    { expiresIn:  process.env.JWT_REFRESH_EXPIRES_IN }
                );

                logger.info({ userId: user.id }, 'Login successful');
                res.writeHead(200); 
                res.end(JSON.stringify({ message: 'Login successful', accessToken, refreshToken })); 
            } else {
                res.writeHead(400);
                res.end(JSON.stringify({ message: 'Invalid credentials'}));
            }
        } catch(err) {
            logger.error(err, 'Could not login');
            res.writeHead(500);
            res.end(JSON.stringify({ message: 'Could not login'}));
        }
    });
});

router.addRoute('POST', '/auth/refresh', (req, res) => {
    let rawBody = '';
    
    req.on('data', (chunk) => rawBody += chunk);

    req.on('end', () => {
        const body = JSON.parse(rawBody || '{}');
        const refreshToken = body.refreshToken;        
        try {
            const tokenDecoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

            const accessToken = jwt.sign(
                { id: tokenDecoded.id, email: tokenDecoded.email },
                process.env.JWT_SECRET,
                { expiresIn:  process.env.JWT_EXPIRES_IN }
            );
            logger.info({ userId: tokenDecoded.id }, 'Access token refreshed');
            res.writeHead(200);
            res.end(JSON.stringify({ accessToken: accessToken }));
        } catch(err) {
            logger.warn(err, 'Invalid or expired refresh token');
            res.writeHead(401);
            res.end(JSON.stringify({ message: 'Invalid or expired refresh token' }));
        }
    });
});

router.addRoute('POST', '/auth/forgot-password', authRateLimiter, (req, res) => {
    let rawBody = '';

    req.on('data', (chunk) => rawBody += chunk);

    req.on('end', async () => {
        const body = JSON.parse(rawBody || '{}');
    
        if (!body.email) {
            res.writeHead(400);
            res.end(JSON.stringify({ message: 'Email are required'}));
            return;
        };

        try {
            const result = await pool.query('SELECT * FROM users WHERE email = $1', [body.email]);
            const user = result.rows[0];

            if(!user) {
                res.writeHead(400);
                res.end(JSON.stringify({ message: 'Invalid email'}));
                return;
            }  

            const newPassword = crypto.randomBytes(6).toString('base64');
            const newHash = await bcrypt.hash(newPassword, 10);

            await pool.query(
                'UPDATE users SET password_hash = $1 WHERE email = $2',
                [newHash, user.email]
            ); 

            await transporter.sendMail({
                from: '"Support" <brain.weimann27@ethereal.email>',
                to: body.email,
                subject: 'Your temporary password',
                html: `
                    <p>We received a password recovery request.</p>
                    <p>Your temporary password is: <strong>${newPassword}</strong></p>
                    <p>Use it to log in and then change your password.</p>
                `,
            });

            logger.info({ email: body.email }, 'Temporary password sent');
            res.writeHead(200);
            res.end(JSON.stringify({ message: 'Temporary password sent to your email' }));
        } catch(err) {
            logger.error(err, 'Could not change password');
            res.writeHead(500);
            res.end(JSON.stringify({ message: 'Could not cnage password'}));
        }
    });
});

router.addRoute('POST', '/auth/logout', authenticate, (req, res) => {
    logger.info({ userId: req.user.id }, 'Logout successful');
    res.writeHead(200); 
    res.end(JSON.stringify({ message: 'Logout successful' }));                
});
