'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const App = dynamic(() => import('../App'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-amber-400 font-heading tracking-widest text-lg">
      LOADING SHIRSEKARS FITNESS HUB...
    </div>
  ),
});

export default function HomePage() {
  return <App />;
}
