import { MusicIcon, PauseIcon, PlayIcon, TasksIcon } from '../../assets/icons/jsx';
import styles from './Footer.module.css';
import { PomodoroContext } from '../../contexts';
import { usePomodoro } from '../../hooks';
import { useContext } from 'react';

function Footer() {
    const { pomodoroControls } = usePomodoro();
    const { isRunning } = useContext(PomodoroContext);
    
    return (
        <footer className={styles['footer']}>
            <div className={styles['footer__content']}>
                <div className={styles['footer__menu']} aria-label='Menu actions'>
                    <button 
                        className={styles['footer__menu-item']}
                    >
                        <span>Music</span>
                        <MusicIcon />
                    </button>
                    <button  
                        className={styles['footer__menu-item']}
                        onClick={() => pomodoroControls.toggleTimer()}
                    >
                        <span>{isRunning ? 'Pause' : 'Play'}</span>
                        {isRunning ? <PauseIcon /> : <PlayIcon/>}
                    </button>
                    <button 
                        className={styles['footer__menu-item']}
                    >
                        <span>Tasks</span>
                        <TasksIcon />
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
