// Admin authentication and session management

export interface AdminUser {
    username: string;
    password: string; // In production, this should be hashed
    role: 'admin' | 'super-admin';
}

// Demo admin credentials (in production, use proper authentication)
export const ADMIN_USERS: AdminUser[] = [
    {
        username: 'admin',
        password: 'admin123', // Change this in production!
        role: 'super-admin'
    }
];

export const validateAdmin = (username: string, password: string): AdminUser | null => {
    const user = ADMIN_USERS.find(u => u.username === username && u.password === password);
    return user || null;
};
