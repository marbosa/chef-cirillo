import { useState } from 'react';
import { PomodoroContext } from './index';

const PomodoroProvider = ({ children }) => {
    const [pomodoro, setPomodoro] = useState({
        pomodoro: 1,
        break: 1,
        longBreak: 1,
        longBreakInterval: 2
    });
    
    const [isRunning, setIsRunning] = useState(false);
    const [autoStart, setAutoStart] = useState(false);
    
    return (
        <PomodoroContext.Provider value={{ pomodoro, setPomodoro, isRunning, setIsRunning, autoStart, setAutoStart }}>
            { children }
        </PomodoroContext.Provider>
    );
};

export default PomodoroProvider;
