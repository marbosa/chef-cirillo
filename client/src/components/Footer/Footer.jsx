import { useState } from 'react';
import { MusicIcon, PauseIcon, PlayIcon, TasksIcon } from '../../assets/icons/jsx';
import styles from './Footer.module.css';

function Footer() {
    const [hasStarted, setHasStarted] = useState(false);

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
                        onClick={() => setHasStarted(prevState => !prevState)}
                    >
                        <span>{hasStarted ? 'Pause' : 'Play'}</span>
                        {hasStarted ? <PauseIcon /> : <PlayIcon/>}
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
