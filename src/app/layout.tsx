import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FitMind Body - Transforme seu corpo. Eleve sua mente.',
  description: 'Sua jornada fitness premium começa aqui. Treinos personalizados, dietas sob medida e acompanhamento completo.',
  keywords: 'fitness, treino, dieta, personalizado, calistenia, academia, saúde',
  authors: [{ name: 'FitMind Body' }],
  openGraph: {
    title: 'FitMind Body - Transformação Fitness Personalizada',
    description: 'Treinos e dietas personalizados para sua transformação completa',
    type: 'website',
    locale: 'pt_BR',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Meta Pixel Code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
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
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=2118265925371041&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* End Meta Pixel Code */}
      </head>
      <body className="font-inter antialiased">
        {children}
      </body>
    </html>
  )
}