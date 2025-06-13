import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SiteHeaderWrapper } from "@/components/site-header-wrapper"
import { SiteFooter } from "@/components/site-footer"
import { AuthProvider } from "@/components/auth-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "鱼泡泡空投聚合器",
    template: "%s | 鱼泡泡空投聚合器",
  },
  description: "发现最新空投项目，一起走向致富之路",
  keywords: ["空投", "加密货币", "区块链", "Web3"],
  authors: [
    {
      name: "鱼泡泡",
      url: "https://twitter.com/your-twitter",
    },
  ],
  creator: "鱼泡泡",
  icons: {
    icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-V5mxq70ZjiiRLppAyW22t00G5DEtG5.png",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head />
      <body className={`${inter.className} flex min-h-screen flex-col`}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <SiteHeaderWrapper />
            <main className="flex-1">{children}</main>
            <SiteFooter />
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
