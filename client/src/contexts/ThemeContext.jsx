import { createContext } from 'react';

const ThemeContext = createContext({
    theme: 'Default',
    setTheme: () => {}
});


export default ThemeContext;
