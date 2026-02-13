import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import Image from 'next/image';
import { Truck, ShieldCheck, RotateCcw, Headset, ArrowUpRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import styles from '../Page.module.css'; // Reusing styles from main page but might need tweaks
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'MAAKO | Premium Men\'s Fashion',
    description: 'Exclusive styles for the modern man. Experience MAAKO.',
};

export const dynamic = 'force-dynamic';

export default async function MenPage() {
    const dbProducts = await prisma.product.findMany({
        where: { section: 'men' },
        take: 4,
        orderBy: { createdAt: 'desc' }
    });

    const products = dbProducts.map((p: any) => ({
        ...p,
        new: true,
        sizes: JSON.parse(p.sizes || '[]'),
        colors: JSON.parse(p.colors || '[]'),
        images: JSON.parse(p.images || '[]')
    }));

    return (
        <main>
            {/* Custom Hero for Men */}
            <section className={styles.section} style={{
                minHeight: '80vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'radial-gradient(circle at center, #2c3e50 0%, #000000 100%)',
                color: '#fff',
                position: 'relative',
                padding: '0 20px'
            }}>
                <div className="container" style={{ textAlign: 'center', maxWidth: '800px', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                    {/* Brand Logo Integration */}
                    <div style={{
                        width: '120px',
                        height: '120px',
                        position: 'relative',
                        marginBottom: '24px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        boxShadow: '0 0 30px rgba(255,255,255,0.1)',
                        border: '2px solid rgba(255,255,255,0.1)'
                    }}>
                        <Image
                            src="/makoo.jpg"
                            alt="MAAKO"
                            fill
                            style={{ objectFit: 'cover' }}
                            priority
                        />
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                        fontWeight: 900,
                        margin: '0 0 20px',
                        lineHeight: 1,
                        background: 'linear-gradient(to right, #fff, #9ca3af)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textTransform: 'uppercase',
                        letterSpacing: '-1px'
                    }}>
                        Defining <br /> Masculinity
                    </h1>

                    <p style={{
                        fontSize: '1.1rem',
                        opacity: 0.8,
                        marginBottom: '32px',
                        lineHeight: 1.6,
                        maxWidth: '500px',
                        margin: '0 auto 40px'
                    }}>
                        Bold, sophisticated, and uncompromising. <br />
                        The pinnacle of modern fashion.
                    </p>

                    <Link href="/shop?section=men" className="btn-luxe" style={{
                        background: '#fff',
                        color: '#000',
                        padding: '14px 36px',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        letterSpacing: '2px',
                        textTransform: 'uppercase'
                    }}>
                        Shop The Collection
                    </Link>
                </div>

                {/* Optional: Overlay texture or grain could be added here */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'url("/noise.png")', // If noise texture exists, otherwise transparent
                    opacity: 0.05,
                    pointerEvents: 'none'
                }} />
            </section>

            {/* Featured Products */}
            <section className={styles.section} style={{ background: 'var(--bg-alt)' }}>
                <div className="container">
                    <div className={styles.sectionTitle}>
                        <h2>MAAKO Arrivals</h2>
                        <p>Fresh picks from our design studio, available now.</p>
                    </div>

                    {products.length > 0 ? (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                            gap: '40px',
                            marginBottom: '60px'
                        }}>
                            {products.map((product: any) => (
                                <ProductCard key={product.id} {...product} />
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <p>No products found for this section yet.</p>
                        </div>
                    )}

                    <div style={{ textAlign: 'center' }}>
                        <Link href="/shop?section=men" className="btn-luxe">
                            View All Men's Products <ArrowUpRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Brand Promise / Features */}
            <section className={styles.section}>
                <div className="container">
                    <div className={styles.featuresGrid}>
                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}><Truck size={28} /></div>
                            <h3>Fast Delivery</h3>
                            <p>Premium tracked shipping across Bangladesh and worldwide.</p>
                        </div>
                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}><ShieldCheck size={28} /></div>
                            <h3>Secure Payment</h3>
                            <p>Your transactions are protected with industry-leading security.</p>
                        </div>
                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}><RotateCcw size={28} /></div>
                            <h3>Easy Returns</h3>
                            <p>Not the perfect fit? Enjoy a hassle-free 7-day return policy.</p>
                        </div>
                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}><Headset size={28} /></div>
                            <h3>Expert Support</h3>
                            <p>Our concierge team is here to assist you with every detail.</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
