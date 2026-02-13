import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import Image from 'next/image';
import { Truck, ShieldCheck, RotateCcw, Headset, ArrowUpRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import styles from '../Page.module.css'; // Reusing page styles
import heroStyles from '../../components/Hero.module.css'; // Using Hero component styles
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
            {/* Custom Hero for Men - Matching Faroo Structure */}
            {/* Custom Hero for Men - Matching Faroo Structure */}
            <section className={heroStyles.hero} style={{ background: '#f8f9fa' }}> {/* Slight difference in bg if needed */}
                <div className={heroStyles.container}>
                    <div className={heroStyles.content}>
                        <span className={heroStyles.label} style={{ color: '#000' }}>MAAKO Official</span>
                        <h1 className={heroStyles.title} style={{ color: '#111' }}>
                            Defining <br />
                            <span className="text-gradient" style={{
                                background: 'linear-gradient(to right, #000, #555)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>Masculinity</span>
                        </h1>
                        <p className={heroStyles.subtitle} style={{ color: '#444' }}>
                            Bold, sophisticated, and uncompromising. Experience the pinnacle of modern men's fashion with our new collection.
                        </p>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <Link href="/shop?section=men" className="btn-luxe" style={{ background: '#000', color: '#fff' }}>
                                Shop Collection <ArrowUpRight size={18} />
                            </Link>
                            <Link href="/about" className="btn-outline" style={{ color: '#000', borderColor: '#000' }}>
                                Our Manifesto
                            </Link>
                        </div>
                    </div>

                    <div className={heroStyles.imageSection}>
                        <div className={heroStyles.imageWrapper}>
                            <Image
                                src="/collections/men.png" // Using the correct male image
                                alt="MAAKO Men's Collection"
                                fill
                                priority
                                style={{ objectFit: 'cover' }}
                            />
                        </div>

                        {/* Floating Badge */}
                        <div className={heroStyles.floatingCard} style={{ left: '-40px', bottom: '60px' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                position: 'relative',
                                border: '1px solid #eee'
                            }}>
                                <Image src="/makoo.jpg" alt="Icon" fill style={{ objectFit: 'cover' }} />
                            </div>
                            <div>
                                <h4 style={{ color: '#000' }}>MAAKO Series</h4>
                                <span>Premium Collection</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={heroStyles.scrollIndicator}>
                    <span className={heroStyles.scrollText} style={{ color: '#888' }}>Scroll</span>
                    <div className={heroStyles.scrollLine} style={{ background: 'linear-gradient(to bottom, #000, transparent)' }}></div>
                </div>
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
