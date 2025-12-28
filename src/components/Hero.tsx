'use client';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star } from 'lucide-react';
import styles from './Hero.module.css';

export default function Hero() {
    return (
        <section className={styles.hero}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <span className={styles.label}>New Season | Faroo Official</span>
                    <h1 className={styles.title}>
                        Redefining <br />
                        <span className="text-gradient">Modern Elegance</span>
                    </h1>
                    <p className={styles.subtitle}>
                        Experience the perfect harmony of traditional craftsmanship and
                        contemporary minimalism. A legacy of luxury, curated for the modern individual.
                    </p>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <Link href="/shop" className="btn-luxe">
                            Explore Collection <ArrowRight size={18} />
                        </Link>
                        <Link href="/about" className="btn-outline">
                            Our Story
                        </Link>
                    </div>
                </div>

                <div className={styles.imageSection}>
                    <div className={styles.imageWrapper}>
                        <Image
                            src="/hero-new.png"
                            alt="Faroo Official Premium Collection"
                            fill
                            priority
                            style={{ objectFit: 'cover' }}
                        />
                    </div>

                    <div className={styles.floatingCard}>
                        <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '50%', color: 'white' }}>
                            <Star size={16} fill="currentColor" />
                        </div>
                        <div>
                            <h4>Elite Craftsmanship</h4>
                            <span>Handmade with Love</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.scrollIndicator}>
                <span className={styles.scrollText}>Scroll</span>
                <div className={styles.scrollLine}></div>
            </div>
        </section>
    );
}
