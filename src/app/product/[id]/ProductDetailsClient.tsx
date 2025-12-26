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
    ShoppingBag
} from 'lucide-react';

interface Product {
    id: string;
    title: string;
    price: number;
    category: string;
    section: string;
    subcategory: string;
    image: string;
    description?: string | null;
    sizes: string[];
    colors: string[];
}

interface ProductDetailsClientProps {
    product: Product;
    relatedProducts: Product[];
}

import SizeGuideModal from '@/components/SizeGuideModal';

export default function ProductDetailsClient({ product, relatedProducts }: ProductDetailsClientProps) {
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);
    const [openAccordion, setOpenAccordion] = useState<string | null>('details');
    const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

    // Fallback for missing data
    const sizes = product.sizes?.length ? product.sizes : [];
    const colors = product.colors?.length ? product.colors : [];

    const { addToCart } = useCart();

    const handleAddToCart = () => {
        if (sizes.length > 0 && !selectedSize) {
            alert('Please select a size');
            return;
        }

        if (colors.length > 0 && !selectedColor) {
            alert('Please select a color');
            return;
        }

        setIsAdding(true);

        // Simulate loading for premium feel
        setTimeout(() => {
            addToCart({
                productId: product.id,
                productTitle: product.title,
                price: product.price,
                image: product.image,
                quantity: quantity,
                size: selectedSize,
                color: selectedColor
            });
            setIsAdding(false);
            alert('Added to cart!');
        }, 600);
    };

    const toggleAccordion = (section: string) => {
        setOpenAccordion(openAccordion === section ? null : section);
    };

    return (
        <div className={styles.productPage}>
            <SizeGuideModal
                isOpen={isSizeGuideOpen}
                onClose={() => setIsSizeGuideOpen(false)}
                category={product.subcategory}
            />
            <div className={styles.container}>
                {/* Breadcrumb */}
                <div className={styles.breadcrumb}>
                    <Link href="/">Home</Link> <span>/</span>
                    <Link href="/shop">Shop</Link> <span>/</span>
                    <span style={{ color: 'var(--text-color)', fontWeight: 500 }}>{product.title}</span>
                </div>

                <div className={styles.productGrid}>
                    {/* Left Column: Images */}
                    <div className={styles.imageSection}>
                        <div className={styles.mainImage}>
                            <Image
                                src={product.image}
                                alt={product.title}
                                fill
                                priority
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>
                        {/* Mock Gallery for visuals */}
                        <div className={styles.imageGallery}>
                            <div className={`${styles.galleryThumb} ${styles.active}`}>
                                <Image src={product.image} alt="View 1" width={80} height={100} style={{ objectFit: 'cover' }} />
                            </div>
                            {/* We duplicate the image to simulate a gallery since we only have one */}
                            <div className={styles.galleryThumb}>
                                <Image src={product.image} alt="View 2" width={80} height={100} style={{ objectFit: 'cover' }} />
                            </div>
                            <div className={styles.galleryThumb}>
                                <Image src={product.image} alt="View 3" width={80} height={100} style={{ objectFit: 'cover' }} />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Details */}
                    <div className={styles.detailsSection}>
                        <div className={styles.badges}>
                            <span className={styles.badge}>New Season</span>
                            <span className={styles.badge} style={{ background: '#F0F9FF', color: '#0066CC' }}>Best Seller</span>
                        </div>

                        <h1 className={styles.productTitle}>{product.title}</h1>

                        <div className={styles.rating}>
                            <div style={{ display: 'flex' }}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} size={16} fill="#FFB800" strokeWidth={0} />
                                ))}
                            </div>
                            <span>(12 Reviews)</span>
                        </div>

                        <div className={styles.priceContainer}>
                            <span className={styles.productPrice}>৳{product.price.toLocaleString()}</span>
                            {/* Mock original price for discount effect */}
                            <span className={styles.originalPrice}>৳{(product.price * 1.2).toFixed(0)}</span>
                        </div>

                        <p className={styles.productDescription}>
                            {product.description || "Experience premium quality with this meticulously crafted piece. Designed for both comfort and style, making it a perfect addition to your wardrobe."}
                        </p>

                        <div className={styles.selectors}>
                            {/* Color Selector */}
                            {colors.length > 0 && (
                                <div>
                                    <div className={styles.selectorLabel}>
                                        <span>Color: {selectedColor || 'Select a color'}</span>
                                    </div>
                                    <div className={styles.optionsGrid}>
                                        {colors.map((color) => (
                                            <button
                                                key={color}
                                                className={`${styles.colorOption} ${selectedColor === color ? styles.selected : ''}`}
                                                style={{ backgroundColor: color.toLowerCase() }}
                                                onClick={() => setSelectedColor(color)}
                                                title={color}
                                                aria-label={color}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Size Selector */}
                            {sizes.length > 0 && (
                                <div>
                                    <div className={styles.selectorLabel}>
                                        <span>Size: {selectedSize || 'Select a size'}</span>
                                        <button
                                            className={styles.sizeGuideBtn}
                                            onClick={() => setIsSizeGuideOpen(true)}
                                        >
                                            Size Guide
                                        </button>
                                    </div>
                                    <div className={styles.optionsGrid}>
                                        {sizes.map((size) => (
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
                            )}
                        </div>

                        <div className={styles.actions}>
                            <div className={styles.quantityControl}>
                                <button
                                    className={styles.quantityBtn}
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                >
                                    <Minus size={16} />
                                </button>
                                <span className={styles.quantityValue}>{quantity}</span>
                                <button
                                    className={styles.quantityBtn}
                                    onClick={() => setQuantity(quantity + 1)}
                                >
                                    <Plus size={16} />
                                </button>
                            </div>

                            <button
                                className={styles.addToCartBtn}
                                onClick={handleAddToCart}
                                disabled={isAdding}
                            >
                                {isAdding ? (
                                    <>Adding...</>
                                ) : (
                                    <>
                                        <ShoppingBag size={20} />
                                        Add to Cart
                                    </>
                                )}
                            </button>

                            <button className={styles.wishlistBtn} aria-label="Add to Wishlist">
                                <Heart size={20} />
                            </button>
                        </div>

                        <div className={styles.featuresList}>
                            <div className={styles.featureItem}>
                                <Truck size={20} className={styles.featureIcon} />
                                <span>Free Shipping</span>
                            </div>
                            <div className={styles.featureItem}>
                                <ShieldCheck size={20} className={styles.featureIcon} />
                                <span>Secure Checkout</span>
                            </div>
                            <div className={styles.featureItem}>
                                <RotateCcw size={20} className={styles.featureIcon} />
                                <span>Easy Returns</span>
                            </div>
                            <div className={styles.featureItem}>
                                <Share2 size={20} className={styles.featureIcon} />
                                <span>Share Product</span>
                            </div>
                        </div>

                        {/* Accordion Information */}
                        <div className={styles.infoSection}>
                            <div className={styles.accordionItem}>
                                <button
                                    className={styles.accordionHeader}
                                    onClick={() => toggleAccordion('details')}
                                >
                                    Product Details
                                    <ChevronDown
                                        size={20}
                                        style={{
                                            transform: openAccordion === 'details' ? 'rotate(180deg)' : 'rotate(0)',
                                            transition: 'transform 0.3s'
                                        }}
                                    />
                                </button>
                                <div className={`${styles.accordionContent} ${openAccordion === 'details' ? styles.open : ''}`}>
                                    <div className={styles.contentInner}>
                                        <ul>
                                            <li>Category: {product.category}</li>
                                            <li>Subcategory: {product.subcategory}</li>
                                            <li>Material: 100% Premium Cotton (Mock)</li>
                                            <li>Fit: Regular Fit</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.accordionItem}>
                                <button
                                    className={styles.accordionHeader}
                                    onClick={() => toggleAccordion('shipping')}
                                >
                                    Shipping & Returns
                                    <ChevronDown
                                        size={20}
                                        style={{
                                            transform: openAccordion === 'shipping' ? 'rotate(180deg)' : 'rotate(0)',
                                            transition: 'transform 0.3s'
                                        }}
                                    />
                                </button>
                                <div className={`${styles.accordionContent} ${openAccordion === 'shipping' ? styles.open : ''}`}>
                                    <div className={styles.contentInner}>
                                        <p>Free standard shipping on all orders over ৳2000. Returns are accepted within 30 days of purchase. Please ensure tags are attached.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className={styles.relatedSection}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>You May Also Like</h2>
                            <Link href="/shop" className={styles.viewAllLink}>
                                View All
                            </Link>
                        </div>
                        <div className={styles.relatedGrid}>
                            {relatedProducts.map((relatedProduct: Product) => (
                                // @ts-ignore
                                <ProductCard key={relatedProduct.id} {...relatedProduct} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
