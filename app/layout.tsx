import type { Metadata } from "next"
import { Inter, Raleway } from "next/font/google"
import "./globals.css"
import { PageContainer } from "@/components/shared/PageContainer"
import { AntProvider } from "@/components/shared/AntProvider"

const inter = Inter({ subsets: ["latin"] })
const raleway = Raleway({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MemeGoat",
  description: "Secure layer of meme on Bitcoin",
  keywords: [
    "MemeGoat",
    "Meme",
    "Goat",
    "MemeGoatSTX",
    "blockchain",
    "bitcoin",
    "MemeGoat STX",
    "MemeGoatSTX",
    "MemeGoat Socialfi",
    "MemeGoat website",
    "MemeGoat application",
  ],
  publisher: "MemeGoat",
  openGraph: {
    title: "MemeGoat",
    siteName: "MemeGoat",
    images: [
      {
        url: "/opengraph-image.png",
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-custom-black`}>
        <AntProvider>
          <PageContainer>{children}</PageContainer>
        </AntProvider>
      </body>
    </html>
  )
}
