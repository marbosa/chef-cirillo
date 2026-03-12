import http from 'http';
import dotenv from 'dotenv';
import { router } from './router.js';
import { applyHeaders, handlePreflight } from './config/headers.js';
import './routes/index.js';

dotenv.config();

const PORT = process.env.PORT;

const server = http.createServer((req, res) => {
    applyHeaders(res);
    if (handlePreflight(req, res)) return;

    router.dispatch(req, res);
});

server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
