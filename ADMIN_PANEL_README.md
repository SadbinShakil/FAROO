# Faroo Admin Panel

A comprehensive admin panel for managing your e-commerce store with a beautiful, modern interface.

## 🚀 Features

### 1. **Dashboard**
- Real-time statistics overview
- Total products, orders, revenue tracking
- Recent orders display
- Active discount codes overview
- Quick access to all management sections

### 2. **Product Management**
- View all products in a beautiful grid layout
- Search products by name or category
- Filter by section (Women/Men)
- Add new products (demo interface)
- Edit existing products
- Delete products with confirmation
- Product details including:
  - Title, price, category
  - Images
  - Sizes and colors
  - Stock information

### 3. **Order Management**
- View all customer orders
- Search by order number, customer name, or email
- Filter by order status (Pending, Processing, Shipped, Delivered)
- Update order status directly from the table
- View detailed order information including:
  - Customer details
  - Shipping address
  - Order items
  - Payment information
  - Order summary with discounts
- Export orders (demo interface)

### 4. **Discount Management**
- Create and manage discount codes
- Two types of discounts:
  - Percentage-based (e.g., 25% OFF)
  - Fixed amount (e.g., ₹500 OFF)
- Configure discount parameters:
  - Minimum purchase requirement
  - Maximum discount cap
  - Valid date range
  - Usage limits
- Toggle discount activation/deactivation
- Track usage statistics
- Delete discount codes

### 5. **Authentication**
- Secure admin login
- Session-based authentication
- Protected routes

## 🔐 Access Credentials

**Demo Login:**
- Username: `admin`
- Password: `admin123`

> ⚠️ **Note:** You can override this password by setting the `ADMIN_PASSWORD` environment variable in Vercel.

## 📁 File Structure

```
src/
├── app/
│   └── admin/
│       ├── page.tsx                    # Login page
│       ├── AdminLogin.module.css       # Login styles
│       ├── dashboard/
│       │   ├── page.tsx               # Dashboard page
│       │   └── Dashboard.module.css   # Dashboard styles
│       ├── products/
│       │   ├── page.tsx               # Products management
│       │   └── Products.module.css    # Products styles
│       ├── orders/
│       │   ├── page.tsx               # Orders management
│       │   └── Orders.module.css      # Orders styles
│       └── discounts/
│           ├── page.tsx               # Discounts management
│           └── Discounts.module.css   # Discounts styles
└── data/
    ├── admin.ts                        # Admin user data
    ├── products.ts                     # Product catalog
    ├── orders.ts                       # Order data
    └── discounts.ts                    # Discount codes
```

## 🎨 Design Features

- **Modern UI:** Clean, professional interface with gradient accents
- **Responsive:** Works on desktop, tablet, and mobile devices
- **Dark Sidebar:** Professional dark-themed navigation
- **Smooth Animations:** Hover effects, transitions, and micro-interactions
- **Color-Coded Status:** Visual indicators for order and payment status
- **Card-Based Layout:** Easy-to-scan information cards
- **Modal Dialogs:** Detailed views without page navigation

## 🛠️ Usage

### Accessing the Admin Panel

1. Navigate to `/admin` in your browser
2. Login with the demo credentials
3. You'll be redirected to the dashboard

### Managing Products

1. Click "Products" in the sidebar
2. Use the search bar to find specific products
3. Filter by section (All/Women/Men)
4. Click the edit icon to modify a product
5. Click the trash icon to delete a product
6. Click "Add Product" to create new products

### Managing Orders

1. Click "Orders" in the sidebar
2. Search for orders by number, customer name, or email
3. Filter by status using the filter buttons
4. Change order status using the dropdown in each row
5. Click the eye icon to view full order details
6. Click "Export" to download order data

### Managing Discounts

1. Click "Discounts" in the sidebar
2. View all discount codes with their details
3. Toggle the switch to activate/deactivate codes
4. Click the edit icon to modify discount parameters
5. Click the trash icon to delete a discount
6. Click "Create Discount" to add new codes

## 📊 Data Management

Currently, the admin panel uses in-memory data storage (TypeScript files). For production:

1. **Database Integration:**
   - Connect to PostgreSQL, MongoDB, or your preferred database
   - Implement proper CRUD operations
   - Add data validation

2. **API Routes:**
   - Create Next.js API routes for each operation
   - Implement proper error handling
   - Add request validation

3. **State Management:**
   - Consider using Redux, Zustand, or React Query
   - Implement optimistic updates
   - Add loading states

4. **File Uploads:**
   - Integrate with cloud storage (AWS S3, Cloudinary)
   - Add image upload functionality
   - Implement image optimization

## 🔒 Security Recommendations

For production deployment:

1. **Authentication:**
   - Implement JWT or session-based auth
   - Use bcrypt for password hashing
   - Add two-factor authentication
   - Implement role-based access control (RBAC)

2. **API Security:**
   - Add CSRF protection
   - Implement rate limiting
   - Validate all inputs
   - Use HTTPS only

3. **Data Protection:**
   - Encrypt sensitive data
   - Implement audit logs
   - Add backup mechanisms
   - Follow GDPR/data protection regulations

## 🚀 Future Enhancements

- **Analytics Dashboard:** Sales charts, revenue trends, customer insights
- **Inventory Management:** Stock tracking, low stock alerts
- **Customer Management:** View and manage customer accounts
- **Email Notifications:** Order confirmations, shipping updates
- **Bulk Operations:** Import/export products, bulk price updates
- **Advanced Filtering:** Date ranges, price ranges, multiple filters
- **Reports:** Generate sales reports, inventory reports
- **Settings:** Store configuration, payment gateway settings
- **Multi-language Support:** Internationalization
- **Dark Mode:** Theme switcher for the admin panel

## 📝 Notes

- This is a demo implementation with in-memory data
- All changes are temporary and reset on page reload
- For production, integrate with a real database
- Implement proper error handling and validation
- Add loading states and error messages
- Consider adding unit and integration tests

## 🎯 Quick Start

1. Access the admin panel: `http://localhost:3000/admin`
2. Login with: `admin` / `admin123`
3. Explore the dashboard and management sections
4. Test CRUD operations (changes are temporary)

---

**Built with Next.js, TypeScript, and modern CSS modules**
