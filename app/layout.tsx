import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { AppProvider } from "@/providers/app-provider";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Indo Bangla Books",
  description: "Curated books and authors for curious readers.",
  authors: [{ name: "Indo Bangla Books" }],

  openGraph: {
    title: "Indo Bangla Books",
    description: "Curated books and authors for curious readers.",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    site: "@foliobooks",
  },

  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable} data-scroll-behavior="smooth">
      <body className={`${poppins.className} antialiased`}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}