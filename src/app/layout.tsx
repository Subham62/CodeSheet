import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TRPCReactProvider } from "@/trpc/client";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import {ClerkProvider} from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CodeSheet - AI-Powered Code Generation",
  icons: {
    icon: "/logo.svg",           // Default favicon
    shortcut: "/logo.svg", // Windows shortcut
    apple: "/logo.svg", // iOS Safari
  },
  description: "Build production-ready apps and websites by chatting with AI. Instant previews, full-stack code, secure sandboxes, and no setup required.",
  keywords: "AI code generation, Next.js, React, full-stack development, AI coding assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#4285F4"
        }
      }}
    >
    <TRPCReactProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          >
            <Toaster/>
            {/* {children} */}
            <main>{children}</main>
          </ThemeProvider>
        </body>
      </html>
    </TRPCReactProvider>
    </ClerkProvider>  
  );
}
