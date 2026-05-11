import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
