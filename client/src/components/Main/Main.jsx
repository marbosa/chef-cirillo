import { usePomodoro } from '../../hooks/index';
import { ResetIcon } from '../../assets/icons/jsx';
import styles from './Main.module.css';

const Main = () => {
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const secs = time % 60;
        return [minutes.toString().padStart(2, '0'), secs.toString().padStart(2, '0')];    
    };

    const { pomodoroState, pomodoroControls} = usePomodoro();
    const [minutes, secs] = formatTime(pomodoroState.timeLeft);

    return (
        <main className={styles['main']}>
            <div className={styles['main__content']}>
                <div className={styles['main__counter']}>
                    <div className={styles['main__counter-actions']}>
                        <button 
                            onClick={() => pomodoroControls.switchCycle('pomodoro')}
                            className={styles['main__counter-action']}
                            style={pomodoroState.currentType === 'pomodoro' ? {backgroundColor: 'var(--timer-pomodoro)'} : undefined}
                        >
                            pomodoro
                        </button>
                        <button 
                            onClick={() => pomodoroControls.switchCycle('break')}
                            className={styles['main__counter-action']}
                            style={pomodoroState.currentType === 'break' ? {backgroundColor: 'var(--timer-short-break)'} : undefined}
                        >
                            break
                        </button>
                        <button 
                            onClick={() => pomodoroControls.switchCycle('longBreak')}
                            className={styles['main__counter-action']}
                            style={pomodoroState.currentType === 'longBreak' ? {backgroundColor: 'var(--timer-long-break)'} : undefined}
                        >
                            long break
                        </button>
                    </div>
                    <time className={styles['main__counter-time']}>
                        {[...minutes].map((digit, i) => (
                            <span key={i} className={styles.digit}>{digit}</span>
                        ))}
                        <span className={styles.separator}>:</span>
                        {[...secs].map((digit, i) => (
                            <span key={i} className={styles.digit}>{digit}</span>
                        ))}
                    </time>
                    <strong 
                        className={styles['main__counter-info']}
                        onClick={() => pomodoroControls.resetTimer()}
                    >
                        {`#${pomodoroState.pomodoroCount}`}
                        <button 
                            className={styles['main__counter-button']}
                        >
                            <ResetIcon />
                            reset
                        </button>
                    </strong>
                </div>
                <div className={styles['main__phrase-box']}>
                    <p>
                        Pomodoro after pomodoro, the perfect sauce is made.
                    </p>
                </div>
            </div>
        </main>
    );
};

export default Main;
