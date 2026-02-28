import { router } from '../router.js';

router.addRoute('POST', '/auth/register', (req, res) => {
    res.end('register');
});

router.addRoute('POST', '/auth/login', (req, res) => {
    res.end('login');
});

router.addRoute('POST', '/auth/logout', (req, res) => {
    res.end('logout');
});
