'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook, Twitter, Mail, ArrowRight } from 'lucide-react';
import styles from './Footer.module.css';
import { usePathname } from 'next/navigation';

export default function Footer() {
    const pathname = usePathname();
    const isMaako = pathname?.startsWith('/men');

    const brandName = isMaako ? 'MAAKO' : 'Faroo Official';
    const brandLogo = isMaako ? '/maako-logo.png' : '/faroo-logo.jpg';
    const brandDesc = isMaako
        ? 'MAAKO defines the modern man with bold aesthetics and uncompromising quality.'
        : 'Founded in Dhaka, Faroo Official is a luxury fashion label dedicated to refined minimalism and sustainable craftsmanship.';

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.brand}>
                    <Image
                        src={brandLogo}
                        alt={brandName}
                        width={60}
                        height={60}
                        style={{ borderRadius: '50%', objectFit: 'cover' }}
                        onError={(e) => e.currentTarget.style.display = 'none'}
                    />
                    <p className={styles.brandInfo}>
                        {brandDesc}
                    </p>
                    <div className={styles.socials} style={{ marginTop: '30px' }}>
                        <a href="https://www.instagram.com/_faroo_official/" target="_blank" rel="noopener noreferrer">
                            <Instagram size={20} className="hover:text-gold transition-colors" />
                        </a>
                        <a href="#"><Facebook size={20} /></a>
                        <a href="#"><Twitter size={20} /></a>
                    </div>
                </div>

                <div className={styles.column}>
                    <h3>Boutique</h3>
                    <ul>
                        <li><Link href="/shop">New Arrivals</Link></li>
                        <li><Link href="/shop?section=women">Women's Collection</Link></li>
                        <li><Link href="/shop?section=men">Men's Series</Link></li>
                        <li><Link href="/collections">Seasonal Edits</Link></li>
                    </ul>
                </div>

                <div className={styles.column}>
                    <h3>Atelier</h3>
                    <ul>
                        <li><Link href="/about">Our Story</Link></li>
                        <li><Link href="/track-order">Order Tracking</Link></li>
                        <li><Link href="/contact">Concierge</Link></li>
                        <li><Link href="/privacy">Privacy Policy</Link></li>
                    </ul>
                </div>

                <div className={styles.newsletter}>
                    <h3>Newsletter</h3>
                    <p>Be the first to know about private sales and new launches.</p>
                    <div className={styles.inputGroup}>
                        <input type="email" placeholder="E-mail address" />
                        <button className={styles.submitBtn}>
                            <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            </div>

            <div className={styles.bottom}>
                <p>&copy; {new Date().getFullYear()} Faroo Official. All rights reserved.</p>
                <div className="flex gap-4 opacity-50 text-[10px] uppercase tracking-widest">
                    <span>Dhaka</span>
                    <span>•</span>
                    <span>London</span>
                    <span>•</span>
                    <span>New York</span>
                </div>
            </div>
        </footer>
    );
}
