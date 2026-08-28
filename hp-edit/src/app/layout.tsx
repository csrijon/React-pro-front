import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#030712",
};

export const metadata: Metadata = {
  title: "HP Edit Enterprise | Next-Gen Software, AI Agents & Enterprise Systems",
  description:
    "We architect superfast web apps, mobile apps, autonomous AI agents, enterprise automation systems, WhatsApp integrations, and growth engines.",
  keywords: [
    "HP Edit",
    "HP Edit Enterprise",
    "software development",
    "AI agents",
    "web development",
    "mobile app development",
    "WhatsApp API integration",
    "enterprise automation",
    "IT consulting",
    "influencer marketing"
  ],
  authors: [{ name: "HP Edit Enterprise", url: "https://www.hpedit.com" }],
  openGraph: {
    title: "HP Edit Enterprise | Next-Gen Software & AI Studio",
    description:
      "Modern, superfast, highly-animated digital engineering firm for high-ticket clients and scaling enterprises.",
    url: "https://www.hpedit.com",
    siteName: "HP Edit Enterprise",
    images: [
      {
        url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
        width: 1200,
        height: 630,
        alt: "HP Edit Enterprise Digital Systems",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HP Edit Enterprise | Next-Gen Software & AI Studio",
    description: "Architecting intelligent software, AI agents, and enterprise digital solutions.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-cyber-950 text-gray-100 antialiased min-h-screen selection:bg-cyan-500 selection:text-black overflow-x-clip">
        {children}
      </body>
    </html>
  );
}
