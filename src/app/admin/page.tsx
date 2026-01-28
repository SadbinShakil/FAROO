'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './AdminLogin.module.css';

export default function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();

            if (res.ok) {
                // Compatibility for older components that might still check session storage
                sessionStorage.setItem('adminAuth', 'true');
                router.push('/admin/dashboard');
            } else {
                setError(data.error || 'Invalid credentials');
            }
        } catch (err) {
            setError('Login failed. Please try again.');
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
                </form>
            </div>
        </div>
    );
}
