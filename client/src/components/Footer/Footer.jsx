import { MusicIcon, PauseIcon, PlayIcon, TasksIcon } from '../../assets/icons/jsx';
import styles from './Footer.module.css';
import { PomodoroContext } from '../../contexts';
import { usePomodoro } from '../../hooks';
import { useState, useContext } from 'react';
import { Modal, Tasks } from '../index';

function Footer() {
    const { pomodoroControls } = usePomodoro();
    const { isRunning } = useContext(PomodoroContext);
    
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '',
        children: null
    });

    const openTasks = () => {
        setModalConfig({
            isOpen: true,
            title: 'Tasks',
            children: <Tasks />
        });
    };

    // const openMusic = () => {
    //     setModalConfig({
    //         isOpen: true,
    //         title: 'Music',
    //         children: <Music />
    //     });
    // };

    const closeModal = () => {
        setModalConfig(prev => ({ ...prev, isOpen: false}));
    };

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
                        onClick={() => openTasks()}
                    >
                        <span>Tasks</span>
                        <TasksIcon />
                    </button>
                </div>
            </div>

            <Modal 
                isOpen={modalConfig.isOpen} 
                title={modalConfig.title} 
                onClose={closeModal}
            >
                {modalConfig.children}
            </Modal>
        </footer>
    );
};

export default Footer;
