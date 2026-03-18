import { useEffect, useContext, useReducer } from 'react';
import { PomodoroContext } from '../contexts';
import { useAlarm } from './index';

function secondsForType(type, config) {
    if (type === 'pomodoro') return config.pomodoro * 60;
    if (type === 'break') return config.break * 60;
    if (type === 'longBreak') return config.longBreak * 60;
    return 0;
}

const ACTIONS = {
    SET_TYPE: 'SET_TYPE',
    INCREMENT_COUNT: 'INCREMENT_COUNT',
    RESET: 'RESET',
    SET_TIME: 'SET_TIME',
    DECREMENT_TIME: 'DECREMENT_TIME',
    TOGGLE_CYCLE: 'TOGGLE_CYCLE'
};

export const usePomodoro = () => {
    const { pomodoro, isRunning, setIsRunning, autoStart, activeTaskId } = useContext(PomodoroContext);

    const { playAlarm } = useAlarm();

    const initialState = {
        currentType: 'pomodoro',
        pomodoroCount: 1,
        timeLeft: secondsForType('pomodoro', pomodoro),
        cycleReverted: false
    };

    const reducer = (state, action) => {
        switch (action.type) {
            case ACTIONS.SET_TYPE: return { ...state, currentType: action.payload };
            case ACTIONS.INCREMENT_COUNT: return { ...state, pomodoroCount: state.pomodoroCount + 1 };
            case ACTIONS.SET_TIME: return { ...state, timeLeft: secondsForType(action.payload, pomodoro) };
            case ACTIONS.DECREMENT_TIME: return { ...state, timeLeft: Math.max(state.timeLeft - action.payload, 0) };
            case ACTIONS.TOGGLE_CYCLE: return { ...state, cycleReverted: !state.cycleReverted };
            case ACTIONS.RESET: return { ...initialState };
            default: return state;
        }
    };

    const [pomodoroState, dispatch] = useReducer(reducer, initialState);

    const pomodoroControls = {
        toggleTimer: () => setIsRunning(prev => !prev),
        resetTimer: () => {
            dispatch({ type: ACTIONS.RESET });
            setIsRunning(false);
        },
        switchCycle: (type) => {
            dispatch({ type: ACTIONS.SET_TYPE, payload: type });
            dispatch({ type: ACTIONS.SET_TIME, payload: type });
            dispatch({ type: ACTIONS.TOGGLE_CYCLE });
            setIsRunning(false);
        }
    };

    useEffect(() => {
        dispatch({ type: ACTIONS.RESET });
        setIsRunning(false);
    }, [pomodoro, setIsRunning]);

    useEffect(() => {
        if (!isRunning) return;

        let lastTimestamp = Date.now();

        function handleCycleEnd() {
            if (pomodoroState.currentType === 'pomodoro') {
                if (pomodoroState.cycleReverted) dispatch({ type: ACTIONS.INCREMENT_COUNT });

                if (pomodoroState.pomodoroCount % pomodoro.longBreakInterval === 0) {
                    dispatch({ type: ACTIONS.SET_TYPE, payload: 'longBreak' });
                    dispatch({ type: ACTIONS.SET_TIME, payload: 'longBreak' });
                } else {
                    dispatch({ type: ACTIONS.SET_TYPE, payload: 'break' });
                    dispatch({ type: ACTIONS.SET_TIME, payload: 'break' });
                }
            } else {
                dispatch({ type: ACTIONS.SET_TYPE, payload: 'pomodoro' });
                dispatch({ type: ACTIONS.SET_TIME, payload: 'pomodoro' });
                if (!pomodoroState.cycleReverted) dispatch({ type: ACTIONS.INCREMENT_COUNT });
            }
            if(activeTaskId !== null) {
                console.log(activeTaskId);
            }
        }

        const interval = setInterval(() => {
            const now = Date.now();
            const elapsed = Math.floor((now - lastTimestamp) / 1000);

            if (elapsed >= 1) {
                if (pomodoroState.timeLeft - elapsed <= 0) {
                    handleCycleEnd();
                    playAlarm();
                    if (!autoStart) setIsRunning(false);
                } else {
                    dispatch({ type: ACTIONS.DECREMENT_TIME, payload: elapsed });
                }
                lastTimestamp = now;
            }
        }, 250);

        return () => clearInterval(interval);
    }, [isRunning, pomodoroState, pomodoro, autoStart, setIsRunning, playAlarm, activeTaskId]);

    return { pomodoroState, pomodoroControls };
};
