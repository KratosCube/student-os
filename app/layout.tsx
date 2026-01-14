import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";  // 👈 TENTO ŘÁDEK TAM MUSÍ BÝT!

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zkouškový Dashboard",
  description: "Organizér zkoušek a zápočtů",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body className={inter.className}>{children}</body>
    </html>
  );
}