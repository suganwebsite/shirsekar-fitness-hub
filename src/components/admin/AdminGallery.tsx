'use client';

import { GalleryItem } from '@/types';
import { Image as ImageIcon, Loader2, Plus, Sparkles, Trash2, UploadCloud, X } from 'lucide-react';
import React, { useState } from 'react';

interface AdminGalleryProps {
  galleryItems: GalleryItem[];
  onCreateItem: (item: Omit<GalleryItem, 'id'>) => void;
  onDeleteItem: (id: string) => void;
}

export const AdminGallery: React.FC<AdminGalleryProps> = ({
  galleryItems,
  onCreateItem,
  onDeleteItem,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<GalleryItem['category']>('gym');
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Vercel Blob direct cloud upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        // Fallback to local data URL if server returns error
        const reader = new FileReader();
        reader.onload = (uploadEvent) => {
          if (uploadEvent.target?.result) {
            setImageUrl(uploadEvent.target.result as string);
            setIsUploading(false);
          }
        };
        reader.readAsDataURL(file);
        return;
      }

      const data = await res.json();
      if (data.url) {
        setImageUrl(data.url);
      } else {
        setUploadError(data.error || 'Failed to upload to Vercel Blob');
      }
    } catch {
      // Fallback to data URL
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setImageUrl(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) return;

    onCreateItem({
      title: title.trim(),
      category,
      imageUrl: imageUrl.trim(),
      caption: caption.trim() || undefined,
      isFeatured,
      order: galleryItems.length + 1,
    });

    setIsModalOpen(false);
    setTitle('');
    setImageUrl('');
    setCaption('');
    setIsFeatured(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold uppercase text-white tracking-wide">
            GYM GALLERY MANAGEMENT
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Add real photographs of the gym floor, weights, equipment, and community sessions (supports Vercel Blob cloud storage).
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 rounded-xl font-heading font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Photo</span>
        </button>
      </div>

      {/* Grid of gallery items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleryItems.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden flex flex-col justify-between"
          >
            <div className="relative aspect-[4/3] bg-neutral-950">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover filter brightness-95"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-neutral-950/80 text-[10px] font-bold text-amber-400 uppercase border border-neutral-800">
                {item.category}
              </span>
              {item.isFeatured && (
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-amber-400 text-neutral-950 text-[10px] font-extrabold flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  Featured
                </span>
              )}
            </div>

            <div className="p-4 flex items-center justify-between">
              <div>
                <h4 className="font-heading text-sm font-bold uppercase text-white truncate max-w-[200px]">
                  {item.title}
                </h4>
                {item.caption && (
                  <p className="text-[11px] text-neutral-400 truncate max-w-[200px]">
                    {item.caption}
                  </p>
                )}
              </div>

              <button
                onClick={() => {
                  if (confirm(`Remove image "${item.title}" from gallery?`)) {
                    onDeleteItem(item.id);
                  }
                }}
                className="p-1.5 rounded-lg bg-neutral-800 text-neutral-500 hover:text-red-400 hover:bg-neutral-700 transition-colors"
                title="Delete Photo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Photo Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="font-heading text-lg font-bold uppercase text-white">
                ADD PHOTO TO GALLERY
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 my-4">
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                  Photo Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Free Weights Dumbbells Rack"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                >
                  <option value="gym">Gym Floor</option>
                  <option value="equipment">Equipment</option>
                  <option value="training">Training Sessions</option>
                  <option value="community">Community / Members</option>
                  <option value="exterior">Building / Exterior</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                  Upload Image (Vercel Blob / Cloud)
                </label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs rounded-xl cursor-pointer flex items-center gap-1.5 border border-neutral-700">
                      {isUploading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                      ) : (
                        <UploadCloud className="w-3.5 h-3.5 text-amber-400" />
                      )}
                      <span>{isUploading ? 'Uploading to Blob...' : 'Choose File to Upload'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                        className="hidden"
                      />
                    </label>
                    <span className="text-[11px] text-neutral-500">or paste image URL:</span>
                  </div>

                  {uploadError && (
                    <p className="text-[11px] text-red-400">{uploadError}</p>
                  )}

                  <input
                    type="text"
                    required
                    placeholder="/images/... or https://..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                  Caption / Short Note (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Olympic lifting station with rubber floor"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded bg-neutral-950 border-neutral-800 text-amber-500"
                />
                <span>Feature on Homepage Spotlight</span>
              </label>

              <div className="flex justify-end gap-2 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs uppercase rounded-xl cursor-pointer"
                >
                  Add Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
