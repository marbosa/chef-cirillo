import { useLocation, useNavigate } from 'react-router';
import styles from './Error.module.css';
import { LogoIcon } from '../../assets/icons/jsx';

const Error = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const error = location.state;
    const message = error?.message || 'Something went wrong'; 
    const code = error?.code || 404;

    return(
        <div className={styles['container']}>
            <div className={styles['content']}>
                <LogoIcon/>
                <div role="alert" className={styles['text']}>
                    <h1>Error {code}</h1>
                    <p>{message}</p>
                </div>
                <button 
                    className={styles['actionButton']} 
                    onClick={() => navigate('/')}
                    aria-label='Go back to home'
                >
                    Back to home
                </button>
            </div>
        </div>
    );

};

export default Error;
