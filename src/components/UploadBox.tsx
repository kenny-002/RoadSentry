'use client';

import React, { useState, useRef } from 'react';
import { Camera, ImageIcon, Trash2, CheckCircle, Loader2, RefreshCw } from 'lucide-react';

interface UploadBoxProps {
  onFileSelect: (url: string) => void;
  selectedFileUrl?: string;
  onClear: () => void;
}

export default function UploadBox({ onFileSelect, selectedFileUrl, onClear }: UploadBoxProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [source, setSource] = useState<'camera' | 'gallery' | null>(null);

  // Gallery input — accepts any image from file system / gallery
  const galleryInputRef = useRef<HTMLInputElement>(null);
  // Camera input — on mobile opens camera directly; on desktop falls back to file picker
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File, src: 'camera' | 'gallery') => {
    setSource(src);
    setIsUploading(true);
    // Convert to base64 data URL so the image survives navigation (blob URLs die on page change)
    const reader = new FileReader();
    reader.onloadend = () => {
      setIsUploading(false);
      if (reader.result) {
        onFileSelect(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0], 'gallery');
    }
  };

  const handleCameraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0], 'camera');
    }
  };

  const handleClear = () => {
    setSource(null);
    // Reset both inputs so same file can be re-selected
    if (galleryInputRef.current) galleryInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
    onClear();
  };

  return (
    <div className="w-full space-y-3">
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        Upload Photo Proof
      </label>

      {/* Hidden inputs */}
      {/* Gallery input — opens photos/files */}
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        capture={undefined}
        className="hidden"
        onChange={handleGalleryChange}
      />
      {/* Camera input — on mobile directly opens camera */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleCameraChange}
      />

      {selectedFileUrl ? (
        /* ── Preview of uploaded photo ── */
        <div className="relative rounded-2xl border border-slate-200 dark:border-navy-700 overflow-hidden group aspect-[16/9] max-h-64 w-full flex items-center justify-center bg-slate-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={selectedFileUrl}
            alt="Uploaded issue proof"
            className="w-full h-full object-cover"
          />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
            <p className="text-white text-xs font-bold">Replace or remove photo</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all active:scale-95 shadow-lg"
              >
                <Camera className="h-4 w-4" />
                Retake
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all active:scale-95 shadow-lg"
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </button>
            </div>
          </div>

          {/* Success badge */}
          <div className="absolute top-3 left-3 bg-emerald-500/90 text-white px-2.5 py-1 rounded-lg text-[10px] font-extrabold flex items-center gap-1.5 backdrop-blur-md shadow">
            <CheckCircle className="h-3.5 w-3.5" />
            <span>{source === 'camera' ? 'Camera Photo' : 'Gallery Photo'} · AI Ready</span>
          </div>

          {/* Mobile-visible remove button (always visible, not just on hover) */}
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-3 right-3 sm:hidden bg-red-600/90 hover:bg-red-700 text-white rounded-full p-1.5 shadow-lg backdrop-blur-md"
            title="Remove photo"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ) : isUploading ? (
        /* ── Uploading state ── */
        <div className="w-full rounded-2xl border-2 border-dashed border-blue-400 bg-blue-500/5 aspect-[16/9] max-h-56 flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
          <div className="text-center">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Processing Photo...</p>
            <p className="text-xs text-slate-400 mt-0.5">Running AI size validation</p>
          </div>
        </div>
      ) : (
        /* ── Upload choice buttons ── */
        <div className="space-y-3">
          {/* Two large tap-friendly buttons */}
          <div className="grid grid-cols-2 gap-3">
            {/* Open Camera */}
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="group flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border-2 border-dashed border-blue-300 dark:border-blue-700 bg-blue-500/5 dark:bg-blue-500/8 hover:bg-blue-500/10 dark:hover:bg-blue-500/15 hover:border-blue-500 transition-all duration-200 active:scale-[0.97] cursor-pointer min-h-[130px]"
            >
              <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                <Camera className="h-7 w-7 text-blue-500" />
              </div>
              <div className="text-center">
                <p className="text-sm font-extrabold text-slate-800 dark:text-white">Open Camera</p>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">Take a photo now</p>
              </div>
            </button>

            {/* Upload from Gallery */}
            <button
              type="button"
              onClick={() => galleryInputRef.current?.click()}
              className="group flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border-2 border-dashed border-emerald-300 dark:border-emerald-700 bg-emerald-500/5 dark:bg-emerald-500/8 hover:bg-emerald-500/10 dark:hover:bg-emerald-500/15 hover:border-emerald-500 transition-all duration-200 active:scale-[0.97] cursor-pointer min-h-[130px]"
            >
              <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
                <ImageIcon className="h-7 w-7 text-emerald-500" />
              </div>
              <div className="text-center">
                <p className="text-sm font-extrabold text-slate-800 dark:text-white">Gallery</p>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">Choose from photos</p>
              </div>
            </button>
          </div>

          <p className="text-center text-[10px] text-slate-400 dark:text-slate-500">
            Supports JPG, PNG · Max 15MB · Photo is used for AI severity analysis
          </p>
        </div>
      )}
    </div>
  );
}
