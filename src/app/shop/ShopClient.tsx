'use client';

import { useState, useMemo } from 'react';
import ProductCard from '@/components/ProductCard';
import { Filter, SlidersHorizontal, ChevronDown } from 'lucide-react';
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
    createdAt?: string | Date;
}

export default function ShopClient({ initialProducts }: { initialProducts: Product[] }) {
    const [selectedSections, setSelectedSections] = useState<string[]>([]);
    const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState<'newest' | 'price-low-high' | 'price-high-low'>('newest');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const sections = useMemo(() => {
        return Array.from(new Set(initialProducts.map(p => p.section)));
    }, [initialProducts]);

    const subcategories = useMemo(() => {
        return Array.from(new Set(initialProducts.map(p => p.subcategory)));
    }, [initialProducts]);

    const filteredProducts = useMemo(() => {
        let result = initialProducts.filter(product => {
            const sectionMatch = selectedSections.length === 0 ||
                selectedSections.includes(product.section);
            const subcategoryMatch = selectedSubcategories.length === 0 ||
                selectedSubcategories.includes(product.subcategory);
            return sectionMatch && subcategoryMatch;
        });

        result = [...result].sort((a, b) => {
            switch (sortBy) {
                case 'price-low-high': return a.price - b.price;
                case 'price-high-low': return b.price - a.price;
                case 'newest':
                default:
                    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                    return dateB - dateA;
            }
        });

        return result;
    }, [initialProducts, selectedSections, selectedSubcategories, sortBy]);

    const toggleSection = (section: string) => {
        setSelectedSections(prev =>
            prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
        );
    };

    const toggleSubcategory = (subcategory: string) => {
        setSelectedSubcategories(prev =>
            prev.includes(subcategory) ? prev.filter(s => s !== subcategory) : [...prev, subcategory]
        );
    };

    return (
        <div className={styles.shopPage}>
            <div className={styles.header}>
                <div className="container">
                    <span className="text-gradient uppercase tracking-widest text-sm font-bold">Catalogue</span>
                    <h1>All Collections</h1>
                    <p>Meticulously crafted pieces for your everyday luxury.</p>
                </div>
            </div>

            <div className={styles.container}>
                <div className={styles.content}>
                    {/* Mobile Filter Toggle */}
                    <button
                        className={styles.mobileFilterBtn}
                        onClick={() => setIsFilterOpen(true)}
                    >
                        <Filter size={20} />
                        Filters
                    </button>

                    {/* Sidebar Filters */}
                    <div
                        className={`${styles.overlay} ${isFilterOpen ? styles.overlayVisible : ''}`}
                        onClick={() => setIsFilterOpen(false)}
                    />
                    <aside className={`${styles.sidebar} ${isFilterOpen ? styles.sidebarOpen : ''}`}>
                        <div className={styles.sidebarHeader}>
                            <h3>Filters</h3>
                            <button onClick={() => setIsFilterOpen(false)}>×</button>
                        </div>
                        <div className={styles.filterSection}>
                            <h3>Collections</h3>
                            {sections.map(section => (
                                <label key={section} className={styles.filterOption}>
                                    <input
                                        type="checkbox"
                                        checked={selectedSections.includes(section)}
                                        onChange={() => toggleSection(section)}
                                    />
                                    <span>{section.charAt(0).toUpperCase() + section.slice(1)}</span>
                                </label>
                            ))}
                        </div>

                        <div className={styles.filterSection}>
                            <h3>Category</h3>
                            {subcategories.map(sub => (
                                <label key={sub} className={styles.filterOption}>
                                    <input
                                        type="checkbox"
                                        checked={selectedSubcategories.includes(sub)}
                                        onChange={() => toggleSubcategory(sub)}
                                    />
                                    <span>{sub}</span>
                                </label>
                            ))}
                        </div>

                        <button
                            className={styles.applyBtn}
                            onClick={() => setIsFilterOpen(false)}
                        >
                            Apply Filters
                        </button>
                    </aside>

                    {/* Main Area */}
                    <main className={styles.mainArea}>
                        <div className={styles.topBar}>
                            <span className={styles.productCount}>
                                Showing <strong>{filteredProducts.length}</strong> Products
                            </span>

                            <div className={styles.sortWrapper}>
                                <SlidersHorizontal size={14} className="text-ghost" />
                                <span className="text-sm font-medium">Sort by:</span>
                                <select
                                    className={styles.sortSelect}
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as any)}
                                >
                                    <option value="newest">Latest Arrivals</option>
                                    <option value="price-low-high">Price: Low to High</option>
                                    <option value="price-high-low">Price: High to Low</option>
                                </select>
                            </div>
                        </div>

                        {filteredProducts.length > 0 ? (
                            <div className={styles.productGrid}>
                                {filteredProducts.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        id={product.id}
                                        title={product.title}
                                        price={product.price}
                                        category={product.subcategory}
                                        image={product.image}
                                        new={sortBy === 'newest'}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className={styles.noProducts}>
                                <p>No products match your current filters.</p>
                                <button
                                    onClick={() => { setSelectedSections([]); setSelectedSubcategories([]); }}
                                    className="text-primary mt-4 font-bold uppercase tracking-widest text-xs"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
