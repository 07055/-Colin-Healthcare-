import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/lib/CartContext";
import WhatsAppHelp from "@/components/WhatsAppHelp";

export const dynamic = 'force-dynamic'

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <Header />
      <main style={{ minHeight: '80vh' }}>{children}</main>
      <Footer />
      <WhatsAppHelp />
    </CartProvider>
  );
}
