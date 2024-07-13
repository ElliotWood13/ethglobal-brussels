"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navbar } from "@/components/ui/navbar";
import { Badge } from "@/components/ui/badge";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <html lang="en">
      <QueryClientProvider client={queryClient}>
        <body className={inter.className}>
          <div className="flex flex-col items-center justify-between px-8 py-4">
            <div className="z-10 w-full max-w-6xl items-center justify-between gap-4 font-mono text-sm lg:flex">
              <Navbar />
              <Badge>Sepolia</Badge>
            </div>
          </div>
          {children}
          <footer className="flex flex-col items-center justify-between px-8 py-4 text-xs text-slate-400">
            ETHGlobal Brussels 2024
          </footer>
        </body>
      </QueryClientProvider>
    </html>
  );
}
