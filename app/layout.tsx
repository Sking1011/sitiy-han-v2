import './globals.css'
import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/theme-provider'
import { SessionProvider } from '@/components/providers/session-provider'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'Sytyi Han ERP',
  description: 'Система управления производством',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster position="top-center" richColors />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
