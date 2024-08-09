import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { PageContainer } from "@/components/shared/PageContainer"
import { AntProvider } from "@/components/shared/AntProvider"
import config from "@/utils/config"
import StacksProvider from "@/provider/stacks"
import { NotificationModal } from "@/components/shared/NotificationModal"
import { NotificationProvider } from "@/provider/notification"
import { TokensProvider } from "@/provider/Tokens"
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL(config.BASE_URL),
  title: "MemeGoat DeFi",
  description:
    "Launch | Swap | Raise liquidity | Deploy a pool | Play games | Earn | Promote",
  keywords: [
    "MemeGoat",
    "MemeGoat App",
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
    title: "MemeGoat DeFi",
    description:
      "Launch | Swap | Raise liquidity | Deploy a pool | Play games | Earn | Promote",
    siteName: "MemeGoat",
    url: "https://app.memegoat.io/",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://res.cloudinary.com/osaretinfrank/image/upload/v1723235872/204adf06-dc10-42a0-a5ce-a52b4448103b_ym2sfn.jpg",
        alt: "MemeGoat",
        width: 1200,
        height: 675,
      },
    ],
  },
  twitter: {
    images: [
      {
        url: "https://res.cloudinary.com/osaretinfrank/image/upload/v1723235872/204adf06-dc10-42a0-a5ce-a52b4448103b_ym2sfn.jpg",
        alt: "MemeGoat",
      },
    ],
    card: "summary_large_image",
    site: "@GoatCoinSTX",
    title: "MemeGoat DeFi",
    description:
      "Launch | Swap | Raise liquidity | Deploy a pool | Play games | Earn | Promote",
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
          <StacksProvider>
            <TokensProvider>
              <PageContainer>
                <NotificationProvider>
                  {children}
                  <NotificationModal />
                </NotificationProvider>
              </PageContainer>
            </TokensProvider>
          </StacksProvider>
        </AntProvider>
      </body>
    </html>
  )
}
