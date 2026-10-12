import React, { useState } from 'react';
import { DemoProvider, useDemo } from './context/DemoContext';
import Navbar from './components/Navbar';
import StudentHome from './components/StudentHome';
import QuestionWorkspace from './components/QuestionWorkspace';
import AITutorView from './components/AITutorView';
import ProgressView from './components/ProgressView';
import TopicsView from './components/TopicsView';
import TeacherView from './components/TeacherView';
import ParentView from './components/ParentView';
import InstitutionView from './components/InstitutionView';
import MathTestModal from './components/MathTestModal';
import {
  LayoutDashboard,
  HelpCircle,
  TrendingUp,
  BookOpen,
  Sparkles,
  Award,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

type StudentTab = 'home' | 'workshop' | 'tutor' | 'progress' | 'topics';

const MainContent: React.FC = () => {
  const { role, track, activeQuestion, setActiveQuestionId } = useDemo();
  const [studentTab, setStudentTab] = useState<StudentTab>('home');
  const [isMathModalOpen, setIsMathModalOpen] = useState(false);

  const studentTabs: Array<{ id: StudentTab; label: string; icon: React.ElementType }> = [
    { id: 'home', label: 'Bugünüm', icon: LayoutDashboard },
    { id: 'workshop', label: 'Soru Atölyesi', icon: HelpCircle },
    { id: 'tutor', label: 'AI Öğrenme Rehberi', icon: Sparkles },
    { id: 'progress', label: 'Gelişimim', icon: TrendingUp },
    { id: 'topics', label: 'Konularım', icon: BookOpen },
  ];

  const handleSelectTopicQuestion = (questionId: string) => {
    setActiveQuestionId(questionId);
    setStudentTab('workshop');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FB] text-[#172033]">
      {/* Top Navbar */}
      <Navbar onOpenMathTest={() => setIsMathModalOpen(true)} />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* If Role is Student: Show Student Sub-Navigation Tabs */}
        {role === 'ogrenci' && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex flex-wrap items-center gap-1">
              {studentTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = studentTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setStudentTab(tab.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#14264B] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-slate-500'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 pr-2">
              <span className="font-semibold text-slate-700">{track} Parkuru</span>
              <span>•</span>
              <span className="truncate max-w-[200px] text-slate-600">{activeQuestion?.topic}</span>
            </div>
          </div>
        )}

        {/* View Routing Based on Active Role */}
        {role === 'ogrenci' && (
          <>
            {studentTab === 'home' && (
              <StudentHome
                onGoToWorkshop={() => setStudentTab('workshop')}
                onGoToTutor={() => setStudentTab('tutor')}
                onGoToProgress={() => setStudentTab('progress')}
              />
            )}
            {studentTab === 'workshop' && (
              <QuestionWorkspace onOpenTutor={() => setStudentTab('tutor')} />
            )}
            {studentTab === 'tutor' && <AITutorView />}
            {studentTab === 'progress' && (
              <ProgressView onGoToWorkshop={() => setStudentTab('workshop')} />
            )}
            {studentTab === 'topics' && (
              <TopicsView onSelectTopicQuestion={handleSelectTopicQuestion} />
            )}
          </>
        )}

        {role === 'ogretmen' && <TeacherView />}
        {role === 'veli' && <ParentView />}
        {role === 'kurum' && <InstitutionView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-[#14264B] text-white flex items-center justify-center font-bold text-[10px]">
              K+
            </div>
            <span className="font-semibold text-slate-800">Kübik+ Öğrenme Platformu</span>
            <span>• Kübik Dershanesi (Ereğli, Zonguldak)</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span>“Sadece soru çözme. Nerede takıldığını anla, doğru yöntemle öğren.”</span>
            <span className="text-slate-300">•</span>
            <span className="text-emerald-700 font-medium">Doğrulanmış Soru & KaTeX Motoru</span>
          </div>
        </div>
      </footer>

      {/* KaTeX Math Verification Modal */}
      <MathTestModal
        isOpen={isMathModalOpen}
        onClose={() => setIsMathModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <DemoProvider>
      <MainContent />
    </DemoProvider>
  );
}
