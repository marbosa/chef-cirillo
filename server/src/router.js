import { globalRateLimiter } from './middlewares/rateLimiter.js';

const routes = [];

const addRoute = (method, path, ...handlers) => {
    routes.push({ method, path, handlers });
};

const dispatch = (req, res) => {
    const [rawUrl, rawParams] = req.url.split('?');
    const urlParts = rawUrl.split('/');

    const route = routes.find(route => {
        if (route.method !== req.method) return false;

        const routeParts = route.path.split('/');
        if (routeParts.length !== urlParts.length) return false;
        
        return routeParts.every((part, index) => {
            if (part.startsWith(':')) return true;
            return part === urlParts[index];
        });
    });

    if(!route){
        res.writeHead(404);
        res.end(JSON.stringify({error: 'Not found'}));
        return;
    } 

    req.params = {};
    route.path.split('/').forEach((part, index) => {
        if (part.startsWith(':')) {
            req.params[part.slice(1)] = urlParts[index];
        }
    });

    req.query = Object.fromEntries(new URLSearchParams(rawParams || ''));
    
    let index = 0;
    const next = () => {
        const handler = route.handlers[index];
        if (!handler) return;
        index += 1;
        handler(req, res, next);
    };
    globalRateLimiter(req, res, next);
};

export const router = { addRoute, dispatch };
