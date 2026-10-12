import React, { createContext, useContext, useState, useEffect } from 'react';
import { Track, Question, SAMPLE_QUESTIONS, getQuestionById, getFollowUpQuestion } from '../data/questions';

export type Role = 'ogrenci' | 'ogretmen' | 'veli' | 'kurum';

export interface StudentAttempt {
  id: string;
  questionId: string;
  track: Track;
  selectedOption: string;
  isCorrect: boolean;
  submittedAt: string;
  detectedMisconception?: string;
  isFollowUp: boolean;
  parentQuestionId?: string;
  explanationProvided?: string;
}

export interface TutorMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  source?: 'gemini-live' | 'pedagogical-engine-demo';
  questionId?: string;
}

export interface TeacherIntervention {
  id: string;
  date: string;
  note: string;
  assignedAction?: string;
}

interface DemoContextType {
  role: Role;
  setRole: (role: Role) => void;
  track: Track;
  setTrack: (track: Track) => void;
  activeQuestionId: string;
  setActiveQuestionId: (id: string) => void;
  activeQuestion: Question | undefined;
  attempts: StudentAttempt[];
  latestAttemptForActive: StudentAttempt | undefined;
  submitAnswer: (questionId: string, optionId: string) => void;
  isFollowUpAvailable: boolean;
  startFollowUp: () => void;
  tutorMessages: TutorMessage[];
  sendTutorMessage: (customPrompt?: string) => Promise<void>;
  isTutorLoading: boolean;
  tutorError: string | null;
  serverStatus: { hasGeminiKey: boolean; model: string } | null;
  teacherInterventions: TeacherIntervention[];
  addTeacherNote: (note: string, action?: string) => void;
  resetDemo: () => void;
  activeStudentName: string;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>('ogrenci');
  const [track, setTrackState] = useState<Track>('LGS');
  const [activeQuestionId, setActiveQuestionId] = useState<string>('lgs-math-01');
  const [attempts, setAttempts] = useState<StudentAttempt[]>([]);
  const [tutorMessages, setTutorMessages] = useState<TutorMessage[]>([
    {
      id: 'init-tutor-msg',
      role: 'assistant',
      content:
        'Merhaba! Ben **Kübik Öğrenme Rehberi**.\n\nSoru çözerken takıldığın bir adım olursa veya *"Bu adımı neden böyle yaptık?"* dediğinde bana sorabilirsin. Sana doğrudan cevabı vermek yerine, mantığı kavramanı sağlayacak ipuçlarıyla adım adım yardımcı olurum.\n\nİlk soruna hazırsan başlayalım!',
      timestamp: 'Şimdi',
      source: 'pedagogical-engine-demo',
    },
  ]);
  const [isTutorLoading, setIsTutorLoading] = useState(false);
  const [tutorError, setTutorError] = useState<string | null>(null);
  const [serverStatus, setServerStatus] = useState<{ hasGeminiKey: boolean; model: string } | null>(null);
  const [teacherInterventions, setTeacherInterventions] = useState<TeacherIntervention[]>([
    {
      id: 'demo-note-1',
      date: 'Bugün',
      note: 'Öğrencinin üslü sayılar yeni nesil problem modellemesinde taban-kuvvet ilişkisi dikkatle takip edilmeli.',
      assignedAction: 'Üslü sayılar 3 adımlı pekiştirme mikro görevi önerildi.',
    },
  ]);

  // Check backend health
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setServerStatus({
          hasGeminiKey: Boolean(data.hasGeminiKey),
          model: data.model || 'gemini-3.8-flash',
        });
      })
      .catch((err) => {
        console.warn('Backend health check note:', err);
      });
  }, []);

  const activeQuestion = getQuestionById(activeQuestionId);

  // Set track & update initial question accordingly
  const setTrack = (newTrack: Track) => {
    setTrackState(newTrack);
    if (newTrack === 'LGS') {
      setActiveQuestionId('lgs-math-01');
    } else if (newTrack === 'YKS') {
      setActiveQuestionId('yks-math-01');
    } else {
      setActiveQuestionId('ara-math-01');
    }
  };

  const latestAttemptForActive = attempts
    .filter((a) => a.questionId === activeQuestionId)
    .slice(-1)[0];

  const submitAnswer = (questionId: string, optionId: string) => {
    const q = getQuestionById(questionId);
    if (!q) return;

    const isCorrect = optionId === q.trustedAnswerKey;
    const selectedOptObj = q.options.find((opt) => opt.id === optionId);
    const misconceptionNote = selectedOptObj?.misconceptionNote;
    const isFollowUp = questionId.includes('followup');

    // Find parent if it's a follow-up
    let parentQuestionId: string | undefined = undefined;
    if (isFollowUp) {
      const parentQ = SAMPLE_QUESTIONS.find((item) => item.followUpQuestionId === questionId);
      parentQuestionId = parentQ?.id;
    }

    const newAttempt: StudentAttempt = {
      id: `att-${Date.now()}`,
      questionId,
      track: q.track,
      selectedOption: optionId,
      isCorrect,
      submittedAt: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      detectedMisconception: misconceptionNote,
      isFollowUp,
      parentQuestionId,
      explanationProvided: isCorrect ? q.solution : misconceptionNote || q.solution,
    };

    setAttempts((prev) => [...prev, newAttempt]);

    // Add automatic pedagogical tutor prompt in chat
    if (!isCorrect && misconceptionNote) {
      const introMsg: TutorMessage = {
        id: `tutor-reaction-${Date.now()}`,
        role: 'assistant',
        content: `Cevabını inceledim. **${optionId}** şıkkını seçtin. Bu çok doğal ve sıkça düşülen bir tuzaktır:\n\n> **Muhtemel Hata Noktası:** ${misconceptionNote}\n\nİstersen bu kuralın neden böyle olduğunu adım adım birlikte açabiliriz. Bana *"Bu adımda neden böyle yaptık?"* diye sorabilirsin!`,
        timestamp: 'Şimdi',
        source: 'pedagogical-engine-demo',
        questionId,
      };
      setTutorMessages((prev) => [...prev, introMsg]);
    } else if (isCorrect) {
      const successMsg: TutorMessage = {
        id: `tutor-success-${Date.now()}`,
        role: 'assistant',
        content: `Tebrikler! **${optionId}** doğru cevap. Matematiksel mantığı son derece tutarlı şekilde kurdun.\n\nŞimdi bu kazanımı kalıcı hale getirmek için hedefe yönelik **pekiştirme sorusuyla** devam etmeye ne dersin?`,
        timestamp: 'Şimdi',
        source: 'pedagogical-engine-demo',
        questionId,
      };
      setTutorMessages((prev) => [...prev, successMsg]);
    }
  };

  const isFollowUpAvailable = Boolean(
    activeQuestion?.followUpQuestionId && latestAttemptForActive
  );

  const startFollowUp = () => {
    if (activeQuestion?.followUpQuestionId) {
      setActiveQuestionId(activeQuestion.followUpQuestionId);
    }
  };

  const sendTutorMessage = async (customPrompt?: string) => {
    const promptText =
      customPrompt ||
      (latestAttemptForActive && !latestAttemptForActive.isCorrect
        ? 'Bu soruda seçtiğim şık neden hatalı oldu? Mantığını bana adım adım anlatır mısın?'
        : 'Bu sorunun çözüm mantığını ve temel formülünü adım adım izah eder misin?');

    const userMessage: TutorMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: promptText,
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      questionId: activeQuestionId,
    };

    setTutorMessages((prev) => [...prev, userMessage]);
    setIsTutorLoading(true);
    setTutorError(null);

    try {
      const payload = {
        track,
        grade: activeQuestion?.grade,
        subject: activeQuestion?.subject,
        topic: activeQuestion?.topic,
        questionText: activeQuestion?.questionText,
        trustedAnswerKey: activeQuestion?.trustedAnswerKey,
        studentOption: latestAttemptForActive?.selectedOption,
        isCorrect: latestAttemptForActive?.isCorrect,
        solution: activeQuestion?.solution,
        misconceptionNote: latestAttemptForActive?.detectedMisconception,
        messages: [...tutorMessages, userMessage],
        prompt: promptText,
      };

      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Sunucu hatası: ${res.status}`);
      }

      const data = await res.json();
      const assistantMessage: TutorMessage = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        content: data.text,
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
        source: data.source,
        questionId: activeQuestionId,
      };

      setTutorMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Error fetching tutor response:', err);
      setTutorError('Rehber yanıtı alınırken bir sorun oluştu. Pedagojik kural motoru devreye alındı.');

      // Fallback response so user experience is never blocked
      const fallbackReply: TutorMessage = {
        id: `ast-fallback-${Date.now()}`,
        role: 'assistant',
        content: `Bağlantı anlık olarak yerel moda geçti. Ancak sorunun çözüm mantığı çok net:\n\nBu soruda en kritik kural:\n$$a^n \\cdot a^m = a^{n+m}$$\nTabanlar eşit olduğunda üsler toplanır, çarpılmaz. Adımları tekrar kontrol edip pekiştirme sorusuyla ilerleyelim!`,
        timestamp: 'Şimdi',
        source: 'pedagogical-engine-demo',
        questionId: activeQuestionId,
      };
      setTutorMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setIsTutorLoading(false);
    }
  };

  const addTeacherNote = (note: string, action?: string) => {
    const intervention: TeacherIntervention = {
      id: `int-${Date.now()}`,
      date: 'Bugün',
      note,
      assignedAction: action || 'Rehberlik takibi tanımlandı.',
    };
    setTeacherInterventions((prev) => [intervention, ...prev]);
  };

  const resetDemo = () => {
    setTrackState('LGS');
    setActiveQuestionId('lgs-math-01');
    setAttempts([]);
    setTutorMessages([
      {
        id: 'init-tutor-msg',
        role: 'assistant',
        content:
          'Merhaba! Ben **Kübik Öğrenme Rehberi**.\n\nSoru çözerken takıldığın bir adım olursa veya *"Bu adımı neden böyle yaptık?"* dediğinde bana sorabilirsin. Sana doğrudan cevabı vermek yerine, mantığı kavramanı sağlayacak ipuçlarıyla adım adım yardımcı olurum.\n\nİlk soruna hazırsan başlayalım!',
        timestamp: 'Şimdi',
        source: 'pedagogical-engine-demo',
      },
    ]);
    setTutorError(null);
  };

  const activeStudentName =
    track === 'LGS' ? 'Zeynep Kaya (8. Sınıf)' : track === 'YKS' ? 'Emre Demir (12. Sınıf - YKS)' : 'Berke Yıldız (10. Sınıf)';

  return (
    <DemoContext.Provider
      value={{
        role,
        setRole,
        track,
        setTrack,
        activeQuestionId,
        setActiveQuestionId,
        activeQuestion,
        attempts,
        latestAttemptForActive,
        submitAnswer,
        isFollowUpAvailable,
        startFollowUp,
        tutorMessages,
        sendTutorMessage,
        isTutorLoading,
        tutorError,
        serverStatus,
        teacherInterventions,
        addTeacherNote,
        resetDemo,
        activeStudentName,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
};

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
}
