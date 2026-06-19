export default function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Bakery",
    name: "El Club del Pancito",
    description:
      "Panadería artesanal por suscripción en Sucre, Bolivia. Pan chuquisaqueño recién horneado entregado a domicilio.",
    url: "https://elclubdelpancito.bo",
    telephone: "+59175769711",
    email: "hola@elclubdelpancito.bo",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Sucre",
      addressRegion: "Chuquisaca",
      addressCountry: "BO",
    },
    servesCuisine: "Bolivian",
    image: "https://elclubdelpancito.bo/images/logo.png",
    priceRange: "Bs. 52 - Bs. 82",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "05:00",
      closes: "20:00",
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
