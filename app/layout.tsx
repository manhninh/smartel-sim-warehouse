import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Smartel SIM Inventory',
  description: 'Hệ thống quản lý kho SIM bằng Next.js',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  )
}
