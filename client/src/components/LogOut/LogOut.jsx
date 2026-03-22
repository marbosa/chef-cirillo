import { useState } from 'react';
import styles from './LogOut.module.css';
import { auth } from '../../api/auth';

const LogOut = ({ close }) => {
    const [showFeedback, setShowFeedback] = useState(false);
    
    const handleConfirm = async () => {
        try {
            await auth.logout();
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        } catch {
            return;
        }
        setShowFeedback(true);
        setTimeout(close, 2000);
    };

    const handleCancel = () => {
        close();
    };

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
