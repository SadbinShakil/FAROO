'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
    id: string; // Unique ID: productId + size + color
    productId: string;
    productTitle: string;
    price: number;
    image: string;
    quantity: number;
    size: string;
    color?: string;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (item: Omit<CartItem, 'id'>) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    cartCount: number;
    cartTotal: number;
    isCartOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load cart from local storage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error('Failed to parse cart', e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save cart to local storage whenever it changes
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('cart', JSON.stringify(items));
        }
    }, [items, isLoaded]);

    const addToCart = (newItem: Omit<CartItem, 'id'>) => {
        setItems(prev => {
            // Create a unique ID based on product, size, and color
            const uniqueId = `${newItem.productId}-${newItem.size}${newItem.color ? `-${newItem.color}` : ''}`;

            const existingItem = prev.find(item => item.id === uniqueId);
            if (existingItem) {
                return prev.map(item =>
                    item.id === uniqueId
                        ? { ...item, quantity: item.quantity + newItem.quantity }
                        : item
                );
            }
            return [...prev, { ...newItem, id: uniqueId }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const updateQuantity = (id: string, newQuantity: number) => {
        if (newQuantity < 1) return;
        setItems(prev => prev.map(item =>
            item.id === id ? { ...item, quantity: newQuantity } : item
        ));
    };

    const clearCart = () => {
        setItems([]);
    };

    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    return (
        <CartContext.Provider value={{
            items,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartCount,
            cartTotal,
            isCartOpen,
            openCart,
            closeCart
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
