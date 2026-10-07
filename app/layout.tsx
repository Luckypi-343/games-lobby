import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { Noto_Sans_TC, Noto_Serif_TC } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const notoSansTC = Noto_Sans_TC({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-luckypi-sans',
})
const notoSerifTC = Noto_Serif_TC({
  subsets: ['latin'],
  weight: ['700', '900'],
  variable: '--font-luckypi-display',
})

export const metadata: Metadata = {
  title: 'Luckypi Games 遊戲大廳 | 益智區與博奕區 — Pi Network休閒娛樂平台',
  description:
    'Luckypi Games 是專為Pi先鋒打造的遊戲大廳,設有益智區與博奕區兩大分類,超過100台持續更新的機台,結合腦力開發與休閒娛樂,使用遊戲幣暢玩,陪伴每一位先鋒度過輕鬆愉快的遊戲時光。',
  keywords: ['Luckypi Games', 'Pi Network', 'Pi幣', '遊戲大廳', '益智遊戲', '老虎機', '休閒遊戲', 'Pi先鋒'],
  generator: 'v0.app',
  openGraph: {
    title: 'Luckypi Games 遊戲大廳',
    description: '益智區與博奕區兩大分類,超過100台持續更新的機台,Pi先鋒專屬休閒娛樂空間。',
    locale: 'zh_TW',
    type: 'website',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#1a1208',
  userScalable: false,
  maximumScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="zh-Hant" className={`${notoSansTC.variable} ${notoSerifTC.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
