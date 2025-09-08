import { useState } from 'react';
import { ThemeContext } from './index';

const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('Default');
    
    return (
        <ThemeContext.Provider value={{theme, setTheme}}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;
