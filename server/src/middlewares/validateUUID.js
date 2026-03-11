const validateUUID = (req, res, next) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

    for (const param of Object.values(req.params)) {
        if (!uuidRegex.test(param)) {
            res.writeHead(400);
            res.end(JSON.stringify({ error: 'Invalid UUID'}));
            return;
        }
    }

    next();
};

export default validateUUID;
