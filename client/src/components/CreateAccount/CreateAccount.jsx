import { useState } from 'react';
import styles from './CreateAccount.module.css';

const CreateAccount = ({ close }) => {
    const [formData, setFormData] = useState({
        email: '', 
        password: '', 
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({
        email: '', 
        password: '', 
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
            email: '',
            password: '',
            confirmPassword: ''
        };

        if(!data.email || !data.email.includes('@')) {
            errors.email = 'Invalid email';
        }

        if(!data.password || data.password.length < 6) {
            errors.password = 'Minimun 6 characters';
        }

        if(!data.confirmPassword || data.confirmPassword !== data.password) {
            errors.confirmPassword = 'Passwords do not match';
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

        console.log('Form valid', formData);
    };

    const cancelSubmit = () => {
        setFormData({
            email: '',
            password: '',
            confirmPassword: ''
        });
        setErrors({ 
            email: '', 
            password: '', 
            confirmPassword: '' 
        });

        close();
        console.log('Form cancel', formData);
    };

    return (
        <form noValidate className={styles['form']} onSubmit={handleSubmit}>
            <div className={styles['inputs-group']}>
                <div className={styles['inputs-field']}>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        placeholder="Enter a valid email address"
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

                <div className={styles['inputs-field']}>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        placeholder="Password must be at least 6 characters"
                        id="password"
                        name='password'
                        value={formData.password}
                        onChange={changeData}
                        required
                    />
                    <span className={`${styles['input-alarm']} ${errors.password ? styles['active'] : ''}`}>
                        {errors.password}
                    </span>
                </div>
                <div className={styles['inputs-field']}>
                    <label htmlFor="confirm-password">Confirm Password</label>
                    <input
                        type="password"
                        placeholder="Confirm password"
                        id="confirm-password"
                        name='confirmPassword'
                        onChange={changeData}
                        value={formData.confirmPassword}
                        required
                    />
                    <span className={`${styles['input-alarm']} ${errors.confirmPassword ? styles['active'] : ''}`}>
                        {errors.confirmPassword}
                    </span>
                </div>
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
                    <p>Account created successfully!</p>
                </div>
            )}
        </form>

    );
};

export default CreateAccount;
