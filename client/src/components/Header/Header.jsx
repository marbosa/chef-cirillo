import { Modal, Settings } from './../index';
import { LogoIcon, ProfileIcon, SettingsIcon } from '../../assets/icons/jsx';
import styles from './Header.module.css';
import { useState } from 'react';

function Header() {
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '',
        children: null
    });

    const openSettings = () => {
        setModalConfig({
            isOpen: true,
            title: 'Settings',
            children: <Settings />
        });
    };

    // const openProfile = () => {
    //     setModalConfig({
    //         isOpen: true,
    //         title: 'Profile',
    //         children: <Profile />
    //     });
    // };

    const closeModal = () => {
        setModalConfig(prev => ({ ...prev, isOpen: false}));
    };


    return (
        <header className={styles['header']}>
            <div className={styles['header__content']}>
                <button
                    className={styles['header__logo-button']}
                    aria-label='About the Chef Cirillo'
                >
                    <LogoIcon/>
                </button>                
                <div 
                    className={styles['header__menu']} 
                    role="group"
                    aria-label='Menu actions'
                >
                    <button 
                        className={styles['header__menu-item']} 
                        aria-label='Profile'
                    >
                        <span>Profile</span>
                        <ProfileIcon/>
                    </button>
                    <button 
                        className={styles['header__menu-item']} 
                        aria-label='Settings'
                        onClick={() => openSettings()}
                    >
                        <span>Settings</span>
                        <SettingsIcon/>
                    </button>
                </div>    
            </div>

            <Modal 
                isOpen={modalConfig.isOpen} 
                title={modalConfig.title} 
                onClose={closeModal}
            >
                {modalConfig.children}
            </Modal>
        </header>
    );
};

export default Header;
