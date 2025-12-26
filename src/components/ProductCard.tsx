import Link from 'next/link';
import Image from 'next/image';
import styles from './ProductCard.module.css';

interface ProductProps {
    id: string;
    title: string;
    price: number;
    category: string;
    image: string;
}

export default function ProductCard({ id, title, price, category, image }: ProductProps) {
    return (
        <div className={styles.card}>
            <Link href={`/product/${id}`} className={styles.imageWrapper}>
                <Image
                    src={image}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </Link>
            <div className={styles.info}>
                <div>
                    <h3 className={styles.title}>
                        <Link href={`/product/${id}`}>{title}</Link>
                    </h3>
                    <p className={styles.category}>{category}</p>
                </div>
                <span className={styles.price}>৳{price.toLocaleString()}</span>
            </div>
            <Link href={`/product/${id}`} className={styles.addToCartBtn}>
                View Details
            </Link>
        </div>
    );
}
