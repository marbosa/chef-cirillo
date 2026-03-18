import { createContext } from 'react';

const PomodoroContext = createContext({
    pomodoro: {},
    setPomodoro: () => {},
    isRunning: false,
    setIsRunning: () => {},
    autoStart: false,
    setAutoStart: () => {},
    activeTaskId: null,
    setActiveTaskId: () => {}
});

export default PomodoroContext;
