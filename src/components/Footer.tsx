import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.column}>
                    <h3>Shop</h3>
                    <ul>
                        <li><Link href="/shop">All Products</Link></li>
                        <li><Link href="/new-arrivals">New Arrivals</Link></li>
                        <li><Link href="/accessories">Accessories</Link></li>
                    </ul>
                </div>
                <div className={styles.column}>
                    <h3>Company</h3>
                    <ul>
                        <li><Link href="/about">About Us</Link></li>
                        <li><Link href="/contact">Contact</Link></li>
                        <li><Link href="/careers">Careers</Link></li>
                    </ul>
                </div>
                <div className={styles.column}>
                    <h3>Support</h3>
                    <ul>
                        <li><Link href="/faq">FAQ</Link></li>
                        <li><Link href="/shipping">Shipping & Returns</Link></li>
                        <li><Link href="/privacy">Privacy Policy</Link></li>
                    </ul>
                </div>
                <div className={styles.column}>
                    <h3>Newsletter</h3>
                    <p style={{ color: '#999', fontSize: '0.9rem', marginBottom: '10px' }}>
                        Subscribe for the latest updates.
                    </p>
                    {/* Newsletter form placeholder */}
                </div>
            </div>
            <div className={styles.bottom}>
                <p>&copy; 2024 Faroo. All rights reserved.</p>
            </div>
        </footer>
    );
}
