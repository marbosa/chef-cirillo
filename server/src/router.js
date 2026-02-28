const routes = [];

const addRoute = (method, path, ...handlers) => {
    routes.push({ method, path, handlers });
};

const dispatch = (req, res) => {
    const route = routes.find(
        route => route.method === req.method && route.path === req.url
    );

    if(!route){
        res.writeHead(404);
        res.end(JSON.stringify({error: 'Not found'}));
        return;
    } 

    let index = 0;
    const next = () => {
        const handler = route.handlers[index];
        if (!handler) return;
        index += 1;
        handler(req, res, next);
    };
    next();
};

export const router = { addRoute, dispatch };
