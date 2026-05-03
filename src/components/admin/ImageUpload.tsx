'use client';
import { useState, useCallback } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export function ImageUpload({ images, onChange, maxImages = 6 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (images.length >= maxImages) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    setUploading(true);
    try {
      const uploadPromises = acceptedFiles.slice(0, maxImages - images.length).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        if (data.url) return data.url;
        // Fallback: create a local object URL for demo when cloudinary is not configured
        return URL.createObjectURL(file);
      });

      const urls = await Promise.all(uploadPromises);
      onChange([...images, ...urls.filter(Boolean)]);
    } catch (error) {
      console.error('Upload error:', error);
      // Fallback: use object URLs for local demo
      const fallbackUrls = acceptedFiles.slice(0, maxImages - images.length).map(
        (file) => URL.createObjectURL(file)
      );
      onChange([...images, ...fallbackUrls]);
    } finally {
      setUploading(false);
    }
  }, [images, maxImages, onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    maxFiles: maxImages - images.length,
  });

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {images.map((url, i) => (
            <div key={i} className="relative aspect-[3/4] rounded-lg overflow-hidden border group">
              <Image src={url} alt={`Product ${i + 1}`} fill className="object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/70 text-white opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
              {i === 0 && (
                <div className="absolute bottom-2 left-2 bg-[#C9A96E] text-[#0F0F0F] text-xs px-2 py-0.5 rounded-full font-medium">
                  Main
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Dropzone */}
      {images.length < maxImages && (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition
            ${isDragActive ? 'border-[#C9A96E] bg-[#C9A96E]/5' : 'border-border hover:border-[#C9A96E]/50'}
            ${uploading ? 'opacity-50 pointer-events-none' : ''}
          `}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <Loader2 className="w-12 h-12 mx-auto animate-spin text-[#C9A96E]" />
          ) : (
            <>
              <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm font-medium mb-1">
                {isDragActive ? 'Drop images here' : 'Drag & drop images here'}
              </p>
              <p className="text-xs text-muted-foreground">
                or click to browse ({images.length}/{maxImages} uploaded)
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
