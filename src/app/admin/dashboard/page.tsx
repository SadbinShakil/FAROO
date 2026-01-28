'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, ShoppingCart, Tag, Users, TrendingUp, AlertCircle } from 'lucide-react';
// import { PRODUCTS } from '@/data/products';
// import { ORDERS, getOrderStats } from '@/data/orders';
import { DISCOUNTS } from '@/data/discounts'; // Kept static for now as we didn't migrate discounts API yet
import { Order } from '@/data/orders';
import styles from './Dashboard.module.css';

export default function AdminDashboard() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [products, setProducts] = useState<any[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const auth = sessionStorage.getItem('adminAuth');
        if (auth !== 'true') {
            router.push('/admin');
        } else {
            setIsAuthenticated(true);
            fetchData();
        }
    }, [router]);

    const fetchData = async () => {
        try {
            const [productsRes, ordersRes] = await Promise.all([
                fetch('/api/products'),
                fetch('/api/orders')
            ]);

            if (productsRes.ok) setProducts(await productsRes.json());
            if (ordersRes.ok) {
                const ordersData = await ordersRes.json();
                setOrders(ordersData.map((o: any) => ({
                    ...o,
                    createdAt: new Date(o.createdAt),
                    updatedAt: new Date(o.updatedAt)
                })));
            }
        } catch (error) {
            console.error('Error loading dashboard data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await fetch('/api/admin/logout', { method: 'POST' });
        sessionStorage.removeItem('adminAuth');
        router.push('/admin');
    };

    if (!isAuthenticated || loading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    // Compute stats dynamically
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const pendingOrders = orders.filter(o => o.status === 'pending').length;

    // Stats object matching previous structure
    const stats = {
        totalOrders,
        totalRevenue,
        pendingOrders
    };

    const recentOrders = orders.slice(0, 5);
    const activeDiscounts = DISCOUNTS.filter(d => d.active);

    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <div className={styles.logo}>
                    <h2>Faroo Admin</h2>
                </div>

                <nav className={styles.nav}>
                    <Link href="/admin/dashboard" className={styles.navItemActive}>
                        <TrendingUp size={20} />
                        Dashboard
                    </Link>
                    <Link href="/admin/products" className={styles.navItem}>
                        <Package size={20} />
                        Products
                    </Link>
                    <Link href="/admin/orders" className={styles.navItem}>
                        <ShoppingCart size={20} />
                        Orders
                    </Link>
                    <Link href="/admin/discounts" className={styles.navItem}>
                        <Tag size={20} />
                        Discounts
                    </Link>
                    <Link href="/" className={styles.navItem}>
                        <Users size={20} />
                        View Store
                    </Link>
                </nav>

                <button onClick={handleLogout} className={styles.logoutBtn}>
                    Logout
                </button>
            </aside>

            <main className={styles.main}>
                <header className={styles.header}>
                    <h1>Dashboard</h1>
                    <p>Welcome back! Here's what's happening with your store.</p>
                </header>

                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                            <Package size={24} />
                        </div>
                        <div className={styles.statContent}>
                            <p className={styles.statLabel}>Total Products</p>
                            <h3 className={styles.statValue}>{products.length}</h3>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                            <ShoppingCart size={24} />
                        </div>
                        <div className={styles.statContent}>
                            <p className={styles.statLabel}>Total Orders</p>
                            <h3 className={styles.statValue}>{stats.totalOrders}</h3>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                            <TrendingUp size={24} />
                        </div>
                        <div className={styles.statContent}>
                            <p className={styles.statLabel}>Total Revenue</p>
                            <h3 className={styles.statValue}>৳{stats.totalRevenue.toLocaleString()}</h3>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
                            <AlertCircle size={24} />
                        </div>
                        <div className={styles.statContent}>
                            <p className={styles.statLabel}>Pending Orders</p>
                            <h3 className={styles.statValue}>{stats.pendingOrders}</h3>
                        </div>
                    </div>
                </div>

                <div className={styles.contentGrid}>
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2>Recent Orders</h2>
                            <Link href="/admin/orders" className={styles.viewAll}>View All</Link>
                        </div>
                        <div className={styles.table}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Order #</th>
                                        <th>Customer</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map(order => (
                                        <tr key={order.id}>
                                            <td className={styles.orderNumber}>{order.orderNumber}</td>
                                            <td>{order.customerName}</td>
                                            <td className={styles.amount}>৳{order.total.toLocaleString()}</td>
                                            <td>
                                                <span className={`${styles.badge} ${styles[order.status]}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td>{order.createdAt.toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2>Active Discounts</h2>
                            <Link href="/admin/discounts" className={styles.viewAll}>Manage</Link>
                        </div>
                        <div className={styles.discountList}>
                            {activeDiscounts.map(discount => (
                                <div key={discount.id} className={styles.discountItem}>
                                    <div className={styles.discountCode}>
                                        <Tag size={18} />
                                        <span>{discount.code}</span>
                                    </div>
                                    <div className={styles.discountDetails}>
                                        <p>{discount.description}</p>
                                        <p className={styles.discountValue}>
                                            {discount.type === 'percentage' ? `${discount.value}% OFF` : `৳${discount.value} OFF`}
                                        </p>
                                    </div>
                                    <div className={styles.discountStats}>
                                        <span>{discount.usageCount} uses</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
