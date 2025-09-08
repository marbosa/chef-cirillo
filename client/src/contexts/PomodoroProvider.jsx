import { useState } from 'react';
import { PomodoroContext } from './index';

const PomodoroProvider = ({children}) => {
    const [pomodoro, setPomodoro] = useState({
        pomodoro: 25,
        break: 5,
        longBreak: 15,
        longBreakInterval: 4
    });
    
    return (
        <PomodoroContext.Provider value={{pomodoro, setPomodoro}}>
            {children}
        </PomodoroContext.Provider>
    );
};

export default PomodoroProvider;
