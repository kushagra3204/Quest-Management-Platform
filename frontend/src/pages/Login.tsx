import React, { SyntheticEvent, useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import styles from "../styles/login-page.module.css"

interface LoginParam {
  setLoggedInUser?: React.Dispatch<React.SetStateAction<boolean | null>>;
}

export default function Login({ setLoggedInUser }: LoginParam) {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('user');
  const [redirect, setRedirect] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const response = await fetch('http://localhost:5000/api/auth/user', {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (response.ok) {
        setLoggedIn(true);
        if (setLoggedInUser) {
          setLoggedInUser(true);
        }
      } else {
        setLoggedIn(false);
        if (setLoggedInUser) {
          setLoggedInUser(false);
        }
      }
    })();
  }, [setLoggedInUser]);

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();

    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username__email: usernameOrEmail, password: password }),
    });

    if (response.ok) {
      setRedirect(true);
      if (setLoggedInUser) {
        setLoggedInUser(true);
      }
    } else {
      alert('Invalid credentials');
    }
  };

  if (loggedIn == null) return <p>Loading...</p>
  if (loggedIn) return <Navigate to="/" />;
  if (redirect) return <Navigate to="/" />;


  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.loginCard}>
          <div className={styles.formSection}>
            <div className={styles.header}>
              <h1>Welcome back!</h1>
              <p>We're so excited to see you again!</p>
            </div>

            <form onSubmit={submit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="email">
                  EMAIL OR USERNAME <span className={styles.required}>*</span>
                </label>
                <input id="email" type="text" onChange={e => setUsernameOrEmail(e.target.value)} required />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="password">
                  PASSWORD <span className={styles.required}>*</span>
                </label>
                <input
                  id="password"
                  type="password"
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>

              <span onClick={() => navigate("/signup")} style={{ color: "#00a8fc", cursor: "pointer" }}>Forgot your password?</span>

              <button type="submit" className={styles.loginButton}>
                Log In
              </button>

              <p className={styles.register}>
                Need an account? <span onClick={() => navigate("/signup")} style={{ color: "#00a8fc", cursor: "pointer" }}>Register</span>
              </p>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}