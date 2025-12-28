import Link from 'next/link';
import Image from 'next/image';
import styles from './Collections.module.css';

export const metadata = {
    title: 'Collections | Faroo - Premium Fashion Hub',
    description: 'Explore our curated collections of premium Bangladeshi and South Asian fusion wear for men and women.',
};

const collections = [
    {
        id: 'new-arrivals',
        title: 'New Arrivals',
        description: 'Discover the latest trends and seasonal drops.',
        image: '/collections/new.png',
        link: '/shop?new=true',
        badge: 'Limited Edition',
        wide: true
    },
    {
        id: 'women',
        title: 'Women\'s Edit',
        description: 'Elegance redefined for the modern woman.',
        image: '/collections/women.png',
        link: '/shop?section=women',
        badge: 'Trending Now'
    },
    {
        id: 'men',
        title: 'Men\'s Collection',
        description: 'Sophisticated essentials for every occasion.',
        image: '/collections/men.png',
        link: '/shop?section=men',
        badge: 'New Season'
    }
];

export default function CollectionsPage() {
    return (
        <div className={styles.container}>
            <section className={styles.hero}>
                <h1>Our Collections</h1>
                <p>Explore our carefully curated selections designed to celebrate individuality and modern style.</p>
            </section>

            <div className={styles.grid}>
                {collections.map((collection) => (
                    <Link
                        key={collection.id}
                        href={collection.link}
                        className={`${styles.collectionCard} ${collection.wide ? styles.wideCard : ''}`}
                    >
                        <div className={styles.imageWrapper}>
                            <Image
                                src={collection.image}
                                alt={collection.title}
                                fill
                                priority={collection.wide}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 1200px"
                            />
                            <div className={styles.overlay}>
                                <span className={styles.badge}>{collection.badge}</span>
                                <h2>{collection.title}</h2>
                                <p>{collection.description}</p>
                                <span className={styles.exploreBtn}>Explore Collection</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <section style={{
                padding: '60px 20px',
                textAlign: 'center',
                background: '#fff',
                borderTop: '1px solid #eee'
            }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Need Something Specific?</h2>
                <Link href="/shop" className={styles.exploreBtn} style={{ background: '#000', color: '#fff' }}>
                    View All Products
                </Link>
            </section>
        </div>
    );
}
