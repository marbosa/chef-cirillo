import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { PomodoroProvider, AlarmProvider, ThemeProvider } from './contexts/index';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
    // <StrictMode>
        <ThemeProvider>
            <PomodoroProvider>
                <AlarmProvider>
                    <App />
                </AlarmProvider>
            </PomodoroProvider>
        </ThemeProvider>
    // </StrictMode>,
);
