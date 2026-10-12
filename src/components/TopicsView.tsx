import React from 'react';
import { useDemo } from '../context/DemoContext';
import { SAMPLE_QUESTIONS } from '../data/questions';
import { BookOpen, CheckCircle2, Clock, ArrowRight } from 'lucide-react';

interface TopicsViewProps {
  onSelectTopicQuestion: (questionId: string) => void;
}

export const TopicsView: React.FC<TopicsViewProps> = ({ onSelectTopicQuestion }) => {
  const { track } = useDemo();

  const syllabus = {
    LGS: [
      {
        id: 'lgs-top-1',
        title: 'Çarpanlar ve Katlar',
        subtitle: 'EBOB - EKOK Problemleri',
        status: 'Tamamlandı',
        badge: 'Temel Atıldı',
        questionId: 'lgs-math-02',
        totalQuestions: 12,
      },
      {
        id: 'lgs-top-2',
        title: 'Üslü İfadeler',
        subtitle: 'Çarpma, Bölme & Problem Modelleme',
        status: 'Aktif Çalışılıyor',
        badge: 'Odak Konu',
        questionId: 'lgs-math-01',
        totalQuestions: 18,
      },
      {
        id: 'lgs-top-3',
        title: 'Kareköklü İfadeler',
        subtitle: 'Gerçek Sayılar & Yaklaşık Değerler',
        status: 'Sıradaki Konu',
        badge: 'Haftaya',
        questionId: 'lgs-math-01',
        totalQuestions: 15,
      },
      {
        id: 'lgs-top-4',
        title: 'Veri Analizi',
        subtitle: 'Daire Grafiği & Sütun Grafiği Dönüşümü',
        status: 'Planlandı',
        badge: 'Gelecek Ünite',
        questionId: 'lgs-math-01',
        totalQuestions: 10,
      },
    ],
    YKS: [
      {
        id: 'yks-top-1',
        title: 'Fonksiyonlar (TYT & AYT)',
        subtitle: 'Tek/Çift Fonksiyonlar, Tanım Kümesi ve Grafikler',
        status: 'Aktif Çalışılıyor',
        badge: 'Odak Konu',
        questionId: 'yks-math-01',
        totalQuestions: 24,
      },
      {
        id: 'yks-top-2',
        title: 'Polinomlar',
        subtitle: 'Bölme Kalan İlişkisi & Katsayılar',
        status: 'Sıradaki Konu',
        badge: 'AYT Temeli',
        questionId: 'yks-math-01',
        totalQuestions: 16,
      },
      {
        id: 'yks-top-3',
        title: 'İkinci Dereceden Denklemler ve Karmaşık Sayılar',
        subtitle: 'Diskriminant & Kök Bağıntıları',
        status: 'Planlandı',
        badge: 'Gelecek Ünite',
        questionId: 'yks-math-01',
        totalQuestions: 20,
      },
      {
        id: 'yks-top-4',
        title: 'Parabol ve İkinci Dereceden Fonksiyonlar',
        subtitle: 'Tepe Noktası & Simetri Ekseni',
        status: 'Planlandı',
        badge: 'Gelecek Ünite',
        questionId: 'yks-math-01',
        totalQuestions: 18,
      },
    ],
    ARA_SINIF: [
      {
        id: 'ara-top-1',
        title: 'İkinci Dereceden Denklemler',
        subtitle: '10. Sınıf Kökler Toplamı ve Çarpımı',
        status: 'Aktif Çalışılıyor',
        badge: 'Odak Konu',
        questionId: 'ara-math-01',
        totalQuestions: 15,
      },
      {
        id: 'ara-top-2',
        title: 'Çokgenler ve Dörtgenler',
        subtitle: 'Açı ve Uzunluk Bağıntıları',
        status: 'Sıradaki Konu',
        badge: 'Geometri',
        questionId: 'ara-math-01',
        totalQuestions: 12,
      },
      {
        id: 'ara-top-3',
        title: 'Sayma ve Olasılık',
        subtitle: 'Permütasyon ve Kombinasyon',
        status: 'Planlandı',
        badge: 'Gelecek Ünite',
        questionId: 'ara-math-01',
        totalQuestions: 14,
      },
    ],
  }[track];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">Müfredat ve Konularım</h2>
          <p className="text-xs text-slate-500">
            {track === 'LGS'
              ? 'MEB 8. Sınıf LGS Matematik Kazanım Sıralaması'
              : track === 'YKS'
              ? 'ÖSYM YKS (TYT-AYT) Matematik Konu Haritası'
              : 'MEB 10. Sınıf Matematik Müfredatı'}
          </p>
        </div>

        <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-3 py-1.5 rounded-xl border border-blue-200">
          {syllabus.length} Temel Ünite
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {syllabus.map((item) => {
          const isCurrent = item.status === 'Aktif Çalışılıyor';
          return (
            <div
              key={item.id}
              className={`p-6 rounded-2xl border transition-all ${
                isCurrent
                  ? 'bg-white border-blue-500 ring-2 ring-blue-500/10 shadow-xs'
                  : 'bg-white border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    isCurrent
                      ? 'bg-blue-600 text-white'
                      : item.status === 'Tamamlandı'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.status}
                </span>

                <span className="text-xs text-slate-400 font-medium">{item.totalQuestions} Soru</span>
              </div>

              <h3 className="font-bold text-slate-900 text-base mb-1">{item.title}</h3>
              <p className="text-xs text-slate-500 mb-5 leading-relaxed">{item.subtitle}</p>

              <button
                onClick={() => onSelectTopicQuestion(item.questionId)}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  isCurrent
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <span>{isCurrent ? 'Soru Atölyesinde Devam Et' : 'Örnek Soruyu İncele'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopicsView;
