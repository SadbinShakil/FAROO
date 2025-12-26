import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Faroo | Premium Clothing",
  description: "Experience the finest in fashion with Faroo.",
};

import { CartProvider } from "@/context/CartContext";
import CartSidebar from "@/components/CartSidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <Header />
          <CartSidebar />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
