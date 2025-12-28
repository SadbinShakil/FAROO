'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, ShoppingCart, Tag, Users, TrendingUp, Plus, Edit, Trash2, Search } from 'lucide-react';
import { DISCOUNTS, Discount } from '@/data/discounts';
import styles from '../dashboard/Dashboard.module.css';
import discountsStyles from './Discounts.module.css';

export default function AdminDiscounts() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [discounts, setDiscounts] = useState<Discount[]>(DISCOUNTS);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        const auth = sessionStorage.getItem('adminAuth');
        if (auth !== 'true') {
            router.push('/admin');
        } else {
            setIsAuthenticated(true);
        }
    }, [router]);

    const handleLogout = () => {
        sessionStorage.removeItem('adminAuth');
        router.push('/admin');
    };

    if (!isAuthenticated) {
        return <div className={styles.loading}>Loading...</div>;
    }

    const filteredDiscounts = discounts.filter(discount =>
        discount.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        discount.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleDiscountStatus = (id: string) => {
        setDiscounts(discounts.map(d =>
            d.id === id ? { ...d, active: !d.active } : d
        ));
    };

    const deleteDiscount = (id: string) => {
        if (confirm('Are you sure you want to delete this discount code?')) {
            setDiscounts(discounts.filter(d => d.id !== id));
        }
    };

    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <div className={styles.logo}>
                    <h2>Faroo Admin</h2>
                </div>

                <nav className={styles.nav}>
                    <Link href="/admin/dashboard" className={styles.navItem}>
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
                    <Link href="/admin/discounts" className={styles.navItemActive}>
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
                <header className={discountsStyles.header}>
                    <div>
                        <h1>Discount Codes</h1>
                        <p>Create and manage promotional discount codes</p>
                    </div>
                    <button className={discountsStyles.addBtn} onClick={() => setShowAddModal(true)}>
                        <Plus size={20} />
                        Create Discount
                    </button>
                </header>

                <div className={discountsStyles.searchBox}>
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Search discount codes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className={discountsStyles.discountsGrid}>
                    {filteredDiscounts.map(discount => (
                        <div key={discount.id} className={discountsStyles.discountCard}>
                            <div className={discountsStyles.cardHeader}>
                                <div className={discountsStyles.codeBox}>
                                    <Tag size={20} />
                                    <span className={discountsStyles.code}>{discount.code}</span>
                                </div>
                                <div className={discountsStyles.actions}>
                                    <button className={discountsStyles.editBtn} title="Edit">
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        className={discountsStyles.deleteBtn}
                                        onClick={() => deleteDiscount(discount.id)}
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className={discountsStyles.cardBody}>
                                <p className={discountsStyles.description}>{discount.description}</p>

                                <div className={discountsStyles.discountValue}>
                                    {discount.type === 'percentage' ? (
                                        <span className={discountsStyles.percentage}>{discount.value}% OFF</span>
                                    ) : (
                                        <span className={discountsStyles.fixed}>৳{discount.value} OFF</span>
                                    )}
                                </div>

                                <div className={discountsStyles.details}>
                                    {discount.minPurchase && (
                                        <div className={discountsStyles.detailItem}>
                                            <span className={discountsStyles.label}>Min Purchase:</span>
                                            <span className={discountsStyles.value}>৳{discount.minPurchase.toLocaleString()}</span>
                                        </div>
                                    )}
                                    {discount.maxDiscount && (
                                        <div className={discountsStyles.detailItem}>
                                            <span className={discountsStyles.label}>Max Discount:</span>
                                            <span className={discountsStyles.value}>৳{discount.maxDiscount.toLocaleString()}</span>
                                        </div>
                                    )}
                                    <div className={discountsStyles.detailItem}>
                                        <span className={discountsStyles.label}>Valid Until:</span>
                                        <span className={discountsStyles.value}>{discount.validUntil.toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className={discountsStyles.stats}>
                                    <div className={discountsStyles.statItem}>
                                        <span className={discountsStyles.statValue}>{discount.usageCount}</span>
                                        <span className={discountsStyles.statLabel}>Uses</span>
                                    </div>
                                    {discount.maxUsage && (
                                        <div className={discountsStyles.statItem}>
                                            <span className={discountsStyles.statValue}>{discount.maxUsage - discount.usageCount}</span>
                                            <span className={discountsStyles.statLabel}>Remaining</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={discountsStyles.cardFooter}>
                                <label className={discountsStyles.toggle}>
                                    <input
                                        type="checkbox"
                                        checked={discount.active}
                                        onChange={() => toggleDiscountStatus(discount.id)}
                                    />
                                    <span className={discountsStyles.slider}></span>
                                    <span className={discountsStyles.toggleLabel}>
                                        {discount.active ? 'Active' : 'Inactive'}
                                    </span>
                                </label>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredDiscounts.length === 0 && (
                    <div className={discountsStyles.emptyState}>
                        <Tag size={64} />
                        <h3>No discount codes found</h3>
                        <p>Create your first discount code to get started</p>
                    </div>
                )}

                {showAddModal && (
                    <div className={discountsStyles.modal} onClick={() => setShowAddModal(false)}>
                        <div className={discountsStyles.modalContent} onClick={(e) => e.stopPropagation()}>
                            <h2>Create Discount Code</h2>
                            <p className={discountsStyles.modalNote}>
                                This is a demo interface. In a production environment, you would have a comprehensive form here with fields for:
                            </p>
                            <ul className={discountsStyles.featureList}>
                                <li>Discount code name</li>
                                <li>Discount type (percentage or fixed amount)</li>
                                <li>Discount value</li>
                                <li>Minimum purchase requirement</li>
                                <li>Maximum discount cap</li>
                                <li>Valid from/until dates</li>
                                <li>Usage limits</li>
                                <li>Applicable products/categories</li>
                            </ul>
                            <button
                                className={discountsStyles.closeBtn}
                                onClick={() => setShowAddModal(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
