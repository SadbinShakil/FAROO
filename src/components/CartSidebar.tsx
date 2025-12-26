'use client';

import { useCart } from '@/context/CartContext';
import { X, ShoppingBag, Trash2 } from 'lucide-react';
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
                    <h2>Your Bag ({items.length})</h2>
                    <button onClick={closeCart} className={styles.closeBtn}>
                        <X size={24} />
                    </button>
                </div>

                <div className={styles.cartItems}>
                    {items.length === 0 ? (
                        <div className={styles.emptyCart}>
                            <ShoppingBag size={48} opacity={0.2} />
                            <p>Your shopping bag is empty.</p>
                            <button onClick={closeCart} className="btn-outline">
                                Start Shopping
                            </button>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.id} className={styles.cartItem}>
                                <div className={styles.itemImage}>
                                    <Image
                                        src={item.image}
                                        alt={item.productTitle}
                                        fill
                                        sizes="80px"
                                    />
                                </div>
                                <div className={styles.itemDetails}>
                                    <div className={styles.itemHeader}>
                                        <div>
                                            <h3>{item.productTitle}</h3>
                                            <p className={styles.itemSize}>Size: {item.size}</p>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className={styles.removeBtn}
                                            aria-label="Remove item"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                    <div className={styles.itemFooter}>
                                        <div className={styles.quantityControls}>
                                            <button
                                                className={styles.qtyBtn}
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                            >
                                                −
                                            </button>
                                            <span className={styles.qtyValue}>{item.quantity}</span>
                                            <button
                                                className={styles.qtyBtn}
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <div className={styles.itemPrice}>
                                            ৳{(item.price * item.quantity).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {items.length > 0 && (
                    <div className={styles.footer}>
                        <div className={styles.totalRow}>
                            <span className={styles.totalLabel}>Subtotal</span>
                            <span className={styles.totalValue}>৳{cartTotal.toLocaleString()}</span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '16px', textAlign: 'center' }}>
                            Shipping and taxes calculated at checkout.
                        </p>
                        <Link href="/checkout" className={styles.checkoutBtn} onClick={closeCart}>
                            Proceed to Checkout
                        </Link>
                    </div>
                )}
            </aside>
        </>
    );
}
