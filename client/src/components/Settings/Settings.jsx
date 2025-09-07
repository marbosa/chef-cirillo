import { useContext, useState } from 'react';
import { NumericInput, Select } from '../index';
import { ThemeContext } from '../../context/ThemeContext';
import styles from './Settings.module.css';

function Settings() {
    const [alarm, setAlarm] = useState('Alarm 1');
    const {theme, setTheme} = useContext(ThemeContext);

    const config = {
        pomodoro: 25,
        break: 5,
        longBreak: 15,
        longBreakIntervalN: 4
    };

    const [pomodoroTime, setPomodoroTime] = useState(config.pomodoro);
    const [breakTime, setBreakTime] = useState(config.break);
    const [longBreakTime, setLongBreakTime] = useState(config.longBreak);
    const [longBreakInterval, setLongBreakInterval] = useState(config.longBreakIntervalN);

    
    return (
        <div className={styles['settings__container']}>
            <section className={styles['settings__section']}>
                <h2 className={styles['settings__section-title']}>Timer</h2>
                <div className={styles['settings__section-item']}>
                    <span>Pomodoro</span>

                    <NumericInput 
                        name={'pomodoro'} 
                        value={pomodoroTime}
                        minValue={0}
                        maxValue={300}
                        onChange={val => setPomodoroTime(val)}
                    />
                </div>
                <div className={styles['settings__section-item']}>
                    <span>Break</span>
                    <NumericInput 
                        name={'break'} 
                        value={breakTime}
                        minValue={0}
                        maxValue={300}
                        onChange={val => setBreakTime(val)}
                    />
                </div>
                <div className={styles['settings__section-item']}>
                    <span>Long Break</span>
                    <NumericInput 
                        name={'longBreak'} 
                        value={longBreakTime}
                        minValue={0}
                        maxValue={300}
                        onChange={val => setLongBreakTime(val)}
                    />
                </div>
                <div className={styles['settings__section-item']}>
                    <span>Long Break Interval</span>
                    <NumericInput 
                        name={'longBreakInterval'} 
                        value={longBreakInterval}
                        minValue={0}
                        maxValue={30}
                        onChange={val => setLongBreakInterval(val)}
                    />
                </div>
                <div className={styles['settings__section-item']}>
                    <span>Auto start</span>
                    <button>On</button>
                </div>
                <div className={styles['settings__section-item']}>
                    <span>Reset</span>
                    <button 
                        onClick={() => {
                            setPomodoroTime(config.pomodoro);
                            setBreakTime(config.break);
                            setLongBreakTime(config.longBreak);
                            setLongBreakInterval(config.longBreakIntervalN);
                        }}
                    >Ok</button>
                </div>
            </section>

            <section className={styles['settings__section']}>
                <h2 className={styles['settings__section-title']}>Alarm</h2>

                <div className={styles['settings__section-item']}>
                    <span>Sound</span>
                    <Select 
                        options={['Alarm 1', 'Alarm 2', 'None']}
                        defaultValue={alarm}
                        onChange={setAlarm}
                    />
                </div>
                <div className={styles['settings__section-item']}>
                    <span>Volume</span>
                    <input type='range' min='0' max='100'/>
                </div>
            </section>

            <section className={styles['settings__section']}>
                <h2 className={styles['settings__section-title']}>Theme</h2>
                
                <div className={styles['settings__section-item']}>
                    <span>Chose theme</span>
                    <Select 
                        options={['Default', 'Light', 'Dark']}
                        defaultValue={theme}
                        onChange={setTheme}
                    />
                </div>
            </section>

            <section className={styles['settings__section']}>
                <h2 className={styles['settings__section-title']}>Integrations</h2>
                
                <div className={styles['settings__section-item']}>
                    <span>Music</span>
                    <button>Connect</button>
                </div>
                <div className={styles['settings__section-item']}>
                    <span>Tasks</span>
                    <button>Connect</button>
                </div>
            </section>
        </div>
    );
};

export default Settings;
