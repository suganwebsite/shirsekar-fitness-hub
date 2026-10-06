'use client';

import dynamic from 'next/dynamic';
import React, { useEffect } from 'react';

const App = dynamic(() => import('../../App'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-amber-400 font-heading tracking-widest text-lg">
      LOADING GYM PORTAL...
    </div>
  ),
});

export default function AdminRoutePage() {
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.location.hash.startsWith('#/admin')) {
      window.location.hash = '#/admin/dashboard';
    }
  }, []);

  return <App />;
}
