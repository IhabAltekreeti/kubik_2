export type Track = 'LGS' | 'YKS' | 'ARA_SINIF';

export interface QuestionOption {
  id: string; // 'A' | 'B' | 'C' | 'D'
  text: string;
  misconceptionNote?: string; // The pedagogical hypothesis if student chooses this distractor
}

export interface Question {
  id: string;
  track: Track;
  grade: string;
  subject: string;
  topic: string;
  learningObjective: string;
  difficulty: 'Temel' | 'Orta' | 'Yeni Nesil / İleri';
  questionText: string;
  diagramNote?: string;
  options: QuestionOption[];
  trustedAnswerKey: string;
  solution: string;
  generalExplanation: string;
  followUpQuestionId?: string;
  sourceLabel: string;
  isVerified: boolean;
  estimatedTimeSec: number;
}

export const SAMPLE_QUESTIONS: Question[] = [
  // ===================== LGS TRACK =====================
  {
    id: 'lgs-math-01',
    track: 'LGS',
    grade: '8. Sınıf',
    subject: 'Matematik',
    topic: 'Üslü İfadeler (Çarpma Kuralı & Problem Modelleme)',
    learningObjective: 'Tam sayıların pozitif tam sayı kuvvetlerini hesaplar; üslü ifadelerle çarpma işlemini problem bağlamında uygular.',
    difficulty: 'Yeni Nesil / İleri',
    questionText:
      'Bir biyoloji laboratuvarında gözlemlenen özel bir bakteri türünün sayısı, uygun sıcaklık ve besin ortamında her $20$ dakikada bir $2$ katına çıkmaktadır.\n\nDeney tüpünde başlangıç anında $2^4$ adet bakteri bulunduğu bilindiğine göre, $2$ saat sonra tüpteki toplam bakteri sayısı aşağıdakilerden hangisidir?',
    diagramNote: 'Bakteri popülasyonu 20 dakikalık periyotlarla $2^1$ çarpanı ile katlanarak büyümektedir.',
    options: [
      {
        id: 'A',
        text: '$2^7$',
        misconceptionNote:
          'Zaman periyodu hesaplama eksikliği: 2 saat içinde 6 periyot olduğunu tespit etmek yerine 3 periyot sayılmış veya üsler hatalı toplanmış olabilir.',
      },
      {
        id: 'B',
        text: '$2^9$',
        misconceptionNote:
          'Başlangıç üssünü dahil etmeme veya bir periyodu eksik sayma: 6 periyotluk artış $2^6$ ile $2^4$ çarpımında 1 eksik işlem yapılmış olabilir.',
      },
      {
        id: 'C',
        text: '$2^{10}$',
        misconceptionNote: undefined, // Correct!
      },
      {
        id: 'D',
        text: '$2^{24}$',
        misconceptionNote:
          'Kritik Kavram Yanılgısı (Üsleri Çarpma Hatası): Tabanlar aynıyken üslerin çarpılacağı yanılgısına düşülmüş ($4 \\cdot 6 = 24$). Oysa kural gereği tabanlar aynı olduğunda üsler toplanır: $a^m \\cdot a^n = a^{m+n}$ ($4 + 6 = 10$).',
      },
    ],
    trustedAnswerKey: 'C',
    solution:
      '**Adım 1:** Zaman periyodunu belirleyelim.\n$2$ saat $= 120$ dakikadır. Bakteriler her $20$ dakikada bir $2$ katına çıktığından:\n$$\\frac{120}{20} = 6 \\text{ kez bölünme (ikiye katlanma)}$$\nBu durum bakteri sayısının $2^6$ katına çıkacağını gösterir.\n\n**Adım 2:** Başlangıçtaki miktar ile çarpalım.\nBaşlangıçtaki miktar $2^4$ olduğuna göre:\n$$\\text{Toplam Sayı} = 2^4 \\cdot 2^6$$\n\n**Adım 3:** Üslü sayılarda çarpma kuralını uygulayalım.\nTabanlar aynı ($2$) olduğunda üsler toplanır:\n$$2^4 \\cdot 2^6 = 2^{4+6} = 2^{10}$$\n\nDoğru cevap **C** seçeneğidir.',
    generalExplanation:
      'Bu soruda en kritik ayrım, zaman dilimini ($120 \\div 20 = 6$) $2^6$ olarak üslü biçimde modellemek ve $a^m \\cdot a^n = a^{m+n}$ kuralını dikkatle uygulamaktır.',
    followUpQuestionId: 'lgs-math-01-followup',
    sourceLabel: 'Kübik Özgün Soru Havuzu — LGS Matematik Doğrulanmış Örnek Soru',
    isVerified: true,
    estimatedTimeSec: 120,
  },

  // LGS FOLLOW-UP QUESTION (Pekiştirme Sorusu)
  {
    id: 'lgs-math-01-followup',
    track: 'LGS',
    grade: '8. Sınıf',
    subject: 'Matematik',
    topic: 'Üslü İfadeler (Kazanım Doğrulama Sorusu)',
    learningObjective: 'Aynı tabanlı üslü ifadelerde çarpma kuralını doğru kavrar ve transfer eder.',
    difficulty: 'Orta',
    questionText:
      '$3^3 \\cdot 3^5$ işleminin sonucu ile ilgili aşağıdaki adımlardan hangisi doğrudur ve işlemin sonucu kaçtır?',
    options: [
      {
        id: 'A',
        text: 'Tabanlar aynı olduğu için üsler toplanır: $3^{3+5} = 3^8$',
        misconceptionNote: undefined, // Correct!
      },
      {
        id: 'B',
        text: 'Tabanlar aynı olduğu için üsler çarpılır: $3^{3 \\cdot 5} = 3^{15}$',
        misconceptionNote:
          'Kavram yanılgısı devam ediyor: Üslü sayılarda tabanlar aynıyken çarpma işleminde üsler çarpılmaz, toplanır.',
      },
      {
        id: 'C',
        text: 'Tabanlar çarpılır, üsler toplanır: $9^{3+5} = 9^8$',
        misconceptionNote:
          'Tabanı da çarpma hatası: Ortak taban korunur, tabanlar birbiriyle çarpılmaz.',
      },
      {
        id: 'D',
        text: 'Hem tabanlar hem üsler çarpılır: $9^{15}$',
        misconceptionNote:
          'Çifte çarpma hatası: Üslü sayılar mantığında üs bir tekrarlı çarpım sayısıdır.',
      },
    ],
    trustedAnswerKey: 'A',
    solution:
      '**Kural:**\n$$a^m \\cdot a^n = a^{m+n}$$\nTaban $3$ sabit tutulur ve üsler toplanır:\n$$3^3 \\cdot 3^5 = 3^{3+5} = 3^8$$\nDoğru cevap **A** seçeneğidir.',
    generalExplanation:
      'Önceki sorudaki yanılgıyı doğrudan test eden bu transfer sorusunda, tabanın korunduğu ve sadece üslerin toplandığı pekiştirilir.',
    sourceLabel: 'Kübik Öğrenme Döngüsü — Hedefe Yönelik Pekiştirme Sorusu',
    isVerified: true,
    estimatedTimeSec: 60,
  },

  // LGS SECONDARY QUESTION: EBOB - EKOK
  {
    id: 'lgs-math-02',
    track: 'LGS',
    grade: '8. Sınıf',
    subject: 'Matematik',
    topic: 'Çarpanlar ve Katlar (EBOB Uygulamaları)',
    learningObjective: 'İki doğal sayının en büyük ortak bölenini (EBOB) hesaplar, ilgili problemleri çözer.',
    difficulty: 'Orta',
    questionText:
      'Kenar uzunlukları $36\\text{ m}$ ve $48\\text{ m}$ olan dikdörtgen biçimindeki bir bahçenin etrafına, köşelerine de mutlaka birer fidan dikilmek şartıyla eşit aralıklarla fidan dikilecektir.\n\nİki fidan arasındaki mesafe en fazla kaç metre olabilir?',
    options: [
      { id: 'A', text: '$6\\text{ m}$', misconceptionNote: 'Ortak bölenlerden biridir ancak EN BÜYÜK ortak bölen değildir.' },
      { id: 'B', text: '$8\\text{ m}$', misconceptionNote: '48 sayısını böler ancak 36 sayısını tam bölmez.' },
      { id: 'C', text: '$12\\text{ m}$', misconceptionNote: undefined }, // Correct! EBOB(36, 48) = 12
      { id: 'D', text: '$24\\text{ m}$', misconceptionNote: '36 sayısını bölmez, sadece 48 sayısının bölenidir.' },
    ],
    trustedAnswerKey: 'C',
    solution:
      'Aralık mesafesinin **en fazla** olması için kenar uzunluklarının En Büyük Ortak Böleni (EBOB) bulunmalıdır:\n$$36 = 2^2 \\cdot 3^2$$\n$$48 = 2^4 \\cdot 3^1$$\n$$\\text{EBOB}(36, 48) = 2^2 \\cdot 3^1 = 12\\text{ m}$$\nDoğru cevap **C** seçeneğidir.',
    generalExplanation: 'Bütünden parçaya gidilen ve aralıkların maksimum istendiği sorularda EBOB kullanılır.',
    sourceLabel: 'Kübik Özgün Soru Havuzu — LGS Matematik Doğrulanmış Örnek Soru',
    isVerified: true,
    estimatedTimeSec: 90,
  },

  // ===================== YKS TRACK =====================
  {
    id: 'yks-math-01',
    track: 'YKS',
    grade: '12. Sınıf / Mezun (TYT-AYT)',
    subject: 'Matematik',
    topic: 'Fonksiyonlar (Tek ve Çift Fonksiyonlar)',
    learningObjective: 'Fonksiyonların cebirsel ve grafiksel simetri özelliklerini (tek ve çift fonksiyon) kavrar ve uygular.',
    difficulty: 'Orta',
    questionText:
      'Gerçel sayılar kümesi $\\mathbb{R}$ üzerinde tanımlı bir $f$ fonksiyonu için her $x \\in \\mathbb{R}$ sayısında\n$$f(-x) = f(x)$$\neşitliği sağlanmaktadır.\n\n$$f(x) = (a-2)x^3 + x^2 + (b+1)x + 4$$\n\nolduğuna göre, $f(a+b)$ değeri kaçtır?',
    diagramNote: 'Çift fonksiyonların grafikleri y eksenine göre simetriktir; polinom yapısında tek dereceli x terimleri sıfırlanmalıdır.',
    options: [
      {
        id: 'A',
        text: '$3$',
        misconceptionNote: 'Katsayı hesaplamalarında işaret hatası veya fonksiyondaki sabit terimi dahil etmeme.',
      },
      {
        id: 'B',
        text: '$5$',
        misconceptionNote: undefined, // Correct!
      },
      {
        id: 'C',
        text: '$7$',
        misconceptionNote: 'İşlemde $a+b$ değerini hatalı bulma veya $x^2$ terimini karesini almadan ekleme.',
      },
      {
        id: 'D',
        text: '$8$',
        misconceptionNote:
          'Fonksiyonu tek fonksiyon zannederek çift dereceli terimleri ($x^2$ ve sabit terimi) sıfırlama veya hatalı katsayı eşitlemesi.',
      },
    ],
    trustedAnswerKey: 'B',
    solution:
      '**Adım 1:** Çift fonksiyon özelliğini hatırlayalım.\nHer $x$ için $f(-x) = f(x)$ ise $f$ bir **çift fonksiyondur**.\nPolinom biçimindeki bir çift fonksiyonda **tek dereceli terimlerin katsayıları $0$** olmalıdır:\n- $x^3$ teriminin katsayısı: $a - 2 = 0 \\implies a = 2$\n- $x^1$ teriminin katsayısı: $b + 1 = 0 \\implies b = -1$\n\n**Adım 2:** Fonksiyonun sade halini yazalım.\n$$f(x) = 0 \\cdot x^3 + x^2 + 0 \\cdot x + 4 = x^2 + 4$$\n\n**Adım 3:** İstenen $f(a+b)$ değerini bulalım.\n$$a + b = 2 + (-1) = 1$$\n$$f(1) = 1^2 + 4 = 1 + 4 = 5$$\n\nDoğru cevap **B** seçeneğidir.',
    generalExplanation:
      'Çift fonksiyonda $f(-x) = f(x)$ simetrisi tek üslü terimleri sıfırlar. Bu temel kural tespit edildikten sonra katsayılar ve bileşke parametre yerine konur.',
    followUpQuestionId: 'yks-math-01-followup',
    sourceLabel: 'Kübik Özgün Soru Havuzu — YKS Matematik Doğrulanmış Örnek Soru',
    isVerified: true,
    estimatedTimeSec: 150,
  },

  // YKS FOLLOW-UP QUESTION
  {
    id: 'yks-math-01-followup',
    track: 'YKS',
    grade: '12. Sınıf / Mezun (TYT-AYT)',
    subject: 'Matematik',
    topic: 'Fonksiyonlar (Çift Fonksiyon Değer Değerlendirme)',
    learningObjective: 'Çift fonksiyonlarda $f(-x) = f(x)$ eşitliğini sayısal değerler üzerinde doğrudan yorumlar.',
    difficulty: 'Temel',
    questionText:
      'Gerçel sayılarda tanımlı $g(x) = x^2 + k$ fonksiyonu verilmektedir.\n\n$g$ fonksiyonunun bir çift fonksiyon olduğu ve $g(2) = 7$ olduğu bilindiğine göre, $g(-2) + g(0)$ toplamı kaçtır?',
    options: [
      {
        id: 'A',
        text: '$10$',
        misconceptionNote: undefined, // Correct! g(-2)=g(2)=7. 2^2 + k = 7 => k = 3. g(0) = 3. 7 + 3 = 10.
      },
      {
        id: 'B',
        text: '$14$',
        misconceptionNote: 'Sadece $g(-2)$ ve $g(2)$ toplamı alınmış ($7 + 7$), $g(0)$ değeri eklenmemiş.',
      },
      {
        id: 'C',
        text: '$11$',
        misconceptionNote: '$k$ sabit terimi bulunurken $2^2 = 4$ yerine yanlış işlem yapılmış.',
      },
      {
        id: 'D',
        text: '$7$',
        misconceptionNote: '$g(0)$ değerinin sıfır olacağı yanılgısına düşülmüş.',
      },
    ],
    trustedAnswerKey: 'A',
    solution:
      '**1. Adım:** Çift fonksiyon özelliği:\n$g(-2) = g(2) = 7$ olur.\n\n**2. Adım:** $k$ sabitini bulalım:\n$$g(2) = 2^2 + k = 4 + k = 7 \\implies k = 3$$\n\n**3. Adım:** $g(0)$ değerini hesaplayalım:\n$$g(0) = 0^2 + 3 = 3$$\n\n**4. Adım:** Toplamı hesaplayalım:\n$$g(-2) + g(0) = 7 + 3 = 10$$\nDoğru cevap **A** seçeneğidir.',
    generalExplanation: 'Çift fonksiyonlarda zıt işaretli girdilerin aynı çıktıyı verdiği bilgisi pekiştirilir.',
    sourceLabel: 'Kübik Öğrenme Döngüsü — Hedefe Yönelik Pekiştirme Sorusu',
    isVerified: true,
    estimatedTimeSec: 75,
  },

  // ===================== ARA SINIFLAR (10. Sınıf) =====================
  {
    id: 'ara-math-01',
    track: 'ARA_SINIF',
    grade: '10. Sınıf',
    subject: 'Matematik',
    topic: 'İkinci Dereceden Bir Bilinmeyenli Denklemler',
    learningObjective: 'Kökler ile katsayılar arasındaki bağıntıları kullanarak problem çözer.',
    difficulty: 'Orta',
    questionText:
      '$$x^2 - 6x + m - 1 = 0$$\n\ndenkleminin kökleri $x_1$ ve $x_2$\'dir.\n\nKökler arasında $x_1 - x_2 = 2$ bağıntısı olduğuna göre, $m$ gerçel sayısı kaçtır?',
    diagramNote: 'Kökler toplamı $x_1 + x_2 = -\\frac{b}{a}$ ve kökler çarpımı $x_1 \\cdot x_2 = \\frac{c}{a}$ formüllerini kullanınız.',
    options: [
      { id: 'A', text: '$7$', misconceptionNote: 'İşlemde sabit terimdeki $-1$ unutulmuş olabilir.' },
      { id: 'B', text: '$8$', misconceptionNote: 'Kökler çarpımı doğrudan $m$ olarak alınmış ($m-1$ yerine).' },
      { id: 'C', text: '$9$', misconceptionNote: undefined }, // Correct!
      { id: 'D', text: '$10$', misconceptionNote: 'Kökler farkı formülünde işaret hatası yapılmış olabilir.' },
    ],
    trustedAnswerKey: 'C',
    solution:
      '**Adım 1:** Kökler toplamını yazalım:\n$$x_1 + x_2 = -\\frac{-6}{1} = 6$$\n\n**Adım 2:** Verilen kökler farkı ile iki bilinmeyenli denklem sistemi kuralım:\n$$\\begin{cases} x_1 + x_2 = 6 \\\\ x_1 - x_2 = 2 \\end{cases}$$\nTaraf tarafa toplarsak: $2x_1 = 8 \\implies x_1 = 4$.\nBuradan $x_2 = 6 - 4 = 2$ bulunur.\n\n**Adım 3:** Kökler çarpımı bağıntısını uygulayalım:\n$$x_1 \\cdot x_2 = \\frac{m - 1}{1} = m - 1$$\n$$4 \\cdot 2 = m - 1 \\implies 8 = m - 1 \\implies m = 9$$\n\nDoğru cevap **C** seçeneğidir.',
    generalExplanation: 'Kökler toplamı ve farkından kökler bulunur, ardından kökler çarpımı ile bilinmeyen parametre hesaplanır.',
    followUpQuestionId: 'ara-math-01-followup',
    sourceLabel: 'Kübik Özgün Soru Havuzu — 10. Sınıf Matematik Doğrulanmış Örnek Soru',
    isVerified: true,
    estimatedTimeSec: 120,
  },

  // ARA SINIF FOLLOW-UP
  {
    id: 'ara-math-01-followup',
    track: 'ARA_SINIF',
    grade: '10. Sınıf',
    subject: 'Matematik',
    topic: 'İkinci Dereceden Denklemler (Kökler Bağıntısı Pekiştirme)',
    learningObjective: 'Kökler toplamı formülünü hızlı ve doğru uygular.',
    difficulty: 'Temel',
    questionText:
      '$$2x^2 - 8x + 5 = 0$$\n\ndenkleminin kökleri $x_1$ ve $x_2$\'dir. Kökler toplamı olan $x_1 + x_2$ değeri kaçtır?',
    options: [
      { id: 'A', text: '$4$', misconceptionNote: undefined }, // Correct! -(-8)/2 = 4
      { id: 'B', text: '$-4$', misconceptionNote: 'İşaret hatası: Formüldeki eksiyi unutma ($-(-8) = +8$).' },
      { id: 'C', text: '$\\frac{5}{2}$', misconceptionNote: 'Kökler toplamı yerine kökler çarpımını buldunuz.' },
      { id: 'D', text: '$8$', misconceptionNote: 'Baş katsayı olan $a=2$\'ye bölmeyi unuttunuz.' },
    ],
    trustedAnswerKey: 'A',
    solution:
      'Kökler toplamı formülü:\n$$x_1 + x_2 = -\\frac{b}{a}$$\nBurada $a = 2$, $b = -8$\'dir:\n$$x_1 + x_2 = -\\frac{-8}{2} = \\frac{8}{2} = 4$$\nDoğru cevap **A** seçeneğidir.',
    generalExplanation: 'Baş katsayıya bölme ve işaret kuralının pekiştirilmesi sağlanır.',
    sourceLabel: 'Kübik Öğrenme Döngüsü — Hedefe Yönelik Pekiştirme Sorusu',
    isVerified: true,
    estimatedTimeSec: 45,
  },
];

export function getQuestionsByTrack(track: Track): Question[] {
  return SAMPLE_QUESTIONS.filter((q) => q.track === track && !q.id.includes('followup'));
}

export function getQuestionById(id: string): Question | undefined {
  return SAMPLE_QUESTIONS.find((q) => q.id === id);
}

export function getFollowUpQuestion(currentQuestionId: string): Question | undefined {
  const current = getQuestionById(currentQuestionId);
  if (current?.followUpQuestionId) {
    return SAMPLE_QUESTIONS.find((q) => q.id === current.followUpQuestionId);
  }
  return undefined;
}
