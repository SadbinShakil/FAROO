// Discount and promotion management

export interface Discount {
    id: string;
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
    description: string;
    validFrom: Date;
    validUntil: Date;
    minPurchase?: number;
    maxDiscount?: number;
    active: boolean;
    usageCount: number;
    maxUsage?: number;
}

export const DISCOUNTS: Discount[] = [
    {
        id: 'd1',
        code: 'WELCOME10',
        type: 'percentage',
        value: 10,
        description: 'Welcome discount for new customers',
        validFrom: new Date('2024-01-01'),
        validUntil: new Date('2025-12-31'),
        minPurchase: 2000,
        active: true,
        usageCount: 45,
        maxUsage: 1000
    },
    {
        id: 'd2',
        code: 'WINTER25',
        type: 'percentage',
        value: 25,
        description: 'Winter sale - 25% off',
        validFrom: new Date('2024-12-01'),
        validUntil: new Date('2025-02-28'),
        minPurchase: 5000,
        maxDiscount: 2000,
        active: true,
        usageCount: 123,
    },
    {
        id: 'd3',
        code: 'FLAT500',
        type: 'fixed',
        value: 500,
        description: 'Flat ৳500 off on orders above ৳3000',
        validFrom: new Date('2024-12-01'),
        validUntil: new Date('2025-01-31'),
        minPurchase: 3000,
        active: true,
        usageCount: 67,
    }
];

export const getActiveDiscounts = (): Discount[] => {
    const now = new Date();
    return DISCOUNTS.filter(d =>
        d.active &&
        d.validFrom <= now &&
        d.validUntil >= now &&
        (!d.maxUsage || d.usageCount < d.maxUsage)
    );
};

export const validateDiscountCode = (code: string, orderTotal: number): Discount | null => {
    const discount = getActiveDiscounts().find(d => d.code.toLowerCase() === code.toLowerCase());

    if (!discount) return null;
    if (discount.minPurchase && orderTotal < discount.minPurchase) return null;

    return discount;
};

export const calculateDiscount = (discount: Discount, orderTotal: number): number => {
    if (discount.type === 'percentage') {
        const discountAmount = (orderTotal * discount.value) / 100;
        return discount.maxDiscount ? Math.min(discountAmount, discount.maxDiscount) : discountAmount;
    }
    return discount.value;
};
