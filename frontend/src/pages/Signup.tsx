import React, { SyntheticEvent, useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import styles from "../styles/login-page.module.css";

export default function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
            }
        })();
    }, []);

    const submit = async (e: SyntheticEvent) => {
        e.preventDefault();

        const response = await fetch('http://localhost:5000/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
        });

        if (response.ok) {
            setRedirect(true);
        }
    };

    if (loggedIn) return <Navigate to="/" />;
    if (redirect) return <Navigate to="/login" />;

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <div className={styles.loginCard}>
                    <div className={styles.formSection}>
                        <div className={styles.header}>
                            <h1>Create an account</h1>
                            <p>Join us and start your journey!</p>
                        </div>

                        <form onSubmit={submit} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label htmlFor="username">
                                    USERNAME <span className={styles.required}>*</span>
                                </label>
                                <input id="username" type="text" onChange={e => setUsername(e.target.value)} required />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="email">
                                    EMAIL <span className={styles.required}>*</span>
                                </label>
                                <input id="email" type="email" onChange={e => setEmail(e.target.value)} required />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="password">
                                    PASSWORD <span className={styles.required}>*</span>
                                </label>
                                <input id="password" type="password" onChange={e => setPassword(e.target.value)} required />
                            </div>

                            <button type="submit" className={styles.loginButton}>
                                Register
                            </button>

                            <p className={styles.register}>
                                Already have an account? <span onClick={() => navigate("/login")} style={{ color: "#00a8fc", cursor: "pointer" }}>Log in</span>
                            </p>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}