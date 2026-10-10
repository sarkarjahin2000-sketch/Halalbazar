import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import AuthProvider from "@/components/auth/AuthProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: "হালাল বাজার (Halal Bazar) — খাঁটি খাবার সুস্থ জীবন | Organic Grocery Shop",
    template: "%s | Halal Bazar (হালাল বাজার)",
  },
  description:
    "হালাল বাজার — অর্গানিক গ্রোসারি শপ। ড্রাই ফ্রুটস, খাঁটি মধু, মশলা ও প্রাকৃতিক খাদ্যপণ্য। প্রোপাইটর: জোবাইদুর রহমান জাহিন। শম্ভুপুরা, সোনারগাঁ, নারায়ণগঞ্জ। হেল্পলাইন: 01618908086।",
  keywords: [
    "হালাল বাজার",
    "Halal Bazar",
    "অর্গানিক গ্রোসারি শপ",
    "ড্রাই ফ্রুটস",
    "খাঁটি মধু",
    "মশলা",
    "সোনারগাঁ",
    "নারায়ণগঞ্জ",
    "Bangladesh organic shop",
  ],
  openGraph: {
    type: "website",
    locale: "bn_BD",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "হালাল বাজার (Halal Bazar)",
    title: "হালাল বাজার (Halal Bazar) — খাঁটি খাবার সুস্থ জীবন",
    description:
      "অর্গানিক গ্রোসারি শপ — ড্রাই ফ্রুটস, মধু, মশলা ও প্রাকৃতিক খাদ্যপণ্য। প্রোপাইটর: জোবাইদুর রহমান জাহিন, সোনারগাঁ, নারায়ণগঞ্জ।",
    images: [{ url: "/images/cover.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "হালাল বাজার (Halal Bazar) — Organic Grocery Shop",
    description: "খাঁটি খাবার সুস্থ জীবন • 100% Natural & Organic",
    images: ["/images/cover.png"],
  },
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className={inter.variable} suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-warm-white text-stone-900 antialiased"
      >
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <Toaster
            position="top-center"
            richColors
            closeButton
            duration={3000}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
