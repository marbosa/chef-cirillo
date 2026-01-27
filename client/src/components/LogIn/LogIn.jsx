import { useState } from 'react';
import { ForgotPassword, Modal } from './../../components';
import styles from './LogIn.module.css';

const LogIn = ({close}) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({
        email: '',
        password: ''
    });

    const [forgotPassword, setForgotPassword] = useState(false);
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
            password: ''
        };

        if(!data.email || !data.email.includes('@')) {
            errors.email = 'Invalid email';
        }

        if(!data.password || data.password.length < 6) {
            errors.password = 'Minimun 6 characters';
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
    };

    const cancelSubmit = () => {
        setFormData({
            email: '',
            password: '',
        });

        setErrors({ 
            email: '', 
            password: '', 
        });

        close();
        console.log('Form cancel', formData);
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
                <div className={styles['inputs-field']}>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        placeholder="Enter your password"
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
            <span onClick={() => setForgotPassword(true)}>
                Forgot your password?
            </span>
            { showFeedback && (
                <div className={styles['form-feedback']}>
                    <p>Logged in successfully!</p>
                </div>
            )}
            { forgotPassword && (
                <Modal 
                    isOpen={forgotPassword} 
                    title={'Log in without a password'} 
                    onClose={() => setForgotPassword(false)}
                >
                    <ForgotPassword close={close}/>
                </Modal>
            )}
        </form>
    );
};

export default LogIn;
