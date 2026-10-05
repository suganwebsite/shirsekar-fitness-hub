import { ArrowLeft, Dumbbell } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
        <Dumbbell className="w-7 h-7" />
      </div>
      <h1 className="font-heading text-4xl font-extrabold uppercase text-white mb-2">
        404 — PAGE NOT FOUND
      </h1>
      <p className="text-xs text-neutral-400 max-w-sm mb-6 leading-relaxed">
        The page you are looking for does not exist or has moved.
      </p>
      <Link
        href="/"
        className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-heading font-bold text-xs uppercase tracking-wider rounded-xl inline-flex items-center gap-2 cursor-pointer shadow-md"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Homepage</span>
      </Link>
    </div>
  );
}
