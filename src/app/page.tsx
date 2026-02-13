import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShieldCheck, Truck, RotateCcw, Headset, ArrowUpRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import styles from './Page.module.css';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const dbProducts = await prisma.product.findMany({
    where: { section: 'women' },
    take: 4,
    orderBy: { createdAt: 'desc' }
  });

  const products = dbProducts.map((p: any) => ({
    ...p,
    new: true // Marking recently added as new
  }));

  return (
    <main>
      <Hero />

      {/* Collections Showcase */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionTitle}>
            <span className="text-gradient font-bold uppercase tracking-widest text-sm">Curated Styles</span>
            <h2>Seasonal Collections</h2>
            <p>Explore our latest drops designed for elegance and comfort.</p>
          </div>

          <div className={styles.categoryGrid}>
            <Link href="/shop?section=women" className={styles.categoryCard}>
              <Image
                src="/collections/women.png"
                alt="Women's Collection"
                fill
              />
              <div className={styles.categoryOverlay}>
                <h3>The Collection</h3>
                <p>Timeless silhouettes refined for modern living.</p>
                <span className={styles.categoryLink}>Discover Now</span>
              </div>
            </Link>

            <Link href="/shop?section=women" className={styles.categoryCard}>
              <Image
                src="/hero-new.png"
                alt="New Arrivals"
                fill
              />
              <div className={styles.categoryOverlay}>
                <h3>New Arrivals</h3>
                <p>Fresh perspectives for the season ahead.</p>
                <span className={styles.categoryLink}>Shop Latest</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className={styles.section} style={{ background: 'var(--bg-alt)' }}>
        <div className="container">
          <div className={styles.sectionTitle}>
            <h2>New Arrivals</h2>
            <p>Fresh picks from our design studio, available now.</p>
          </div>

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

          <div style={{ textAlign: 'center' }}>
            <Link href="/shop" className="btn-luxe">
              View All Products <ArrowUpRight size={18} />
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

      {/* Newsletter Overlay Section */}
      <section className={styles.section} style={{ paddingTop: 0 }}>
        <div className={styles.newsletter}>
          <div className={styles.newsletterContent}>
            <h2 className="font-heading text-4xl mb-4">Join the Insiders</h2>
            <p>Receive exclusive invitations to collection launches and private events.</p>
            <form className={styles.newsletterInput}>
              <input type="email" placeholder="Your Email Address" required />
              <button className="btn-luxe">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
