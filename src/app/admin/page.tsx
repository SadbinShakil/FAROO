'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './AdminLogin.module.css';

export default function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        // Simple demo authentication
        if (username === 'admin' && password === 'admin123') {
            // Store in sessionStorage (in production, use proper auth)
            sessionStorage.setItem('adminAuth', 'true');
            router.push('/admin/dashboard');
        } else {
            setError('Invalid credentials. Try admin/admin123');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.loginBox}>
                <div className={styles.header}>
                    <h1>Admin Panel</h1>
                    <p>Sign in to manage your store</p>
                </div>

                <form onSubmit={handleLogin} className={styles.form}>
                    {error && <div className={styles.error}>{error}</div>}

                    <div className={styles.inputGroup}>
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username"
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            required
                        />
                    </div>

                    <button type="submit" className={styles.loginBtn}>
                        Sign In
                    </button>

                    <div className={styles.hint}>
                        Demo credentials: admin / admin123
                    </div>
                </form>
            </div>
        </div>
    );
}
