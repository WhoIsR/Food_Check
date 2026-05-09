"use client";

import { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ImageSquare, X, Eye } from "@phosphor-icons/react";
import WebCamera from "./WebCamera";

interface ImageInputProps {
  onImageSelect: (file: File | null) => void;
  currentImage: File | null;
  scanMode: "AUTO" | "OCR";
  onScanModeChange: (mode: "AUTO" | "OCR") => void;
}

export default function ImageInput({
  onImageSelect,
  currentImage,
  scanMode,
  onScanModeChange,
}: ImageInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  const processFile = useCallback(
    (file: File) => {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("Ukuran gambar terlalu besar (Maks 10MB).");
        return;
      }

      onImageSelect(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    },
    [onImageSelect]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      processFile(file);

      // Reset input so same file can be selected again
      e.target.value = "";
    },
    [processFile]
  );

  const handleCameraCapture = useCallback(
    (file: File) => {
      processFile(file);
      setShowCamera(false);
    },
    [processFile]
  );

  const handleRemove = useCallback(() => {
    onImageSelect(null);
    setPreview(null);
    setShowPreview(false);
  }, [onImageSelect]);

  return (
    <>
      {/* Hidden file input for gallery */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        aria-hidden="true"
      />

      <div className="space-y-4">
        {/* Scan Mode Toggle */}
        <div className="flex bg-[var(--bg-tertiary)] p-1.5 rounded-2xl w-full relative">
          <button
            onClick={() => onScanModeChange("AUTO")}
            className="flex-1 py-2.5 text-xs font-semibold rounded-xl z-10 transition-colors"
            style={{ color: scanMode === "AUTO" ? "var(--text-inverse)" : "var(--text-secondary)" }}
          >
            Makanan Langsung
          </button>
          <button
            onClick={() => onScanModeChange("OCR")}
            className="flex-1 py-2.5 text-xs font-semibold rounded-xl z-10 transition-colors"
            style={{ color: scanMode === "OCR" ? "var(--text-inverse)" : "var(--text-secondary)" }}
          >
            Label Kemasan (OCR)
          </button>
          <motion.div
            className="absolute top-1.5 bottom-1.5 rounded-xl shadow-sm"
            style={{ background: "var(--accent)", width: "calc(50% - 6px)" }}
            initial={false}
            animate={{ left: scanMode === "AUTO" ? "6px" : "calc(50%)" }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        </div>

        {/* Dynamic Hint */}
        <p className="text-xs text-center" style={{ color: "var(--text-tertiary)" }}>
          {scanMode === "AUTO" 
            ? "Foto makanan langsung agar AI menebak bahan pembuatnya." 
            : "Foto bagian tabel 'Komposisi' atau daftar bahan di kemasan produk."}
        </p>

        <AnimatePresence mode="wait">
          {!currentImage ? (
            /* Upload buttons */
            <motion.div
              key="buttons"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex gap-2"
            >
              {/* Camera button */}
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => setShowCamera(true)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium cursor-pointer transition-colors duration-200"
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px dashed var(--border-primary)",
                  color: "var(--text-secondary)",
                }}
              >
                <Camera size={18} weight="duotone" style={{ color: "var(--accent)" }} />
                <span className="hidden sm:inline">Ambil Foto</span>
                <span className="sm:hidden">Kamera</span>
              </motion.button>

              {/* Gallery button */}
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium cursor-pointer transition-colors duration-200"
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px dashed var(--border-primary)",
                  color: "var(--text-secondary)",
                }}
              >
                <ImageSquare size={18} weight="duotone" style={{ color: "var(--accent)" }} />
                <span className="hidden sm:inline">Pilih Gambar</span>
                <span className="sm:hidden">Galeri</span>
              </motion.button>
            </motion.div>
          ) : (
            /* Image preview card */
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
              style={{
                background: "var(--accent-subtle)",
                border: "1px solid var(--accent)",
              }}
            >
              {/* Thumbnail */}
              {preview && (
                <div
                  className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0"
                  style={{
                    background: "var(--bg-tertiary)",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preview}
                    alt="Preview label"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* File info */}
              <div className="flex-1 min-w-0">
                <p
                  className="text-xs font-medium truncate"
                  style={{ color: "var(--text-primary)" }}
                >
                  {currentImage.name}
                </p>
                <p
                  className="text-[11px]"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {(currentImage.size / 1024).toFixed(0)} KB — Siap dianalisis
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => setShowPreview(true)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-colors duration-150"
                  style={{
                    background: "var(--bg-secondary)",
                    color: "var(--text-secondary)",
                  }}
                  title="Lihat preview"
                >
                  <Eye size={14} />
                </button>
                <button
                  onClick={handleRemove}
                  className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-colors duration-150"
                  style={{
                    background: "var(--status-danger-bg)",
                    color: "var(--status-danger)",
                  }}
                  title="Hapus gambar"
                >
                  <X size={14} weight="bold" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Web Camera Modal */}
      {showCamera && (
        <WebCamera
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      )}

      {/* Full preview modal */}
      <AnimatePresence>
        {showPreview && preview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.8)" }}
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-lg w-full rounded-2xl overflow-hidden"
              style={{ background: "var(--bg-primary)" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Preview gambar label"
                className="w-full max-h-[70vh] object-contain"
              />
              <button
                onClick={() => setShowPreview(false)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
                style={{
                  background: "rgba(0,0,0,0.5)",
                  color: "white",
                }}
              >
                <X size={16} weight="bold" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
