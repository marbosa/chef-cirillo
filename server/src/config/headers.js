export const applyHeaders = (res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('X-XSS-Protection', '0');
    res.setHeader('Referrer-Policy', 'no-referrer');

    res.setHeader('Content-Type', 'application/json');

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');    
};

export const handlePreflight = (req, res) => {
    if(req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return true;
    }
    return false;
};

