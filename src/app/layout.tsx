import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Muse — Day 1 Platform Validation",
  description: "The AI Creative Team That Learns You. Day 1 validation dashboard for the MUSE project — Creative Minds Jam #1.",
  keywords: ["Muse", "Minds SDK", "AI Creative Team", "Creative Minds Jam", "Next.js", "TypeScript"],
  authors: [{ name: "MUSE Project" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Muse — Day 1 Platform Validation",
    description: "The AI Creative Team That Learns You",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Muse — Day 1 Platform Validation",
    description: "The AI Creative Team That Learns You",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
