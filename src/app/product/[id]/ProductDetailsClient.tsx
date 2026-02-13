'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import styles from './page.module.css';
import { useCart } from '@/context/CartContext';
import {
    Heart,
    Share2,
    Truck,
    ShieldCheck,
    RotateCcw,
    Star,
    ChevronDown,
    Minus,
    Plus,
    ShoppingBag,
    CheckCircle2
} from 'lucide-react';

interface Product {
    id: string;
    title: string;
    price: number;
    category: string;
    section: string;
    subcategory: string;
    image: string;
    images?: string[];
    description?: string | null;
    sizes: string[];
    colors: string[];
}

interface ProductDetailsClientProps {
    product: Product;
    relatedProducts: Product[];
}

export default function ProductDetailsClient({ product, relatedProducts }: ProductDetailsClientProps) {
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);
    const [isAdded, setIsAdded] = useState(false);
    const [activeImage, setActiveImage] = useState<string>(product.image);
    const [openAccordion, setOpenAccordion] = useState<string | null>('details');

    const productImages = product.images?.length ? product.images : [product.image];

    // Reset active image when product changes
    if (activeImage !== product.image && !productImages.includes(activeImage)) {
        setActiveImage(productImages[0]);
    }

    const sizes = product.sizes?.length ? product.sizes : ['S', 'M', 'L', 'XL'];
    const colors = product.colors?.length ? product.colors : ['White', 'Black'];

    const { addToCart, openCart } = useCart();

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert('Please select a size');
            return;
        }

        setIsAdding(true);

        setTimeout(() => {
            addToCart({
                productId: product.id,
                productTitle: product.title,
                price: product.price,
                image: product.image,
                quantity: quantity,
                size: selectedSize,
            });
            setIsAdding(false);
            setIsAdded(true);
            setTimeout(() => {
                setIsAdded(false);
                openCart();
            }, 1500);
        }, 800);
    };

    return (
        <div className={styles.productPage}>
            <div className={styles.container}>
                <nav className={styles.breadcrumb}>
                    <Link href="/">Home</Link> <span>/</span>
                    <Link href="/shop">Shop</Link> <span>/</span>
                    <span className="text-main font-semibold">{product.title}</span>
                </nav>

                <div className={styles.productGrid}>
                    {/* Left Column: Image Stack */}
                    <div className={styles.imageSection}>
                        <div className={styles.mainImage}>
                            <Image
                                src={activeImage || product.image}
                                alt={product.title}
                                fill
                                priority
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>
                        <div className={styles.imageGallery}>

                            {productImages.map((img, i) => (
                                <div
                                    key={i}
                                    className={`${styles.galleryThumb} ${activeImage === img ? styles.active : ''}`}
                                    onClick={() => setActiveImage(img)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <Image src={img} alt="Thumbnail" fill style={{ objectFit: 'cover' }} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Info */}
                    <div className={styles.detailsSection}>
                        <div className={styles.badges}>
                            <span className={styles.badge} style={{ background: 'var(--primary-bg)', color: 'var(--primary)' }}>
                                New Arrival
                            </span>
                            <span className={styles.badge} style={{ background: '#fef3c7', color: '#92400e' }}>
                                Limited Edition
                            </span>
                        </div>

                        <h1 className={styles.productTitle}>{product.title}</h1>

                        <div className={styles.rating}>
                            <div className="flex text-accent">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                            </div>
                            <span>(4.9/5 from 42 Reviews)</span>
                        </div>

                        <div className={styles.priceContainer}>
                            <span className={styles.productPrice}>৳{product.price.toLocaleString()}</span>
                            <span className={styles.originalPrice}>৳{(product.price * 1.15).toLocaleString()}</span>
                        </div>

                        <p className={styles.productDescription}>
                            {product.description || "Crafted from specialized fabrics, this piece combines luxury with everyday functionality. Designed for longevity and timeless style."}
                        </p>

                        {/* Size Selection */}
                        <div className="mb-8">
                            <div className={styles.selectorLabel}>
                                <span>Select Size: <span className="text-primary">{selectedSize}</span></span>
                                <button className="text-[10px] underline tracking-widest">SIzeguide</button>
                            </div>
                            <div className={styles.optionsGrid}>
                                {sizes.map(size => (
                                    <button
                                        key={size}
                                        className={`${styles.sizeOption} ${selectedSize === size ? styles.selected : ''}`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Purchase Actions */}
                        <div className={styles.actions}>
                            <div className={styles.quantityControl}>
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className={styles.quantityBtn}>
                                    <Minus size={16} />
                                </button>
                                <span className={styles.quantityValue}>{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)} className={styles.quantityBtn}>
                                    <Plus size={16} />
                                </button>
                            </div>

                            <button
                                className={styles.addToCartBtn}
                                onClick={handleAddToCart}
                                disabled={isAdding || isAdded}
                            >
                                {isAdding ? (
                                    <span>Processing...</span>
                                ) : isAdded ? (
                                    <span className="flex items-center gap-2"><CheckCircle2 size={20} /> Added</span>
                                ) : (
                                    <span className="flex items-center gap-2"><ShoppingBag size={20} /> Add to Cart</span>
                                )}
                            </button>

                            <button className={styles.wishlistBtn}>
                                <Heart size={20} />
                            </button>
                        </div>

                        {/* Feature Points */}
                        <div className={styles.featuresList}>
                            <div className={styles.featureItem}><Truck size={18} className={styles.featureIcon} /> <span>Express Delivery</span></div>
                            <div className={styles.featureItem}><ShieldCheck size={18} className={styles.featureIcon} /> <span>Verified Quality</span></div>
                            <div className={styles.featureItem}><RotateCcw size={18} className={styles.featureIcon} /> <span>30-Day Returns</span></div>
                            <div className={styles.featureItem}><Share2 size={18} className={styles.featureIcon} /> <span>Secure Share</span></div>
                        </div>

                        {/* Info Accordions */}
                        <div className="border-t border-light mt-8">
                            <div className={styles.accordionItem}>
                                <button className={styles.accordionHeader} onClick={() => setOpenAccordion(openAccordion === 'details' ? null : 'details')}>
                                    Product Specifications
                                    <ChevronDown size={16} style={{ transform: openAccordion === 'details' ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
                                </button>
                                <div className={`${styles.accordionContent} ${openAccordion === 'details' ? styles.open : ''}`}>
                                    <div className={styles.contentInner}>
                                        <p>Material: Premium Cotton Blend</p>
                                        <p>Weight: 240 GSM Luxury Weight</p>
                                        <p>Care: Hand wash or dry clean recommended</p>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.accordionItem}>
                                <button className={styles.accordionHeader} onClick={() => setOpenAccordion(openAccordion === 'shipping' ? null : 'shipping')}>
                                    Shipping & Returns
                                    <ChevronDown size={16} style={{ transform: openAccordion === 'shipping' ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
                                </button>
                                <div className={`${styles.accordionContent} ${openAccordion === 'shipping' ? styles.open : ''}`}>
                                    <div className={styles.contentInner}>
                                        <p>Dispatched within 24-48 hours. Returns accepted on unworn items with tags within 7 days.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Section */}
                {relatedProducts.length > 0 && (
                    <div className={styles.relatedSection}>
                        <div className={styles.sectionHeader}>
                            <h2>You May Also Like</h2>
                            <Link href="/shop" className={styles.viewAllLink}>Explore Shop</Link>
                        </div>
                        <div className={styles.productGrid} style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                            {relatedProducts.slice(0, 4).map(p => (
                                <ProductCard key={p.id} {...p} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
