"use client";

import { useTheme } from "@/components/ThemeProvider";
import { Moon, Sun, ShieldCheck, UserCircle, SignOut, Clock, House } from "@phosphor-icons/react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { useAuthModal } from "@/context/AuthModalContext";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const { openModal } = useAuthModal();
  const supabase = createClient();
  
  // Dynamic Island Scroll Animation
  const { scrollY } = useScroll();

  const navWidth = useTransform(scrollY, [0, 100], ["100%", "auto"]);
  const navPaddingY = useTransform(scrollY, [0, 100], ["12px", "8px"]);
  const navPaddingX = useTransform(scrollY, [0, 100], ["20px", "16px"]);
  const navBgOpacity = useTransform(scrollY, [0, 100], [0.4, 0.7]);
  const navBorderRadius = useTransform(scrollY, [0, 100], ["16px", "32px"]);
  const navBoxShadow = useTransform(scrollY, [0, 100], ["0 0px 0px 0px rgba(0,0,0,0)", "0 10px 40px -10px rgba(0,0,0,0.15)"]);

  // Progressive text hiding
  const logoWidth = useTransform(scrollY, [0, 100], [85, 0]);
  const textWidth = useTransform(scrollY, [0, 100], [65, 0]);
  const textOpacity = useTransform(scrollY, [0, 80], [1, 0]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowDropdown(false);
  };

  const handleHistoryClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      openModal();
    }
  };

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-40 flex justify-center w-full pointer-events-none px-4 sm:px-6 pt-4"
    >
      <motion.nav
        className="pointer-events-auto flex items-center justify-between shadow-sm backdrop-blur-xl transition-shadow duration-300"
        style={{
          width: navWidth,
          paddingTop: navPaddingY,
          paddingBottom: navPaddingY,
          paddingLeft: navPaddingX,
          paddingRight: navPaddingX,
          borderRadius: navBorderRadius,
          background: `rgba(var(--bg-secondary-rgb), ${navBgOpacity.get()})`,
          border: "1px solid var(--border)",
          boxShadow: navBoxShadow,
        }}
      >
        {/* Left Section: Logo */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:scale-105"
              style={{ background: "var(--accent-subtle)" }}
            >
              <ShieldCheck
                size={20}
                weight="duotone"
                style={{ color: "var(--accent)" }}
              />
            </div>
            <motion.div 
              className="flex flex-col overflow-hidden justify-center"
              style={{ width: logoWidth, opacity: textOpacity }}
            >
              <span
                className="text-sm font-semibold tracking-tight leading-none whitespace-nowrap pl-2.5"
                style={{ color: "var(--text-primary)" }}
              >
                FoodCheck
              </span>
            </motion.div>
          </Link>
        </div>

        {/* Center Section: Links */}
        <div className="flex items-center gap-1 mx-2 sm:mx-4">
          <Link href="/">
            <button 
              className="h-9 px-3 rounded-full flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)] hover:bg-[var(--bg-tertiary)]"
              style={{ color: "var(--text-secondary)" }}
            >
              <House size={18} weight="bold" className="shrink-0" />
              <motion.div 
                className="overflow-hidden flex items-center hidden sm:flex"
                style={{ width: textWidth, opacity: textOpacity }}
              >
                <span className="text-sm font-medium whitespace-nowrap pl-2">
                  Beranda
                </span>
              </motion.div>
            </button>
          </Link>

          <Link href="/history" onClick={handleHistoryClick}>
            <button 
              className="h-9 px-3 rounded-full flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)] hover:bg-[var(--bg-tertiary)]"
              style={{ color: "var(--text-secondary)" }}
            >
              <Clock size={18} weight="bold" className="shrink-0" />
              <motion.div 
                className="overflow-hidden flex items-center hidden sm:flex"
                style={{ width: textWidth, opacity: textOpacity }}
              >
                <span className="text-sm font-medium whitespace-nowrap pl-2">
                  Riwayat
                </span>
              </motion.div>
            </button>
          </Link>
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="relative flex items-center w-12 h-7 rounded-full p-1 transition-colors duration-300 focus:outline-none cursor-pointer"
            style={{
              background: "var(--bg-tertiary)",
              border: "1px solid var(--border)",
            }}
            aria-label="Toggle theme"
          >
            <div className="absolute inset-0 w-full flex items-center justify-between px-1.5 pointer-events-none" style={{ color: "var(--text-tertiary)" }}>
              <Moon size={12} weight="bold" />
              <Sun size={12} weight="bold" />
            </div>
            
            <motion.div
              className="w-5 h-5 rounded-full flex items-center justify-center shadow-sm relative z-10"
              style={{
                background: "var(--bg-primary)",
                color: "var(--text-primary)",
                border: "1px solid var(--border)"
              }}
              initial={false}
              animate={{
                x: theme === "dark" ? 0 : 20,
              }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              {theme === "dark" ? (
                <Moon size={10} weight="fill" />
              ) : (
                <Sun size={10} weight="fill" />
              )}
            </motion.div>
          </button>

          {/* Auth UI */}
          <div className="relative flex items-center">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-8 h-8 rounded-full overflow-hidden border transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  style={{ borderColor: "var(--border)" }}
                >
                  {user.user_metadata?.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.user_metadata.avatar_url}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-secondary)]">
                      <UserCircle size={20} weight="fill" />
                    </div>
                  )}
                </button>

                <AnimatePresence>
                  {showDropdown && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowDropdown(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-3 w-48 rounded-2xl shadow-xl z-50 overflow-hidden border backdrop-blur-xl"
                        style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}
                      >
                        <div className="px-4 py-3 border-b" style={{ borderColor: "var(--border)" }}>
                          <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
                            {user.user_metadata?.full_name || user.email}
                          </p>
                        </div>
                        <div className="p-2">
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-3 py-2 text-sm flex items-center gap-2 rounded-xl transition-colors text-red-500 hover:bg-red-500/10"
                          >
                            <SignOut size={16} />
                            Keluar
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button 
                onClick={openModal}
                className="h-8 px-4 rounded-full text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent)] hover:scale-105"
                style={{ background: "var(--accent)", color: "var(--text-inverse)", boxShadow: "0 4px 14px 0 rgba(0,0,0,0.15)" }}
              >
                Masuk
              </button>
            )}
          </div>
        </div>
      </motion.nav>
    </motion.header>
  );
}
