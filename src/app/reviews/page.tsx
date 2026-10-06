'use client';

import dynamic from 'next/dynamic';
import React, { useEffect } from 'react';

const App = dynamic(() => import('../../App'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-amber-400 font-heading tracking-widest text-lg">
      LOADING REVIEWS...
    </div>
  ),
});

export default function ReviewsPage() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const el = document.getElementById('reviews');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return <App />;
}
