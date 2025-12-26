import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import styles from './Hero.module.css';

export default function Hero() {
    return (
        <section className={styles.hero}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <span className={styles.label}>New Collection 2025</span>
                    <h1 className={styles.title}>Redefine Your Style</h1>
                    <p className={styles.subtitle}>
                        Discover timeless elegance and contemporary fashion. Curated collections that speak to your individuality.
                    </p>
                    <div className={styles.ctaGroup}>
                        <Link href="/shop" className="btn">
                            Explore Collection
                        </Link>
                        <Link href="/shop?section=men" className="btn btn-secondary">
                            Shop Men's
                        </Link>
                    </div>
                </div>

                <div className={styles.imageWrapper}>
                    <Image
                        src="/hero-new.png"
                        alt="Luxury Fashion"
                        fill
                        priority
                        style={{ objectFit: 'cover' }}
                    />
                </div>
            </div>
        </section>
    );
}
