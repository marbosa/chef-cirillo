import { useState } from 'react';
import { ThemeContext } from './ThemeContext';

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('Default');
    
    return (
        <ThemeContext.Provider value={{theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
