import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField } from '@mui/material';
import Header from '../../components/Header/Header';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', { // login endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        setErrorMsg(data.message || 'Login failed');
      } else {
        localStorage.setItem('jwtToken', data.token);
        console.log('Login sucesful:', data);
        navigate('/calculator'); // redirecționează după logare
      }
    } catch (error) {
      setErrorMsg('Server error: ' + error.message);
      console.error('Login error:', error);
    }
  };


  return (
    <>
      <div className={styles.container}>
        <Header />
        <div className={styles.loginContainer}>
          <h2 className={styles.loginPage}>log in</h2>
          <form className={styles.formGroupLogin} onSubmit={handleLogin}>
            <TextField
              label="Email"
              variant="standard"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              margin="normal"
              sx={{ width: '240px' }}
              required
            />

            <TextField
              label="Password"
              variant="standard"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              sx={{ width: '240px' }}
              required
            />
            {errorMsg && <p className={styles.errorMsg}>{errorMsg}</p>}
            <div className={styles.btnContainer}>
              <button className={styles.logBtn} type="submit">Log in</button>
              <button className={styles.regBtn} onClick={() => navigate('/register')}>Register</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;