import React from 'react';
import { useDemo, Role } from '../context/DemoContext';
import { Track } from '../data/questions';
import {
  GraduationCap,
  Users,
  HeartHandshake,
  Building2,
  RotateCcw,
  Sparkles,
  Calculator,
  CheckCircle2,
} from 'lucide-react';

interface NavbarProps {
  onOpenMathTest: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenMathTest }) => {
  const { role, setRole, track, setTrack, resetDemo, serverStatus } = useDemo();

  const roles: Array<{ id: Role; label: string; icon: React.ElementType }> = [
    { id: 'ogrenci', label: 'Öğrenci', icon: GraduationCap },
    { id: 'ogretmen', label: 'Öğretmen', icon: Users },
    { id: 'veli', label: 'Veli', icon: HeartHandshake },
    { id: 'kurum', label: 'Kurum', icon: Building2 },
  ];

  const tracks: Array<{ id: Track; label: string; badge: string }> = [
    { id: 'LGS', label: 'LGS', badge: '8. Sınıf' },
    { id: 'YKS', label: 'YKS', badge: 'TYT - AYT' },
    { id: 'ARA_SINIF', label: 'Ara Sınıflar', badge: '9-10-11' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#14264B] text-white border-b border-[#0B1733] shadow-md">
      {/* Top institution bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-slate-200 tracking-wide">Kübik Dershanesi</span>
          <span className="text-slate-400 hidden sm:inline">• Ereğli, Zonguldak</span>
          <span className="bg-blue-900/60 text-blue-200 border border-blue-400/30 px-2 py-0.5 rounded text-[11px] font-medium ml-2">
            Kübik+ Hibrit Dijital Platform
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMathTest}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-slate-200 transition-colors text-[11px] font-medium cursor-pointer"
            title="Matematiksel KaTeX formül doğrulamalarını kontrol et"
          >
            <Calculator className="w-3.5 h-3.5 text-indigo-300" />
            <span className="hidden md:inline">Matematik Gösterim</span> Testi
          </button>

          <div className="flex items-center gap-1.5 bg-black/25 px-2.5 py-1 rounded text-[11px] text-slate-300 border border-white/5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>
              {serverStatus?.hasGeminiKey ? (
                <span className="text-emerald-300 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 inline" /> Gemini 3.8 Flash (Aktif)
                </span>
              ) : (
                <span className="text-amber-200 font-medium">Pedagojik Rehber Motoru</span>
              )}
            </span>
          </div>

          <button
            onClick={resetDemo}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-rose-950/40 hover:bg-rose-900/60 text-rose-200 border border-rose-500/30 transition-colors text-[11px] font-medium cursor-pointer"
            title="Tüm oturum verilerini ve soruları başlangıç durumuna sıfırlar"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Demoyu Sıfırla</span>
          </button>
        </div>
      </div>

      {/* Main navigation row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center font-black text-xl text-white shadow-inner border border-white/20">
            K+
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white">Kübik+</h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Öğrenme Atölyesi
              </span>
            </div>
            <p className="text-xs text-slate-300 line-clamp-1">
              Sadece soru çözme. Nerede takıldığını anla, doğru yöntemle öğren.
            </p>
          </div>
        </div>

        {/* Track Switcher (LGS / YKS / Ara Sınıflar) */}
        <div className="flex items-center bg-[#0B1733] p-1 rounded-xl border border-white/10 shadow-inner">
          {tracks.map((t) => {
            const isActive = track === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTrack(t.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{t.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-normal ${
                    isActive ? 'bg-blue-800 text-blue-100' : 'bg-white/10 text-slate-400'
                  }`}
                >
                  {t.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Role Switcher */}
        <div className="flex items-center bg-[#0B1733] p-1 rounded-xl border border-white/10">
          <span className="text-[11px] font-medium text-slate-400 px-2 hidden lg:inline">Rol:</span>
          {roles.map((r) => {
            const Icon = r.icon;
            const isActive = role === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setRole(r.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-[#0B1733] shadow-sm font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-700' : 'text-slate-400'}`} />
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
