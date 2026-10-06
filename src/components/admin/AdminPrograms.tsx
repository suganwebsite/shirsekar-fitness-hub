'use client';

import { Dumbbell, Edit2, Eye, EyeOff, Plus, Trash2, X } from 'lucide-react';
import React, { useState } from 'react';
import { TrainingProgram } from '../../types';

interface AdminProgramsProps {
  programs: TrainingProgram[];
  onCreateProgram: (prog: Omit<TrainingProgram, 'id'>) => void;
  onUpdateProgram: (id: string, updates: Partial<TrainingProgram>) => void;
  onDeleteProgram: (id: string) => void;
}

export const AdminPrograms: React.FC<AdminProgramsProps> = ({
  programs,
  onCreateProgram,
  onUpdateProgram,
  onDeleteProgram,
}) => {
  const [editingProg, setEditingProg] = useState<TrainingProgram | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [duration, setDuration] = useState('');
  const [difficulty, setDifficulty] = useState<TrainingProgram['difficulty']>('All Levels');
  const [image, setImage] = useState('');
  const [isActive, setIsActive] = useState(true);

  const handleOpenCreate = () => {
    setIsCreating(true);
    setEditingProg(null);
    setTitle('');
    setDescription('');
    setTargetAudience('');
    setDuration('12-Week Program');
    setDifficulty('All Levels');
    setImage('/images/facility_strength_weights_1791189513690.jpg');
    setIsActive(true);
  };

  const handleOpenEdit = (prog: TrainingProgram) => {
    setEditingProg(prog);
    setIsCreating(false);
    setTitle(prog.title);
    setDescription(prog.description);
    setTargetAudience(prog.targetAudience);
    setDuration(prog.duration);
    setDifficulty(prog.difficulty);
    setImage(prog.image);
    setIsActive(prog.isActive);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCreating) {
      onCreateProgram({
        title: title.trim(),
        description: description.trim(),
        targetAudience: targetAudience.trim(),
        duration: duration.trim(),
        difficulty,
        image: image.trim(),
        isActive,
        order: programs.length + 1,
      });
      setIsCreating(false);
    } else if (editingProg) {
      onUpdateProgram(editingProg.id, {
        title: title.trim(),
        description: description.trim(),
        targetAudience: targetAudience.trim(),
        duration: duration.trim(),
        difficulty,
        image: image.trim(),
        isActive,
      });
      setEditingProg(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold uppercase text-white tracking-wide">
            TRAINING PROGRAMS
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Manage fitness programs, goals, target audiences, and workout split tracks.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 rounded-xl font-heading font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Program</span>
        </button>
      </div>

      {/* Grid of Programs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((prog) => (
          <div
            key={prog.id}
            className={`rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden flex flex-col justify-between ${
              !prog.isActive ? 'opacity-50' : ''
            }`}
          >
            <div>
              <div className="aspect-[16/10] bg-neutral-950 relative overflow-hidden">
                <img
                  src={prog.image}
                  alt={prog.title}
                  className="w-full h-full object-cover filter brightness-90"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-neutral-950/80 text-[10px] font-bold text-amber-400 border border-neutral-800">
                  {prog.difficulty} · {prog.duration}
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-heading text-lg font-bold uppercase text-white mb-1">
                  {prog.title}
                </h3>
                <p className="text-xs text-neutral-300 line-clamp-2 mb-3">
                  {prog.description}
                </p>

                <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-400">
                  <strong className="text-neutral-300 block mb-0.5">Target Member:</strong>
                  <span>{prog.targetAudience}</span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-neutral-800 flex items-center justify-between bg-neutral-950/40">
              <button
                onClick={() => onUpdateProgram(prog.id, { isActive: !prog.isActive })}
                className="text-xs text-neutral-400 hover:text-white flex items-center gap-1"
              >
                {prog.isActive ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5 text-neutral-500" />}
                <span>{prog.isActive ? 'Active' : 'Hidden'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(prog)}
                  className="p-1.5 rounded-lg bg-neutral-800 text-amber-400 hover:bg-neutral-700"
                  title="Edit Program"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete program "${prog.title}"?`)) {
                      onDeleteProgram(prog.id);
                    }
                  }}
                  className="p-1.5 rounded-lg bg-neutral-800 text-neutral-500 hover:text-red-400"
                  title="Delete Program"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Program Modal */}
      {(isCreating || editingProg) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="font-heading text-lg font-bold uppercase text-white">
                {isCreating ? 'CREATE TRAINING PROGRAM' : `EDIT: ${editingProg?.title}`}
              </h3>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setEditingProg(null);
                }}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 my-4">
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                  Program Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Weight Loss & Conditioning"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                  Program Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Details of the workout structure..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                  Target Member / Who It's For *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Beginners looking to learn barbell basics safely"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                    Duration Track *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 12-Week Track"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                    Difficulty Level
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                  >
                    <option value="All Levels">All Levels</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                  Card Image URL or Path
                </label>
                <input
                  type="text"
                  required
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded bg-neutral-950 border-neutral-800 text-amber-500"
                />
                <span>Active & Visible on Website</span>
              </label>

              <div className="flex justify-end gap-2 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingProg(null);
                  }}
                  className="px-4 py-2 text-xs text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs uppercase rounded-xl cursor-pointer"
                >
                  {isCreating ? 'Create Program' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
