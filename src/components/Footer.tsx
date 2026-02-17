'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook, Twitter, Mail, ArrowRight } from 'lucide-react';
import styles from './Footer.module.css';
import { usePathname } from 'next/navigation';

export default function Footer() {
    const pathname = usePathname();
    if (pathname?.startsWith('/admin')) return null;

    const isMaako = pathname?.startsWith('/men');

    const brandName = isMaako ? 'MAAKO' : 'Faroo Official';
    const brandLogo = isMaako ? '/makoo.jpg' : '/faroo-logo.jpg';
    const brandDesc = isMaako
        ? 'MAAKO, a sub-brand of Faroo, defines the modern man with bold aesthetics and uncompromising quality.'
        : 'Founded in Dhaka, Faroo Official is a luxury fashion label dedicated to refined minimalism and sustainable craftsmanship.';

    const instagramLink = isMaako
        ? 'https://www.instagram.com/maakoofficial?igsh=NmhiMWt5dHJmcXA='
        : 'https://www.instagram.com/_faroo_official/';

    const facebookLink = isMaako
        ? 'https://www.facebook.com/profile.php?id=61585445337815'
        : 'https://www.facebook.com/profile.php?id=100070183413446';

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.brand}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                        <Image
                            src={brandLogo}
                            alt={brandName}
                            width={50}
                            height={50}
                            style={{ borderRadius: '50%', objectFit: 'cover' }}
                            onError={(e) => e.currentTarget.style.display = 'none'}
                        />
                        <span style={{ fontSize: '1.2rem', fontWeight: 'bold', letterSpacing: '1px' }}>{brandName}</span>
                    </div>
                    <p className={styles.brandInfo}>
                        {brandDesc}
                    </p>
                    <div className={styles.socials} style={{ marginTop: '30px' }}>
                        <a href={instagramLink} target="_blank" rel="noopener noreferrer" style={{ opacity: 0.7, transition: '0.3s' }}>
                            <Instagram size={20} />
                        </a>
                        <a href={facebookLink} target="_blank" rel="noopener noreferrer" style={{ opacity: 0.7, transition: '0.3s' }}>
                            <Facebook size={20} />
                        </a>
                    </div>
                </div>

                <div className={styles.column}>
                    <h3>Collections</h3>
                    <ul>
                        <li><Link href="/shop">New Arrivals</Link></li>
                        <li><Link href="/shop?section=men">Men's Collection</Link></li>
                        <li><Link href="/shop?section=women">Women's Collection</Link></li>
                        <li><Link href="/shop?section=lifestyle">Lifestyle</Link></li>
                    </ul>
                </div>

                <div className={styles.column}>
                    <h3>Assistance</h3>
                    <ul>
                        <li><Link href="/track-order">Track My Order</Link></li>
                        <li><Link href="/shipping">Shipping & Returns</Link></li>
                        <li><Link href="/size-guide">Size Guide</Link></li>
                        <li><Link href="/contact">Contact Us</Link></li>
                        <li><Link href="/about">Our Story</Link></li>
                    </ul>
                </div>

                <div className={styles.newsletter}>
                    <h3>Stay Connected</h3>
                    <p>Subscribe for exclusive access to new drops and private sales.</p>
                    <form className={styles.inputGroup} onSubmit={(e) => e.preventDefault()}>
                        <input type="email" placeholder="Email address" required />
                        <button className={styles.submitBtn} aria-label="Subscribe">
                            <ArrowRight size={20} />
                        </button>
                    </form>
                </div>
            </div>

            <div className={styles.bottom}>
                <p>&copy; {new Date().getFullYear()} {brandName}. All rights reserved.</p>
                <div className="flex gap-4 opacity-50 text-[11px] uppercase tracking-widest">
                    <span>Dhaka • Chittagong • Sylhet</span>
                </div>
            </div>
        </footer>
    );
}
