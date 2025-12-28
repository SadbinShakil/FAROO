import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, Leaf, Award, ArrowRight } from 'lucide-react';
import styles from './About.module.css';

export const metadata = {
    title: 'About Us | Faroo Official - The Essence of Luxury',
    description: 'Discover the heritage, craftsmanship, and vision behind Faroo Official. A legacy of refined minimalism from Dhaka to the world.',
};

export default function AboutPage() {
    return (
        <div className={styles.container}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <Image
                    src="/hero-new.png"
                    alt="Faroo Official Studio"
                    fill
                    className={styles.heroImage}
                    priority
                />
                <div className={styles.heroContent}>
                    <span>Our Legacy</span>
                    <h1>The Soul of Faroo</h1>
                    <p>Where tradition meets the future of minimalism.</p>
                </div>
            </section>

            {/* Our Story */}
            <section className={styles.section}>
                <div className={styles.storyGrid}>
                    <div className={styles.imageBox}>
                        <Image
                            src="/collections/women.png"
                            alt="The Art of Faroo Craftsmanship"
                            fill
                        />
                    </div>
                    <div className={styles.textBlock}>
                        <h2 className="font-heading italic">Born in Dhaka, <br />Curated for the World</h2>
                        <p>
                            Founded with a vision to bridge the gap between traditional heritage and modern minimalism,
                            Faroo is more than just a fashion brand. It is an exploration of identity, culture, and timeless style.
                        </p>
                        <p>
                            Every piece we create tells a story of meticulous craftsmanship. We believe that true luxury
                            lies in the details: the choice of fabric, the precision of a stitch, and the soul of the artisan.
                        </p>
                        <Link href="/shop" className="btn-luxe inline-flex mt-6">
                            Explore Collections <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Quote */}
            <div className={styles.quote}>
                <span className="text-primary opacity-30 text-8xl block mb-6 px-4">“</span>
                Faroo is a commitment to the art of being oneself—understated yet unforgettable.
            </div>

            {/* Values Section */}
            <section className={styles.values}>
                <div className="container">
                    <span className="text-gradient font-bold tracking-[4px] uppercase text-xs mb-4 block">Foundations</span>
                    <h2 className="text-4xl font-heading mb-16">The Faroo Ethos</h2>
                    <div className={styles.valueGrid}>
                        <div className={styles.valueCard}>
                            <div className={styles.valueIcon}><Award size={28} /></div>
                            <h3>Authenticity</h3>
                            <p>We stay true to our roots, celebrating the rich textile traditions of South Asia while embracing global trends.</p>
                        </div>
                        <div className={styles.valueCard}>
                            <div className={styles.valueIcon}><Sparkles size={28} /></div>
                            <h3>Quality</h3>
                            <p>We never compromise on materials. From pure cotton to fine silks, our quality is our promise to you.</p>
                        </div>
                        <div className={styles.valueCard}>
                            <div className={styles.valueIcon}><Leaf size={28} /></div>
                            <h3>Innovation</h3>
                            <p>We constantly experiment with silhouettes and techniques to provide a fresh perspective on ethnic wear.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Craftsmanship Details */}
            <section className={styles.section}>
                <div className={styles.storyGrid}>
                    <div className={styles.textBlock}>
                        <h2 className="font-heading italic">Precision & Passion</h2>
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
                            alt="The Artisan Process"
                            fill
                        />
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="bg-primary text-white py-32 text-center">
                <div className="container max-w-2xl">
                    <h2 className="text-5xl font-heading mb-8">Join the Vanguard</h2>
                    <p className="opacity-80 mb-12 text-lg">Experience the perfect blend of tradition and modernity. Faroo Official is not just a brand; it's a lifestyle.</p>
                    <Link href="/shop" className="bg-white text-primary px-12 py-5 font-bold uppercase tracking-widest text-sm hover:bg-opacity-90 transition-all">
                        Visit the Atelier
                    </Link>
                </div>
            </section>
        </div>
    );
}
