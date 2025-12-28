import Image from 'next/image';
import styles from './About.module.css';

export const metadata = {
    title: 'About Us | Faroo - Redefining Elegance',
    description: 'Learn about the story, craftsmanship, and values of Faroo, a premium Bangladeshi fashion brand.',
};

export default function AboutPage() {
    return (
        <div className={styles.container}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <Image
                    src="/hero-new.png"
                    alt="Faroo Studio"
                    fill
                    style={{ objectFit: 'cover' }}
                    priority
                />
                <div className={styles.heroOverlay}></div>
                <div className={styles.heroContent}>
                    <h1>The Faroo Story</h1>
                </div>
            </section>

            {/* Our Story */}
            <section className={styles.section}>
                <div className={styles.storyGrid}>
                    <div className={styles.imageBox}>
                        <Image
                            src="/collections/women.png"
                            alt="Craftsmanship"
                            fill
                            style={{ objectFit: 'cover' }}
                        />
                    </div>
                    <div className={styles.textBlock}>
                        <h2>Born in Dhaka, Designed for the World</h2>
                        <p>
                            Founded with a vision to bridge the gap between traditional heritage and modern minimalism,
                            Faroo is more than just a fashion brand. It is an exploration of identity, culture, and timeless style.
                        </p>
                        <p>
                            Every piece we create tells a story of meticulous craftsmanship. We believe that true luxury
                            lies in the details—the choice of fabric, the precision of a stitch, and the soul of the artisan.
                        </p>
                    </div>
                </div>
            </section>

            {/* Quote */}
            <div className={styles.quote}>
                "Fashion is not just what you wear, it's how you carry your heritage into the future."
            </div>

            {/* Values Section */}
            <section className={styles.values}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '40px' }}>Our Core Values</h2>
                <div className={styles.valueGrid}>
                    <div className={styles.valueCard}>
                        <h3>Authenticity</h3>
                        <p>We stay true to our roots, celebrating the rich textile traditions of South Asia while embracing global trends.</p>
                    </div>
                    <div className={styles.valueCard}>
                        <h3>Quality</h3>
                        <p>We never compromise on materials. From pure cotton to fine silks, our quality is our promise to you.</p>
                    </div>
                    <div className={styles.valueCard}>
                        <h3>Innovation</h3>
                        <p>We constantly experiment with silhouettes and techniques to provide a fresh perspective on ethnic wear.</p>
                    </div>
                </div>
            </section>

            {/* Craftsmanship Details */}
            <section className={styles.section}>
                <div className={styles.storyGrid}>
                    <div className={styles.textBlock}>
                        <h2>The Art of Detail</h2>
                        <p>
                            Our design philosophy centers on understated luxury. We focus on subtle hand-embroidery,
                            pearl embellishments, and unique silhouettes that offer a sophisticated alternative to mainstream fashion.
                        </p>
                        <p>
                            When you wear Faroo, you are wearing hours of dedicated handwork and a commitment to excellence
                            that is increasingly rare in the world of fast fashion.
                        </p>
                    </div>
                    <div className={styles.imageBox}>
                        <Image
                            src="/collections/new.png"
                            alt="Art of Detail"
                            fill
                            style={{ objectFit: 'cover' }}
                        />
                    </div>
                </div>
            </section>

            {/* Footer Call to Action */}
            <section style={{
                padding: '100px 20px',
                textAlign: 'center',
                backgroundColor: 'var(--primary-color)',
                color: 'white'
            }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Join Our Journey</h2>
                <p style={{ marginBottom: '40px', opacity: '0.9' }}>Experience the perfect blend of tradition and modernity.</p>
                <a href="/shop" style={{
                    display: 'inline-block',
                    padding: '15px 40px',
                    backgroundColor: 'white',
                    color: 'var(--primary-color)',
                    fontWeight: 'bold',
                    textDecoration: 'none',
                    borderRadius: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                }}>Shop the Collection</a>
            </section>
        </div>
    );
}
