import React from 'react';
import { useDemo } from '../context/DemoContext';
import { getQuestionById } from '../data/questions';
import {
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Layers,
  BookOpen,
} from 'lucide-react';
import MathView from './MathView';

interface ProgressViewProps {
  onGoToWorkshop: () => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({ onGoToWorkshop }) => {
  const { attempts, track } = useDemo();

  const attemptsForTrack = attempts.filter((a) => a.track === track);
  const totalAttempts = attemptsForTrack.length;
  const correctAttempts = attemptsForTrack.filter((a) => a.isCorrect).length;

  // Find linked pairs: main questions vs follow-up questions
  const followUpAttempts = attemptsForTrack.filter((a) => a.isFollowUp);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-900">Gelişim ve Öğrenme Analizi</h2>
          </div>
          <p className="text-xs text-slate-500">
            Aktif oturumda çözdüğünüz sorular, tespit edilen kavram yanılgıları ve pekiştirme sonuçları.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200">
            <span className="text-slate-500 block text-[10px]">Çözülen</span>
            <span className="text-slate-900 font-bold text-base">{totalAttempts} Soru</span>
          </div>
          <div className="bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200">
            <span className="text-slate-500 block text-[10px]">Doğru</span>
            <span className="text-emerald-700 font-bold text-base">{correctAttempts} Soru</span>
          </div>
        </div>
      </div>

      {/* The Core Demonstration: Learning Loop Comparison (Hata -> İpucu -> Transfer Soru) */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-base">Öğrenme Döngüsü Transfer Raporu</h3>
          </div>
          <span className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full font-semibold border border-indigo-200">
            Kübik+ Öğrenme Metodu
          </span>
        </div>

        <p className="text-xs text-slate-600 mb-6 leading-relaxed">
          Platformumuzun ana felsefesi: Öğrencinin ilk denemedeki hatasından ders çıkarıp, doğrudan hedefe
          yönelik pekiştirme sorusunda doğruyu bulup bulmadığını ölçmektir.
        </p>

        {attemptsForTrack.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p className="mb-3">Bu oturumda henüz bir deneme kaydedilmedi.</p>
            <button
              onClick={onGoToWorkshop}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
            >
              İlk Soruyu Çözmeye Başla
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Show each main attempt and whether it was followed up */}
            {attemptsForTrack
              .filter((a) => !a.isFollowUp)
              .map((mainAtt) => {
                const question = getQuestionById(mainAtt.questionId);
                const relatedFollowUp = followUpAttempts.find(
                  (fu) => fu.parentQuestionId === mainAtt.questionId
                );

                return (
                  <div
                    key={mainAtt.id}
                    className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-4"
                  >
                    {/* Step 1: Initial Attempt */}
                    <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-slate-200/60">
                      <div>
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Adım 1: İlk Deneme (Ana Soru)
                        </div>
                        <div className="text-sm font-semibold text-slate-900">
                          {question?.topic || 'Konu'}
                        </div>
                        <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                          {question?.learningObjective}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {mainAtt.isCorrect ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Doğru ({mainAtt.selectedOption})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold">
                            <AlertCircle className="w-3.5 h-3.5" /> Hatalı Seçim ({mainAtt.selectedOption})
                          </span>
                        )}
                        <span className="text-xs text-slate-400 font-mono">{mainAtt.submittedAt}</span>
                      </div>
                    </div>

                    {/* Step 2: The feedback provided */}
                    {!mainAtt.isCorrect && mainAtt.detectedMisconception && (
                      <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900">
                        <strong className="font-semibold block mb-0.5">
                          Gözlemlenen Muhtemel Hata Noktası:
                        </strong>
                        {mainAtt.detectedMisconception}
                      </div>
                    )}

                    {/* Step 3: Follow-up question result */}
                    <div className="pt-2">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Adım 2: Pekiştirme / Transfer Sorusu Sonucu
                      </div>

                      {relatedFollowUp ? (
                        <div className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-slate-200 text-xs">
                          <div className="flex items-center gap-2.5">
                            {relatedFollowUp.isCorrect ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                            )}
                            <div>
                              <div className="font-semibold text-slate-900">
                                {relatedFollowUp.isCorrect
                                  ? 'Kavram Yanılgısı Başarıyla Düzeltildi!'
                                  : 'Konunun Öğretmen İle Birlikte Tekrar Edilmesi Önerilir'}
                              </div>
                              <div className="text-slate-500 text-[11px]">
                                {relatedFollowUp.isCorrect
                                  ? 'Öğrenci transfer sorusunda doğru kuralı uyguladı.'
                                  : 'Öğrenci bu adımda ek öğretmen rehberliğine ihtiyaç duyuyor.'}
                              </div>
                            </div>
                          </div>
                          <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                            {relatedFollowUp.isCorrect ? 'Gelişim Doğrulandı' : 'Takip Gerekli'}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/70 border border-dashed border-slate-300 text-xs text-slate-600">
                          <span>Bu soru için henüz pekiştirme sorusu çözülmedi.</span>
                          <button
                            onClick={onGoToWorkshop}
                            className="font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                          >
                            <span>Pekiştirme Sorusunu Aç</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* Honest Pedagogical Note */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-start gap-2">
        <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p>
          <strong>Şeffaflık İlkesi:</strong> Buradaki veriler yalnızca mevcut demo oturumunda gözlemlenen
          soru çözümlerine dayanmaktadır. Tek bir doğru cevap ile kesin başarı veya yetersizlik teşhisi
          konulmaz; gözlemlenen pedagojik hipotezler öğretmen ve veli ile paylaşılır.
        </p>
      </div>
    </div>
  );
};

export default ProgressView;
