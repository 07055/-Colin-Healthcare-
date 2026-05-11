import type { Metadata } from "next";
import "./globals.css";
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
        <StoreShell>
          {children}
        </StoreShell>
      </body>
    </html>
  );
}
