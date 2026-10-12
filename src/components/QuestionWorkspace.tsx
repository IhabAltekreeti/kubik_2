import React, { useState } from 'react';
import { useDemo } from '../context/DemoContext';
import { getFollowUpQuestion } from '../data/questions';
import MathView from './MathView';
import {
  HelpCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';

interface QuestionWorkspaceProps {
  onOpenTutor: () => void;
}

export const QuestionWorkspace: React.FC<QuestionWorkspaceProps> = ({ onOpenTutor }) => {
  const {
    activeQuestion,
    activeQuestionId,
    setActiveQuestionId,
    attempts,
    submitAnswer,
    sendTutorMessage,
  } = useDemo();

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isRetrying, setIsRetrying] = useState<boolean>(false);

  // Reset local state when active question changes
  React.useEffect(() => {
    setSelectedOption(null);
    setShowHint(false);
    setIsRetrying(false);
  }, [activeQuestionId]);

  if (!activeQuestion) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center text-slate-500 border border-slate-200">
        Soru bulunamadı. Lütfen sol menüden veya üst bardan bir parkur seçin.
      </div>
    );
  }

  // Check if current question has already been submitted in this session
  const currentAttempt = attempts
    .filter((a) => a.questionId === activeQuestionId)
    .slice(-1)[0];

  const isSubmitted = Boolean(currentAttempt) && !isRetrying;
  const isCorrect = currentAttempt?.isCorrect;
  const followUpQuestion = getFollowUpQuestion(activeQuestionId);

  const handleSubmit = () => {
    if (!selectedOption) return;
    setIsRetrying(false);
    submitAnswer(activeQuestionId, selectedOption);
  };

  const handleAskTutorAboutStep = () => {
    const prompt = currentAttempt && !currentAttempt.isCorrect
      ? `Bu soruda ${currentAttempt.selectedOption} şıkkını seçtim. Bu adımda neden böyle yaptığımızı ve hata noktamı bana adım adım anlatır mısın?`
      : `Bu sorunun çözüm adımlarını ve mantığını bana açıklar mısın?`;

    sendTutorMessage(prompt);
    onOpenTutor();
  };

  const handleGoToFollowUp = () => {
    if (activeQuestion.followUpQuestionId) {
      setSelectedOption(null);
      setShowHint(false);
      setIsRetrying(false);
      setActiveQuestionId(activeQuestion.followUpQuestionId);
    }
  };

  const handleResetCurrentQuestion = () => {
    setSelectedOption(null);
    setShowHint(false);
    setIsRetrying(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Question Metadata Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
            {activeQuestion.subject}
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-700 font-medium">{activeQuestion.topic}</span>
          <span className="text-slate-400">•</span>
          <span className="text-blue-700 font-semibold bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
            {activeQuestion.difficulty}
          </span>
          {activeQuestion.id.includes('followup') && (
            <span className="text-purple-700 font-bold bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
              Pekiştirme Sorusu
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="hidden sm:inline">{activeQuestion.sourceLabel}</span>
          <span className="sm:hidden">Doğrulanmış Soru</span>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        {/* Learning Objective / Kazanım */}
        <div className="mb-4 text-xs text-slate-500 flex items-start gap-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
          <BookOpen className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-800 font-medium">Hedef Kazanım:</strong>{' '}
            {activeQuestion.learningObjective}
          </div>
        </div>

        {/* Question Text with KaTeX */}
        <div className="text-base sm:text-lg text-slate-900 leading-relaxed font-normal mb-6">
          <MathView content={activeQuestion.questionText} />
        </div>

        {/* Diagram Note (if applicable) */}
        {activeQuestion.diagramNote && (
          <div className="my-4 p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-blue-900 flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold">Model İpucu:</strong> {activeQuestion.diagramNote}
            </div>
          </div>
        )}

        {/* Options List */}
        <div
          role="radiogroup"
          aria-label="Soru seçenekleri"
          className="space-y-3 my-6"
        >
          {activeQuestion.options.map((opt) => {
            const isSelected = selectedOption === opt.id || (isSubmitted && currentAttempt?.selectedOption === opt.id);
            const isCorrectOption = opt.id === activeQuestion.trustedAnswerKey;

            let borderStyle = 'border-slate-200 hover:border-slate-300 bg-white focus:ring-2 focus:ring-blue-500/30';
            let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-200';

            if (isSubmitted) {
              if (isCorrectOption) {
                borderStyle = 'border-emerald-500 bg-emerald-50/60 ring-1 ring-emerald-500';
                badgeStyle = 'bg-emerald-600 text-white border-emerald-600';
              } else if (isSelected && !isCorrect) {
                borderStyle = 'border-rose-400 bg-rose-50/60 ring-1 ring-rose-400';
                badgeStyle = 'bg-rose-600 text-white border-rose-600';
              } else {
                borderStyle = 'border-slate-200 opacity-60 bg-white';
              }
            } else if (isSelected) {
              borderStyle = 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/30';
              badgeStyle = 'bg-blue-600 text-white border-blue-600';
            }

            return (
              <div
                key={opt.id}
                role="radio"
                tabIndex={isSubmitted ? -1 : 0}
                aria-checked={Boolean(isSelected)}
                aria-label={`Seçenek ${opt.id}`}
                onClick={() => {
                  if (!isSubmitted) setSelectedOption(opt.id);
                }}
                onKeyDown={(e) => {
                  if (!isSubmitted && (e.key === ' ' || e.key === 'Enter')) {
                    e.preventDefault();
                    setSelectedOption(opt.id);
                  }
                }}
                className={`flex items-start gap-3.5 p-4 rounded-xl border transition-all cursor-pointer outline-none ${borderStyle}`}
              >
                <div
                  className={`w-7 h-7 rounded-lg border font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 ${badgeStyle}`}
                >
                  {opt.id}
                </div>
                <div className="text-sm sm:text-base text-slate-800 flex-1 leading-snug pt-0.5">
                  <MathView content={opt.text} as="span" />
                </div>
                {isSubmitted && isCorrectOption && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
                {isSubmitted && isSelected && !isCorrect && (
                  <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                )}
              </div>
            );
          })}
        </div>

        {/* Action Buttons before submission */}
        {!isSubmitted ? (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => setShowHint(!showHint)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-amber-500" />
              <span>{showHint ? 'İpucunu Gizle' : 'Küçük Bir İpucu Al'}</span>
            </button>

            <button
              disabled={!selectedOption}
              onClick={handleSubmit}
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                selectedOption
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-900/20 active:scale-[0.98]'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>Cevabı Gönder</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : null}

        {/* Small Hint Accordion */}
        {showHint && !isSubmitted && (
          <div className="mt-4 p-4 bg-amber-50/80 border border-amber-200/80 rounded-xl text-xs text-amber-900 animate-fadeIn">
            <div className="font-bold flex items-center gap-1.5 mb-1 text-amber-800">
              <Lightbulb className="w-4 h-4" />
              <span>Pedagojik İpucu</span>
            </div>
            <p className="leading-relaxed">
              Sorudaki zaman periyodunu ($2$ saat $= 120$ dk) bölünme aralığına ($20$ dk) bölerek katlanma sayısını bulun.
              Ardından tabanları aynı olan iki üslü ifadeyi çarparken üslerin nasıl işlendiğini hatırlayın!
            </p>
          </div>
        )}
      </div>

      {/* Post-submission Feedback Panel */}
      {isSubmitted && currentAttempt && (
        <div
          className={`rounded-2xl p-6 sm:p-7 border shadow-sm transition-all ${
            isCorrect
              ? 'bg-white border-emerald-200 ring-1 ring-emerald-500/20'
              : 'bg-white border-amber-200 ring-1 ring-amber-500/20'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5">
              {isCorrect ? (
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5" />
                </div>
              )}
              <div>
                <h4 className="font-bold text-slate-900 text-base">
                  {isCorrect ? 'Tebrikler, Cevabınız Doğru!' : 'Cevabınızı Birlikte İnceleyelim'}
                </h4>
                <p className="text-xs text-slate-500">
                  {isCorrect
                    ? 'Kazanımı başarıyla uyguladınız.'
                    : `Seçilen Şık: ${currentAttempt.selectedOption} • Doğru Şık: ${activeQuestion.trustedAnswerKey}`}
                </p>
              </div>
            </div>
          </div>

          {/* If Incorrect: Misconception Analysis */}
          {!isCorrect && currentAttempt.detectedMisconception && (
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 mb-5 text-xs text-amber-900">
              <div className="font-bold text-amber-800 flex items-center gap-1.5 mb-1.5">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span>Muhtemel Hata Noktası (Pedagojik Teşhis):</span>
              </div>
              <p className="leading-relaxed font-medium">
                {currentAttempt.detectedMisconception}
              </p>
            </div>
          )}

          {/* Full Worked Solution with KaTeX */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/70 mb-5">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Adım Adım Doğrulanmış Çözüm</span>
            </div>
            <div className="text-sm text-slate-800 leading-relaxed">
              <MathView content={activeQuestion.solution} />
            </div>
          </div>

          {/* Post-submission Next Steps */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleAskTutorAboutStep}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs border border-indigo-200 transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Rehbere Bu Adımı Sor</span>
              </button>

              <button
                onClick={handleResetCurrentQuestion}
                className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-slate-600 hover:text-slate-800 hover:bg-slate-100 text-xs font-medium transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Yeniden Dene</span>
              </button>
            </div>

            {/* Follow-up question CTA */}
            {followUpQuestion ? (
              <button
                onClick={handleGoToFollowUp}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-900/20 transition-all cursor-pointer"
              >
                <span>Hedefe Yönelik Pekiştirme Sorusuna Geç</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <span className="text-xs text-slate-500 font-medium">
                Bu kazanım için öğrenme döngüsü tamamlandı.
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionWorkspace;
