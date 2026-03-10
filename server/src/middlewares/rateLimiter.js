import { RateLimiterMemory } from 'rate-limiter-flexible';

const opts = {
    points: 6,
    duration: 60,
};

const rateLimiter = new RateLimiterMemory(opts);

export const authRateLimiter = async (req, res, next) => {
    try {
        await rateLimiter.consume(req.socket.remoteAddress);
        next();
    } catch {
        res.writeHead(429);
        res.end(JSON.stringify({ error: 'Too many requests' }));
    }
};

const globalOpts = {
    points: 100,
    duration: 60
};

const globalLimiter = new RateLimiterMemory(globalOpts);

export const globalRateLimiter = async (req, res, next) => {
    try {
        await globalLimiter.consume(req.socket.remoteAddress);
        next();
    } catch {
        res.writeHead(429);
        res.end(JSON.stringify({ error: 'Too many requests' }));
    }
};
