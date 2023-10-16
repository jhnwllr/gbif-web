import { Header } from '@/components/header'
import './globals.css'
import { Inter } from 'next/font/google'
import styles from './layout.module.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className={styles.main}>
          {children}
        </main>
      </body>
    </html>
  )
}