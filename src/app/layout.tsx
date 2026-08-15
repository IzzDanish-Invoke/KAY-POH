import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kay Poh — Local Tours of Ipoh",
  description: "OKU-first, fully supported and accessible trips through Ipoh, Perak.",
  icons: { icon: "/brand/kaypoh-dark-outline.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
