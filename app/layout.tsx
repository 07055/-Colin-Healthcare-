import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Sam's Suma Mart (SSM) | Medical Supplies & Healthcare Products",
    template: "%s | Sam's Suma Mart",
  },
  description: "Quality medical supplies, healthcare products, and BF Suma products delivered to your doorstep in Kenya.",
  metadataBase: new URL('https://samassumamart.co.ke'),
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    siteName: "Sam's Suma Mart",
    title: "Sam's Suma Mart (SSM) | Medical Supplies & Healthcare Products",
    description: "Quality medical supplies, healthcare products, and BF Suma products delivered to your doorstep in Kenya.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
