"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, EnvelopeSimple, LockKey, GoogleLogo } from "@phosphor-icons/react";
import { createClient } from "@/utils/supabase/client";
import { useAuthModal } from "@/context/AuthModalContext";

export default function AuthModal() {
  const { isOpen, closeModal } = useAuthModal();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        closeModal();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setSuccessMsg(
          "Registrasi berhasil! Silakan periksa email Anda untuk tautan konfirmasi."
        );
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setErrorMsg("Gagal login dengan Google.");
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setIsLogin(true);
    setEmail("");
    setPassword("");
    setErrorMsg("");
    setSuccessMsg("");
  };

  return (
    <AnimatePresence onExitComplete={resetState}>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            onClick={closeModal}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
              mass: 0.8,
            }}
            className="relative w-full max-w-[400px] rounded-3xl overflow-hidden shadow-2xl"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              boxShadow: "0 24px 64px -12px rgba(0, 0, 0, 0.3)",
            }}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 rounded-full z-10 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              style={{
                color: "var(--text-tertiary)",
                background: "var(--bg-tertiary)",
              }}
            >
              <X size={16} weight="bold" />
            </button>

            <div className="p-8 pb-6">
              <div className="text-center mb-8">
                <h2
                  className="text-2xl font-bold tracking-tight"
                  style={{ color: "var(--text-primary)" }}
                >
                  {isLogin ? "Selamat Datang" : "Buat Akun"}
                </h2>
                <p
                  className="mt-2 text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {isLogin
                    ? "Masuk untuk melanjutkan ke FoodCheck"
                    : "Bergabunglah untuk menganalisis dan menyimpan makanan Anda"}
                </p>
              </div>

              <form onSubmit={handleAuth} className="space-y-4">
                <div className="space-y-3">
                  <div className="relative">
                    <div
                      className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      <EnvelopeSimple size={18} weight="duotone" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Alamat Email"
                      className="block w-full pl-10 pr-4 py-3 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                      style={{
                        background: "var(--bg-primary)",
                        color: "var(--text-primary)",
                        border: "1px solid var(--border)",
                      }}
                    />
                  </div>
                  <div className="relative">
                    <div
                      className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      <LockKey size={18} weight="duotone" />
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Kata Sandi"
                      className="block w-full pl-10 pr-4 py-3 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                      style={{
                        background: "var(--bg-primary)",
                        color: "var(--text-primary)",
                        border: "1px solid var(--border)",
                      }}
                    />
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {errorMsg && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-xs text-center"
                      style={{ color: "var(--status-danger)" }}
                    >
                      {errorMsg}
                    </motion.div>
                  )}
                  {successMsg && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-xs text-center"
                      style={{ color: "var(--status-safe)" }}
                    >
                      {successMsg}
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  style={{
                    background: "var(--accent)",
                    color: "var(--text-inverse)",
                    boxShadow: "var(--shadow-glow)",
                  }}
                >
                  {isLoading ? (
                    <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  ) : isLogin ? (
                    "Masuk"
                  ) : (
                    "Daftar"
                  )}
                </button>
              </form>

              <div className="mt-6 relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t" style={{ borderColor: "var(--border)" }} />
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-widest font-medium">
                  <span className="px-3" style={{ background: "var(--bg-secondary)", color: "var(--text-tertiary)" }}>
                    Atau
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full flex justify-center items-center gap-3 py-3 px-4 rounded-xl text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  style={{
                    background: "var(--bg-primary)",
                    color: "var(--text-primary)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <GoogleLogo size={20} weight="bold" />
                  Lanjutkan dengan Google
                </button>
              </div>
            </div>

            <div
              className="px-8 py-5 text-center text-sm border-t transition-colors"
              style={{
                background: "var(--bg-tertiary)",
                borderColor: "var(--border)",
                color: "var(--text-secondary)",
              }}
            >
              {isLogin ? "Belum punya akun? " : "Sudah punya akun? "}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
                className="font-medium hover:underline focus:outline-none transition-colors"
                style={{ color: "var(--text-primary)" }}
              >
                {isLogin ? "Daftar Sekarang" : "Masuk"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
