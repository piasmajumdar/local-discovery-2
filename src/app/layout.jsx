import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata = {
  title: 'Local Discovery',
  description: 'AI-Based Local Discovery',
  icons: {
    icon: '/favicon.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>

        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js" async></script>
      </head>
      <body className="open-sans">
        <Header />
        {children}
        <Analytics />
        <SpeedInsights />
        <Footer />
      </body>
    </html>
  )
}
