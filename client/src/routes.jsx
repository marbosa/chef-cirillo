import { createBrowserRouter } from 'react-router';
import { Home, Error } from './pages';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
        errorElement: <Error />
    }
]);

export default router;
