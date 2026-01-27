import { useState } from 'react';
import styles from './ChangePassword.module.css';

const ChangePassword = ({close}) => {
    const [formData, setFormData] = useState({
        password: '',
        newPassword: '',
        confirmPassword: ''
    });
    
    const [errors, setErrors] = useState({
        password: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [showFeedback, setShowFeedback] = useState(false);

    const changeData = (e) => {
        const {name, value} = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        setErrors(prev => ({
            ...prev, 
            [name]: ''
        }));
    };

    const validateForm = (data) => {
        const errors = {
            password: '',
            confirmPassword: '',
            newPassword: ''
        };

        if(!data.password || data.password.length < 6) {
            errors.password = 'Invalid password';
        }

        if(!data.newPassword || data.newPassword.length < 6) {
            errors.newPassword = 'Invalid password';
        }

        if(!data.confirmPassword || data.confirmPassword.length < 6 || data.confirmPassword !== data.newPassword) {
            errors.confirmPassword = 'Invalid password';
        }

        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = validateForm(formData);
        setErrors(newErrors);

        const hasErrors = Object.values(newErrors).some(err => err != '');
        if (hasErrors) return;

        setShowFeedback(true);

        setTimeout(() => {
            close();
        }, 2000);

        console.log(errors);
    };

    const cancelSubmit = () => {
        setFormData({
            password: '',
            confirmPassword: '',
            newPassword: ''
        });

        setErrors({ 
            password: '',
            confirmPassword: '',
            newPassword: ''
        });

        close();
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className={styles['inputs-group']}>
                <div className={styles['inputs-field']}>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        id="password"
                        value={formData.password}
                        onChange={changeData}
                        name='password'
                        required
                    />
                    <span className={`${styles['input-alarm']} ${errors.password ? styles['active'] : ''}`}>
                        {errors.password}
                    </span>
                </div>
                <div className={styles['inputs-field']}>
                    <label htmlFor="new-password">New Password</label>
                    <input
                        type="password"
                        placeholder="Enter your new password"
                        id="new-password"
                        value={formData.newPassword}
                        onChange={changeData}
                        name='newPassword'
                        required
                    />
                    <span className={`${styles['input-alarm']} ${errors.newPassword ? styles['active'] : ''}`}>
                        {errors.newPassword}
                    </span>
                </div>
                <div className={styles['inputs-field']}>
                    <label htmlFor="confirm-password">Confirm new password</label>
                    <input
                        type="password"
                        placeholder="Enter your new password again"
                        id="confirm-password"
                        value={formData.confirmPassword}
                        onChange={changeData}
                        name='confirmPassword'
                        required
                    />
                    <span className={`${styles['input-alarm']} ${errors.confirmPassword ? styles['active'] : ''}`}>
                        {errors.confirmPassword}
                    </span>
                </div>
                <div className={styles['form-actions']}>
                    <button
                        type="submit"
                        className={styles['button-confirm']}
                    >
                        Confirmar
                    </button>
                    <button
                        type="button"
                        className={styles['button-cancel']}
                        onClick={cancelSubmit}
                    >
                        Cancelar
                    </button>
                </div>
                { showFeedback && (
                    <div className={styles['form-feedback']}>
                        <p>Password changed successfully!</p>
                    </div>
                )}
            </div>
        </form>
    );
};

export default ChangePassword;
