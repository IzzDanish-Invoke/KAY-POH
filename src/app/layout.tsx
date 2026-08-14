import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kay Poh — Local Tours of Ipoh",
  description: "Small-group tours through the food, heritage, and hidden corners of Ipoh, Perak.",
  icons: { icon: "/brand/kaypoh-dark-outline.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
