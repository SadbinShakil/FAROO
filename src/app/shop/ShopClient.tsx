'use client';

import { useState, useMemo, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { Filter, SlidersHorizontal, ChevronDown } from 'lucide-react';
import styles from './page.module.css';
import { useSearchParams } from 'next/navigation';

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
    const searchParams = useSearchParams();
    const initialSection = searchParams.get('section');

    // Initialize section filter if present in URL
    const [selectedSections, setSelectedSections] = useState<string[]>(
        initialSection ? [initialSection] : []
    );

    const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState<'newest' | 'price-low-high' | 'price-high-low'>('newest');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const sections = ['men', 'women', 'lifestyle'];

    const subcategories = useMemo(() => {
        const relevantProducts = selectedSections.length > 0
            ? initialProducts.filter(p => selectedSections.includes(p.section))
            : initialProducts;

        return Array.from(new Set(relevantProducts.map(p => p.subcategory)));
    }, [initialProducts, selectedSections]);

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

    const pageTitle = selectedSections.length === 1 && selectedSections[0] === 'men'
        ? 'MAAKO Collection'
        : selectedSections.length === 1 && selectedSections[0] === 'women'
            ? 'FAROO Collection'
            : 'All Collections';

    const FILTER_CATEGORIES = {
        men: [
            {
                title: "Topwear",
                items: ["T-Shirt", "Polo", "Hoodie", "Jacket", "Sweater", "Blazer", "Suit"]
            },
            {
                title: "Shirts",
                items: ["Casual Shirt", "Formal Shirt", "Printed Shirt", "Half Sleeve", "Full Sleeve", "Denim Shirt"]
            },
            {
                title: "Bottoms",
                items: ["Jeans", "Chinos", "Cargo", "Joggers", "Shorts", "Formal Pant", "Trouser"]
            },
            {
                title: "Ethnic Wear",
                items: ["Panjabi", "Kabli", "Waistcoat", "Vest"]
            },
            {
                title: "Accessories",
                items: ["Perfume", "Belt", "Wallet", "Footwear", "Mask", "Cap", "Tie"]
            }
        ],
        women: [
            {
                title: "Western Wear",
                items: ["Tops", "T-Shirt", "Gown", "Summer Blazer", "Casual Shirt", "Long Shirt", "Co-Ord Set"]
            },
            {
                title: "Traditional Wear",
                items: ["Single Kameez", "Kurti", "Kaftan", "Salwar Kameez", "Tunic", "Dupatta"]
            },
            {
                title: "Bottoms",
                items: ["Jeans", "Palazzo", "Skirt", "Leggings", "Trouser", "Joggers"]
            },
            {
                title: "Winterwear",
                items: ["Poncho", "Cardigan", "Hoodie", "Jacket", "Shawl", "Shrug"]
            }
        ],
        lifestyle: [
            {
                title: "Personal",
                items: ["Bags", "Sunglass", "Caps", "Wallet", "Perfume"]
            },
            {
                title: "Exclusive",
                items: ["Privilege Card", "Gold Card"]
            }
        ]
    };

    const currentFilters = selectedSections.includes('men') && !selectedSections.includes('women') && !selectedSections.includes('lifestyle')
        ? FILTER_CATEGORIES.men
        : selectedSections.includes('women') && !selectedSections.includes('men') && !selectedSections.includes('lifestyle')
            ? FILTER_CATEGORIES.women
            : selectedSections.includes('lifestyle') && !selectedSections.includes('men') && !selectedSections.includes('women')
                ? FILTER_CATEGORIES.lifestyle
                : null;

    // Helper to normalize strings for comparison (remove spaces, lowercase, remove hyphens)
    const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

    // Get all normalized categories currently displayed in the main groups
    const coveredCategories = new Set<string>();
    if (currentFilters) {
        currentFilters.forEach(section =>
            section.items.forEach(item => coveredCategories.add(normalize(item)))
        );
    }

    // Identify "Other" categories that are NOT covered by the main groups
    // We treat "T-Shirt", "T shirt", "tshirt" all as the same if they normalize to "tshirt"
    const otherCategories = subcategories.filter(sub => !coveredCategories.has(normalize(sub)));

    return (
        <div className={styles.shopPage}>
            <div className={styles.header}>
                <div className="container">
                    <span className="text-gradient uppercase tracking-widest text-sm font-bold">Catalogue</span>
                    <h1>{pageTitle}</h1>
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

                        {/* Dynamic Categories */}
                        {currentFilters ? (
                            currentFilters.map((group) => (
                                <div key={group.title} className={styles.filterSection}>
                                    <h3>{group.title}</h3>
                                    {group.items.map(sub => (
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
                            ))
                        ) : (
                            // Fallback for mixed/all views: Show discovered subcategories from DB
                            <div className={styles.filterSection}>
                                <h3>Categories</h3>
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
                        )}

                        {/* Show any DB subcategories NOT covered by the groups (Uncategorized) */}
                        {currentFilters && otherCategories.length > 0 && (
                            <div className={styles.filterSection}>
                                <h3>Other Categories</h3>
                                {otherCategories.map(sub => (
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
                        )}

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
