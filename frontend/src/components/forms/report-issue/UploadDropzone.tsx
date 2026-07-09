import { useRef, useState } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import { Camera, ImagePlus, Trash2, Upload, FileCheck } from 'lucide-react';

interface UploadDropzoneProps {
  file: File | null;
  previewUrl: string | null;
  onFileSelected: (file: File) => void;
  onClear: () => void;
}

const FORMAT_LABEL = 'Supports: JPG, PNG, HEIC, WebP (Max 10 MB)';

function UploadDropzone({ file, previewUrl, onFileSelected, onClear }: UploadDropzoneProps) {
  const fileInputRef   = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onFileSelected(f);
    e.target.value = '';
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) onFileSelected(f);
  };

  return (
    <section className="gov-card p-6 shadow-sm">
      {/* Label */}
      <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
        Evidence Upload
      </p>
      <h2 className="mt-1 text-lg font-bold text-slate-900">
        Capture or upload a civic issue photo
      </h2>
      <p className="text-xs text-slate-500 mt-1 font-semibold">{FORMAT_LABEL}</p>

      {/* Drop zone */}
      <div
        className={[
          'group relative mt-5 overflow-hidden rounded-2xl border-2 border-dashed p-8 transition-all duration-300',
          isDragging
            ? 'border-blue-600 bg-blue-50/50 scale-[1.002]'
            : 'border-slate-200 bg-slate-50/30 hover:border-blue-400 hover:bg-slate-50/50',
        ].join(' ')}
        onDragOver={handleDragOver}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {previewUrl ? (
          /* ── Preview mode ───────────────────────────── */
          <div className="relative flex flex-col items-center gap-6 sm:flex-row sm:items-start text-left">
            <div className="relative overflow-hidden rounded-xl border border-slate-200 shadow-sm flex-shrink-0">
              <img
                src={previewUrl}
                alt="Selected civic issue preview"
                className="h-44 w-60 object-cover transition duration-300 group-hover:scale-[1.015]"
              />
            </div>
            <div className="flex-1 space-y-2 min-w-0">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-green-700">
                <FileCheck className="h-4 w-4" />
                Evidence Selected
              </div>
              <p className="text-sm font-bold text-slate-900 truncate">{file?.name}</p>
              <p className="text-xs text-slate-500 font-semibold">
                {file ? `${(file.size / 1024).toFixed(0)} KB · ${file.type}` : ''}
              </p>

              <div className="flex flex-wrap gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  <Upload className="h-3.5 w-3.5" />
                  Replace
                </button>
                <button
                  type="button"
                  onClick={onClear}
                  className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100 transition"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ── Empty mode ─────────────────────────────── */
          <div className="flex flex-col items-center gap-5 py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 transition-transform duration-300 group-hover:scale-105 shadow-sm">
              <ImagePlus className="h-7 w-7" strokeWidth={2} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Drag & drop your issue photo here</p>
              <p className="mt-1 text-xs text-slate-500 font-semibold">
                or use the buttons below to browse files or capture
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mt-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                <Upload className="h-4 w-4" />
                Browse Files
              </button>
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-5 py-2.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition"
              >
                <Camera className="h-4 w-4" />
                Use Camera
              </button>
            </div>
          </div>
        )}
      </div>

      <input ref={fileInputRef}   type="file" accept="image/*"                onChange={handleFileInputChange} className="sr-only" />
      <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleFileInputChange} className="sr-only" />
    </section>
  );
}

export default UploadDropzone;
