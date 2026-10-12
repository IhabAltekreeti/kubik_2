import React, { useState, useRef, useEffect } from 'react';
import { useDemo } from '../context/DemoContext';
import MathView from './MathView';
import {
  Sparkles,
  Send,
  Loader2,
  CheckCircle2,
  Lightbulb,
  MessageSquare,
  Compass,
} from 'lucide-react';

export const AITutorView: React.FC = () => {
  const {
    tutorMessages,
    sendTutorMessage,
    isTutorLoading,
    tutorError,
    activeQuestion,
    latestAttemptForActive,
    serverStatus,
  } = useDemo();

  const [inputPrompt, setInputPrompt] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [tutorMessages, isTutorLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputPrompt.trim() || isTutorLoading) return;
    const text = inputPrompt.trim();
    setInputPrompt('');
    await sendTutorMessage(text);
  };

  const handleQuickPrompt = (promptText: string) => {
    if (isTutorLoading) return;
    sendTutorMessage(promptText);
  };

  const quickPrompts = [
    'Bu adımda neden böyle yaptık?',
    'Bana küçük bir ipucu ver',
    'Temel kuralı formülle açıklar mısın?',
    'Tüm adımları detaylıca göster',
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col h-[750px] max-h-[85vh]">
      {/* Tutor Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200/80 bg-slate-50/60 rounded-t-2xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-base">Kübik Öğrenme Rehberi</h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                Pedagojik Asistan
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Aktif Konu: <strong className="text-slate-700 font-medium">{activeQuestion?.topic}</strong>
            </p>
          </div>
        </div>

        {/* Engine status */}
        <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
          {serverStatus?.hasGeminiKey ? (
            <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Gemini 3.8 Flash (Aktif)
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Kübik Pedagojik Motor (Yerel/Demo)
            </span>
          )}
        </div>
      </div>

      {/* Context Badge: Let student see what context tutor knows */}
      {activeQuestion && (
        <div className="px-5 py-2.5 bg-indigo-50/40 border-b border-indigo-100/60 text-xs text-indigo-950 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span>
              Bağlam: <strong>{activeQuestion.grade}</strong> • Soru No: {activeQuestion.id} •{' '}
              {latestAttemptForActive
                ? `Son Deneme: ${latestAttemptForActive.selectedOption} şıkkı (${latestAttemptForActive.isCorrect ? 'Doğru' : 'Hatalı'})`
                : 'Henüz cevap gönderilmedi'}
            </span>
          </div>
          <span className="text-[11px] text-indigo-700 font-medium">Otomatik Bağlam Aktarımı</span>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {tutorMessages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed ${
                  isUser
                    ? 'bg-[#002499] text-[#e1e5ed] rounded-tr-xs shadow-xs'
                    : 'bg-slate-50 border border-slate-200/80 text-slate-900 rounded-tl-xs shadow-2xs'
                }`}
              >
                {/* Message Content rendered with KaTeX & Markdown */}
                <div className={isUser ? 'text-[#e1e5ed]' : 'text-slate-800'}>
                  <MathView content={msg.content} className={isUser ? 'text-[#e1e5ed]' : undefined} />
                </div>

                <div
                  className={`mt-2 text-[10px] flex items-center justify-end gap-1.5 ${
                    isUser ? 'text-blue-100' : 'text-slate-400'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {msg.source && !isUser && (
                    <span>• {msg.source === 'gemini-live' ? 'Gemini 3.8 Flash' : 'Kübik Rehber'}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isTutorLoading && (
          <div className="flex gap-3 justify-start items-center">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
            </div>
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl rounded-tl-xs px-4 py-3 text-xs text-slate-600 flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
              <span>Kübik Rehber pedagojik adımı hazırlıyor...</span>
            </div>
          </div>
        )}

        {tutorError && (
          <div className="p-3 bg-amber-50 text-amber-800 text-xs rounded-xl border border-amber-200">
            {tutorError}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50 flex flex-wrap gap-1.5">
        <span className="text-[11px] text-slate-400 self-center mr-1">Hızlı Sor:</span>
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            disabled={isTutorLoading}
            onClick={() => handleQuickPrompt(qp)}
            className="text-xs px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 border border-slate-200 transition-colors cursor-pointer font-medium disabled:opacity-50"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSend}
        className="p-3 sm:p-4 border-t border-slate-200/80 bg-white rounded-b-2xl flex items-center gap-2"
      >
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder="Aklına takılan soruyu veya adımı yaz..."
          disabled={isTutorLoading}
          className="flex-1 bg-slate-50 hover:bg-slate-100/60 focus:bg-white text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900"
        />
        <button
          type="submit"
          disabled={!inputPrompt.trim() || isTutorLoading}
          className={`p-2.5 rounded-xl font-semibold transition-all cursor-pointer ${
            inputPrompt.trim() && !isTutorLoading
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
          title="Mesajı gönder"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default AITutorView;
