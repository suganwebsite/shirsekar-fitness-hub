import type { Metadata } from 'next';
import React from 'react';
import '../index.css';

export const metadata: Metadata = {
  title: "Shirsekar's Fitness Hub | Gym in Bandra East, Mumbai",
  description:
    "Premier fitness center and gym in Bandra East, Mumbai. Managed by Fit Mantras. Strength training, cardio, personal training, and free trial workouts.",
  keywords: [
    "gym in Bandra East",
    "fitness center Bandra",
    "Shirsekar's Fitness Hub",
    "Fit Mantras",
    "strength training Mumbai",
    "personal training Bandra",
    "free trial gym Mumbai",
  ],
  openGraph: {
    title: "Shirsekar's Fitness Hub | Gym in Bandra East, Mumbai",
    description:
      "Premier fitness center and gym in Bandra East, Mumbai. Managed by Fit Mantras. Strength training, cardio, and free trials.",
    type: 'website',
    locale: 'en_IN',
    siteName: "Shirsekar's Fitness Hub",
  },
  twitter: {
    card: 'summary_large_image',
    title: "Shirsekar's Fitness Hub | Gym in Bandra East, Mumbai",
    description:
      "Premier fitness center and gym in Bandra East, Mumbai. Managed by Fit Mantras.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": ["ExerciseGym", "HealthClub", "LocalBusiness"],
              "name": "Shirsekar's Fitness Hub",
              "alternateName": "शिरसेकर्स' फिटनेस हब",
              "description": "Premier fitness center and gym in Bandra East, Mumbai. Managed by Fit Mantras. Strength training, cardio, personal training, and free trial workouts.",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Mahatma Gandhi Vidyamandir, JL Shirshekar Marg, Government Colony",
                "addressLocality": "Bandra East, Mumbai",
                "addressRegion": "Maharashtra",
                "postalCode": "400051",
                "addressCountry": "IN"
              },
              "telephone": "+917710039324",
              "priceRange": "₹₹",
              "openingHours": ["Mo-Sa 06:00-22:30", "Su 07:00-13:00"],
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "3.9",
                "reviewCount": "43",
                "bestRating": "5",
                "worstRating": "1"
              }
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-neutral-950 text-neutral-100 antialiased selection:bg-amber-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
