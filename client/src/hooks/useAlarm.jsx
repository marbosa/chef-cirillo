import { AlarmContext } from '../contexts';
import { useContext, useEffect, useRef } from 'react';
import { alarmSound1, alarmSound2 } from '../assets/sounds';

export const useAlarm = () => {
    const { alarmSettings, setAlarmSettings } = useContext(AlarmContext);
    const audio = useRef(new Audio(alarmSound1));
    const prevAudio = useRef(alarmSettings.alarmSelected);
    const isFirstRender = useRef(true);    
    const repeat = useRef(alarmSettings.repeat);

    useEffect(() => {
        let audioFile;

        if (alarmSettings.alarmSelected != prevAudio.current) {    
            if (audio.current) {
                audio.current.pause();
                audio.current.currentTime = 0;
            }

            if (alarmSettings.alarmSelected === 'None') {
                audio.current = null;
            } else {
                if (alarmSettings.alarmSelected === 'Alarm 1') audioFile = alarmSound1;
                else if (alarmSettings.alarmSelected === 'Alarm 2') audioFile = alarmSound2;
                
                audio.current = new Audio(audioFile);
            }
        }

        if (audio.current) audio.current.volume = alarmSettings.volume / 100;

        repeat.current = alarmSettings.repeat; 

        prevAudio.current = alarmSettings.alarmSelected;
    }, [alarmSettings]);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if(audio.current && !isFirstRender.current) {
            audio.current.pause();
            audio.current.currentTime = 0;
            audio.current.play();
        }
    }, [alarmSettings.alarmSelected]);

    const playAlarm = () => {
        const playNext = () => {
            if(audio.current && repeat.current > 0){
                audio.current.currentTime = 0;
                audio.current.play();
                audio.current.onended = () => {
                    repeat.current--;
                    playNext();
                };
            };
        };

        repeat.current = alarmSettings.repeat;
        playNext();
    };

    return { alarmSettings, setAlarmSettings, playAlarm };
};
