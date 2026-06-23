import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Colin Healthcare (CH) | Medicines & Health Products",
    template: "%s | Colin Healthcare",
  },
  description: "Quality medicines, health products, and pharmaceutical supplies delivered to your doorstep in Kenya.",
  metadataBase: new URL('https://colinhealthcare.co.ke'),
  robots: { index: true, follow: true },
  verification: {
    google: 'DHfA53dOVgEFxVwf5pSswOyJBRADoaTXHif3eIVX59g',
  },
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    siteName: "Colin Healthcare",
    title: "Colin Healthcare (CH) | Medicines & Health Products",
    description: "Quality medicines, health products, and pharmaceutical supplies delivered to your doorstep in Kenya.",
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
