import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { twMerge } from 'tailwind-merge'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={twMerge('min-h-screen', inter.className)}>
        {children}
        <Toaster
          position="top-center"
          gutter={12}
          containerStyle={{ margin: '8px' }}
          toastOptions={{
            success: {
              duration: 3000,
            },
            error: {
              duration: 5000,
            },
            style: {
              fontSize: '16px',
              maxWidth: 'max-content',
              padding: '16px 24px',
              color: '#333333',
            },
          }}
        />
      </body>
    </html>
  )
}
