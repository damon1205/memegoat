import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { PageContainer } from "@/components/shared/PageContainer"
import { AntProvider } from "@/components/shared/AntProvider"
import config from "@/utils/config"
import StacksProvider from "@/provider/stacks"
import StoreProvider from "@/provider/Redux"
import { NotificationModal } from "@/components/shared/NotificationModal"
import { NotificationProvider } from "@/provider/notification"
import { TokensProvider } from "@/provider/Tokens"
import QueryProvider from "@/provider/Query"
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL(config.BASE_URL),
  title: "MemeGoat",
  description: "Secure layer for memes on Bitcoin",
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
    images: "/og-image.png",
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
            {/* <StoreProvider> */}
            {/* <QueryProvider> */}
            <TokensProvider>
              <PageContainer>
                <NotificationProvider>
                  {children}
                  <NotificationModal />
                </NotificationProvider>
              </PageContainer>
            </TokensProvider>
            {/* </QueryProvider> */}
            {/* </StoreProvider> */}
          </StacksProvider>
        </AntProvider>
      </body>
    </html>
  )
}
