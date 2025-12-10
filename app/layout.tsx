import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "EcoCollect - Waste Management System",
  description: "Smart waste collection and management platform for sustainable cities",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "logoEcoCollect1-removebg.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/logoEcoCollect1-removebg.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/logoEcoCollect1-removebg.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
