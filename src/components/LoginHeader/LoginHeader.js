import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './LoginHeader.module.css';

const LoginHeader = () => {
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const getUserProfile = async () => {
        const token = localStorage.getItem('jwtToken');
        if (!token) return;
        try {
            const response = await fetch('http://localhost:5000/api/auth/me', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch user profile');
            }
            const data = await response.json();
            setUserName(data.name || data.email);
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    useEffect(() => {
        getUserProfile();
    }, []);

    const handleExit = async () => {
        const token = localStorage.getItem('jwtToken');
        try {
            const response = await fetch('http://localhost:5000/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
            });
            if (!response.ok) {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('Error during logout:', error);
        } finally {
            localStorage.removeItem('jwtToken');
            navigate('/login');
        }
    };

    return (
        <>
            <div className={styles.buttonContainer}>
                <div className={styles.calcBtnContainer}>
                    <div className={styles.homeButtonsContainer}>
                        <button
                            className={`${styles.homeButtons} ${location.pathname === '/calculator' ? styles.activeButton : ''
                                }`}
                            onClick={() => navigate('/calculator')}
                        >
                            calculator
                        </button>
                        <button
                            className={`${styles.homeButtons} ${location.pathname === '/diary' ? styles.activeButton : ''
                                }`}
                            onClick={() => navigate('/diary')}
                        >
                            diary
                        </button>
                    </div>
                    <div className={styles.headerRight}>
                        <span className={styles.userName}>{userName}</span>
                        <button className={styles.exitButton} onClick={handleExit}>
                            Exit
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginHeader;