'use client';

import { useState } from 'react';
import styles from './TrackOrder.module.css';
import { Search, Package, Calendar, Truck } from 'lucide-react';

export default function TrackOrderPage() {
    const [orderNumber, setOrderNumber] = useState('');
    const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [order, setOrder] = useState<any>(null);
    const [isCancelling, setIsCancelling] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setOrder(null);

        try {
            const params = new URLSearchParams({
                orderNumber: orderNumber,
                phone: phone
            });

            const res = await fetch(`/api/orders/track?${params}`);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to find order');
            }

            setOrder(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelOrder = async () => {
        if (!confirm('Are you sure you want to cancel this order? This action cannot be undone.')) return;

        setIsCancelling(true);
        try {
            const res = await fetch(`/api/orders/${order.orderNumber}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'cancel' })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to cancel order');
            }

            // Refresh order data
            setOrder({ ...order, status: 'cancelled' });
            alert('Order has been cancelled successfully.');
        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsCancelling(false);
        }
    };

    // Check if order is editable (within 30 mins and pending)
    const isEditable = order &&
        order.status === 'pending' &&
        (new Date().getTime() - new Date(order.createdAt).getTime()) < 30 * 60 * 1000;

    return (
        <div className={styles.trackPage}>
            <div className={styles.container}>
                <h1 className={styles.title}>Track Your Order</h1>

                <div className={styles.searchSection}>
                    <form onSubmit={handleSearch}>
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Order Number</label>
                                <input
                                    type="text"
                                    placeholder="e.g. ORD-2024-0001"
                                    className={styles.input}
                                    value={orderNumber}
                                    onChange={(e) => setOrderNumber(e.target.value)}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Phone Number (Used for Billing)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. 01700000000"
                                    className={styles.input}
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className={styles.searchBtn}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Searching...' : 'Track Order'}
                        </button>
                    </form>
                    {error && (
                        <div style={{ marginTop: '20px', color: 'red', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}
                </div>

                {order && (
                    <div className={styles.resultSection}>
                        <div className={styles.orderHeader}>
                            <div className={styles.orderId}>
                                Order #{order.orderNumber}
                            </div>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                {isEditable && (
                                    <button
                                        onClick={handleCancelOrder}
                                        disabled={isCancelling}
                                        style={{
                                            background: '#fee2e2',
                                            color: '#dc2626',
                                            border: 'none',
                                            padding: '8px 16px',
                                            borderRadius: '20px',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            fontSize: '0.85rem'
                                        }}
                                    >
                                        {isCancelling ? 'Cancelling...' : 'Cancel Order'}
                                    </button>
                                )}
                                <div className={`${styles.orderStatus} ${styles[order.status.toLowerCase()] || ''}`}>
                                    {order.status}
                                </div>
                            </div>
                        </div>

                        <div className={styles.orderMeta}>
                            <div className={styles.metaItem}>
                                <label>Date Placed</label>
                                <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className={styles.metaItem}>
                                <label>Total Amount</label>
                                <p>৳{order.total.toLocaleString()}</p>
                            </div>
                            <div className={styles.metaItem}>
                                <label>Payment Method</label>
                                <p style={{ textTransform: 'capitalize' }}>
                                    {order.paymentMethod} ({order.paymentStatus})
                                </p>
                            </div>
                        </div>

                        <h3>Order Items</h3>
                        <div className={styles.itemsList}>
                            {order.items.map((item: any) => (
                                <div key={item.id} className={styles.item}>
                                    <div className={styles.itemInfo}>
                                        <div style={{
                                            width: 40,
                                            height: 40,
                                            background: '#f0f0f0',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: 4
                                        }}>
                                            <Package size={20} color="#666" />
                                        </div>
                                        <div className={styles.itemDetails}>
                                            <span className={styles.itemTitle}>{item.productTitle}</span>
                                            <span className={styles.itemVariant}>
                                                Size: {item.size} {item.color ? `| Color: ${item.color}` : ''} | Qty: {item.quantity}
                                            </span>
                                        </div>
                                    </div>
                                    <span className={styles.itemPrice}>
                                        ৳{(item.price * item.quantity).toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div style={{
                            padding: '20px',
                            background: '#F0F9FF',
                            borderRadius: '8px',
                            display: 'flex',
                            gap: '12px',
                            alignItems: 'center',
                            color: '#0066CC'
                        }}>
                            <Truck size={24} />
                            <div>
                                <strong>Shipping Address</strong>
                                <p style={{ margin: '4px 0 0', color: '#334155', fontSize: '0.95rem' }}>
                                    {order.shippingStreet}, {order.shippingCity}, {order.shippingState}, {order.shippingPincode}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
