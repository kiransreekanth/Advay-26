import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ADVAY 2026 | National Level Techno-Cultural Fest',
  description: 'ADVAY is the National-level Techno-Cultural fest of Toc H Institute of Science & Technology. February 14-15, 2026.',
  keywords: ['ADVAY', 'ADVAY 2026', 'TIST', 'College Fest', 'Kerala', 'Techno Cultural'],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0D0D0D',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}