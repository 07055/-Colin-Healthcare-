import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/lib/CartContext";

export const metadata: Metadata = {
  title: "Sam's Suma Mart (SSM) | Medical Supplies & Healthcare Products",
  description: "Quality medical supplies, healthcare products, and BF Suma products delivered to your doorstep in Kenya.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Header />
          <main style={{ minHeight: '80vh' }}>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
