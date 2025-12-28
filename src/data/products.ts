// Product catalog for Faroo Official
// This file contains a curated list of 10 Women's and 10 Men's products

export interface Product {
    id: string;
    title: string;
    price: number;
    category: string;
    section: 'women' | 'men';
    subcategory: string;
    image: string;
    description?: string;
    sizes?: string[];
    colors?: string[];
    new?: boolean;
}

export const PRODUCTS: Product[] = [
    // --- WOMEN'S COLLECTION (10 Products) ---
    {
        id: 'w1',
        title: 'Faroo "Noor" Embroidered Tunic',
        price: 4500,
        category: 'Women',
        section: 'women',
        subcategory: 'Tunics',
        image: '/products/women-tunic-6.jpg',
        description: 'Intricately embroidered mint green tunic with premium finishing. Part of our exclusive Noor Collection.',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Mint Green'],
        new: true
    },
    {
        id: 'w2',
        title: 'Faroo "Maya" Floral Kurti Set',
        price: 3200,
        category: 'Women',
        section: 'women',
        subcategory: 'Tunics',
        image: '/products/women-tunic-2.jpg',
        description: 'Elegant white kurti set featuring delicate floral prints and matching trousers.',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['White/Floral'],
    },
    {
        id: 'w3',
        title: 'Faroo "Zara" Pearl Sleeve Tunic',
        price: 4200,
        category: 'Women',
        section: 'women',
        subcategory: 'Tunics',
        image: '/products/women-tunic-3.jpg',
        description: 'Soft pink tunic featuring statement sleeves adorned with hand-stitched pearls.',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Pink'],
    },
    {
        id: 'w4',
        title: 'Faroo "Aura" Striped Tunic',
        price: 3500,
        category: 'Women',
        section: 'women',
        subcategory: 'Tunics',
        image: '/products/women-tunic-1.jpg',
        description: 'Contemporary blue and white striped tunic designed for daily elegance.',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Blue/White'],
    },
    {
        id: 'w5',
        title: 'Faroo "Sahara" Maroon Printed Tunic',
        price: 3800,
        category: 'Women',
        section: 'women',
        subcategory: 'Tunics',
        image: '/products/women-tunic-5.jpg',
        description: 'Deep maroon tunic with intricate printed patterns on the sleeves and hemline.',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Maroon'],
    },
    {
        id: 'w6',
        title: 'Faroo "Iris" Color Block Sweater',
        price: 2900,
        category: 'Women',
        section: 'women',
        subcategory: 'Sweaters',
        image: '/products/women-sweater-4.jpg',
        description: 'Modern color-block knit sweater in shades of beige, pink, and brown.',
        sizes: ['S', 'M', 'L'],
        colors: ['Multi'],
        new: true
    },
    {
        id: 'w7',
        title: 'Faroo "Luna" Striped Knit',
        price: 2800,
        category: 'Women',
        section: 'women',
        subcategory: 'Sweaters',
        image: '/products/women-sweater-1.jpg',
        description: 'Classic pink and white striped sweater crafted from ultra-soft wool blend.',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Pink/White'],
    },
    {
        id: 'w8',
        title: 'Faroo Cable Knit Cardigan',
        price: 3500,
        category: 'Women',
        section: 'women',
        subcategory: 'Cardigans',
        image: '/products/women-cardigan-1.jpg',
        description: 'Premium black cable-knit cardigan with an adjustable waist belt.',
        sizes: ['S', 'M', 'L'],
        colors: ['Black'],
    },
    {
        id: 'w9',
        title: 'Faroo "Meher" White Lace Tunic',
        price: 4800,
        category: 'Women',
        section: 'women',
        subcategory: 'Tunics',
        image: '/products/women-tunic-4.jpg',
        description: 'Exquisite white tunic with delicate lace overlays and pearl embellishments.',
        sizes: ['S', 'M', 'L'],
        colors: ['White'],
    },
    {
        id: 'w10',
        title: 'Faroo "Aria" Navy Bow Cardigan',
        price: 3300,
        category: 'Women',
        section: 'women',
        subcategory: 'Cardigans',
        image: '/products/women-cardigan-2.jpg',
        description: 'Navy blue cardigan featuring charming bow details and gold buttons.',
        sizes: ['S', 'M', 'L'],
        colors: ['Navy'],
    },

    // --- MEN'S COLLECTION (10 Products) ---
    {
        id: 'm1',
        title: 'Faroo "Rayaan" Premium Panjabi',
        price: 4500,
        category: 'Men',
        section: 'men',
        subcategory: 'Panjabi',
        image: '/products/men-shirt-placeholder.png',
        description: 'Crafted from premium fine cotton with delicate self-embroidery on the collar.',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['White', 'Off-White'],
        new: true
    },
    {
        id: 'm2',
        title: 'Faroo "Irfan" Silk Kurta',
        price: 5200,
        category: 'Men',
        section: 'men',
        subcategory: 'Kurta',
        image: '/products/men-shirt-placeholder.png',
        description: 'Semi-silk kurta with a royal sheen, perfect for festive occasions.',
        sizes: ['M', 'L', 'XL', 'XXL'],
        colors: ['Deep Blue', 'Royal Maroon'],
    },
    {
        id: 'm3',
        title: 'Faroo "Zoha" Classic Panjabi',
        price: 3800,
        category: 'Men',
        section: 'men',
        subcategory: 'Panjabi',
        image: '/products/men-shirt-placeholder.png',
        description: 'Traditional fit panjabi with modern touch, made for all-day comfort.',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Beige', 'Grey'],
    },
    {
        id: 'm4',
        title: 'Faroo "Kaveh" Modern Slim Panjabi',
        price: 4200,
        category: 'Men',
        section: 'men',
        subcategory: 'Panjabi',
        image: '/products/men-shirt-placeholder.png',
        description: 'Slim-fit panjabi with a minimalist design for a sharp, modern look.',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Black', 'Navy Blue'],
        new: true
    },
    {
        id: 'm5',
        title: 'Faroo "Zayn" Linen Casual Shirt',
        price: 2800,
        category: 'Men',
        section: 'men',
        subcategory: 'Shirts',
        image: '/products/men-shirt-placeholder.png',
        description: 'Breathable 100% linen shirt for ultimate comfort in warm weather.',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Sage Green', 'White'],
    },
    {
        id: 'm6',
        title: 'Faroo "Aryan" Oxford Shirt',
        price: 3200,
        category: 'Men',
        section: 'men',
        subcategory: 'Shirts',
        image: '/products/men-shirt-placeholder.png',
        description: 'Classic Oxford button-down shirt, a staple for every man\'s wardrobe.',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Light Blue', 'White'],
    },
    {
        id: 'm7',
        title: 'Faroo "Faris" Denim Jacket',
        price: 4800,
        category: 'Men',
        section: 'men',
        subcategory: 'Jackets',
        image: '/products/men-jacket-placeholder.png',
        description: 'Rugged yet stylish denim jacket with a premium washed finish.',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Indigo', 'Black'],
    },
    {
        id: 'm8',
        title: 'Faroo "Arsalan" Bomber Jacket',
        price: 5500,
        category: 'Men',
        section: 'men',
        subcategory: 'Jackets',
        image: '/products/men-jacket-placeholder.png',
        description: 'Water-resistant bomber jacket with a quilted lining for cold evenings.',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Olive Green', 'Classic Black'],
    },
    {
        id: 'm9',
        title: 'Faroo "Hadi" Slim Chinos',
        price: 3500,
        category: 'Men',
        section: 'men',
        subcategory: 'Pants',
        image: '/products/men-pants-placeholder.png',
        description: 'Versatile slim-fit chinos made from premium stretch cotton twill.',
        sizes: ['30', '32', '34', '36'],
        colors: ['Khaki', 'Navy'],
    },
    {
        id: 'm10',
        title: 'Faroo "Omar" Royal Panjabi Set',
        price: 6500,
        category: 'Men',
        section: 'men',
        subcategory: 'Panjabi',
        image: '/products/men-shirt-placeholder.png',
        description: 'A complete festive set featuring a heavy embroidered panjabi and matching pajama.',
        sizes: ['M', 'L', 'XL'],
        colors: ['Maroon/Gold'],
    }
];

export const FEATURED_PRODUCTS = PRODUCTS.filter(p => p.new).slice(0, 4);

export const getProductById = (id: string): Product | undefined => {
    return PRODUCTS.find(product => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
    return PRODUCTS.filter(product => product.category === category);
};

export const getProductsBySection = (section: 'women' | 'men'): Product[] => {
    return PRODUCTS.filter(product => product.section === section);
};
