import { useState } from 'react';
import styles from './ForgotPassword.module.css';
import { auth } from '../../api/auth';

const ForgotPassword = ({close}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({ email: '' });
    const [errors, setErrors] = useState({ email: '', server: '' });
    const [showFeedback, setShowFeedback] = useState(false);

    const changeData = (e) => {
        const {name, value} = e.target;

        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '', server: '' }));
    };
    
    const validateForm = (data) => {
        const errors = {
            email: '',
        };

        if(!data.email || !data.email.includes('@')) {
            errors.email = 'Invalid email';
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = validateForm(formData);
        setErrors({...newErrors, server: ''});

        const hasErrors = Object.values(newErrors).some(err => err != '');
        if (hasErrors) return;

        setShowFeedback(true);

        try {   
            setIsLoading(true);
            await auth.forgotPassword(formData);
        } catch(err) {
            setShowFeedback(false);
            setErrors(prev => ({ ...prev, server: err.message }));
            return;
        } 

        setIsLoading(false);

        setTimeout(() => {
            close();
        }, 4000);
    };

    const cancelSubmit = () => {
        setFormData({ email: '' });
        setErrors({ email: '', server: '' });

        close();
    };

    return (
        <form className={styles['form']} noValidate onSubmit={handleSubmit}>
            <div className={styles['inputs-group']}>
                <div className={styles['inputs-field']}>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        id="email"
                        value={formData.email}
                        onChange={changeData}
                        name='email'
                        required
                    />
                    <span className={`${styles['input-alarm']} ${errors.email ? styles['active'] : ''}`}>
                        {errors.email}
                    </span>
                </div>
                    
                <div className={styles['form-actions']}>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={styles['button-confirm']}
                    >
                        Confirm
                    </button>
                    <button
                        type="button"
                        disabled={isLoading}
                        className={styles['button-cancel']}
                        onClick={cancelSubmit}
                    >
                        Cancel
                    </button>
                </div>
                { errors.server && (
                    <div className={styles['form-feedback']}>
                        <p>{errors.server}</p>
                    </div>
                )}

                { showFeedback && (
                    <div className={styles['form-feedback']}>
                        {isLoading ? (
                            <p>Sending...</p>
                        ) : (
                            <p>Check your email for the new password!</p>
                        )}
                    </div>
                )}
            </div>
        </form>
    );
};

export default ForgotPassword;
