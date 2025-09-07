import { createPortal } from 'react-dom';
import { CloseIcon } from '../../assets/icons/jsx';
import styles from './Modal.module.css';

function Modal({ title, isOpen, onClose, children }) {
    if (!isOpen) return null;
    
    return createPortal(
        <div className={styles['backdrop']} onClick={onClose}>
            <div 
                className={`${styles['modal']} ${isOpen ? styles['open'] : ''}`}
                onClick={(e) => e.stopPropagation()}    
            >
                <div className={styles['modal__content']}>
                    <header className={styles['modal__header']}>
                        <span>
                            { title }
                        </span>
                        <button onClick={onClose}>
                            <CloseIcon />
                        </button>
                    </header>
                    <section className={styles['modal__body']}>
                        { children }
                    </section>
                </div>
            </div>
        </div>,
        document.getElementById('layout')
    );
};

export default Modal;
