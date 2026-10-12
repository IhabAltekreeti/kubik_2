import React from 'react';
import { useDemo } from '../context/DemoContext';
import {
  HeartHandshake,
  CheckCircle2,
  HelpCircle,
  MessageCircle,
  Home,
  ShieldCheck,
  Award,
  Sparkles,
} from 'lucide-react';

export const ParentView: React.FC = () => {
  const { track, activeStudentName, attempts, teacherInterventions } = useDemo();

  const attemptsForStudent = attempts.filter((a) => a.track === track);
  const correctCount = attemptsForStudent.filter((a) => a.isCorrect).length;

  const topicTitle =
    track === 'LGS'
      ? '8. Sınıf Matematik — Üslü İfadeler ve Yeni Nesil Modelleme'
      : track === 'YKS'
      ? '12. Sınıf Matematik — Fonksiyonlar ve Simetri Özellikleri'
      : '10. Sınıf Matematik — İkinci Dereceden Denklemler';

  const homeQuestions =
    track === 'LGS'
      ? [
          '“Bakteri sorusunda her 20 dakikada bir ikiye katlanmayı üslü ifadeyle nasıl modelledin?”',
          '“Tabanları aynı olan iki üslü ifadeyi çarparken üsleri neden topluyoruz?”',
          '“Kübik Rehber sana en çok hangi adımda yardımcı oldu?”',
        ]
      : track === 'YKS'
      ? [
          '“Çift fonksiyonların grafikleri hangi eksene göre simetriktir?”',
          '“Tek dereceli terimlerin katsayıları çift fonksiyonda neden sıfır olmalı?”',
          '“Bugünkü soru çözümünde en çok kafanı kurcalayan soru hangisiydi?”',
        ]
      : [
          '“Kökler toplamı formülünü soruda nasıl kullandın?”',
          '“İki bilinmeyenli denklem sistemini çözerken taraf tarafa toplamak işine yaradı mı?”',
        ];

  return (
    <div className="space-y-6">
      {/* Reassuring Parent Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Veli Bilgilendirme Portalı</h2>
              <p className="text-xs text-slate-500">
                Öğrenci: <strong className="text-slate-800">{activeStudentName}</strong> • {track} Parkuru
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { name: 'Zeynep', trackId: 'LGS' as const, grade: '8. Sınıf' },
              { name: 'Emre', trackId: 'YKS' as const, grade: '12. Sınıf' },
              { name: 'Berke', trackId: 'ARA_SINIF' as const, grade: '10. Sınıf' },
            ].map((st) => (
              <button
                key={st.name}
                onClick={() => useDemo().setTrack(st.trackId)}
                className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors border ${
                  track === st.trackId
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {st.name} ({st.grade})
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Kübik+, öğrencinin başarısını kuru notlarla değil; nerede zorlandığını, nasıl bir destek aldığını ve
          evde nasıl desteklenebileceğini şeffaf bir dille paylaşır.
        </p>
      </div>

      {/* 4 Core Pillars of Parent Understanding */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1: What was studied */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-2">
          <div className="text-xs font-bold text-blue-700 uppercase tracking-wider">
            1. Bugün Ne Çalışıldı?
          </div>
          <h3 className="font-bold text-slate-900 text-base">{topicTitle}</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Öğrenci bugünkü çalışma oturumunda MEB müfredatına ve sınav standartlarına uygun yeni nesil modelleme
            soruları üzerinde bağımsız çözüm denemeleri gerçekleştirdi.
          </p>
          <div className="pt-2 text-xs text-slate-500">
            Toplam Deneme: <strong>{attemptsForStudent.length} soru</strong> • Başarılı Çözüm:{' '}
            <strong>{correctCount} soru</strong>
          </div>
        </div>

        {/* Card 2: What was challenging */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-2">
          <div className="text-xs font-bold text-amber-700 uppercase tracking-wider">
            2. Nerede Zorlandı?
          </div>
          <h3 className="font-bold text-slate-900 text-base">Kavram Kuralları Arasındaki Ayrım</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {track === 'LGS'
              ? 'Öğrenci soruyu kavradı ancak üslü sayılarda tabanlar aynı olduğunda kuvvetleri çarpmak yerine toplama adımında dikkat gerektiren bir tereddüt yaşadı.'
              : 'Öğrenci çift fonksiyon kuralını uygularken katsayı eşitlemelerinde işlem dikkatine ihtiyaç duydu.'}
          </p>
          <div className="pt-2 text-xs text-slate-500 italic">
            Bu tür tereddütler öğrenme sürecinin en doğal ve geliştirici adımıdır.
          </div>
        </div>

        {/* Card 3: What support was provided */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-2">
          <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
            3. Hangi Destek Verildi?
          </div>
          <h3 className="font-bold text-slate-900 text-base">Kübik Rehber & Adım Adım İpucu</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Sistem öğrenciye cevabı hazır vermek yerine, mantığı hatırlatacak bir pedagojik ipucu sundu. Ardından
            hatayı pekiştiren bir transfer sorusuyla öğrenmeyi doğruladı.
          </p>
        </div>

        {/* Card 4: Next recommended step */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-2">
          <div className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
            4. Sonraki Önerilen Adım
          </div>
          <h3 className="font-bold text-slate-900 text-base">Kısa Tekrar ve Pekiştirme</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Öğrencinin dershane etüt saatinde öğretmeniyle birlikte bu adımı 5 dakikalık bir soru üzerinde gözden
            geçirmesi ve evde aşağıdaki sohbet sorularıyla desteklenmesi tavsiye edilir.
          </p>
        </div>
      </div>

      {/* Teacher Interventions & Guidance Notes for Parents */}
      {teacherInterventions.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              Dershane Öğretmeninden Veliye İletilen Güncel Notlar
            </h3>
          </div>
          <div className="space-y-2.5">
            {teacherInterventions.map((ti) => (
              <div
                key={ti.id}
                className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-semibold text-blue-700">{ti.assignedAction}</span>
                  <span>{ti.date}</span>
                </div>
                <p className="text-slate-800 leading-relaxed">{ti.note}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Special Feature: Evde Çocuğunuza Ne Sorabilirsiniz? */}
      <div className="bg-gradient-to-br from-indigo-900 to-[#14264B] text-white rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
            <Home className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Evde Çocuğunuza Ne Sorabilirsiniz?</h3>
            <p className="text-xs text-indigo-200">
              Sınav kaygısını tetiklemeden, öğrenmeyi destekleyen yapıcı sohbet başlangıçları
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-200 leading-relaxed mb-5">
          Çocuğunuza <em>“Bugün kaç soru çözdün, kaç netin var?”</em> yerine aşağıdaki soruları sorarak
          öğrendiği konuyu size anlatmasını sağlayabilirsiniz. Bir şeyi başkasına anlatan öğrencinin bilgisi
          kalıcı hale gelir:
        </p>

        <div className="space-y-3">
          {homeQuestions.map((q, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-white/10 border border-white/15 text-xs text-slate-100 flex items-start gap-2.5"
            >
              <MessageCircle className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
              <span className="font-medium leading-relaxed">{q}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParentView;
