import { useState } from 'react';
import { AlarmContext } from './index';

const AlarmProvider = ({ children }) => {
    const [alarmSettings, setAlarmSettings] = useState({
        alarmOptions: ['Alarm 1', 'Alarm 2', 'None'],
        alarmSelected: 'Alarm 1',
        volume: 100,
        repeat: 1,
    });

    return (
        <AlarmContext.Provider value={{ alarmSettings, setAlarmSettings }}>
            { children }
        </AlarmContext.Provider>
    );
};

export default AlarmProvider;
