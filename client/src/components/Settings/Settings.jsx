import { Children, useContext, useState } from 'react';
import { DeleteAccount, DeleteData, Modal, NumericInput, Select } from '../index';
import { ThemeContext, PomodoroContext } from '../../contexts/index';
import styles from './Settings.module.css';
import { useAlarm } from '../../hooks';

const Settings = () => {
    const { theme, setTheme } = useContext(ThemeContext);
    const { pomodoro, setPomodoro, autoStart, setAutoStart } = useContext(PomodoroContext);
    const { alarmSettings, setAlarmSettings } = useAlarm();

    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '',
        children: null
    });

    const closeModal = () => {
        setModalConfig(prev => ({ ...prev, isOpen: false}));
    };

    const defaultPomodoro = {
        pomodoro: 25,
        break: 5,
        longBreak: 10,
        longBreakInterval: 4
    };

    const deleteAccount = () => {
        setModalConfig({
            title: 'Delete your account',
            isOpen: true,
            children: <DeleteAccount close={closeModal}/>
        });
    };

    const deleteData = () => {
        setModalConfig({
            title: 'Delete your data',
            isOpen: true,
            children: <DeleteData close={closeModal}/>
        });
    };

    return (
        <div className={styles['settings__container']}>
            <section className={styles['settings__section']}>
                <h2 className={styles['settings__section-title']}>Timer</h2>
                <div className={styles['settings__section-item']}>
                    <span>Pomodoro</span>

                    <NumericInput 
                        name={'pomodoro'} 
                        value={pomodoro.pomodoro}
                        minValue={1}
                        maxValue={300}
                        onChange={val => setPomodoro({ ...pomodoro, pomodoro: val})}
                    />
                </div>
                <div className={styles['settings__section-item']}>
                    <span>Break</span>
                    <NumericInput 
                        name={'break'} 
                        value={pomodoro.break}
                        minValue={1}
                        maxValue={300}
                        onChange={val => setPomodoro({ ...pomodoro, break: val})}
                    />
                </div>
                <div className={styles['settings__section-item']}>
                    <span>Long Break</span>
                    <NumericInput 
                        name={'longBreak'} 
                        value={pomodoro.longBreak}
                        minValue={1}
                        maxValue={300}
                        onChange={val => setPomodoro({ ...pomodoro, longBreak: val})}
                    />
                </div>
                <div className={styles['settings__section-item']}>
                    <span>Long Break Interval</span>
                    <NumericInput 
                        name={'longBreakInterval'} 
                        value={pomodoro.longBreakInterval}
                        minValue={1}
                        maxValue={30}
                        onChange={val => setPomodoro({ ...pomodoro, longBreakInterval: val})}
                    />
                </div>
                <div className={styles['settings__section-item']}>
                    <span>Auto start</span>
                    <button
                        onClick={() => setAutoStart(prev => !prev)}
                    >
                        {autoStart ? 'On' : 'Off'}
                    </button>
                </div>
                <div className={styles['settings__section-item']}>
                    <span>Reset</span>
                    <button 
                        onClick={() => setPomodoro(defaultPomodoro)}
                    >
                        Ok
                    </button>
                </div>
            </section>

            <section className={styles['settings__section']}>
                <h2 className={styles['settings__section-title']}>Alarm</h2>

                <div className={styles['settings__section-item']}>
                    <span>Sound</span>
                    <Select 
                        options={alarmSettings.alarmOptions}
                        defaultValue={alarmSettings.alarmSelected}
                        onChange={(opt) => {
                            setAlarmSettings({
                                ...alarmSettings,
                                alarmSelected: opt
                            });
                        }}
                    />
                </div>
                <div className={styles['settings__section-item']}>
                    <span>Volume</span>
                    <input 
                        name='volume'
                        type='range' 
                        min='0' 
                        max='100'
                        value={alarmSettings.volume}
                        onChange={e => {
                            setAlarmSettings({
                                ...alarmSettings,
                                volume: Number(e.target.value)
                            });
                        }}
                />
                </div>
                <div className={styles['settings__section-item']}>
                    <span>Repeat</span>
                    <NumericInput 
                        name={'repeat'} 
                        value={alarmSettings.repeat}
                        minValue={0}
                        maxValue={10}
                        onChange={val => setAlarmSettings({ ...alarmSettings, repeat: val})}
                    />
                </div>
            </section>

            <section className={styles['settings__section']}>
                <h2 className={styles['settings__section-title']}>Theme</h2>
                
                <div className={styles['settings__section-item']}>
                    <span>Choose theme</span>
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
                {/* <div className={styles['settings__section-item']}>
                    <span>Tasks</span>
                    <button>Connect</button>
                </div> */}
            </section>

            <section className={styles['settings__section']}>
                <h2 className={styles['settings__section-title']}>Account</h2>
                
                <div className={styles['settings__section-item']}>
                    <span>Delete data</span>
                    <button onClick={() => deleteData()}>Ok</button>
                </div>
                <div className={styles['settings__section-item']}>
                    <span>Delete account</span>
                    <button onClick={() => deleteAccount()}>Ok</button>
                </div>
            </section>
            <Modal 
                isOpen={modalConfig.isOpen} 
                title={modalConfig.title} 
                onClose={closeModal}
            >
                {modalConfig.children}
            </Modal>
        </div>
    );
};

export default Settings;
