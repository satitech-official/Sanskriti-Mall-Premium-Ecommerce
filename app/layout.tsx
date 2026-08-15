import type { Metadata } from "next";
import "./globals.css";
import { AppChrome } from "@/components/AppChrome";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sanskriti-mall.example";

export const metadata: Metadata = {
  title: { default: "Sanskriti Mall | Premium Men's Fashion in Betul", template: "%s | Sanskriti Mall" },
  description: "Premium men's fashion, co-ords, cotton linen and sharp everyday style from Badora, Betul.",
  keywords: ["men's clothing store Betul", "men's fashion Betul", "co-ord sets Betul", "cotton linen shirts"],
  metadataBase: new URL(siteUrl),
  openGraph: { title: "Sanskriti Mall — Style That Speaks", description: "Premium men's fashion. Great quality. Honest prices.", type: "website", images: [{ url: "/og.png", width: 1672, height: 940, alt: "Sanskriti Mall — Style That Speaks" }] },
  twitter: { card: "summary_large_image", title: "Sanskriti Mall — Style That Speaks", description: "Premium men's fashion. Great quality. Honest prices.", images: ["/og.png"] },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><AppChrome>{children}</AppChrome></body></html>;
}
