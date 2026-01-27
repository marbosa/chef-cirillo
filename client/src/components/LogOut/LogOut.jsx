import { useState, useEffect } from 'react';
import styles from './LogOut.module.css';

const LogOut = ({ close }) => {
    const [showFeedback, setShowFeedback] = useState(false);
    
    const handleConfirm = () => {
        setShowFeedback(true);
        setTimeout(close, 2000);
    };

    const handleCancel = () => {
        close();
    };

    useEffect(() => {
        if (!showFeedback) return;
        const timer = setTimeout(close, 1500);
        return () => clearTimeout(timer);
    }, [showFeedback, close]);

    return (
        <div className={styles['modal']}>
            <p>Are you sure you want to log out?</p>
            <button
                className={styles['button-confirm']}
                onClick={handleConfirm}
                type="button"
            >
                Confirmar
            </button>
            <button
                type="button"
                className={styles['button-cancel']}
                onClick={handleCancel}
            >
                Cancelar
            </button>

            { showFeedback && (
                <div className={styles['feedback']}>
                    <p>Logged out successfully!</p>
                </div>
            )}
        </div>
    );
};

export default LogOut;
