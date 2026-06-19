import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import Script from "next/script"
import "./globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import StructuredData from "@/components/StructuredData"
import WhatsAppButton from "@/components/WhatsAppButton"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://elclubdelpancito.bo"),
  title: {
    default: "El Club del Pancito | Panadería Artesanal por Suscripción en Sucre",
    template: "%s | El Club del Pancito",
  },
  description:
    "Pan artesanal chuquisaqueño recién horneado entregado a domicilio con modelo de suscripción flexible. Descubrí la calidez del horno de barro cada mañana en Sucre, Bolivia.",
  keywords: [
    "pan artesanal",
    "suscripción de pan",
    "Sucre",
    "Chuquisaca",
    "panadería",
    "pan caliente",
    "entrega a domicilio",
    "horno de barro",
    "pan chuquisaqueño",
    "El Club del Pancito",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    title: "El Club del Pancito | Panadería Artesanal por Suscripción",
    description:
      "Pan artesanal chuquisaqueño recién horneado entregado a domicilio con modelo de suscripción flexible. Descubrí la calidez del horno de barro cada mañana en Sucre, Bolivia.",
    url: "https://elclubdelpancito.bo",
    siteName: "El Club del Pancito",
    locale: "es_BO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "El Club del Pancito | Panadería Artesanal por Suscripción",
    description:
      "Pan artesanal chuquisaqueño recién horneado entregado a domicilio con modelo de suscripción flexible.",
  },
  icons: {
    icon: "/favicon.ico",
  },
}

const GTM_ID = "GTM-WLLJ2MVS"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-oven-950 text-cream">
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <Navbar />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
        <WhatsAppButton />
        <Script
          id="tawk-to"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();(function(){var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];s1.async=true;s1.src='https://embed.tawk.to/6a34846316fcef1d436fb118/1jreia9ri';s1.charset='UTF-8';s1.setAttribute('crossorigin','*');s0.parentNode.insertBefore(s1,s0);})();`,
          }}
        />
        <StructuredData />
      </body>
    </html>
  )
}
