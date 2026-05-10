"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CaretLeft,
  Clock,
  Trash,
  MagnifyingGlass,
  ArrowRight,
  ShieldCheck,
  WarningCircle,
  XCircle,
  Funnel,
  TrendUp,
  PencilSimple,
  Check,
  X
} from "@phosphor-icons/react";
import Link from "next/link";
import IngredientCard from "@/components/IngredientCard";

type ScanHistory = {
  id: string;
  product_name: string;
  clean_score: number;
  health_status: string;
  summary: string;
  ingredients: any[];
  created_at: string;
};

export default function HistoryPage() {
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<ScanHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // Edit Name State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "SAFE" | "WARN" | "DANGER">("ALL");

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push("/?auth=true"); // Use ?auth=true to trigger AuthModal on home
        return;
      }
      
      setUser(session.user);
      
      const { data, error } = await supabase
        .from("scan_history")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });
        
      if (!error && data) {
        setHistory(data);
      }
      setLoading(false);
    };

    checkAuthAndFetch();
  }, [supabase, router]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Apakah Anda yakin ingin menghapus riwayat ini?")) return;
    
    setHistory((prev) => prev.filter((item) => item.id !== id));
    await supabase.from("scan_history").delete().eq("id", id);
  };

  const handleSaveName = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    const trimmedName = editName.trim();
    if (!trimmedName) {
      setEditingId(null);
      return;
    }

    // Optimistic UI update
    const previousHistory = [...history];
    setHistory((prev) => 
      prev.map((item) => 
        item.id === id ? { ...item, product_name: trimmedName } : item
      )
    );
    setEditingId(null);
    
    // Database update
    const { error } = await supabase
      .from("scan_history")
      .update({ product_name: trimmedName })
      .eq("id", id)
      // also ensure we're updating the user's own row just in case
      .eq("user_id", user?.id);

    if (error) {
      console.error("Gagal menyimpan nama:", error);
      alert("Gagal menyimpan perubahan ke database. Coba lagi.");
      // Revert state if failed
      setHistory(previousHistory);
    }
  };

  const startEditing = (item: ScanHistory, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditName(item.product_name);
    setEditingId(item.id);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Derived Stats
  const stats = useMemo(() => {
    if (!history.length) return { total: 0, avgScore: 0, safe: 0, warn: 0, danger: 0 };
    
    let safe = 0, warn = 0, danger = 0, totalScore = 0;
    history.forEach(item => {
      totalScore += item.clean_score;
      if (item.clean_score >= 80) safe++;
      else if (item.clean_score >= 60) warn++;
      else danger++;
    });

    return {
      total: history.length,
      avgScore: Math.round(totalScore / history.length),
      safe, warn, danger
    };
  }, [history]);

  // Filtered History
  const filteredHistory = useMemo(() => {
    return history.filter(item => {
      const matchesSearch = item.product_name.toLowerCase().includes(searchQuery.toLowerCase());
      let matchesFilter = true;
      if (filterStatus === "SAFE") matchesFilter = item.clean_score >= 80;
      if (filterStatus === "WARN") matchesFilter = item.clean_score >= 60 && item.clean_score < 80;
      if (filterStatus === "DANGER") matchesFilter = item.clean_score < 60;
      
      return matchesSearch && matchesFilter;
    });
  }, [history, searchQuery, filterStatus]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 rounded-full border-2 border-t-[var(--accent)] border-r-transparent border-b-transparent border-l-transparent"
        />
        <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Memuat riwayat...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <button
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-105"
                style={{ background: "var(--bg-tertiary)", color: "var(--text-primary)" }}
              >
                <CaretLeft size={20} weight="bold" />
              </button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
                Riwayat Analisis
              </h1>
              <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                Lihat kembali makanan yang pernah Anda periksa
              </p>
            </div>
          </div>
        </div>

        {history.length > 0 && (
          <>
            {/* Stats Dashboard */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="p-5 rounded-3xl border flex flex-col justify-between"
                style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Total Scan</span>
                  <TrendUp size={20} style={{ color: "var(--accent)" }} />
                </div>
                <div className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>{stats.total}</div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                className="p-5 rounded-3xl border flex flex-col justify-between"
                style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Rata-rata Skor</span>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: stats.avgScore >= 80 ? "var(--status-safe)" : stats.avgScore >= 60 ? "var(--status-warn)" : "var(--status-danger)" }}>
                    <span className="text-[10px] font-bold text-white">{stats.avgScore >= 80 ? "A" : stats.avgScore >= 60 ? "B" : "C"}</span>
                  </div>
                </div>
                <div className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>{stats.avgScore}</div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="p-5 rounded-3xl border flex flex-col justify-between"
                style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Kategori Aman</span>
                  <ShieldCheck size={20} style={{ color: "var(--status-safe)" }} />
                </div>
                <div className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>{stats.safe}</div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                className="p-5 rounded-3xl border flex flex-col justify-between"
                style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Peringatan/Bahaya</span>
                  <WarningCircle size={20} style={{ color: "var(--status-warn)" }} />
                </div>
                <div className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>{stats.warn + stats.danger}</div>
              </motion.div>
            </div>

            {/* Controls (Search & Filter) */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative w-full sm:w-96">
                <MagnifyingGlass 
                  size={18} 
                  className="absolute left-4 top-1/2 -translate-y-1/2" 
                  style={{ color: "var(--text-tertiary)" }} 
                />
                <input
                  type="text"
                  placeholder="Cari nama produk..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  style={{ 
                    background: "var(--bg-secondary)", 
                    color: "var(--text-primary)",
                    border: "1px solid var(--border)"
                  }}
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
                {(["ALL", "SAFE", "WARN", "DANGER"] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className="px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all"
                    style={{
                      background: filterStatus === status ? "var(--text-primary)" : "var(--bg-tertiary)",
                      color: filterStatus === status ? "var(--bg-primary)" : "var(--text-secondary)",
                      border: "1px solid",
                      borderColor: filterStatus === status ? "transparent" : "var(--border)",
                    }}
                  >
                    {status === "ALL" && "Semua"}
                    {status === "SAFE" && "Aman"}
                    {status === "WARN" && "Hati-hati"}
                    {status === "DANGER" && "Bahaya"}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Empty State / Content */}
        {history.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 px-4 rounded-3xl border border-dashed"
            style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}
          >
            <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6" style={{ background: "var(--bg-tertiary)" }}>
              <Clock size={32} style={{ color: "var(--text-tertiary)" }} />
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Belum Ada Riwayat</h2>
            <p className="max-w-md mx-auto mb-8 text-sm" style={{ color: "var(--text-secondary)" }}>
              Anda belum melakukan scan makanan apapun. Yuk, mulai periksa makanan pertama Anda untuk mengetahui seberapa aman bahan yang terkandung di dalamnya.
            </p>
            <Link href="/">
              <button 
                className="px-6 py-3 rounded-full text-sm font-semibold transition-all hover:scale-105"
                style={{ background: "var(--accent)", color: "var(--text-inverse)", boxShadow: "var(--shadow-glow)" }}
              >
                Mulai Scan Pertama
              </button>
            </Link>
          </motion.div>
        ) : filteredHistory.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Tidak ada hasil yang sesuai dengan filter Anda.</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnimatePresence>
              {filteredHistory.map((item, index) => {
                const isSafe = item.clean_score >= 80;
                const isWarn = item.clean_score >= 60 && item.clean_score < 80;
                
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    key={item.id}
                    className="rounded-3xl border overflow-hidden transition-shadow hover:shadow-xl group"
                    style={{
                      background: "var(--bg-secondary)",
                      borderColor: expandedId === item.id ? "var(--accent)" : "var(--border)",
                    }}
                  >
                    <div
                      className="p-5 sm:p-6 cursor-pointer relative"
                      onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                    >
                      {/* Score Badge */}
                      <div className="absolute top-6 right-6 flex items-center gap-2">
                        <div 
                          className="px-3 py-1 rounded-full text-xs font-bold border"
                          style={{
                            background: isSafe ? "var(--status-safe-bg)" : isWarn ? "var(--status-warn-bg)" : "var(--status-danger-bg)",
                            color: isSafe ? "var(--status-safe)" : isWarn ? "var(--status-warn)" : "var(--status-danger)",
                            borderColor: isSafe ? "var(--status-safe-border)" : isWarn ? "var(--status-warn-border)" : "var(--status-danger-border)"
                          }}
                        >
                          Skor: {item.clean_score}
                        </div>
                      </div>

                      <div className="pr-24">
                        <p className="text-xs mb-1 font-medium" style={{ color: "var(--text-tertiary)" }}>
                          {formatDate(item.created_at)}
                        </p>
                        
                        {editingId === item.id ? (
                          <div className="flex items-center gap-2 mb-2" onClick={e => e.stopPropagation()}>
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleSaveName(item.id);
                                if (e.key === "Escape") setEditingId(null);
                              }}
                              autoFocus
                              className="px-2 py-1 text-lg font-bold rounded-lg border w-full focus:outline-none focus:ring-2"
                              style={{ 
                                background: "var(--bg-primary)",
                                color: "var(--text-primary)",
                                borderColor: "var(--accent)",
                                ringColor: "var(--accent)"
                              }}
                            />
                            <button
                              onClick={(e) => handleSaveName(item.id, e)}
                              className="p-1.5 rounded-lg bg-green-500/10 text-green-500 transition-colors hover:bg-green-500/20"
                            >
                              <Check size={18} weight="bold" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); setEditingId(null); }}
                              className="p-1.5 rounded-lg bg-red-500/10 text-red-500 transition-colors hover:bg-red-500/20"
                            >
                              <X size={18} weight="bold" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 mb-2 group/title">
                            <h3 className="font-bold text-lg line-clamp-1" style={{ color: "var(--text-primary)" }} title={item.product_name}>
                              {item.product_name}
                            </h3>
                            <button
                              onClick={(e) => startEditing(item, e)}
                              className="p-1 rounded-md opacity-0 group-hover/title:opacity-100 transition-opacity hover:bg-[var(--bg-tertiary)]"
                              style={{ color: "var(--text-tertiary)" }}
                            >
                              <PencilSimple size={16} />
                            </button>
                          </div>
                        )}

                        <p className="text-sm line-clamp-2" style={{ color: "var(--text-secondary)" }}>
                          {item.summary}
                        </p>
                      </div>

                      {/* Footer actions of card */}
                      <div className="mt-6 flex items-center justify-between pt-4 border-t" style={{ borderColor: "var(--border)" }}>
                        <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: "var(--text-tertiary)" }}>
                          <Funnel size={14} />
                          {item.ingredients.length} Bahan Ditemukan
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => handleDelete(item.id, e)}
                            className="p-2 rounded-xl transition-colors hover:bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 focus:opacity-100"
                            title="Hapus"
                          >
                            <Trash size={16} weight="bold" />
                          </button>
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300"
                            style={{
                              background: expandedId === item.id ? "var(--text-primary)" : "var(--bg-tertiary)",
                              color: expandedId === item.id ? "var(--bg-primary)" : "var(--text-secondary)",
                              transform: expandedId === item.id ? "rotate(90deg)" : "rotate(0deg)",
                            }}
                          >
                            <ArrowRight size={14} weight="bold" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {expandedId === item.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t overflow-hidden"
                          style={{ borderColor: "var(--border)", background: "var(--bg-primary)" }}
                        >
                          <div className="p-5 sm:p-6 space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                            <h4 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                              <ShieldCheck size={16} style={{ color: "var(--accent)" }} />
                              Rincian Komposisi
                            </h4>
                            {item.ingredients.map((ing, i) => (
                              <IngredientCard
                                key={`${ing.original_name}-${i}`}
                                ingredient={ing}
                                index={i}
                                activeConditions={[]}
                              />
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </main>
  );
}
