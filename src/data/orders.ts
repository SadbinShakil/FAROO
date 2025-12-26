// Order management

export interface OrderItem {
    productId: string;
    productTitle: string;
    quantity: number;
    price: number;
    size?: string;
    color?: string;
}

export interface Order {
    id: string;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    items: OrderItem[];
    subtotal: number;
    discount: number;
    discountCode?: string;
    shipping: number;
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
    paymentMethod: 'cod' | 'card' | 'upi' | 'netbanking';
    shippingAddress: {
        street: string;
        city: string;
        state: string;
        pincode: string;
        country: string;
    };
    createdAt: Date;
    updatedAt: Date;
    notes?: string;
}

export const ORDERS: Order[] = [
    {
        id: 'o1',
        orderNumber: 'ORD-2024-001',
        customerName: 'Priya Sharma',
        customerEmail: 'priya.sharma@example.com',
        customerPhone: '+91 98765 43210',
        items: [
            {
                productId: 'w1',
                productTitle: 'Striped Blue Tunic Set',
                quantity: 1,
                price: 3500,
                size: 'M'
            },
            {
                productId: 'w7',
                productTitle: 'Pink Striped Sweater',
                quantity: 2,
                price: 2800,
                size: 'L'
            }
        ],
        subtotal: 9100,
        discount: 910,
        discountCode: 'WELCOME10',
        shipping: 150,
        total: 8340,
        status: 'delivered',
        paymentStatus: 'paid',
        paymentMethod: 'upi',
        shippingAddress: {
            street: '123 MG Road',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001',
            country: 'India'
        },
        createdAt: new Date('2024-12-15'),
        updatedAt: new Date('2024-12-20'),
        notes: 'Customer requested gift wrapping'
    },
    {
        id: 'o2',
        orderNumber: 'ORD-2024-002',
        customerName: 'Rahul Verma',
        customerEmail: 'rahul.v@example.com',
        customerPhone: '+91 87654 32109',
        items: [
            {
                productId: 'm5',
                productTitle: 'Classic Denim Jeans',
                quantity: 1,
                price: 4000,
                size: '32'
            }
        ],
        subtotal: 4000,
        discount: 0,
        shipping: 100,
        total: 4100,
        status: 'processing',
        paymentStatus: 'paid',
        paymentMethod: 'card',
        shippingAddress: {
            street: '456 Park Street',
            city: 'Delhi',
            state: 'Delhi',
            pincode: '110001',
            country: 'India'
        },
        createdAt: new Date('2024-12-21'),
        updatedAt: new Date('2024-12-21')
    },
    {
        id: 'o3',
        orderNumber: 'ORD-2024-003',
        customerName: 'Anita Desai',
        customerEmail: 'anita.d@example.com',
        customerPhone: '+91 76543 21098',
        items: [
            {
                productId: 'w13',
                productTitle: 'Black Cable Knit Cardigan',
                quantity: 1,
                price: 3500,
                size: 'S'
            },
            {
                productId: 'w15',
                productTitle: 'Beige Button Cardigan',
                quantity: 1,
                price: 3100,
                size: 'M'
            }
        ],
        subtotal: 6600,
        discount: 1650,
        discountCode: 'WINTER25',
        shipping: 150,
        total: 5100,
        status: 'pending',
        paymentStatus: 'pending',
        paymentMethod: 'cod',
        shippingAddress: {
            street: '789 Brigade Road',
            city: 'Bangalore',
            state: 'Karnataka',
            pincode: '560001',
            country: 'India'
        },
        createdAt: new Date('2024-12-22'),
        updatedAt: new Date('2024-12-22')
    }
];

export const getOrderStats = () => {
    const totalOrders = ORDERS.length;
    const totalRevenue = ORDERS.reduce((sum, order) => sum + order.total, 0);
    const pendingOrders = ORDERS.filter(o => o.status === 'pending').length;
    const processingOrders = ORDERS.filter(o => o.status === 'processing').length;

    return {
        totalOrders,
        totalRevenue,
        pendingOrders,
        processingOrders
    };
};
