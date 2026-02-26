import http from 'http';
import dotenv from 'dotenv';
import { applyHeaders, handlePreflight } from './config/headers.js';

dotenv.config();

const PORT = process.env.PORT;

const server = http.createServer((req, res) => {
    applyHeaders(res);
    if (handlePreflight(req, res)) return;

    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/plain'});
        res.end('Chef Cirillo');
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
