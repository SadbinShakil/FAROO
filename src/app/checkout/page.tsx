'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './Checkout.module.css';
import {
    CreditCard,
    Smartphone,
    Banknote,
    AlertCircle
} from 'lucide-react';

type PaymentMethod = 'cod' | 'bkash' | 'rocket' | 'nagad';

export default function CheckoutPage() {
    const { items, cartTotal, clearCart } = useCart();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        deliveryArea: 'inside', // Default to Inside Dhaka
        // Payment related
        trxId: '',
        senderPhone: ''
    });

    // Promo Code State
    const [promoInput, setPromoInput] = useState('');
    const [appliedDiscount, setAppliedDiscount] = useState<{ code: string, amount: number } | null>(null);
    const [promoError, setPromoError] = useState('');
    const [isValidating, setIsValidating] = useState(false);

    // Derived state
    const shippingCost = formData.deliveryArea === 'inside' ? 70 : 150;
    const finalTotal = cartTotal + shippingCost - (appliedDiscount?.amount || 0);

    const handleApplyDiscount = async () => {
        if (!promoInput) return;
        setIsValidating(true);
        setPromoError('');

        try {
            const res = await fetch('/api/discounts/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: promoInput, cartTotal })
            });
            const data = await res.json();

            if (res.ok) {
                setAppliedDiscount({ code: data.code, amount: data.amount });
                setPromoInput('');
            } else {
                setPromoError(data.error);
            }
        } catch (err) {
            setPromoError('Failed to validate code');
        } finally {
            setIsValidating(false);
        }
    };

    const handleRemoveDiscount = () => {
        setAppliedDiscount(null);
        setPromoError('');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation for Mobile Banking
        if (paymentMethod !== 'cod') {
            if (!formData.trxId || !formData.senderPhone) {
                alert('Please provide Transaction ID and Sender Number for the payment.');
                return;
            }
        }

        setIsSubmitting(true);

        const notes = paymentMethod !== 'cod'
            ? `Payment: ${paymentMethod.toUpperCase()} | TrxID: ${formData.trxId} | Sender: ${formData.senderPhone}`
            : '';

        const orderData = {
            customerName: `${formData.firstName} ${formData.lastName}`,
            customerEmail: formData.email,
            customerPhone: formData.phone,
            shippingAddress: {
                street: formData.address,
                city: formData.city,
                state: formData.state,
                pincode: formData.zip,
                country: 'Bangladesh'
            },
            items: items,
            paymentMethod: paymentMethod,
            notes: notes,
            shippingCost: shippingCost,
            discountCode: appliedDiscount?.code,
            discount: appliedDiscount?.amount || 0
        };

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            const data = await res.json();

            if (res.ok) {
                clearCart();
                router.push(`/checkout/success?orderNumber=${data.orderNumber}`);
            } else {
                alert(data.error || 'Failed to place order. Please try again.');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className={styles.checkoutPage}>
                <div className="container" style={{ textAlign: 'center', padding: '60px' }}>
                    <h2>Your cart is empty</h2>
                    <button onClick={() => router.push('/shop')} className="btn" style={{ marginTop: '20px' }}>
                        Return to Shop
                    </button>
                </div>
            </div>
        );
    }

    // Variables are defined at the top

    return (
        <div className={styles.checkoutPage}>
            <div className="container">
                <h1 className={styles.title}>Checkout</h1>

                <form onSubmit={handleSubmit} className={styles.grid}>
                    {/* Left Column - Forms */}
                    <div>
                        <div className={styles.section}>
                            <h2>Contact Information</h2>
                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        className={styles.input}
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        className={styles.input}
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={styles.section}>
                            <h2>Shipping Address</h2>
                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        required
                                        className={styles.input}
                                        value={formData.firstName}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        required
                                        className={styles.input}
                                        value={formData.lastName}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                    <label className={styles.label}>Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        required
                                        className={styles.input}
                                        placeholder="Street address, Apartment, etc."
                                        value={formData.address}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        required
                                        className={styles.input}
                                        value={formData.city}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Division</label>
                                    <input
                                        type="text"
                                        name="state"
                                        required
                                        className={styles.input}
                                        value={formData.state}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}> ZIP / Postal Code</label>
                                    <input
                                        type="text"
                                        name="zip"
                                        required
                                        className={styles.input}
                                        value={formData.zip}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Delivery Area Section */}
                        <div className={styles.section}>
                            <h2>Delivery Area</h2>
                            <div className={styles.paymentMethods}>
                                <label className={`${styles.paymentMethod} ${formData.deliveryArea === 'inside' ? styles.selected : ''}`}>
                                    <input
                                        type="radio"
                                        name="deliveryArea"
                                        value="inside"
                                        checked={formData.deliveryArea === 'inside'}
                                        onChange={() => setFormData({ ...formData, deliveryArea: 'inside' })}
                                    />
                                    <span className={styles.paymentLabel}>Inside Dhaka</span>
                                    <span style={{ fontWeight: 'bold' }}>৳70</span>
                                </label>

                                <label className={`${styles.paymentMethod} ${formData.deliveryArea === 'outside' ? styles.selected : ''}`}>
                                    <input
                                        type="radio"
                                        name="deliveryArea"
                                        value="outside"
                                        checked={formData.deliveryArea === 'outside'}
                                        onChange={() => setFormData({ ...formData, deliveryArea: 'outside' })}
                                    />
                                    <span className={styles.paymentLabel}>Outside Dhaka</span>
                                    <span style={{ fontWeight: 'bold' }}>৳150</span>
                                </label>
                            </div>
                        </div>

                        {/* Payment Method Section */}
                        <div className={styles.section}>
                            <h2>Payment Method</h2>
                            <div className={styles.paymentMethods}>
                                <label className={`${styles.paymentMethod} ${paymentMethod === 'cod' ? styles.selected : ''}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="cod"
                                        checked={paymentMethod === 'cod'}
                                        onChange={() => setPaymentMethod('cod')}
                                    />
                                    <span className={styles.paymentLabel}>Cash on Delivery</span>
                                    <div className={styles.paymentIcons}>
                                        <Banknote size={20} />
                                    </div>
                                </label>

                                <label className={`${styles.paymentMethod} ${paymentMethod === 'bkash' ? styles.selected : ''}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="bkash"
                                        checked={paymentMethod === 'bkash'}
                                        onChange={() => setPaymentMethod('bkash')}
                                    />
                                    <span className={styles.paymentLabel}>bKash</span>
                                    <span style={{ color: '#E2136E', fontWeight: 'bold' }}>bKash</span>
                                </label>

                                <label className={`${styles.paymentMethod} ${paymentMethod === 'nagad' ? styles.selected : ''}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="nagad"
                                        checked={paymentMethod === 'nagad'}
                                        onChange={() => setPaymentMethod('nagad')}
                                    />
                                    <span className={styles.paymentLabel}>Nagad</span>
                                    <span style={{ color: '#F16335', fontWeight: 'bold' }}>Nagad</span>
                                </label>

                                <label className={`${styles.paymentMethod} ${paymentMethod === 'rocket' ? styles.selected : ''}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="rocket"
                                        checked={paymentMethod === 'rocket'}
                                        onChange={() => setPaymentMethod('rocket')}
                                    />
                                    <span className={styles.paymentLabel}>Rocket</span>
                                    <span style={{ color: '#8C3494', fontWeight: 'bold' }}>Rocket</span>
                                </label>
                            </div>

                            {paymentMethod !== 'cod' && (
                                <div className={styles.paymentDetails}>
                                    <div className={styles.paymentInstruction}>
                                        <p style={{ marginBottom: '10px' }}>
                                            Please send <strong>৳{finalTotal.toLocaleString()}</strong> to the following {paymentMethod} number:
                                        </p>
                                        <p style={{ fontSize: '1.2rem', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '15px' }}>
                                            01700000000
                                        </p>
                                        <div style={{ display: 'flex', gap: '8px', fontSize: '0.85rem', color: '#666', alignItems: 'center' }}>
                                            <AlertCircle size={16} />
                                            <span>Use "Send Money" option. Reference: Your Name</span>
                                        </div>
                                    </div>

                                    <div className={styles.formGrid}>
                                        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                            <label className={styles.label}>Transaction ID</label>
                                            <input
                                                type="text"
                                                name="trxId"
                                                required
                                                placeholder="e.g. 9H7G6F5E"
                                                className={styles.input}
                                                value={formData.trxId}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                            <label className={styles.label}>Sender Phone Number</label>
                                            <input
                                                type="text"
                                                name="senderPhone"
                                                required
                                                placeholder="01xxxxxxxxx"
                                                className={styles.input}
                                                value={formData.senderPhone}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div>
                        <div className={styles.section}>
                            <h2>Order Summary</h2>
                            <div className={styles.cartItems}>
                                {items.map(item => (
                                    <div key={item.id} className={styles.cartItem}>
                                        <div className={styles.itemImage}>
                                            <Image
                                                src={item.image}
                                                alt={item.productTitle}
                                                fill
                                            />
                                        </div>
                                        <div className={styles.itemInfo}>
                                            <h4>{item.productTitle}</h4>
                                            <p className={styles.itemMeta}>Size: {item.size} | Qty: {item.quantity}</p>
                                            {item.color && <p className={styles.itemMeta}>Color: {item.color}</p>}
                                            <p className={styles.itemMeta}>৳{(item.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.summaryItem} style={{ marginTop: '20px', padding: '15px 0', borderTop: '1px solid #eee', borderBottom: '1px solid #eee' }}>
                                <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                                    <input
                                        type="text"
                                        placeholder="Promo Code"
                                        className={styles.input}
                                        style={{ height: '40px' }}
                                        value={promoInput}
                                        onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                                        disabled={!!appliedDiscount}
                                    />
                                    <button
                                        type="button"
                                        onClick={appliedDiscount ? handleRemoveDiscount : handleApplyDiscount}
                                        className="btn"
                                        style={{ height: '40px', padding: '0 20px', background: appliedDiscount ? '#333' : 'var(--primary)', fontSize: '0.8rem' }}
                                        disabled={isValidating}
                                    >
                                        {isValidating ? '...' : (appliedDiscount ? 'Remove' : 'Apply')}
                                    </button>
                                </div>
                                {promoError && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '5px' }}>{promoError}</p>}
                                {appliedDiscount && <p style={{ color: '#10b981', fontSize: '0.75rem', marginTop: '5px' }}>Code {appliedDiscount.code} applied!</p>}
                            </div>

                            <div className={styles.summaryItem}>
                                <span>Subtotal</span>
                                <span>৳{cartTotal.toLocaleString()}</span>
                            </div>
                            {appliedDiscount && (
                                <div className={styles.summaryItem} style={{ color: '#10b981' }}>
                                    <span>Discount ({appliedDiscount.code})</span>
                                    <span>-৳{appliedDiscount.amount.toLocaleString()}</span>
                                </div>
                            )}
                            <div className={styles.summaryItem}>
                                <span>Shipping</span>
                                <span>৳{shippingCost}</span>
                            </div>
                            <div className={styles.summaryTotal}>
                                <span>Total</span>
                                <span>৳{finalTotal.toLocaleString()}</span>
                            </div>

                            <button
                                type="submit"
                                className={styles.placeOrderBtn}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Processing...' : 'Place Order'}
                            </button>
                        </div>
                    </div>
                </form>
            </div >
        </div >
    );
}
