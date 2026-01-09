'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { ShoppingBag, Search, User, Menu, X, LayoutDashboard, Package, ShoppingCart, Tag, LogOut, ChevronRight } from 'lucide-react';
import styles from './Header.module.css';
import { useCart } from '@/context/CartContext';

export default function Header() {
    const { openCart, cartCount } = useCart();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const isAdmin = pathname.startsWith('/admin');

    useEffect(() => {
        setIsMounted(true);
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/shop?q=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
        }
    };

    return (
        <>
            <div className={styles.topBar}>
                Free Shipping on Orders Over ৳5,000 | New Season Collection Live
            </div>

            <header className={`${styles.header} ${isScrolled ? styles.headerScrolled : ''}`}>
                <div className={styles.container}>
                    {/* Mobile Menu Toggle */}
                    <button
                        className={styles.mobileToggle}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle Menu"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    {/* Logo */}
                    <Link href="/" className={styles.logo}>
                        <Image
                            src="/faroo-logo.jpg"
                            alt="Faroo Official"
                            width={50}
                            height={50}
                            priority
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
                        {isAdmin ? (
                            <>
                                <Link href="/admin/dashboard" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
                                    <LayoutDashboard size={18} className={styles.mobileOnly} /> Dashboard
                                </Link>
                                <Link href="/admin/products" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
                                    <Package size={18} className={styles.mobileOnly} /> Products
                                </Link>
                                <Link href="/admin/orders" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
                                    <ShoppingCart size={18} className={styles.mobileOnly} /> Orders
                                </Link>
                                <Link href="/admin/discounts" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
                                    <Tag size={18} className={styles.mobileOnly} /> Discounts
                                </Link>
                                <button
                                    onClick={() => {
                                        sessionStorage.removeItem('adminAuth');
                                        router.push('/admin');
                                        setIsMenuOpen(false);
                                    }}
                                    className={`${styles.navLink} ${styles.logoutLink}`}
                                    style={{ width: '100%', textAlign: 'left', border: 'none', background: 'none' }}
                                >
                                    <LogOut size={18} className={styles.mobileOnly} /> Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>Home</Link>
                                <Link href="/shop" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>Shop</Link>
                                <Link href="/collections" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>Collections</Link>
                                <Link href="/track-order" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>Track</Link>
                                <Link href="/about" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>About</Link>
                            </>
                        )}
                    </nav>

                    {/* Actions */}
                    <div className={styles.actions}>
                        {!isMenuOpen && !isAdmin && (
                            <>
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
                                        <button type="button" onClick={() => setIsSearchOpen(false)} className={styles.searchClose}>
                                            <X size={18} />
                                        </button>
                                    </form>
                                ) : (
                                    <button
                                        className={styles.iconBtn}
                                        onClick={() => setIsSearchOpen(true)}
                                        aria-label="Search"
                                    >
                                        <Search size={21} strokeWidth={1.5} />
                                    </button>
                                )}

                                <button className={styles.iconBtn} aria-label="Account">
                                    <User size={21} strokeWidth={1.5} />
                                </button>
                            </>
                        )}

                        <button onClick={openCart} className={styles.iconBtn} aria-label="Cart">
                            <ShoppingBag size={21} strokeWidth={1.5} />
                            {isMounted && cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Backdrop */}
            <div
                className={`${styles.overlay} ${isMenuOpen ? styles.overlayVisible : ''}`}
                onClick={() => setIsMenuOpen(false)}
            />
        </>
    );
}
