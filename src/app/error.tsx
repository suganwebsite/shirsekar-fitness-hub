'use client';

import { AlertTriangle, RotateCcw } from 'lucide-react';
import React, { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Next.js Global Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mb-4">
        <AlertTriangle className="w-7 h-7" />
      </div>
      <h2 className="font-heading text-2xl font-bold uppercase text-white mb-2">
        SOMETHING WENT WRONG
      </h2>
      <p className="text-xs text-neutral-400 max-w-md mb-6 leading-relaxed">
        An unexpected error occurred while loading the application.
      </p>
      <button
        onClick={() => reset()}
        className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-heading font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 cursor-pointer shadow-md"
      >
        <RotateCcw className="w-4 h-4" />
        <span>Try Again</span>
      </button>
    </div>
  );
}
