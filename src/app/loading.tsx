import { Dumbbell } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4">
      <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 animate-pulse">
        <Dumbbell className="w-7 h-7" />
      </div>
      <p className="text-xs uppercase font-heading tracking-widest text-neutral-400">
        Loading Shirsekar's Fitness Hub...
      </p>
    </div>
  );
}
