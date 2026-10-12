import React from 'react';
import MathView from './MathView';
import { X, CheckCircle2, Calculator, ShieldCheck } from 'lucide-react';

interface MathTestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MathTestModal: React.FC<MathTestModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const testCases = [
    {
      label: '1. İkinci Dereceden Polinom Fonksiyonu',
      raw: '$f(x) = x^2 + 4$',
      description: 'Temel kare ve toplama ifadesi',
    },
    {
      label: '2. Çift Fonksiyon Tanım Simetrisi',
      raw: '$f(-x) = f(x)$',
      description: 'Zıt işaretli girdi simetrisi',
    },
    {
      label: '3. Üslü İfadelerde Çarpma ve Kuvvetler Kuralı',
      raw: '$a^n \\cdot a^m = a^{n+m}$',
      description: 'Tabanlar aynıyken üslerin toplanması',
    },
    {
      label: '4. Kesirli Gösterim (Display Mode)',
      raw: '$$\\frac{1}{16}$$',
      description: 'Display mode pay ve payda dizilimi',
    },
    {
      label: '5. Kareköklü Cebirsel İfade',
      raw: '$\\sqrt{x+1}$',
      description: 'Karekök içi çok terimli',
    },
    {
      label: '6. Rasyonel Cebirsel Kesir',
      raw: '$\\frac{x^2+1}{x-1}$',
      description: 'Pay ve paydada değişkenli rasyonel kesir',
    },
    {
      label: '7. Kalın Markdown ve Kural Başlığı',
      raw: '**Kuralımız:** Bir fonksiyonun çift olması için her $x \\in \\mathbb{R}$ sayısında $f(-x) = f(x)$ eşitliği sağlanmalıdır.',
      description: 'Kalın metin ile inline matematiksel ifadenin birleşimi',
    },
    {
      label: '8. Türkçe Paragraf ve Çoklu Inline Formüller',
      raw: 'Örneğin $a = 2$ ve $b = 3$ değerleri için **toplam kuralı** $a + b = 5$ olarak doğrulanır ve $f(5) = 29$ çıkar.',
      description: 'Türkçe metin akışı içinde birden fazla inline matematik ifadesi',
    },
    {
      label: '9. Çok Adımlı Çözüm ve Blok Formül Gösterimi',
      raw: `**Adım 1:** Verilen fonksiyonun çift olduğunu kural ile doğrulayalım:
$$f(-x) = f(x) \\implies (a-2)x^3 + x^2 + (b+1)x + 4 = x^2 + 4$$

**Adım 2:** Katsayıları sıfırlayalım:
- $a - 2 = 0 \\implies a = 2$
- $b + 1 = 0 \\implies b = -1$

**Sonuç:**
$$f(a+b) = f(2 + (-1)) = f(1) = 1^2 + 4 = 5$$`,
      description: 'Metin, kalın yazı, madde işaretleri ve KaTeX display bloklarının bir arada kusursuz sunumu',
    },
    {
      label: '10. Para Birimi / Dolar İşareti Koruması',
      raw: 'Bu eğitim paketi için kitap ücreti 50$ ve deneme sınavı seti 20$ tutmaktadır (Toplam: \\$70).',
      description: 'Sıradan para birimi ve kaçışlı dolar işaretlerinin ($50, 20$) matematik sanılmadan düz metin olarak korunması',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">
                  Matematiksel Gösterim (KaTeX) Doğrulama Paneli
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> KaTeX Aktif
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Şartnamede zorunlu kılınan tüm matematiksel formüller ve test senaryoları
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Test List */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="text-xs text-slate-600 bg-blue-50 p-3.5 rounded-xl border border-blue-100 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p>
              Öğrencilere asla çiğ LaTeX kodu veya escape karakterleri gösterilmez. Tüm formüller modern KaTeX
              motoru üzerinden matematiksel fontlarla render edilir.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {testCases.map((tc, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-colors space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">{tc.label}</span>
                  <span className="text-[10px] font-mono text-slate-400">{tc.description}</span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200/80 text-sm font-medium text-slate-800">
                  <MathView content={tc.raw} />
                </div>

                <div className="text-[11px] font-mono text-slate-400 truncate">
                  Kaynak Girdi: <span className="text-slate-600">{tc.raw}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            Paneli Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

export default MathTestModal;
