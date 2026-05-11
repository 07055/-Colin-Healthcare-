import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/lib/CartContext";
import WhatsAppHelp from "@/components/WhatsAppHelp";
import StoreShell from "@/components/StoreShell";

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
          <StoreShell
            header={<Header />}
            footer={<Footer />}
            whatsapp={<WhatsAppHelp />}
          >
            {children}
          </StoreShell>
        </CartProvider>
      </body>
    </html>
  );
}
