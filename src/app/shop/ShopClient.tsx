'use client';

import { useState, useMemo } from 'react';
import ProductCard from '@/components/ProductCard';
import styles from './page.module.css';

interface Product {
    id: string;
    title: string;
    price: number;
    category: string;
    section: string;
    subcategory: string;
    image: string;
    description?: string | null;
    sizes: string[];
    colors: string[];
    createdAt?: string | Date; // Add createdAt for sorting
}

export default function ShopClient({ initialProducts }: { initialProducts: Product[] }) {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState<'newest' | 'price-low-high' | 'price-high-low'>('newest');

    // Get unique categories and subcategories from the DB data
    const categories = useMemo(() => {
        return Array.from(new Set(initialProducts.map(p => p.section)));
    }, [initialProducts]);

    const subcategories = useMemo(() => {
        return Array.from(new Set(initialProducts.map(p => p.subcategory)));
    }, [initialProducts]);

    // Filter products
    const filteredProducts = useMemo(() => {
        let result = initialProducts.filter(product => {
            const categoryMatch = selectedCategories.length === 0 ||
                selectedCategories.includes(product.section);
            const subcategoryMatch = selectedSubcategories.length === 0 ||
                selectedSubcategories.includes(product.subcategory);
            return categoryMatch && subcategoryMatch;
        });

        // Sort results
        result = [...result].sort((a, b) => {
            switch (sortBy) {
                case 'price-low-high':
                    return a.price - b.price;
                case 'price-high-low':
                    return b.price - a.price;
                case 'newest':
                default:
                    // If createdAt is available, sort by it. Otherwise fallback to ID or keep order
                    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                    return dateB - dateA;
            }
        });

        return result;
    }, [initialProducts, selectedCategories, selectedSubcategories, sortBy]);

    const toggleCategory = (category: string) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const toggleSubcategory = (subcategory: string) => {
        setSelectedSubcategories(prev =>
            prev.includes(subcategory)
                ? prev.filter(s => s !== subcategory)
                : [...prev, subcategory]
        );
    };

    return (
        <div className={styles.shopPage}>
            <div className={styles.header}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1>Shop All Products</h1>
                        <p>Discover our complete collection</p>
                    </div>
                </div>
            </div>

            <div className={styles.container}>
                <div className={styles.content}>
                    {/* Sidebar Filters */}
                    <aside className={styles.sidebar}>
                        <div className={styles.filterSection}>
                            <h3>Category</h3>
                            {categories.map(category => (
                                <div key={category} className={styles.filterOption}>
                                    <input
                                        type="checkbox"
                                        id={`cat-${category}`}
                                        checked={selectedCategories.includes(category)}
                                        onChange={() => toggleCategory(category)}
                                    />
                                    <label htmlFor={`cat-${category}`}>
                                        {category.charAt(0).toUpperCase() + category.slice(1)}
                                    </label>
                                </div>
                            ))}
                        </div>

                        <div className={styles.filterSection}>
                            <h3>Type</h3>
                            {subcategories.map(subcategory => (
                                <div key={subcategory} className={styles.filterOption}>
                                    <input
                                        type="checkbox"
                                        id={`sub-${subcategory}`}
                                        checked={selectedSubcategories.includes(subcategory)}
                                        onChange={() => toggleSubcategory(subcategory)}
                                    />
                                    <label htmlFor={`sub-${subcategory}`}>
                                        {subcategory}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <div className={styles.productGrid}>
                        <div className={styles.gridHeader}>
                            <span className={styles.productCount}>
                                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                            </span>

                            <div className={styles.sortWrapper}>
                                <label htmlFor="sort">Sort by:</label>
                                <select
                                    id="sort"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as any)}
                                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd', marginLeft: '8px' }}
                                >
                                    <option value="newest">Newest</option>
                                    <option value="price-low-high">Price: Low to High</option>
                                    <option value="price-high-low">Price: High to Low</option>
                                </select>
                            </div>
                        </div>

                        {filteredProducts.length > 0 ? (
                            <div className={styles.grid}>
                                {filteredProducts.map((product: Product) => (
                                    // @ts-ignore
                                    <ProductCard key={product.id} {...product} />
                                ))}
                            </div>
                        ) : (
                            <div className={styles.noProducts}>
                                <p>No products found matching your filters.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
