import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Header.module.css';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div>
            <div>
            <button
                    className={`${styles.homeButtons} ${location.pathname === '/' ? styles.activeButton : ''
                        }`}
                    onClick={() => navigate('/')}
                >
                     home
                </button>
                <button
                    className={`${styles.homeButtons} ${location.pathname === '/login' ? styles.activeButton : ''
                        }`}
                    onClick={() => navigate('/login')}
                >
                    log in
                </button>
                <button
                    className={`${styles.homeButtons} ${location.pathname === '/register' ? styles.activeButton : ''
                        }`}
                    onClick={() => navigate('/register')}
                >
                    registration
                </button>
            </div>
        </div>

    );
};

export default Header;