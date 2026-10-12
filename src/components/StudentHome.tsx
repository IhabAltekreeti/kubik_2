import React from 'react';
import { useDemo } from '../context/DemoContext';
import {
  Compass,
  ArrowRight,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Clock,
  Layers,
  Award,
} from 'lucide-react';
import MathView from './MathView';

interface StudentHomeProps {
  onGoToWorkshop: () => void;
  onGoToTutor: () => void;
  onGoToProgress: () => void;
}

export const StudentHome: React.FC<StudentHomeProps> = ({
  onGoToWorkshop,
  onGoToTutor,
  onGoToProgress,
}) => {
  const { track, activeQuestion, attempts, activeStudentName } = useDemo();

  const attemptsForTrack = attempts.filter((a) => a.track === track);
  const correctCount = attemptsForTrack.filter((a) => a.isCorrect).length;

  const trackInfo = {
    LGS: {
      title: 'LGS 2025 Hazırlık Parkuru',
      grade: '8. Sınıf',
      focus: 'Üslü İfadeler & Yeni Nesil Modelleme',
      desc: 'Liseye Geçiş Sınavı matematik netlerini artırmak için adım adım mantık yürütme atölyesi.',
      badge: 'LGS Hedef: Fen & Anadolu Liseleri',
    },
    YKS: {
      title: 'YKS 2025 (TYT - AYT) Parkuru',
      grade: '12. Sınıf & Mezun',
      focus: 'Fonksiyonlar & Simetri Kuralları',
      desc: 'Kavramsal derinlik ve soru analizi ile AYT matematik hedeflerine odaklanın.',
      badge: 'YKS Hedef: Derece Grubu',
    },
    ARA_SINIF: {
      title: 'Ara Sınıf Konu Güçlendirme',
      grade: '10. Sınıf',
      focus: 'İkinci Dereceden Denklemler & Kök Bağıntıları',
      desc: 'Okul başarısını yükseltirken temel sınav hazırlığını sağlam temellere oturtun.',
      badge: 'Okul & Sınav Desteği',
    },
  }[track];

  return (
    <div className="space-y-6">
      {/* Welcome & Track Header */}
      <div className="bg-gradient-to-r from-[#14264B] via-[#1a3365] to-[#254685] rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full opacity-10 pointer-events-none flex items-center justify-center font-black text-9xl">
          K+
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-semibold mb-3 border border-white/15">
            <Award className="w-3.5 h-3.5 text-amber-300" />
            <span>{trackInfo.badge}</span>
            <span className="text-white/40">•</span>
            <span>{trackInfo.grade}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            Hoş geldin, {activeStudentName.split(' ')[0]} 👋
          </h2>

          <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-6">
            Bugün hedefin: <strong className="text-white font-semibold">{trackInfo.focus}</strong> konusunda
            takıldığın noktaları tespit edip sağlam bir kavrayış kazanmak.
          </p>

          {/* Dominant primary call to action */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onGoToWorkshop}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 active:scale-[0.98] text-white font-semibold text-sm transition-all shadow-lg shadow-blue-900/30 cursor-pointer"
            >
              <span>Bugünkü Göreve Başla</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onGoToTutor}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition-colors cursor-pointer border border-white/15"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Kübik Rehbere Soru Sor</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main 2-column workspace layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Primary Tasks & Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Primary Recommended Learning Task */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">Öncelikli Öğrenme Görevi</h3>
              </div>
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                Aktif Konu
              </span>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/60 mb-4">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1.5">
                <BookOpen className="w-4 h-4 text-slate-600" />
                <span>{activeQuestion?.topic}</span>
                <span>•</span>
                <span>{activeQuestion?.difficulty}</span>
              </div>
              <div className="text-sm text-slate-800 line-clamp-3 font-normal leading-relaxed">
                <MathView content={activeQuestion?.questionText || ''} />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Tahmini süre: ~3 dakika</span>
              </div>
              <button
                onClick={onGoToWorkshop}
                className="font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                <span>Soruyu Aç ve Çöz</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Secondary Task: Revision & Concept Reinforcement */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base">Pekiştirme ve Tekrar Görevi</h3>
              </div>
              <span className="text-xs text-slate-500">Planlanan Adım</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Ana soruyu tamamladıktan sonra, karşılaştığın muhtemel kavram yanılgısını ölçen özel bir transfer
              sorusuyla bilginizi kalıcı hale getirin.
            </p>

            <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-indigo-900 font-medium">
                <Layers className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Kazanım Doğrulama: Hata analizinden hemen sonra yeni soru</span>
              </div>
              <button
                onClick={onGoToWorkshop}
                className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 underline cursor-pointer"
              >
                İncele
              </button>
            </div>
          </div>

          {/* Learning loop history on this session */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-base">Bu Oturumdaki Denemeleriniz</h3>
              <button
                onClick={onGoToProgress}
                className="text-xs font-semibold text-blue-700 hover:text-blue-800 cursor-pointer"
              >
                Tüm Gelişim Detayı →
              </button>
            </div>

            {attemptsForTrack.length === 0 ? (
              <div className="py-6 text-center text-slate-500 text-xs">
                <p>Henüz bir soru çözmediniz. Yukarıdaki görev ile ilk adımınızı atabilirsiniz.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {attemptsForTrack.map((att, idx) => (
                  <div
                    key={att.id || idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      {att.isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-700 font-bold flex items-center justify-center text-[10px] shrink-0">
                          !
                        </span>
                      )}
                      <div>
                        <div className="font-semibold text-slate-900">
                          {att.isFollowUp ? 'Pekiştirme Sorusu' : 'Ana Soru'} (Seçilen Şık: {att.selectedOption})
                        </div>
                        <div className="text-slate-500 text-[11px]">
                          {att.isCorrect ? 'Doğru analiz edildi' : att.detectedMisconception?.slice(0, 75) + '...'}
                        </div>
                      </div>
                    </div>
                    <span className="text-slate-400 font-mono text-[11px] shrink-0">{att.submittedAt}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI Tutor Card & Pedagogical Promise */}
        <div className="space-y-6">
          {/* AI Guide quick card */}
          <div className="bg-[#14264B] text-white rounded-2xl p-6 shadow-md border border-[#0B1733]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Kübik Öğrenme Rehberi</h3>
                <span className="text-xs text-blue-200">Kişiselleştirilmiş İpucu Asistanı</span>
              </div>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed mb-4">
              Bir soruyu çözemediğinde veya yanlış yaptığında yalnız değilsin. Rehberimiz hatanın nedenini
              gösterir ve formülü adım adım anlatır.
            </p>

            <div className="bg-black/25 rounded-xl p-3 border border-white/10 mb-5 text-xs text-slate-300 italic">
              “Bu adımda neden üsleri toplamadık da çarptık?” gibi sorularını doğrudan sorabilirsin.
            </div>

            <button
              onClick={onGoToTutor}
              className="w-full py-2.5 px-4 rounded-xl bg-white text-[#14264B] font-semibold text-xs hover:bg-slate-100 transition-colors cursor-pointer text-center"
            >
              Rehber İle Çalış
            </button>
          </div>

          {/* Pedagogical Principle Box */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Kübik+ Eğitim İlkesi
            </h4>
            <p className="text-sm font-semibold text-slate-900 mb-2">
              “Sadece soru çözme. Nerede takıldığını anla, doğru yöntemle öğren ve gelişimini gör.”
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Öğrenme, yalnızca test çözmekten ibaret değildir. Asıl sıçrama, yanlış cevabın ardındaki kavram
              yanılgısını keşfettiğiniz anda başlar.
            </p>
          </div>

          {/* Quick Metrics (Session observed only) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <div className="text-xs font-semibold text-slate-700 mb-3 flex items-center justify-between">
              <span>Oturum Özeti</span>
              <span className="text-[10px] text-slate-400">Gerçek Oturum Verisi</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                <div className="text-xl font-bold text-slate-900">{attemptsForTrack.length}</div>
                <div className="text-[11px] text-slate-500">Çözülen Soru</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                <div className="text-xl font-bold text-emerald-700">{correctCount}</div>
                <div className="text-[11px] text-slate-500">Doğru Cevap</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentHome;
