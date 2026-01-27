import { useState, useEffect } from 'react';
import styles from './DeleteAccount.module.css';

const DeleteAccount = ({ close }) => {
    const [showFeedback, setShowFeedback] = useState(false);
    
    const handleConfirm = () => {
        setShowFeedback(true);
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
            <p>Are you sure you want to delete your account?</p>
            
            <button
                className={styles['button-confirm']}
                onClick={handleConfirm}
                type="button"
            >
                Confirm
            </button>
            <button
                type="button"
                className={styles['button-cancel']}
                onClick={handleCancel}
            >
                Cancel
            </button>

            { showFeedback && (
                <div className={styles['feedback']}>
                    <p>Account deleted successfully!</p>
                </div>
            )}
        </div>
    );
};

export default DeleteAccount;
