"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, X, ArrowsClockwise } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

interface WebCameraProps {
  onCapture: (file: File) => void;
  onClose: () => void;
}

export default function WebCamera({ onCapture, onClose }: WebCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [isInitializing, setIsInitializing] = useState(true);

  const startCamera = async (mode: "user" | "environment") => {
    setIsInitializing(true);
    setError(null);

    // Stop existing stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode },
        audio: false,
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err: any) {
      console.error("Camera error:", err);
      if (err.name === "NotAllowedError") {
        setError("Izin kamera ditolak. Izinkan akses kamera di pengaturan browser.");
      } else if (err.name === "NotFoundError") {
        setError("Tidak ada kamera yang terdeteksi di perangkat ini.");
      } else {
        setError("Gagal mengakses kamera. Pastikan Anda menggunakan HTTPS.");
      }
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    startCamera(facingMode);

    return () => {
      // Cleanup stream on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  const handleCapture = () => {
    if (!videoRef.current) return;

    // Batasi dimensi maksimal agar iOS Safari tidak kehabisan memori (layar hitam)
    const MAX_DIMENSION = 1920;
    let targetWidth = videoRef.current.videoWidth;
    let targetHeight = videoRef.current.videoHeight;

    if (targetWidth > MAX_DIMENSION || targetHeight > MAX_DIMENSION) {
      const ratio = Math.min(MAX_DIMENSION / targetWidth, MAX_DIMENSION / targetHeight);
      targetWidth = Math.round(targetWidth * ratio);
      targetHeight = Math.round(targetHeight * ratio);
    }

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d");
    
    if (ctx) {
      // Jika kamera depan, flip gambarnya (opsional, tapi UI video sudah diflip)
      if (facingMode === "user") {
        ctx.translate(targetWidth, 0);
        ctx.scale(-1, 1);
      }
      
      ctx.drawImage(videoRef.current, 0, 0, targetWidth, targetHeight);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const file = new File([blob], `foodcheck_${Date.now()}.jpg`, {
              type: "image/jpeg",
            });
            onCapture(file);
          }
        },
        "image/jpeg",
        0.8
      );
    }
  };

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black flex flex-col"
      >
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/60 to-transparent">
          <button
            onClick={onClose}
            className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition"
          >
            <X size={24} />
          </button>
          
          <button
            onClick={toggleCamera}
            className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition"
          >
            <ArrowsClockwise size={24} />
          </button>
        </div>

        {/* Video feed */}
        <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-black">
          {error ? (
            <div className="text-white text-center p-6 bg-red-500/20 rounded-2xl max-w-sm">
              <p className="mb-4">{error}</p>
              <button
                onClick={() => startCamera(facingMode)}
                className="px-4 py-2 bg-white text-black rounded-lg font-medium"
              >
                Coba Lagi
              </button>
            </div>
          ) : (
            <>
              {isInitializing && (
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  <div className="h-8 w-8 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                </div>
              )}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  isInitializing ? "opacity-0" : "opacity-100"
                } ${facingMode === "user" ? "scale-x-[-1]" : ""}`}
              />
            </>
          )}
        </div>

        {/* Bottom bar */}
        <div className="h-32 bg-black flex items-center justify-center pb-safe">
          <button
            onClick={handleCapture}
            disabled={!!error || isInitializing}
            className="w-20 h-20 rounded-full border-4 border-white/50 flex items-center justify-center disabled:opacity-50"
          >
            <div className="w-16 h-16 bg-white rounded-full active:scale-95 transition-transform" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
