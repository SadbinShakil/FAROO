'use client';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Eye } from 'lucide-react';
import styles from './ProductCard.module.css';
import { useCart } from '@/context/CartContext';

interface ProductProps {
    id: string;
    title: string;
    price: number;
    category: string;
    image: string;
    new?: boolean;
}

export default function ProductCard({ id, title, price, category, image, new: isNew }: ProductProps) {
    const { addToCart, openCart } = useCart();

    const handleQuickAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart({
            productId: id,
            productTitle: title,
            price,
            image,
            quantity: 1,
            size: 'M', // Default size for quick add
        });
        openCart();
    };

    return (
        <div className={styles.card}>
            {isNew && <span className={styles.badge}>New Arrival</span>}

            <Link href={`/product/${id}`} className={styles.imageWrapper}>
                <Image
                    src={image}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={false}
                />
                <div className={styles.quickActions}>
                    <button onClick={handleQuickAdd} className={styles.quickAdd}>
                        <ShoppingBag size={16} /> <span>Quick Add</span>
                    </button>
                </div>
            </Link>

            <div className={styles.info}>
                <p className={styles.category}>{category}</p>
                <h3 className={styles.title}>
                    <Link href={`/product/${id}`}>{title}</Link>
                </h3>
                <span className={styles.price}>৳{price.toLocaleString()}</span>
            </div>
        </div>
    );
}
