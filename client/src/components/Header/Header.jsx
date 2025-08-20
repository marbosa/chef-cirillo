import { LogoIcon, ProfileIcon, SettingsIcon } from '../../assets/icons/jsx';
import styles from './Header.module.css';

function Header() {
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
                    >
                        <span>Settings</span>
                        <SettingsIcon/>
                    </button>
                </div>    
            </div>
        </header>
    );
};

export default Header;
