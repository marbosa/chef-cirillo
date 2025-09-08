import { createContext } from 'react';

const PomodoroContext = createContext({
    pomodoro: {},
    setPomodoro: () => {},
});

export default PomodoroContext;
