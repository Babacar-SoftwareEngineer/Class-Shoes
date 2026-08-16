'use client';

import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import Image from 'next/image';
import { API_BASE_URL } from '../lib/api';

export default function ImageUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (imageUrl?.startsWith('blob:')) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] ?? null;
    setFile(selectedFile);
    setImageUrl(null);
    setError(null);
  };

  const handleUpload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      setError('Sélectionnez une image avant de continuer.');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });
      const data: { url?: string; error?: string } = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(data.error || "L'image n'a pas pu être envoyée.");
      }

      setImageUrl(data.url);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Une erreur est survenue.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleUpload} className="space-y-5">
      <div>
        <label htmlFor="product-image" className="mb-2 block text-sm font-semibold text-(--ink)">
          Image du produit
        </label>
        <input
          id="product-image"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full rounded-lg border border-(--line) bg-white p-3 text-sm text-(--ink)"
        />
        <p className="mt-2 text-xs text-(--muted)">Image uniquement, 5 Mo maximum.</p>
      </div>

      <button
        type="submit"
        disabled={!file || isUploading}
        className="inline-flex rounded-full bg-(--ink) px-6 py-3 text-sm font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isUploading ? 'Envoi en cours...' : "Uploader l'image"}
      </button>

      {error && <p className="text-sm text-red-700" role="alert">{error}</p>}

      {imageUrl && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-green-700">Image uploadée avec succès.</p>
          <div className="relative h-80 w-full">
            <Image src={imageUrl} alt="Image uploadée" fill sizes="(max-width: 768px) 100vw, 672px" className="rounded-lg object-contain" />
          </div>
          <a href={imageUrl} target="_blank" rel="noreferrer" className="break-all text-xs text-(--muted) underline">
            {imageUrl}
          </a>
        </div>
      )}
    </form>
  );
}
