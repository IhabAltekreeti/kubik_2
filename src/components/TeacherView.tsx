import React, { useState } from 'react';
import { useDemo } from '../context/DemoContext';
import { getQuestionById } from '../data/questions';
import {
  Users,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Send,
  MessageSquare,
  ShieldCheck,
  Award,
  Layers,
  HelpCircle,
} from 'lucide-react';
import MathView from './MathView';

export const TeacherView: React.FC = () => {
  const {
    attempts,
    track,
    setTrack,
    teacherInterventions,
    addTeacherNote,
    activeStudentName,
  } = useDemo();

  const [newNote, setNewNote] = useState('');
  const [selectedAction, setSelectedAction] = useState('3 Adımlı Pekiştirme Çalışması');

  const attemptsForStudent = attempts.filter((a) => a.track === track);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    addTeacherNote(newNote.trim(), selectedAction);
    setNewNote('');
  };

  return (
    <div className="space-y-6">
      {/* Teacher Workspace Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-900">Öğretmen Masası — Pedagojik Teşhis Paneli</h2>
          </div>
          <p className="text-xs text-slate-500">
            Öğrencinin anlık oturumundaki takıldığı noktaları inceleyin ve ders içi mikro müdahaleler planlayın.
          </p>
        </div>

        {/* Active Student Selector / Badge */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 mr-1">Öğrenci Seçimi:</span>
          {[
            { name: 'Zeynep Kaya', trackId: 'LGS' as const, grade: '8. Sınıf' },
            { name: 'Emre Demir', trackId: 'YKS' as const, grade: '12. Sınıf' },
            { name: 'Berke Yıldız', trackId: 'ARA_SINIF' as const, grade: '10. Sınıf' },
          ].map((student) => {
            const isSelected = track === student.trackId;
            return (
              <button
                key={student.name}
                onClick={() => setTrack(student.trackId)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#14264B] text-white border-[#14264B] shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className="font-semibold">{student.name}</span>{' '}
                <span className="opacity-75 text-[11px]">({student.grade})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2-Column Teacher Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Student's Actual Attempts & Detected Misconceptions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-base">
                Öğrencinin Oturumdaki Soru Çözüm Geçmişi
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                {attemptsForStudent.length} Deneme Kaydedildi
              </span>
            </div>

            {attemptsForStudent.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <p>Bu öğrenciden bu oturumda henüz bir soru çözümü gelmedi.</p>
                <p className="mt-1 text-slate-400">
                  Öğrenci moduna geçip bir soru çözdüğünüzde çözümler burada anında listelenecektir.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {attemptsForStudent.map((att, idx) => {
                  const q = getQuestionById(att.questionId);
                  return (
                    <div
                      key={att.id || idx}
                      className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {att.isCorrect ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Doğru ({att.selectedOption})
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-xs font-semibold">
                              <AlertCircle className="w-3.5 h-3.5" /> Hatalı Seçim ({att.selectedOption})
                            </span>
                          )}
                          <span className="text-xs font-bold text-slate-800">{q?.topic}</span>
                        </div>
                        <span className="text-xs font-mono text-slate-400">{att.submittedAt}</span>
                      </div>

                      <div className="text-xs text-slate-700 font-normal leading-relaxed">
                        <strong className="text-slate-900">Soru Metni:</strong>{' '}
                        <MathView content={q?.questionText || ''} />
                      </div>

                      {!att.isCorrect && att.detectedMisconception && (
                        <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900">
                          <strong className="font-semibold block mb-0.5 flex items-center gap-1 text-amber-800">
                            <Lightbulb className="w-3.5 h-3.5" />
                            Pedagojik Hipotez (Öğretmen İpuçları):
                          </strong>
                          {att.detectedMisconception}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Teacher Suggested Action based on data */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-slate-900 text-base">
                Önerilen Sınıf İçi ve Birebir Öğretmen Müdahalesi
              </h3>
            </div>

            <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-blue-950 space-y-2">
              <p className="font-semibold text-blue-900">
                {track === 'LGS'
                  ? 'Üslü Sayılarda Aynı Tabanla Çarpma ve Bölme Ayrımı:'
                  : track === 'YKS'
                  ? 'Çift Fonksiyonlarda Simetri Ekseni ve Katsayı Kuralı:'
                  : 'İkinci Dereceden Denklemlerde Kök Bağıntıları:'}
              </p>
              <p className="leading-relaxed">
                {track === 'LGS'
                  ? 'Öğrenci doğru cevabı bulmakta değil, üsleri çarpma ve toplama kurallarını karıştırmakta zorlanıyor olabilir. Bir sonraki derste aynı tabanlı üslü sayılarda tekrarlı çarpım modelini tahtada 3 dakikalık kısa bir somutlaştırmayla ele almanız önerilir.'
                  : track === 'YKS'
                  ? 'Öğrenci çift fonksiyon grafiğinin y eksenine göre simetrik olmasından tek dereceli terimlerin yok olması gerektiğini biliyor ancak bileşke/parametre yerine koymada dikkat hatası yapabiliyor.'
                  : 'Kökler toplamı $-b/a$ formülündeki işaret kuralı ile kökler farkı denklem sisteminin ortak çözümünü pekiştirici bir alıştırma uygulatınız.'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Col: Teacher Note Taking & Intervention Management */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <h3 className="font-bold text-slate-900 text-base mb-1">Öğrenciye Not & Görev Bırak</h3>
            <p className="text-xs text-slate-500 mb-4">
              Öğretmen gözleminizi kaydedin; bu not öğrencinin gelişim dosyasına ve veli özetine yansıtılır.
            </p>

            <form onSubmit={handleAddNote} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Öğretmen Gözlemi:
                </label>
                <textarea
                  rows={3}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Örn: Tabanları aynı üslü ifadeler konusundaki 2. adımı derste birlikte tekrar ettik..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50 focus:bg-white transition-all text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Önerilen Takip Eylemi:
                </label>
                <select
                  value={selectedAction}
                  onChange={(e) => setSelectedAction(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50 text-slate-900"
                >
                  <option value="3 Adımlı Pekiştirme Çalışması">3 Adımlı Pekiştirme Çalışması</option>
                  <option value="Birebir Etüt Masası Randevusu">Birebir Etüt Masası Randevusu</option>
                  <option value="Haftalık Tekrar Fasikülü">Haftalık Tekrar Fasikülü</option>
                  <option value="Kavram Haritası Çıkarma">Kavram Haritası Çıkarma</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={!newNote.trim()}
                className={`w-full py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  newNote.trim()
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Gözlemi Kaydet</span>
              </button>
            </form>
          </div>

          {/* Past Interventions */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <h4 className="font-bold text-slate-900 text-sm mb-3">Kaydedilen Öğretmen Notları</h4>
            <div className="space-y-3">
              {teacherInterventions.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-semibold text-blue-700">{item.assignedAction}</span>
                    <span>{item.date}</span>
                  </div>
                  <p className="text-slate-800 leading-relaxed font-normal">{item.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <p>
              <strong>Tek Oturum Bildirimi:</strong> Bu öğretmen paneli, aynı tarayıcı oturumundaki öğrenci
              cevaplarını anlık olarak gösterir. Gerçek çok kullanıcılı senaryoda kurum veritabanı üzerinden
              senkronize edilir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherView;
