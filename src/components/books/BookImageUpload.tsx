'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';

interface BookImageUploadProps {
  imageFile: File | null;
  onImageSelect: (file: File | null) => void;
  error?: string;
  disabled?: boolean;
}

export function BookImageUpload({
  imageFile,
  onImageSelect,
  error,
  disabled = false,
}: BookImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
      onImageSelect(null);
      setPreviewUrl(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      onImageSelect(null);
      setPreviewUrl(null);
      return;
    }

    onImageSelect(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    onImageSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-1.5 w-full">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
          Book Cover Image <span className="text-amber-600">*</span>
        </label>
        <span className="text-xs text-zinc-500">JPG, PNG, WEBP (Max 5MB)</span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
        id="book-image-input"
      />

      {previewUrl ? (
        <div className="relative group rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-zinc-50 dark:bg-zinc-900/50 p-3 flex items-center gap-4">
          <div className="relative w-20 h-28 rounded-xl overflow-hidden shadow-md flex-shrink-0 bg-zinc-200 dark:bg-zinc-800">
            <Image
              src={previewUrl}
              alt="Book cover preview"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="flex-1 min-w-0 space-y-1">
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
              {imageFile?.name}
            </p>
            <p className="text-xs text-zinc-500">
              {imageFile ? `${(imageFile.size / (1024 * 1024)).toFixed(2)} MB` : ''}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                disabled={disabled}
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-semibold text-amber-600 hover:text-amber-500 dark:text-amber-400 transition-colors"
              >
                Replace image
              </button>
              <button
                type="button"
                disabled={disabled}
                onClick={handleRemove}
                className="text-xs font-semibold text-red-500 hover:text-red-400 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={() => !disabled && fileInputRef.current?.click()}
          className={`cursor-pointer border-2 border-dashed rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center transition-all ${
            error
              ? 'border-red-400 bg-red-50/30 dark:bg-red-950/10'
              : 'border-zinc-300 dark:border-zinc-700 hover:border-amber-500 dark:hover:border-amber-500 hover:bg-amber-50/20 dark:hover:bg-amber-950/10'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            Click to upload book cover
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            PNG, JPG, or WEBP up to 5MB (Hosted on imgbb)
          </p>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500 dark:text-red-400 font-medium">{error}</p>
      )}
    </div>
  );
}
