import type { Metadata } from 'next'
import { Inter, Manrope, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter-variable',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope-variable',
  display: 'swap',
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta-variable',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Booking Platform - Book appointments online',
  description: 'Multi-tenant booking platform for businesses',
}

type RootLayoutProps = {
  children: React.ReactNode
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable} ${plusJakarta.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  )
}

export default RootLayout
