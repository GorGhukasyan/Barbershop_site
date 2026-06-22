'use client';
import { useState } from 'react';

const SESSION_KEY = 'ga_visualizer_count';
const MAX_GENERATIONS = 3;

export type VisualizerStep = 'upload' | 'select' | 'generating' | 'result' | 'error';

export function useVisualizer() {
  const [step, setStep] = useState<VisualizerStep>('upload');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [selectedStyleId, setSelectedStyleId] = useState<string>('');
  const [resultImage, setResultImage] = useState<string>('');
  const [error, setError] = useState<string>('');

  function getRemainingGenerations(): number {
    if (typeof window === 'undefined') return MAX_GENERATIONS;
    const count = parseInt(sessionStorage.getItem(SESSION_KEY) ?? '0', 10);
    return Math.max(0, MAX_GENERATIONS - count);
  }

  function incrementGenerationCount() {
    const count = parseInt(sessionStorage.getItem(SESSION_KEY) ?? '0', 10);
    sessionStorage.setItem(SESSION_KEY, String(count + 1));
  }

  function handlePhotoUpload(file: File) {
    setPhoto(file);
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
    setStep('select');
  }

  function handleStyleSelect(styleId: string) {
    setSelectedStyleId(styleId);
  }

  async function generate() {
    if (!photo || !selectedStyleId) return;

    const remaining = getRemainingGenerations();
    if (remaining <= 0) {
      setError('rate_limit');
      setStep('error');
      return;
    }

    setStep('generating');
    setError('');

    try {
      const formData = new FormData();
      formData.append('photo', photo);
      formData.append('hairstyleId', selectedStyleId);

      const res = await fetch('/api/ai/visualizer', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error ?? 'Unknown error');
        setStep('error');
        return;
      }

      incrementGenerationCount();
      setResultImage(`data:${data.data.mimeType};base64,${data.data.imageBase64}`);
      setStep('result');
    } catch {
      setError('network_error');
      setStep('error');
    }
  }

  function reset() {
    setStep('upload');
    setPhoto(null);
    setPhotoPreview('');
    setSelectedStyleId('');
    setResultImage('');
    setError('');
  }

  return {
    step, setStep,
    photo, photoPreview, handlePhotoUpload,
    selectedStyleId, handleStyleSelect,
    resultImage,
    error, setError,
    generate, reset,
    getRemainingGenerations,
  };
}
