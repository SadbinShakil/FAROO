'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Search, User } from 'lucide-react';
import styles from './Header.module.css';
import { useCart } from '@/context/CartContext';

export default function Header() {
    const { openCart, cartCount } = useCart();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/shop?q=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
        }
    };

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    <Image src="/faroo-logo.jpg" alt="Faroo" width={50} height={50} style={{ borderRadius: '50%' }} />
                </Link>

                <nav className={styles.nav}>
                    <Link href="/" className={styles.navLink}>Home</Link>
                    <Link href="/shop" className={styles.navLink}>Shop</Link>
                    <Link href="/track-order" className={styles.navLink}>Track Order</Link>
                    <Link href="/collections" className={styles.navLink}>Collections</Link>
                    <Link href="/about" className={styles.navLink}>About</Link>
                </nav>

                <div className={styles.actions}>
                    {isSearchOpen ? (
                        <form onSubmit={handleSearch} className={styles.searchForm}>
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={styles.searchInput}
                                autoFocus
                            />
                            <button type="button" onClick={() => setIsSearchOpen(false)} className={styles.closeSearch}>
                                ×
                            </button>
                        </form>
                    ) : (
                        <button
                            className={styles.iconBtn}
                            aria-label="Search"
                            onClick={() => setIsSearchOpen(true)}
                        >
                            <Search size={20} />
                        </button>
                    )}

                    <button className={styles.iconBtn} aria-label="Account">
                        <User size={20} />
                    </button>
                    <button onClick={openCart} className={styles.iconBtn} aria-label="Cart" style={{ position: 'relative' }}>
                        <ShoppingBag size={20} />
                        {cartCount > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: '-5px',
                                right: '-5px',
                                background: 'var(--primary-color)',
                                color: 'white',
                                fontSize: '0.7rem',
                                width: '18px',
                                height: '18px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold'
                            }}>
                                {cartCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
}
