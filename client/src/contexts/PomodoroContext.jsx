import { createContext } from 'react';

const PomodoroContext = createContext({
    pomodoro: {},
    setPomodoro: () => {},
    isRunning: false,
    setIsRunning: () => {},
    autoStart: false,
    setAutoStart: () => {},
});

export default PomodoroContext;
