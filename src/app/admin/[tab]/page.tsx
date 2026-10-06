'use client';

import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react';

const App = dynamic(() => import('../../../App'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-amber-400 font-heading tracking-widest text-lg">
      LOADING...
    </div>
  ),
});

export default function AdminSubtabRoutePage() {
  const params = useParams();
  const tab = params?.tab as string;

  useEffect(() => {
    if (tab && typeof window !== 'undefined') {
      window.location.hash = `#/admin/${tab}`;
    }
  }, [tab]);

  return <App />;
}
