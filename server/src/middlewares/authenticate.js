import jwt from './jsonwebtoken';

export const authenticate = (req, res, next) => {    
    const token = req.headers['authorization']?.replace('Bearer ', '');

    if (!token) {
        res.writeHead(401);
        res.end(JSON.stringify({ error: 'Unauthorized' }));
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        res.writeHead(401);
        res.end(JSON.stringify({ error: 'Unauthorized' }));
    }
};
