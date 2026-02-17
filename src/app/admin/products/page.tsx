'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, ShoppingCart, Tag, Users, TrendingUp, Plus, Edit, Trash2, Search, X } from 'lucide-react';
import styles from '../dashboard/Dashboard.module.css';
import productsStyles from './Products.module.css';

interface Product {
    id: string;
    sku: string;
    title: string;
    price: number;
    category: string;
    section: string;
    subcategory: string;
    image: string;
    images?: string[];
    description: string;
    sizeGuide?: string;
    sizes: string[];
    colors: string[];
    stock: number;
}

export default function AdminProducts() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSection, setFilterSection] = useState<'all' | 'women' | 'men' | 'lifestyle'>('all');

    // Modal & Form State
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [colorInput, setColorInput] = useState('');

    const initialFormState = {
        sku: '',
        title: '',
        price: '',
        category: 'Clothing',
        section: 'women',
        subcategory: 'T-Shirts',
        description: '',
        image: '',
        images: [] as string[],
        sizes: '',
        colors: '',
        sizeGuide: {} as Record<string, any>,
        stock: '0',
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

    const handleLogout = async () => {
        await fetch('/api/admin/logout', { method: 'POST' });
        sessionStorage.removeItem('adminAuth');
        router.push('/admin');
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;

        if (formData.images.length >= 5) {
            alert('You can only upload up to 5 images per product.');
            return;
        }

        setUploading(true);
        const file = e.target.files[0];

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('file', file);

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formDataToSend,
            });

            const result = await res.json();

            if (res.ok) {
                const newImages = [...formData.images, result.url];
                setFormData(prev => ({
                    ...prev,
                    images: newImages,
                    image: newImages[0] // Set primary image to the first one
                }));
            } else {
                alert(`Upload failed: ${result.error || 'Please ensure Vercel Blob is configured.'}`);
            }
        } catch (err) {
            console.error('Upload Error:', err);
            alert('Error uploading image. Check your connection.');
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (indexToRemove: number) => {
        const newImages = formData.images.filter((_, index) => index !== indexToRemove);
        setFormData(prev => ({
            ...prev,
            images: newImages,
            image: newImages.length > 0 ? newImages[0] : ''
        }));
    };

    const openAddModal = () => {
        setEditingId(null);
        setFormData(initialFormState);
        setShowModal(true);
    };

    const openEditModal = (product: Product) => {
        setEditingId(product.id);
        setFormData({
            sku: product.sku || '',
            title: product.title,
            price: product.price.toString(),
            category: product.category,
            section: product.section,
            subcategory: product.subcategory,
            description: product.description || '',
            image: product.image,
            images: product.images || (product.image ? [product.image] : []),
            sizes: (product.sizes || []).join(', '),
            colors: (product.colors || []).join(', '),
            sizeGuide: product.sizeGuide ? JSON.parse(product.sizeGuide) : {},
            stock: (product.stock || 0).toString()
        });
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (uploading) {
            alert('Please wait for the image to finish uploading...');
            return;
        }

        // If it's a new product and no image is uploaded, confirm or block
        if (!formData.image && !editingId) {
            const useDefault = confirm('No image has been uploaded. A default product image will be used. Continue?');
            if (!useDefault) return;
        }

        const payload = {
            ...formData,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock),
            sizes: formData.sizes.split(',').map(s => s.trim()).filter(Boolean),
            colors: formData.colors.split(',').map(c => c.trim()).filter(Boolean),
            sizeGuide: JSON.stringify(formData.sizeGuide)
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

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        e.preventDefault();

        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
                if (res.ok) {
                    setProducts(products.filter(p => p.id !== id));
                } else {
                    const errData = await res.json();
                    alert(errData.error || 'Failed to delete product');
                }
            } catch (error) {
                console.error(error);
                alert('Error deleting product');
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

    const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38', '40', '42', '44', 'Free Size'];

    // Derived from the Shop filter logic for consistency
    const SUBCATEGORY_OPTIONS = {
        men: [
            "T-Shirt", "Polo", "Hoodie", "Jacket", "Sweater", "Blazer", "Suit",
            "Casual Shirt", "Formal Shirt", "Printed Shirt", "Half Sleeve", "Full Sleeve", "Denim Shirt",
            "Jeans", "Chinos", "Cargo", "Joggers", "Shorts", "Formal Pant", "Trouser",
            "Panjabi", "Kabli", "Waistcoat", "Vest",
            "Perfume", "Belt", "Wallet", "Footwear", "Mask", "Cap", "Tie"
        ],
        women: [
            "Tops", "T-Shirt", "Gown", "Summer Blazer", "Casual Shirt", "Long Shirt", "Co-Ord Set",
            "Single Kameez", "Kurti", "Kaftan", "Salwar Kameez", "Tunic", "Dupatta",
            "Jeans", "Palazzo", "Skirt", "Leggings", "Trouser", "Joggers",
            "Poncho", "Cardigan", "Hoodie", "Jacket", "Shawl", "Shrug"
        ],
        lifestyle: [
            "Bags", "Sunglass", "Caps", "Wallet", "Perfume", "Privilege Card", "Gold Card"
        ]
    };

    const toggleSize = (size: string) => {
        const currentSizes = formData.sizes ? formData.sizes.split(',').map(s => s.trim()).filter(Boolean) : [];
        let newSizes;
        if (currentSizes.includes(size)) {
            newSizes = currentSizes.filter(s => s !== size);
        } else {
            newSizes = [...currentSizes, size];
        }
        setFormData({ ...formData, sizes: newSizes.join(', ') });
    };

    const COLOR_OPTIONS = [
        "Black", "White", "Gray", "Navy", "Blue", "Royal Blue", "Sky Blue",
        "Red", "Maroon", "Wine",
        "Green", "Olive", "Bottle Green",
        "Beige", "Cream", "Brown", "Tan", "Mustard",
        "Pink", "Dusty Pink", "Magenta",
        "Purple", "Lavender",
        "Yellow", "Orange", "Gold", "Silver", "Multicolor"
    ];

    const toggleColor = (color: string) => {
        const currentColors = formData.colors ? formData.colors.split(',').map(c => c.trim()).filter(Boolean) : [];
        let newColors;
        if (currentColors.includes(color)) {
            newColors = currentColors.filter(c => c !== color);
        } else {
            newColors = [...currentColors, color];
        }
        setFormData({ ...formData, colors: newColors.join(', ') });
    };

    const handleSizeGuideChange = (size: string, field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            sizeGuide: {
                ...prev.sizeGuide,
                [size]: {
                    ...(prev.sizeGuide[size] || {}),
                    [field]: value
                }
            }
        }));
    };

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
                        <button className={filterSection === 'lifestyle' ? productsStyles.filterActive : productsStyles.filterBtn} onClick={() => setFilterSection('lifestyle')}>Lifestyle</button>
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
                                        <button className={productsStyles.deleteBtn} onClick={(e) => handleDelete(e, product.id)}><Trash2 size={18} /></button>
                                    </div>
                                </div>
                                <div className={productsStyles.productInfo}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span className={productsStyles.productId}>#{product.sku || product.id.slice(0, 8)}</span>
                                        <span style={{
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            color: product.stock > 0 ? '#10b981' : '#ef4444',
                                            background: product.stock > 0 ? '#f0fdf4' : '#fef2f2',
                                            padding: '2px 8px',
                                            borderRadius: '10px'
                                        }}>
                                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                        </span>
                                    </div>
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
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>SKU</label>
                                        <input placeholder="e.g. FR-001" className={productsStyles.input} type="text" value={formData.sku} onChange={e => setFormData({ ...formData, sku: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Title</label>
                                        <input required className={productsStyles.input} type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Price (৳)</label>
                                        <input required type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Section</label>
                                        <select value={formData.section} onChange={e => setFormData({ ...formData, section: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
                                            <option value="women">Women</option>
                                            <option value="men">Men</option>
                                            <option value="lifestyle">Lifestyle</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Category (Broad)</label>
                                        <select
                                            value={formData.category}
                                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                                        >
                                            <option value="Clothing">Clothing</option>
                                            <option value="Footwear">Footwear</option>
                                            <option value="Accessories">Accessories</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Stock Count</label>
                                        <input required type="number" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Subcategory / Type</label>
                                    <select
                                        required
                                        value={formData.subcategory}
                                        onChange={e => setFormData({ ...formData, subcategory: e.target.value })}
                                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                                    >
                                        <option value="">Select Subcategory</option>
                                        {(formData.section === 'men' ? SUBCATEGORY_OPTIONS.men :
                                            formData.section === 'lifestyle' ? SUBCATEGORY_OPTIONS.lifestyle :
                                                SUBCATEGORY_OPTIONS.women).map(sub => (
                                                    <option key={sub} value={sub}>{sub}</option>
                                                ))}
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Description</label>
                                    <textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', minHeight: '80px' }} />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Sizes</label>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                            {SIZE_OPTIONS.map(size => (
                                                <label key={size} style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                    padding: '4px 8px',
                                                    border: '1px solid #eee',
                                                    borderRadius: '4px',
                                                    background: formData.sizes.includes(size) ? '#eee' : '#fff',
                                                    cursor: 'pointer'
                                                }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.sizes.includes(size)}
                                                        onChange={() => toggleSize(size)}
                                                    />
                                                    <span style={{ fontSize: '0.9rem' }}>{size}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Colors</label>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', maxHeight: '150px', overflowY: 'auto', padding: '4px', border: '1px solid #eee', borderRadius: '4px' }}>
                                            {COLOR_OPTIONS.map(color => (
                                                <label key={color} style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                    padding: '4px 8px',
                                                    border: '1px solid #eee',
                                                    borderRadius: '4px',
                                                    background: formData.colors.includes(color) ? '#e6f7ff' : '#fff',
                                                    cursor: 'pointer',
                                                    minWidth: 'fit-content'
                                                }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.colors.includes(color)}
                                                        onChange={() => toggleColor(color)}
                                                    />
                                                    <span style={{ fontSize: '0.9rem' }}>{color}</span>
                                                </label>
                                            ))}
                                        </div>
                                        <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                                            <input
                                                type="text"
                                                placeholder="Add custom color..."
                                                value={colorInput}
                                                onChange={(e) => setColorInput(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        if (colorInput.trim()) {
                                                            toggleColor(colorInput.trim());
                                                            setColorInput('');
                                                        }
                                                    }
                                                }}
                                                style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (colorInput.trim()) {
                                                        toggleColor(colorInput.trim());
                                                        setColorInput('');
                                                    }
                                                }}
                                                className={productsStyles.addBtn}
                                                style={{ padding: '0 16px', height: 'auto' }}
                                            >
                                                Add
                                            </button>
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                                            {formData.colors.split(',').map(c => c.trim()).filter(c => c && !COLOR_OPTIONS.includes(c)).map(c => (
                                                <span key={c} style={{ background: '#eee', padding: '4px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem' }}>
                                                    {c}
                                                    <button type="button" onClick={() => toggleColor(c)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2rem', lineHeight: 0.5, color: '#666' }}>&times;</button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {formData.sizes && (
                                    <div style={{ marginBottom: '16px' }}>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Size Guide (Inches)</label>
                                        <div style={{ overflowX: 'auto', border: '1px solid #eee', borderRadius: '4px' }}>
                                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                                                <thead>
                                                    <tr style={{ background: '#f9f9f9', borderBottom: '1px solid #eee' }}>
                                                        <th style={{ padding: '8px', textAlign: 'left' }}>Size</th>
                                                        <th style={{ padding: '8px', textAlign: 'left' }}>Bust</th>
                                                        <th style={{ padding: '8px', textAlign: 'left' }}>Waist</th>
                                                        <th style={{ padding: '8px', textAlign: 'left' }}>Length</th>
                                                        <th style={{ padding: '8px', textAlign: 'left' }}>Hip</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {formData.sizes.split(',').map(s => s.trim()).filter(Boolean).map(size => (
                                                        <tr key={size} style={{ borderBottom: '1px solid #eee' }}>
                                                            <td style={{ padding: '8px', fontWeight: 'bold' }}>{size}</td>
                                                            <td style={{ padding: '8px' }}><input type="text" placeholder="34.0" value={formData.sizeGuide[size]?.bust || ''} onChange={e => handleSizeGuideChange(size, 'bust', e.target.value)} style={{ width: '60px', padding: '4px', border: '1px solid #ddd', borderRadius: '4px' }} /></td>
                                                            <td style={{ padding: '8px' }}><input type="text" placeholder="28.0" value={formData.sizeGuide[size]?.waist || ''} onChange={e => handleSizeGuideChange(size, 'waist', e.target.value)} style={{ width: '60px', padding: '4px', border: '1px solid #ddd', borderRadius: '4px' }} /></td>
                                                            <td style={{ padding: '8px' }}><input type="text" placeholder="52.0" value={formData.sizeGuide[size]?.length || ''} onChange={e => handleSizeGuideChange(size, 'length', e.target.value)} style={{ width: '60px', padding: '4px', border: '1px solid #ddd', borderRadius: '4px' }} /></td>
                                                            <td style={{ padding: '8px' }}><input type="text" placeholder="36.0" value={formData.sizeGuide[size]?.hip || ''} onChange={e => handleSizeGuideChange(size, 'hip', e.target.value)} style={{ width: '60px', padding: '4px', border: '1px solid #ddd', borderRadius: '4px' }} /></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Product Images (Max 5)</label>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            style={{ flex: 1, minWidth: '200px' }}
                                            disabled={formData.images.length >= 5}
                                        />
                                        {uploading && <span>Uploading...</span>}
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                                        {formData.images.map((img, idx) => (
                                            <div key={idx} style={{ position: 'relative', width: '100px', height: '100px', border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden' }}>
                                                <img src={img} alt={`Preview ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(idx)}
                                                    style={{
                                                        position: 'absolute',
                                                        top: '2px',
                                                        right: '2px',
                                                        background: 'rgba(255,0,0,0.7)',
                                                        color: '#fff',
                                                        border: 'none',
                                                        borderRadius: '50%',
                                                        width: '20px',
                                                        height: '20px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '12px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
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
