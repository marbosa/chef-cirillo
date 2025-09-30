import { createContext } from 'react';

const AlarmContext = createContext({
    alarmOptions: ['Alarm 1', 'Alarm 2', 'None'],
    alarmSelected: 'Alarm 1',
    volume: 50,
    repeat: 1,
});

export default AlarmContext;
