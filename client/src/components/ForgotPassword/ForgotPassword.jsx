import { useState } from 'react';
import styles from './ForgotPassword.module.css';

const ForgotPassword = ({close}) => {
    const [formData, setFormData] = useState({
        email: '',
        verificationCode: ''
    });
    
    const [errors, setErrors] = useState({
        email: '',
        verificationCode: ''
    });

    const [step, setStep] = useState(1);

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
            verificationCode: ''
        };

        if (step === 1){
            if(!data.email || !data.email.includes('@')) {
                errors.email = 'Invalid email';
            }
        }

        if (step === 2){
            if(!data.verificationCode || data.verificationCode.length !== 6) {
                errors.verificationCode = 'Invalid code';
            }
        }

        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = validateForm(formData);
        setErrors(newErrors);

        const hasErrors = Object.values(newErrors).some(err => err != '');
        if (hasErrors) return;

        if (step === 1){
            console.log(step);
            setStep(2);
        }

        if (step === 2){
            setShowFeedback(true);
            setTimeout(() => {
                close();
            }, 2000);
        }

        console.log(errors);
    };

    const cancelSubmit = () => {
        setFormData({
            email: '',
            verificationCode: ''
        });

        setErrors({ 
            email: '', 
            verificationCode: ''
        });

        close();
    };

    return (
        <form className={styles['form']} noValidate onSubmit={handleSubmit}>
            <div className={styles['inputs-group']}>
                {
                    step === 1 && (
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
                    )
                }
                {
                    step === 2 && (
                        <div className={styles['inputs-field']}>
                            <label htmlFor="verification-code">Verification code</label>
                            <input
                                type='text'
                                placeholder='Enter the verification code sent to your email'
                                id='verification-code'
                                value={formData.verificationCode}
                                onChange={changeData}
                                name='verificationCode'
                                required
                            />
                            <span className={`${styles['input-alarm']} ${errors.verificationCode ? styles['active'] : ''}`}>
                                {errors.verificationCode}
                            </span>
                        </div>
                    )
                }

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
                        <p>Logged in successfully!</p>
                    </div>
                )}
            </div>
        </form>
    );
};

export default ForgotPassword;
