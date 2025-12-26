'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, ShoppingCart, Tag, Users, TrendingUp, Plus, Edit, Trash2, Search, X } from 'lucide-react';
import styles from '../dashboard/Dashboard.module.css';
import productsStyles from './Products.module.css';

interface Product {
    id: string;
    title: string;
    price: number;
    category: string;
    section: string;
    subcategory: string;
    image: string;
    description: string;
    sizes: string[];
    colors: string[];
}

export default function AdminProducts() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSection, setFilterSection] = useState<'all' | 'women' | 'men'>('all');

    // Modal & Form State
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    const initialFormState = {
        title: '',
        price: '',
        category: 'Clothing',
        section: 'women',
        subcategory: 'T-Shirts',
        description: '',
        image: '',
        sizes: '',  // Comma separated string for input
        colors: ''  // Comma separated string for input
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        const auth = sessionStorage.getItem('adminAuth');
        if (auth !== 'true') {
            router.push('/admin');
        } else {
            setIsAuthenticated(true);
            fetchProducts();
        }
    }, [router]);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products');
            if (res.ok) {
                const data = await res.json();
                setProducts(data);
            }
        } catch (error) {
            console.error('Failed to fetch products', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('adminAuth');
        router.push('/admin');
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;

        setUploading(true);
        const file = e.target.files[0];

        try {
            // Updated to use Vercel Blob direct upload via our API
            const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
                method: 'POST',
                body: file,
            });

            if (res.ok) {
                const result = await res.json();
                setFormData(prev => ({ ...prev, image: result.url }));
            } else {
                alert('Upload failed. Please ensure Vercel Blob is configured.');
            }
        } catch (err) {
            console.error('Upload Error:', err);
            alert('Error uploading image');
        } finally {
            setUploading(false);
        }
    };

    const openAddModal = () => {
        setEditingId(null);
        setFormData(initialFormState);
        setShowModal(true);
    };

    const openEditModal = (product: Product) => {
        setEditingId(product.id);
        setFormData({
            title: product.title,
            price: product.price.toString(),
            category: product.category,
            section: product.section,
            subcategory: product.subcategory,
            description: product.description || '',
            image: product.image,
            sizes: product.sizes.join(', '),
            colors: product.colors.join(', ')
        });
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            ...formData,
            price: parseFloat(formData.price),
            sizes: formData.sizes.split(',').map(s => s.trim()).filter(Boolean),
            colors: formData.colors.split(',').map(c => c.trim()).filter(Boolean)
        };

        try {
            let res;
            if (editingId) {
                // Update existing
                res = await fetch(`/api/products/${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } else {
                // Create new
                res = await fetch('/api/products', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            }

            if (res.ok) {
                setShowModal(false);
                fetchProducts(); // Refresh list
                setFormData(initialFormState);
            } else {
                alert('Failed to save product');
            }
        } catch (error) {
            console.error(error);
            alert('Error saving product');
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this product?')) {
            try {
                const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
                if (res.ok) {
                    setProducts(products.filter(p => p.id !== id));
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSection = filterSection === 'all' || product.section === filterSection;
        return matchesSearch && matchesSection;
    });

    if (!isAuthenticated) return <div className={styles.loading}>Loading...</div>;

    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <div className={styles.logo}><h2>Faroo Admin</h2></div>
                <nav className={styles.nav}>
                    <Link href="/admin/dashboard" className={styles.navItem}><TrendingUp size={20} /> Dashboard</Link>
                    <Link href="/admin/products" className={styles.navItemActive}><Package size={20} /> Products</Link>
                    <Link href="/admin/orders" className={styles.navItem}><ShoppingCart size={20} /> Orders</Link>
                    <Link href="/admin/discounts" className={styles.navItem}><Tag size={20} /> Discounts</Link>
                    <Link href="/" className={styles.navItem}><Users size={20} /> View Store</Link>
                </nav>
                <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
            </aside>

            <main className={styles.main}>
                <header className={productsStyles.header}>
                    <div><h1>Products</h1><p>Manage your product catalog</p></div>
                    <button className={productsStyles.addBtn} onClick={openAddModal}>
                        <Plus size={20} /> Add Product
                    </button>
                </header>

                <div className={productsStyles.filters}>
                    <div className={productsStyles.searchBox}>
                        <Search size={20} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className={productsStyles.filterButtons}>
                        <button className={filterSection === 'all' ? productsStyles.filterActive : productsStyles.filterBtn} onClick={() => setFilterSection('all')}>All ({products.length})</button>
                        <button className={filterSection === 'women' ? productsStyles.filterActive : productsStyles.filterBtn} onClick={() => setFilterSection('women')}>Women</button>
                        <button className={filterSection === 'men' ? productsStyles.filterActive : productsStyles.filterBtn} onClick={() => setFilterSection('men')}>Men</button>
                    </div>
                </div>

                {loading ? <div className={styles.loading}>Loading products...</div> : (
                    <div className={productsStyles.productsGrid}>
                        {filteredProducts.map(product => (
                            <div key={product.id} className={productsStyles.productCard}>
                                <div className={productsStyles.productImage}>
                                    <img src={product.image} alt={product.title} />
                                    <div className={productsStyles.productActions}>
                                        <button className={productsStyles.editBtn} onClick={() => openEditModal(product)}><Edit size={18} /></button>
                                        <button className={productsStyles.deleteBtn} onClick={() => handleDelete(product.id)}><Trash2 size={18} /></button>
                                    </div>
                                </div>
                                <div className={productsStyles.productInfo}>
                                    <span className={productsStyles.productId}>#{product.id}</span>
                                    <h3>{product.title}</h3>
                                    <p className={productsStyles.productCategory}>{product.subcategory}</p>
                                    <div className={productsStyles.productFooter}>
                                        <span className={productsStyles.productPrice}>৳{product.price.toLocaleString()}</span>
                                        <span className={productsStyles.productSection}>{product.section}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {showModal && (
                    <div className={productsStyles.modal} onClick={() => setShowModal(false)}>
                        <div className={productsStyles.modalContent} onClick={(e) => e.stopPropagation()} style={{ maxHeight: '90vh', overflowY: 'auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h2>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
                                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
                            </div>

                            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Title</label>
                                        <input required className={productsStyles.input} type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Price (৳)</label>
                                        <input required type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Section</label>
                                        <select value={formData.section} onChange={e => setFormData({ ...formData, section: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
                                            <option value="women">Women</option>
                                            <option value="men">Men</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Category</label>
                                        <input required type="text" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Subcategory / Type</label>
                                    <input required type="text" value={formData.subcategory} onChange={e => setFormData({ ...formData, subcategory: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Description</label>
                                    <textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', minHeight: '80px' }} />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Sizes (comma separated)</label>
                                        <input type="text" placeholder="S, M, L, XL" value={formData.sizes} onChange={e => setFormData({ ...formData, sizes: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Colors (comma separated)</label>
                                        <input type="text" placeholder="Red, Blue, Green" value={formData.colors} onChange={e => setFormData({ ...formData, colors: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Product Image</label>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            style={{ flex: 1 }}
                                        />
                                        {uploading && <span>Uploading...</span>}
                                    </div>
                                    {formData.image && (
                                        <div style={{ marginTop: '10px', width: '100px', height: '100px', position: 'relative', border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden' }}>
                                            <img src={formData.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    )}
                                </div>

                                <button type="submit" className={productsStyles.addBtn} style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>
                                    {editingId ? 'Update Product' : 'Create Product'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
