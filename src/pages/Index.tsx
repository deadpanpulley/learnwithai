import { useState } from "react";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { StudyMode } from "@/components/StudyMode";
import { FlashcardSession } from "@/components/FlashcardSession";
import { QuizSession } from "@/components/QuizSession";
import { ProgressDashboard } from "@/components/ProgressDashboard";

export type SessionType = 'flashcards' | 'quiz';
export type StudyContent = {
  topic: string;
  content: string;
  topicId?: string;
  questions: Array<{
    question: string;
    answer: string;
    options?: string[];
  }>;
};

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'study-mode' | 'session' | 'dashboard'>('welcome');
  const [sessionType, setSessionType] = useState<SessionType>('flashcards');
  const [studyContent, setStudyContent] = useState<StudyContent | null>(null);

  const handleStartStudy = (type: SessionType, content: StudyContent) => {
    setSessionType(type);
    setStudyContent(content);
    setCurrentScreen('session');
  };

  const handleSessionComplete = () => {
    setCurrentScreen('dashboard');
  };

  const handleBackToStudy = () => {
    setCurrentScreen('study-mode');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50">
      {currentScreen === 'welcome' && (
        <WelcomeScreen 
          onStart={() => setCurrentScreen('study-mode')} 
        />
      )}
      
      {currentScreen === 'study-mode' && (
        <StudyMode 
          onStartStudy={handleStartStudy}
        />
      )}
      
      {currentScreen === 'session' && studyContent && (
        <>
          {sessionType === 'flashcards' ? (
            <FlashcardSession 
              content={studyContent}
              onComplete={handleSessionComplete}
              onBack={handleBackToStudy}
            />
          ) : (
            <QuizSession 
              content={studyContent}
              onComplete={handleSessionComplete}
              onBack={handleBackToStudy}
            />
          )}
        </>
      )}
      
      {currentScreen === 'dashboard' && (
        <ProgressDashboard 
          onBackToStudy={handleBackToStudy}
        />
      )}
    </div>
  );
};

export default Index;
