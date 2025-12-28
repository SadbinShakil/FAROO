'use client';

import { useCart } from '@/context/CartContext';
import { X, ShoppingBag, Trash2, ArrowRight, Minus, Plus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './CartSidebar.module.css';

export default function CartSidebar() {
    const {
        isCartOpen,
        closeCart,
        items,
        removeFromCart,
        updateQuantity,
        cartTotal
    } = useCart();

    return (
        <>
            <div
                className={`${styles.overlay} ${isCartOpen ? styles.open : ''}`}
                onClick={closeCart}
            />

            <aside className={`${styles.sidebar} ${isCartOpen ? styles.open : ''}`}>
                <div className={styles.header}>
                    <h2>Your Collection</h2>
                    <button onClick={closeCart} className={styles.closeBtn} aria-label="Close cart">
                        <X size={20} />
                    </button>
                </div>

                <div className={styles.cartItems}>
                    {items.length === 0 ? (
                        <div className={styles.emptyCart}>
                            <div className="mb-6 opacity-20">
                                <ShoppingBag size={80} strokeWidth={1} />
                            </div>
                            <h3 className="text-xl font-heading mb-2">Your bespoke bag is empty</h3>
                            <p className="text-sm mb-8 max-width-[240px]">Explore our latest collections to find your next signature piece.</p>
                            <Link href="/shop" onClick={closeCart} className="btn-outline" style={{ borderRadius: '0' }}>
                                Start Exploring
                            </Link>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.id} className={styles.cartItem}>
                                <div className={styles.itemImage}>
                                    <Image
                                        src={item.image}
                                        alt={item.productTitle}
                                        fill
                                        sizes="100px"
                                    />
                                </div>
                                <div className={styles.itemDetails}>
                                    <h3 className={styles.productName}>{item.productTitle}</h3>
                                    <div className={styles.itemMeta}>Size: {item.size}</div>
                                    <div className={styles.itemPrice}>৳{item.price.toLocaleString()}</div>

                                    <div className={styles.itemActions}>
                                        <div className={styles.quantityControls}>
                                            <button
                                                className={styles.qtyBtn}
                                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className={styles.qtyValue}>{item.quantity}</span>
                                            <button
                                                className={styles.qtyBtn}
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className={styles.removeBtn}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {items.length > 0 && (
                    <div className={styles.footer}>
                        <div className={styles.summaryRow}>
                            <span>Bag Subtotal</span>
                            <span>৳{cartTotal.toLocaleString()}</span>
                        </div>
                        <div className={styles.summaryRow}>
                            <span>Value Added Tax</span>
                            <span>Included</span>
                        </div>
                        <div className={styles.totalRow}>
                            <span className={styles.totalLabel}>Total Amount</span>
                            <span className={styles.totalValue}>৳{cartTotal.toLocaleString()}</span>
                        </div>
                        <Link href="/checkout" className={styles.checkoutBtn} onClick={closeCart}>
                            Complete Purchase <ArrowRight size={18} />
                        </Link>
                    </div>
                )}
            </aside>
        </>
    );
}
