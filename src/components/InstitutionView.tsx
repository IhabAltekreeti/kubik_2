import React from 'react';
import {
  Building2,
  TrendingUp,
  Target,
  Sparkles,
  Users,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const InstitutionView: React.FC = () => {
  const programs = [
    {
      id: 'prog-1',
      title: 'LGS Matematik Güçlendirme Paketi',
      audience: '8. Sınıf Öğrencileri',
      feature: 'Yeni nesil problem modelleme, adım adım kavram teşhisi ve haftalık veli özeti.',
      model: 'Hibrit (Fiziksel Dershane + Dijital Atölye)',
      status: 'Demo Konsepti',
    },
    {
      id: 'prog-2',
      title: 'TYT - AYT Hızlandırma ve Derece Atölyesi',
      audience: '12. Sınıf & Mezun Öğrenciler',
      feature: 'İleri düzey matematik analizleri, çift/tek fonksiyon grafikleri ve anlık AI rehberliği.',
      model: 'Online & Sınıf İçi Entegre',
      status: 'Demo Konsepti',
    },
    {
      id: 'prog-3',
      title: 'Ara Sınıflar (9-10-11) Temel Sağlamlaştırma',
      audience: 'Lise Öğrencileri',
      feature: 'Okul sınavlarına hazırlık ve YKS temel eksiklerini erkenden kapatma programı.',
      model: 'Bireysel Dijital Çalışma',
      status: 'Demo Konsepti',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Strategic Header */}
      <div className="bg-[#14264B] text-white rounded-2xl p-6 sm:p-8 shadow-md border border-[#0B1733]">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-slate-300 font-medium">Ereğli, Zonguldak</span>
            <span className="text-white/30">•</span>
            <span className="text-xs text-blue-200">Kübik Dershanesi Kurumsal Vizyonu</span>
          </div>

          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
            Genişletilmiş Eğitim Modeli
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
          Dershane Sınırlarını Aşan Dijital Öğrenme Ekosistemi
        </h2>

        <p className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-3xl mb-6">
          Kübik’in Ereğli’deki köklü öğretmen tecrübesi ve güvenini, 7/24 erişilebilir yapay zekâ destekli soru
          atölyesiyle birleştirerek derslik kapasitesi ve coğrafi sınırları aşan ölçeklenebilir bir modele taşıyoruz.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs">
          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <div className="font-bold text-white mb-0.5">1. Sınıf Kapasitesini Aşma</div>
            <div className="text-slate-300">Öğretmen zamanını tekrarlayan sorular yerine teşhise yönlendirme</div>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <div className="font-bold text-white mb-0.5">2. Bölgesel Genişleme</div>
            <div className="text-slate-300">Ereğli’den Zonguldak geneline ve tüm Türkiye’ye dijital paketler</div>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <div className="font-bold text-white mb-0.5">3. Veli Güveni ve Şeffaflık</div>
            <div className="text-slate-300">Öğrencinin her zorlandığı anı pedagojik olarak raporlama</div>
          </div>
        </div>
      </div>

      {/* Strategic Differentiation (Why Not Just Generic Chatbots or Video Banks) */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
        <h3 className="font-bold text-slate-900 text-base mb-2">
          Piyasadaki Çözümlerden Farkımız: “Öğrenme Döngüsü Kalitesi”
        </h3>
        <p className="text-xs text-slate-600 mb-6 leading-relaxed">
          Kübik+, pasif video izleme veya cevabı hemen kopyalatan genel yapay zekâ botları sunmaz.
          Farkımız 4 adımlı pedagojik döngüde yatar:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 font-bold flex items-center justify-center mb-2">
              1
            </div>
            <div className="font-bold text-slate-900">Bağımsız Çözüm</div>
            <div className="text-slate-600">Öğrenci soruyu kendi başına dener; cevabı önceden göremez.</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 font-bold flex items-center justify-center mb-2">
              2
            </div>
            <div className="font-bold text-slate-900">Hata Noktası Teşhisi</div>
            <div className="text-slate-600">
              Kırmızı çarpı yerine, seçilen şıkkın ardındaki kavram yanılgısı tespit edilir.
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
            <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-800 font-bold flex items-center justify-center mb-2">
              3
            </div>
            <div className="font-bold text-slate-900">Adım Adım Rehberlik</div>
            <div className="text-slate-600">
              Kübik Rehber cevabı boca etmez; doğru formülü KaTeX ile adım adım gösterir.
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center mb-2">
              4
            </div>
            <div className="font-bold text-slate-900">Transfer Sorusunda Doğrulama</div>
            <div className="text-slate-600">
              Hemen ardından gelen pekiştirme sorusuyla öğrenmenin kalıcılığı ölçülür.
            </div>
          </div>
        </div>
      </div>

      {/* Potential Future Learning Programs */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-base">Geliştirilebilecek Dijital Eğitim Programları</h3>
          </div>
          <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">
            Örnek Ürün Modelleri
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {programs.map((prog) => (
            <div
              key={prog.id}
              className="p-5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors space-y-3"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-blue-700">{prog.audience}</span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                  {prog.status}
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm">{prog.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{prog.feature}</p>
              <div className="text-[11px] font-semibold text-slate-500 pt-2 border-t border-slate-100">
                Model: <span className="text-slate-800">{prog.model}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Institutional Transparency & Deployment Roadmap */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2">
        <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Kurumsal Dağıtım ve Üretime Geçiş Yol Haritası</span>
        </h4>
        <p className="leading-relaxed">
          Bu demo, platformun etkileşim modelini ve pedagojik değerini kanıtlamak üzere tek oturumlu güvenli
          durum mimarisiyle inşa edilmiştir. Gerçek kurum dağıtımında:
        </p>
        <ul className="list-disc ml-5 space-y-1 pt-1">
          <li>
            <strong>KVKK ve Veri Güvenliği:</strong> Öğrenci kimlikleri ve veli iletişim bilgileri kurum sunucularında
            şifreli olarak saklanır.
          </li>
          <li>
            <strong>Öğrenci Bilgi Sistemi (SIS) Entegrasyonu:</strong> Dershane yoklama ve deneme sınavı netleri ile
            otomatik senkronizasyon.
          </li>
          <li>
            <strong>Özgün Soru Kütüphanesi Genişletmesi:</strong> Kübik öğretmenlerinin hazırladığı haftalık deneme
            ve fasikül sorularının platforma eklenmesi.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default InstitutionView;
