import type { Metadata } from 'next'
import { Inter, Geist, Geist_Mono } from 'next/font/google'
import { Script } from 'next/script'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'FitMind Body - Transforme seu corpo e mente',
  description: 'App de fitness com planos personalizados de treino, nutrição e hidratação. Sistema de créditos flexível para ajustar quando quiser.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} ${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '2118265925371041');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img height="1" width="1" style="display:none"
          src="https://www.facebook.com/tr?id=2118265925371041&ev=PageView&noscript=1"
          />
        </noscript>
        {children}
      </body>
    </html>
  )
}