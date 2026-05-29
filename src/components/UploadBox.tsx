'use client';

import React, { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, Trash2, CheckCircle, UploadCloud, Loader2 } from 'lucide-react';

interface UploadBoxProps {
  onFileSelect: (url: string) => void;
  selectedFileUrl?: string;
  onClear: () => void;
}

export default function UploadBox({ onFileSelect, selectedFileUrl, onClear }: UploadBoxProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const simulateUpload = (fileName: string) => {
    setIsUploading(true);
    // Simulate a network upload delay
    setTimeout(() => {
      setIsUploading(false);
      // Give a beautiful mock image from Unsplash depending on random factor or type
      const mockImages = [
        'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1584467541268-b040f83be3fd?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=800&auto=format&fit=crop'
      ];
      const selectedImage = mockImages[Math.floor(Math.random() * mockImages.length)];
      onFileSelect(selectedImage);
    }, 1500);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      simulateUpload(file.name);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      simulateUpload(file.name);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
        Upload Photo / Video Proof
      </label>

      {selectedFileUrl ? (
        <div className="relative rounded-xl border border-slate-200 dark:border-navy-700 overflow-hidden group aspect-[16/9] max-h-56 w-full flex items-center justify-center bg-slate-900">
          <img 
            src={selectedFileUrl} 
            alt="Uploaded issue proof" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={onClear}
              className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-full transition-transform hover:scale-110 shadow-lg"
              title="Delete photo"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
          <div className="absolute top-3 right-3 bg-emerald-500/90 text-white px-2 py-1 rounded text-[10px] font-bold flex items-center space-x-1 backdrop-blur-md">
            <CheckCircle className="h-3.5 w-3.5" />
            <span>AI Ready</span>
          </div>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
          className={`relative rounded-xl border-2 border-dashed aspect-[16/9] max-h-56 w-full flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-200 ${
            isDragActive 
              ? 'border-blue-500 bg-blue-600/5 dark:bg-blue-600/10' 
              : 'border-slate-200 dark:border-navy-700 hover:border-slate-300 dark:hover:border-navy-600 hover:bg-slate-50/50 dark:hover:bg-navy-900/30'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={handleChange}
          />

          {isUploading ? (
            <div className="flex flex-col items-center space-y-3">
              <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
              <div>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">AI Pre-processing File...</p>
                <p className="text-xs text-slate-400 mt-1">Generating cloud link & running size validation</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <div className="p-3 bg-slate-100 dark:bg-navy-900/80 rounded-xl text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-navy-800/80">
                <UploadCloud className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                  Drag & drop image, or <span className="text-blue-500 hover:underline">browse</span>
                </p>
                <p className="text-xs text-slate-400 mt-1">Supports PNG, JPG, MP4 (Max 15MB)</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
