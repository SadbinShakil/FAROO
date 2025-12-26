'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Suspense } from 'react';

function SuccessContent() {
    const searchParams = useSearchParams();
    const orderNumber = searchParams.get('orderNumber');

    return (
        <div style={{
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f8f9fa',
            padding: '20px'
        }}>
            <div style={{
                background: 'white',
                padding: '60px 40px',
                borderRadius: '8px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                textAlign: 'center',
                maxWidth: '500px',
                width: '100%'
            }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    background: '#e6fffa',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px',
                    color: '#00cc88'
                }}>
                    <CheckCircle size={48} />
                </div>

                <h1 style={{ fontSize: '2rem', marginBottom: '16px', color: '#1a1a1a' }}>Order Placed!</h1>

                {orderNumber && (
                    <div style={{
                        background: '#fafafa',
                        padding: '16px 24px',
                        borderRadius: '8px',
                        border: '1px solid #eee',
                        marginBottom: '24px',
                        display: 'inline-block'
                    }}>
                        <p style={{ margin: 0, color: '#666', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Order Number</p>
                        <p style={{ margin: '4px 0 0', fontWeight: 'bold', fontSize: '1.4rem', color: '#1a1a1a' }}>
                            {orderNumber}
                        </p>
                    </div>
                )}

                <p style={{ color: '#666', marginBottom: '32px', fontSize: '1.1rem', lineHeight: '1.5' }}>
                    Thank you for your purchase. We have received your order and will verify your payment details shortly.
                </p>

                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                    <Link href="/shop" className="btn" style={{ padding: '12px 30px' }}>
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SuccessContent />
        </Suspense>
    );
}
