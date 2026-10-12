import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;

  if (apiKey) {
    try {
      ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
      console.log('Gemini AI client successfully initialized with API key.');
    } catch (err) {
      console.error('Failed to initialize GoogleGenAI client:', err);
    }
  } else {
    console.log('No GEMINI_API_KEY detected. Running in deterministic demo guidance mode.');
  }

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      hasGeminiKey: Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY'),
      model: 'gemini-3.8-flash',
      institution: 'Kübik Dershanesi (Ereğli, Zonguldak)',
    });
  });

  // AI Tutor guidance endpoint
  app.post('/api/tutor', async (req, res) => {
    const {
      track,
      grade,
      subject,
      topic,
      questionText,
      trustedAnswerKey,
      studentOption,
      isCorrect,
      solution,
      misconceptionNote,
      messages = [],
      prompt,
    } = req.body;

    const studentQuestion = prompt || (messages.length > 0 ? messages[messages.length - 1].content : '');

    // If Gemini client is active, attempt live generation
    if (ai && apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
      try {
        const systemInstruction = `Sen "Kübik Öğrenme Rehberi"sin. Kübik Dershanesi'nin (Ereğli, Zonguldak) yapay zekâ destekli pedagojik rehber öğretmenisin.
Hedefin: Öğrencinin ezberlemesini değil, nerede takıldığını anlamasını sağlamak.

Pedagojik Kurallar:
1. Türkçe konuş, samimi, saygılı, cesaretlendirici ve yapıcı bir ton kullan. Asla yargılama veya küçümseme.
2. Öğrencinin seviyesine göre konuş:
   - LGS (8. sınıf): Anlaşılır, kısa adımlı, gündelik analojilerle desteklenmiş açıklamalar.
   - YKS (TYT/AYT): Matematiksel kesinlik, kural ispatı, kavram ilişkisi.
   - Ara sınıflar: Temel kavramı netleştiren, okul müfredatıyla uyumlu dil.
3. ADIM ADIM REHBERLİK: Öğrenci doğrudan "tüm çözümü ver" demedikçe cevabı hemen boca etme. Önce ilk mantıksal adımı ya da ipucunu ver, ardından düşünmesini sağla.
4. MATEMATİKSEL İFADELER:
   - Tüm matematiksel sembolleri ve formülleri mutlaka LaTeX formatında $inline$ (örnek: $f(x) = x^2 + 4$, $a^n \\cdot a^m = a^{n+m}$, $\\frac{1}{16}$) veya $$display$$ formatında yaz.
   - Asla çiğ metin veya biçimsiz LaTeX bırakma.
5. KESİN DOĞRULUK: Verilen soru ve çözüm anahtarını değiştirme. Tahmin yürütme; soru bağlamına sadık kal.
6. ÖĞRENCİ HATASI: Öğrenci yanlış cevap verdiyse (${studentOption ? `seçtiği şık: ${studentOption}` : ''}), bunun arkasındaki muhtemel kavram yanılgısını nazikçe açıkla.

Mevcut Ders Bağlamı:
- Parkur/Hedef: ${track || 'Genel'}
- Sınıf: ${grade || '8/12. Sınıf'}
- Ders: ${subject || 'Matematik'}
- Konu: ${topic || 'Genel Konu'}
- Aktif Soru: ${questionText || 'Belirtilmedi'}
- Doğru Cevap: ${trustedAnswerKey || 'Belirtilmedi'}
- Öğrencinin Durumu: ${isCorrect === true ? 'Doğru cevapladı' : isCorrect === false ? 'Yanlış cevapladı' : 'Soruyu çözüyor'}
${misconceptionNote ? `- Tespit Edilen Muhtemel Hata Notu: ${misconceptionNote}` : ''}
${solution ? `- Doğrulanmış Çözüm Mantığı: ${solution}` : ''}
`;

        // Format conversation history correctly for Gemini API:
        // 1. Must start with role: 'user' (drop any leading model/assistant messages)
        // 2. Roles must alternate user -> model -> user -> model
        // 3. Last message must be role: 'user'
        const rawHistory: Array<{ role: 'user' | 'model'; text: string }> = [];

        // Take last 6 messages
        const recentHistory = messages.slice(-6);
        for (const msg of recentHistory) {
          if ((msg.role === 'user' || msg.role === 'assistant') && msg.content?.trim()) {
            rawHistory.push({
              role: msg.role === 'assistant' ? 'model' : 'user',
              text: msg.content.trim(),
            });
          }
        }

        // Drop any leading 'model' messages
        while (rawHistory.length > 0 && rawHistory[0].role === 'model') {
          rawHistory.shift();
        }

        // Merge consecutive messages with the same role
        const alternatingHistory: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];
        for (const item of rawHistory) {
          if (
            alternatingHistory.length > 0 &&
            alternatingHistory[alternatingHistory.length - 1].role === item.role
          ) {
            alternatingHistory[alternatingHistory.length - 1].parts[0].text += `\n\n${item.text}`;
          } else {
            alternatingHistory.push({
              role: item.role,
              parts: [{ text: item.text }],
            });
          }
        }

        // Ensure last turn is 'user' with the active question
        const currentPrompt = studentQuestion || 'Bu soruda mantığı tam olarak nasıl kurmalıyım? Bana adım adım rehberlik eder misin?';
        if (alternatingHistory.length === 0) {
          alternatingHistory.push({
            role: 'user',
            parts: [{ text: currentPrompt }],
          });
        } else if (alternatingHistory[alternatingHistory.length - 1].role !== 'user') {
          alternatingHistory.push({
            role: 'user',
            parts: [{ text: currentPrompt }],
          });
        }

        const geminiPromise = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: alternatingHistory,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Gemini API timeout limit reached (7s)')), 7000)
        );

        const response = (await Promise.race([geminiPromise, timeoutPromise])) as any;

        const replyText = response.text;
        if (replyText) {
          return res.json({
            text: replyText,
            source: 'gemini-live',
            model: 'gemini-3.8-flash',
            timestamp: new Date().toISOString(),
          });
        }
      } catch (err: any) {
        console.error('Gemini API call failed, falling back to pedagogical rule engine:', err?.message || err);
      }
    }

    // Pedagogical Deterministic Fallback Response
    // Tailored directly to the active question topic and student answer
    let fallbackText = '';
    const questionTopicLower = (topic || '').toLowerCase();
    const questionTextLower = (questionText || '').toLowerCase();

    if (questionTopicLower.includes('ebob') || questionTopicLower.includes('çarpanlar') || questionTextLower.includes('bahçe')) {
      fallbackText = `Bu soru **En Büyük Ortak Bölen (EBOB)** mantığı ile çözülür:

1. **Problemi Anlayalım:**
- Dikdörtgen bahçenin kenarları $36\\text{ m}$ ve $48\\text{ m}$'dir.
- Eşit aralıklarla ve köşelere de gelecek şekilde fidan dikilecektir.
- İki fidan arasındaki mesafenin **en fazla** olması isteniyor.

2. **Matematiksel Kural:**
Mesafe hem $36$'yı hem de $48$'i tam bölmelidir. En büyük aralık için $\\text{EBOB}(36, 48)$ değerini bulmalıyız:
$$36 = 2^2 \\cdot 3^2$$
$$48 = 2^4 \\cdot 3^1$$
$$\\text{EBOB}(36, 48) = 2^2 \\cdot 3^1 = 12\\text{ m}$$

Bu nedenle fidanlar arasındaki mesafe en fazla **$12\\text{ m}$** olabilir (Doğru Cevap: **C**).

Aralık hesabı veya asal çarpanlara ayırma adımı netleşti mi?`;
    } else if (questionTopicLower.includes('üslü') || questionTextLower.includes('bakteri')) {
      if (studentOption === 'D' || (studentQuestion && studentQuestion.includes('neden'))) {
        fallbackText = `Harika bir soru! Gel bu adımı birlikte netleştirelim.

Buradaki en sık karşılaşılan tuzak, **üsleri çarpmak ile toplamak** arasındaki farktır:

1. **Temel Kuralımız:**
Tabanları aynı olan üslü ifadeler çarpılırken üsler toplanır:
$$a^n \\cdot a^m = a^{n+m}$$

2. **Bu Soruya Uygulayalım:**
- Başlangıç bakteri sayısı: $2^4$
- 2 saat = $120$ dakika. Her 20 dakikada bir 2 katına çıktığından $120 \\div 20 = 6$ defa ikiye katlanır ($2^6$).
- Toplam bakteri: $2^4 \\cdot 2^6$

Burada üsler çarpılmaz ($4 \\cdot 6 = 24$ değil!), kural gereği toplanır:
$$2^4 \\cdot 2^6 = 2^{4+6} = 2^{10}$$

**Küçük bir düşünme sorusu:** Eğer $3^3 \\cdot 3^5$ işlemini yapsaydık sonuç ne olurdu? Üsleri toplayarak dener misin?`;
      } else {
        fallbackText = `Adım adım ilerleyelim!

Bu soru **üslü ifadelerde çarpma kuralı** ile ilgilidir:
- İlk olarak 2 saat içinde bakterilerin kaç kez 2 katına çıktığını bulmalıyız.
- 2 saat $120$ dakikadır. $120 \\div 20 = 6$ kez bölünme gerçekleşir, yani katsayımız $2^6$ olur.
- Başlangıçtaki $2^4$ ile bu katı çarparız: $2^4 \\cdot 2^6$.

Tabanlar eşit ($2$) olduğuna göre üsleri toplaman yeterli olacaktır: $4 + 6 = 10$, yani $2^{10}$.

Aklına takılan herhangi bir adım var mı?`;
      }
    } else if (questionTopicLower.includes('fonksiyon')) {
      fallbackText = `Bu soruda çok kritik bir analitik kavram var: **Çift Fonksiyon Simetrisi**.

1. **Tanım:**
Her $x \\in \\mathbb{R}$ için $f(-x) = f(x)$ eşitliği fonksiyonun **çift fonksiyon** olduğunu belirtir. Çift fonksiyonların grafikleri $y$ eksenine göre simetriktir.

2. **Polinom Tipi Fonksiyonlarda Kural:**
Bir polinom fonksiyonunun çift olabilmesi için, tek dereceli terimlerin katsayıları $0$ olmalıdır ($x^3, x^1$ vb. bulunamaz):
- $(a-2)x^3$ teriminde: $a - 2 = 0 \\implies a = 2$
- $(b+1)x$ teriminde: $b + 1 = 0 \\implies b = -1$

3. **Fonksiyonun Kuralı:**
Tek dereceli terimler sıfırlandıktan sonra fonksiyonumuz:
$$f(x) = x^2 + 4$$
haline gelir.

4. **İstenen Değer:**
Bizden $f(a+b)$ isteniyor: $a + b = 2 + (-1) = 1$.
$$f(1) = 1^2 + 4 = 5$$

Böylece doğru cevabımız **$5$** çıkar. Çift fonksiyon mantığında yerine koyma adımı netleşti mi?`;
    } else if (questionTopicLower.includes('denklem')) {
      fallbackText = `İkinci dereceden denklemlerde kök-katsayı bağıntılarını birlikte hatırlayalım:

1. **Temel Formüller:**
$$a x^2 + b x + c = 0$$ denkleminde:
- Kökler toplamı: $x_1 + x_2 = -\\frac{b}{a}$
- Kökler çarpımı: $x_1 \\cdot x_2 = \\frac{c}{a}$

2. **Bu Soruya Uygulanışı:**
$x^2 - 6x + m - 1 = 0$ denkleminde $a = 1, b = -6, c = m - 1$:
- $x_1 + x_2 = -\\frac{-6}{1} = 6$
- Verilen bilgi: $x_1 - x_2 = 2$

Taraf tarafa toplarsak: $2x_1 = 8 \\implies x_1 = 4$ ve $x_2 = 2$ bulunur.
Kökler çarpımı:
$$x_1 \\cdot x_2 = 4 \\cdot 2 = 8 = m - 1 \\implies m = 9$$

Doğru cevap **$9$** (C seçeneği) olur. Hangi adım üzerinde durmak istersin?`;
    } else {
      fallbackText = `Merhaba! Sorundaki temel kavramı adım adım ele alalım:

1. **Verilenleri İnceleme:**
Soruda bizden istenen bağıntıyı oluştururken temel formülleri ve kuralları gözden geçirelim.

2. **Bir Sonraki Adım:**
Verilen denklemi bu kural ile eşleştirerek bilinmeyeni adım adım yalnız bırakabiliriz.

Hangi adımda takıldığını söylersen, o adımı birlikte açalım!`;
    }

    return res.json({
      text: fallbackText,
      source: 'pedagogical-engine-demo',
      model: 'Kübik Pedagojik Kural Motoru (Çevrimdışı/Demo)',
      timestamp: new Date().toISOString(),
    });
  });

  // Serve client in production or attach Vite middleware in development
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Kübik+] Sunucu http://0.0.0.0:${PORT} adresinde çalışıyor.`);
  });
}

startServer();
