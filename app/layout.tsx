import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sitiy Han ERP',
  description: 'Система управления производством',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}
