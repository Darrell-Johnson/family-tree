import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'The Benford · Penny · Johnson Family Tree',
  description: 'A living record of the Benford, Penny, and Johnson family lineage.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
