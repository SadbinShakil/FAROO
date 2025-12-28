'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, ShoppingCart, Tag, Users, TrendingUp, Search, Eye, Download } from 'lucide-react';
import { ORDERS, Order } from '@/data/orders'; // Keep type definition
import styles from '../dashboard/Dashboard.module.css';
import ordersStyles from './Orders.module.css';

export default function AdminOrders() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | Order['status']>('all');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        const auth = sessionStorage.getItem('adminAuth');
        if (auth !== 'true') {
            router.push('/admin');
        } else {
            setIsAuthenticated(true);
            fetchOrders();
        }
    }, [router]);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders');
            if (res.ok) {
                const data = await res.json();
                // Convert date strings to Date objects
                const parsedOrders = data.map((order: any) => ({
                    ...order,
                    createdAt: new Date(order.createdAt),
                    updatedAt: new Date(order.updatedAt)
                }));
                setOrders(parsedOrders);
            }
        } catch (error) {
            console.error('Failed to fetch orders', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('adminAuth');
        router.push('/admin');
    };

    if (!isAuthenticated) {
        return <div className={styles.loading}>Loading...</div>;
    }

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
        const orderToUpdate = orders.find(o => o.id === orderId);
        if (!orderToUpdate) return;

        try {
            const res = await fetch(`/api/orders/${orderToUpdate.orderNumber}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                setOrders(orders.map(order =>
                    order.id === orderId
                        ? { ...order, status: newStatus, updatedAt: new Date() }
                        : order
                ));
            } else {
                const error = await res.json();
                alert(`Failed to update status: ${error.error}`);
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            alert('An error occurred while updating status');
        }
    };

    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <div className={styles.logo}>
                    <h2>Faroo Admin</h2>
                </div>

                <nav className={styles.nav}>
                    <Link href="/admin/dashboard" className={styles.navItem}>
                        <TrendingUp size={20} />
                        Dashboard
                    </Link>
                    <Link href="/admin/products" className={styles.navItem}>
                        <Package size={20} />
                        Products
                    </Link>
                    <Link href="/admin/orders" className={styles.navItemActive}>
                        <ShoppingCart size={20} />
                        Orders
                    </Link>
                    <Link href="/admin/discounts" className={styles.navItem}>
                        <Tag size={20} />
                        Discounts
                    </Link>
                    <Link href="/" className={styles.navItem}>
                        <Users size={20} />
                        View Store
                    </Link>
                </nav>

                <button onClick={handleLogout} className={styles.logoutBtn}>
                    Logout
                </button>
            </aside>

            <main className={styles.main}>
                <header className={ordersStyles.header}>
                    <div>
                        <h1>Orders</h1>
                        <p>Manage customer orders and fulfillment</p>
                    </div>
                    <button className={ordersStyles.exportBtn}>
                        <Download size={20} />
                        Export
                    </button>
                </header>

                <div className={ordersStyles.filters}>
                    <div className={ordersStyles.searchBox}>
                        <Search size={20} />
                        <input
                            type="text"
                            placeholder="Search by order number, customer name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className={ordersStyles.filterButtons}>
                        <button
                            className={filterStatus === 'all' ? ordersStyles.filterActive : ordersStyles.filterBtn}
                            onClick={() => setFilterStatus('all')}
                        >
                            All ({ORDERS.length})
                        </button>
                        <button
                            className={filterStatus === 'pending' ? ordersStyles.filterActive : ordersStyles.filterBtn}
                            onClick={() => setFilterStatus('pending')}
                        >
                            Pending ({ORDERS.filter(o => o.status === 'pending').length})
                        </button>
                        <button
                            className={filterStatus === 'processing' ? ordersStyles.filterActive : ordersStyles.filterBtn}
                            onClick={() => setFilterStatus('processing')}
                        >
                            Processing ({ORDERS.filter(o => o.status === 'processing').length})
                        </button>
                        <button
                            className={filterStatus === 'shipped' ? ordersStyles.filterActive : ordersStyles.filterBtn}
                            onClick={() => setFilterStatus('shipped')}
                        >
                            Shipped ({ORDERS.filter(o => o.status === 'shipped').length})
                        </button>
                        <button
                            className={filterStatus === 'delivered' ? ordersStyles.filterActive : ordersStyles.filterBtn}
                            onClick={() => setFilterStatus('delivered')}
                        >
                            Delivered ({ORDERS.filter(o => o.status === 'delivered').length})
                        </button>
                    </div>
                </div>

                <div className={ordersStyles.ordersTable}>
                    <table>
                        <thead>
                            <tr>
                                <th>Order #</th>
                                <th>Customer</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Payment</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map(order => (
                                <tr key={order.id}>
                                    <td className={ordersStyles.orderNumber}>{order.orderNumber}</td>
                                    <td>
                                        <div className={ordersStyles.customerInfo}>
                                            <strong>{order.customerName}</strong>
                                            <span>{order.customerEmail}</span>
                                        </div>
                                    </td>
                                    <td>{order.items.length} item(s)</td>
                                    <td className={ordersStyles.amount}>৳{order.total.toLocaleString()}</td>
                                    <td>
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                                            className={`${ordersStyles.statusSelect} ${ordersStyles[order.status]}`}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="processing">Processing</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                    <td>
                                        <span className={`${ordersStyles.paymentBadge} ${ordersStyles[order.paymentStatus]}`}>
                                            {order.paymentStatus}
                                        </span>
                                    </td>
                                    <td>{order.createdAt.toLocaleDateString()}</td>
                                    <td>
                                        <button
                                            className={ordersStyles.viewBtn}
                                            onClick={() => setSelectedOrder(order)}
                                            title="View Details"
                                        >
                                            <Eye size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredOrders.length === 0 && (
                    <div className={ordersStyles.emptyState}>
                        <ShoppingCart size={64} />
                        <h3>No orders found</h3>
                        <p>Try adjusting your search or filters</p>
                    </div>
                )}

                {selectedOrder && (
                    <div className={ordersStyles.modal} onClick={() => setSelectedOrder(null)}>
                        <div className={ordersStyles.modalContent} onClick={(e) => e.stopPropagation()}>
                            <h2>Order Details</h2>

                            <div className={ordersStyles.orderDetails}>
                                <div className={ordersStyles.detailSection}>
                                    <h3>Order Information</h3>
                                    <p><strong>Order Number:</strong> {selectedOrder.orderNumber}</p>
                                    <p><strong>Date:</strong> {selectedOrder.createdAt.toLocaleString()}</p>
                                    <p><strong>Status:</strong> <span className={`${styles.badge} ${styles[selectedOrder.status]}`}>{selectedOrder.status}</span></p>
                                    <p><strong>Payment:</strong> <span className={`${styles.badge} ${styles[selectedOrder.paymentStatus]}`}>{selectedOrder.paymentStatus}</span></p>
                                </div>

                                <div className={ordersStyles.detailSection}>
                                    <h3>Customer Information</h3>
                                    <p><strong>Name:</strong> {selectedOrder.customerName}</p>
                                    <p><strong>Email:</strong> {selectedOrder.customerEmail}</p>
                                    <p><strong>Phone:</strong> {selectedOrder.customerPhone}</p>
                                </div>

                                <div className={ordersStyles.detailSection}>
                                    <h3>Shipping Address</h3>
                                    <p>{selectedOrder.shippingAddress.street}</p>
                                    <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}</p>
                                    <p>{selectedOrder.shippingAddress.pincode}, {selectedOrder.shippingAddress.country}</p>
                                </div>

                                <div className={ordersStyles.detailSection}>
                                    <h3>Order Items</h3>
                                    {selectedOrder.items.map((item, index) => (
                                        <div key={index} className={ordersStyles.orderItem}>
                                            <p><strong>{item.productTitle}</strong></p>
                                            <p>Quantity: {item.quantity} × ৳{item.price.toLocaleString()}</p>
                                            {item.size && <p>Size: {item.size}</p>}
                                        </div>
                                    ))}
                                </div>

                                <div className={ordersStyles.detailSection}>
                                    <h3>Order Summary</h3>
                                    <p><strong>Subtotal:</strong> ৳{selectedOrder.subtotal.toLocaleString()}</p>
                                    {selectedOrder.discount > 0 && (
                                        <p><strong>Discount ({selectedOrder.discountCode}):</strong> -৳{selectedOrder.discount.toLocaleString()}</p>
                                    )}
                                    <p><strong>Shipping:</strong> ৳{selectedOrder.shipping.toLocaleString()}</p>
                                    <p className={ordersStyles.totalAmount}><strong>Total:</strong> ৳{selectedOrder.total.toLocaleString()}</p>
                                </div>

                                {selectedOrder.notes && (
                                    <div className={ordersStyles.detailSection}>
                                        <h3>Notes</h3>
                                        <p>{selectedOrder.notes}</p>
                                    </div>
                                )}
                            </div>

                            <button
                                className={ordersStyles.closeBtn}
                                onClick={() => setSelectedOrder(null)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
