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
  title: "MUSE — The AI Creative Team That Learns You",
  description: "A persistent AI creative teammate that develops a long-term understanding of one creator. Creative Minds Jam #1.",
  keywords: ["Muse", "Minds SDK", "AI Creative Team", "Creative Minds Jam", "Next.js", "TypeScript"],
  authors: [{ name: "MUSE Project" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "MUSE — The AI Creative Team That Learns You",
    description: "A persistent AI creative teammate that learns your voice, audience, and performance.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MUSE — The AI Creative Team That Learns You",
    description: "A persistent AI creative teammate that learns your voice, audience, and performance.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
