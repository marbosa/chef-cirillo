import { ResetIcon } from '../../assets/icons/jsx';
import styles from './Main.module.css';

function Main() {
    return (
        <main className={styles['main']}>
            <div className={styles['main__content']}>
                <div className={styles['main__counter']}>
                    <div className={styles['main__counter-actions']}>
                        <button 
                            className={styles['main__counter-action']}
                        >
                            pomodoro
                        </button>
                        <button 
                            className={styles['main__counter-action']}
                        >
                            break
                        </button>
                        <button 
                            className={styles['main__counter-action']}
                        >
                            long break
                        </button>
                        {/* <button 
                            className={styles['main__counter-button']}
                        >
                            <ResetIcon />
                            reset
                        </button> */}
                    </div>
                    <time className={styles['main__counter-time']}>
                        50:00
                    </time>
                    <strong className={styles['main__counter-info']}>
                        #1
                    </strong>
                </div>
                <div className={styles['main__phrase-box']}>
                    <span>
                        {/* edits mantra */}
                    </span>
                    <p>
                        Pomodoro after pomodoro, the perfect sauce is made.
                    </p>
                </div>
            </div>
        </main>
    );
};

export default Main;
