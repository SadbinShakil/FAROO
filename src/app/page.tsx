import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export default async function Home() {
  const dbProducts = await prisma.product.findMany({
    take: 4,
    orderBy: { createdAt: 'desc' }
  });

  const featuredProducts = dbProducts.map((p: any) => ({
    ...p,
    sizes: JSON.parse(p.sizes || '[]'),
    colors: JSON.parse(p.colors || '[]')
  }));

  return (
    <main>
      <Hero />

      {/* Category Showcase */}
      <section style={{ padding: '100px 0', background: 'var(--secondary-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '16px', fontWeight: '700', color: 'var(--primary-color)' }}>Shop by Category</h2>
            <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>Explore our curated collections</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px'
          }}>
            {/* Women's Category */}
            <Link href="/shop?section=women" style={{
              position: 'relative',
              height: '400px',
              borderRadius: '2px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-md)',
              transition: 'all 0.4s ease',
              display: 'block'
            }}>
              <Image
                src="/products/women-tunic-1.jpg"
                alt="Women's Collection"
                fill
                style={{ objectFit: 'cover', transition: 'transform 0.6s ease' }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(93, 0, 30, 0.8), transparent)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '40px',
                color: 'white',
              }}>
                <h3 style={{ fontSize: '2rem', marginBottom: '8px', fontWeight: '400', fontFamily: 'serif' }}>Women's Collection</h3>
                <p style={{ opacity: 0.9, marginBottom: '20px', fontWeight: '300' }}>Elegant tunics, sweaters & more</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  Shop Now <ArrowRight size={16} />
                </div>
              </div>
            </Link>

            {/* Men's Category */}
            <Link href="/shop?section=men" style={{
              position: 'relative',
              height: '400px',
              borderRadius: '2px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-md)',
              transition: 'all 0.4s ease',
              display: 'block'
            }}>
              <Image
                src="/products/men-shirt-placeholder.png"
                alt="Men's Collection"
                fill
                style={{ objectFit: 'cover', transition: 'transform 0.6s ease' }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(93, 0, 30, 0.8), transparent)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '40px',
                color: 'white',
              }}>
                <h3 style={{ fontSize: '2rem', marginBottom: '8px', fontWeight: '400', fontFamily: 'serif' }}>Men's Collection</h3>
                <p style={{ opacity: 0.9, marginBottom: '20px', fontWeight: '300' }}>Shirts, pants & jackets</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  Shop Now <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ padding: '100px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '16px', fontWeight: '700', color: 'var(--primary-color)' }}>Featured Products</h2>
            <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>Handpicked favorites from our collection</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '40px',
            marginBottom: '60px'
          }}>
            {featuredProducts.map((product: any) => (
              // @ts-ignore
              <ProductCard key={product.id} {...product} />
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link href="/shop" className="btn">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{
        padding: '100px 0',
        background: 'linear-gradient(135deg, var(--primary-color) 0%, #2b000e 100%)',
        color: 'white'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '40px',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '3.5rem', fontWeight: '700', marginBottom: '8px', fontFamily: 'serif' }}>24+</div>
              <div style={{ fontSize: '1rem', opacity: 0.9, letterSpacing: '1px', textTransform: 'uppercase' }}>Products</div>
            </div>
            <div>
              <div style={{ fontSize: '3.5rem', fontWeight: '700', marginBottom: '8px', fontFamily: 'serif' }}>100%</div>
              <div style={{ fontSize: '1rem', opacity: 0.9, letterSpacing: '1px', textTransform: 'uppercase' }}>Quality Guaranteed</div>
            </div>
            <div>
              <div style={{ fontSize: '3.5rem', fontWeight: '700', marginBottom: '8px', fontFamily: 'serif' }}>24/7</div>
              <div style={{ fontSize: '1rem', opacity: 0.9, letterSpacing: '1px', textTransform: 'uppercase' }}>Customer Support</div>
            </div>
            <div>
              <div style={{ fontSize: '3.5rem', fontWeight: '700', marginBottom: '8px', fontFamily: 'serif' }}>Free</div>
              <div style={{ fontSize: '1rem', opacity: 0.9, letterSpacing: '1px', textTransform: 'uppercase' }}>Shipping Worldwide</div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section style={{ padding: '100px 0', background: '#fafafa' }}>
        <div className="container" style={{ maxWidth: '700px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '16px', fontWeight: '700' }}>Stay Updated</h2>
          <p style={{ marginBottom: '40px', color: '#666', fontSize: '1.1rem' }}>
            Subscribe to our newsletter for exclusive offers and early access to new collections.
          </p>
          <div style={{
            display: 'flex',
            gap: '12px',
            maxWidth: '500px',
            margin: '0 auto',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <input
              type="email"
              placeholder="Enter your email address"
              style={{
                flex: 1,
                padding: '16px 20px',
                border: 'none',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
            <button className="btn" style={{ borderRadius: 0, margin: 0 }}>Subscribe</button>
          </div>
        </div>
      </section>
    </main>
  );
}
