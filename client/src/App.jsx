import { RouterProvider } from 'react-router';
import { useContext } from 'react';
import { ThemeContext } from './context/ThemeContext';
import router from './routes';
import styles from './App.module.css';

function App() {
    const {theme} = useContext(ThemeContext);

    return (
        <div id='layout' className={styles['layout']} data-theme={theme}>
            <RouterProvider router={router} />
        </div>
    );  
};

export default App;
