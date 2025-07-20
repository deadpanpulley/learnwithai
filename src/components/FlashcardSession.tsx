import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, RotateCcw, Eye, EyeOff } from "lucide-react";
import { StudyContent } from "@/pages/Index";
import { saveSessionResult } from "@/components/SessionTracker";

interface FlashcardSessionProps {
  content: StudyContent;
  onComplete: () => void;
  onBack: () => void;
}

export const FlashcardSession = ({ content, onComplete, onBack }: FlashcardSessionProps) => {
  const [currentCard, setCurrentCard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [completedCards, setCompletedCards] = useState<Set<number>>(new Set());

  const flashcards = content.questions.filter(q => !q.options);
  const totalCards = flashcards.length;

  const handleNext = async () => {
    if (currentCard < totalCards - 1) {
      setCurrentCard(currentCard + 1);
      setShowAnswer(false);
    } else {
      // Save session result
      if (content.topicId) {
        await saveSessionResult({
          topicId: content.topicId,
          sessionType: 'flashcards',
          score: completedCards.size,
          totalQuestions: totalCards
        });
      }
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
      setShowAnswer(false);
    }
  };

  const handleCardComplete = () => {
    setCompletedCards(prev => new Set(prev).add(currentCard));
    setTimeout(() => handleNext(), 300);
  };

  const currentFlashcard = flashcards[currentCard];

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      
      <div className="max-w-5xl w-full relative z-10">
        <div className="flex justify-between items-center mb-12 animate-fade-in">
          <Button variant="outline" onClick={onBack} className="flex items-center px-6 py-3 border-2 hover-lift glass-card-subtle">
            <ArrowLeft className="mr-3 h-5 w-5" />
            Back to Study
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold gradient-text mb-2">{content.topic}</h1>
            <p className="text-lg text-muted-foreground">
              Card {currentCard + 1} of {totalCards}
            </p>
          </div>
          
          <div className="w-32" />
        </div>

        <div className="mb-12 animate-fade-in">
          <div className="w-full h-3 bg-muted/30 rounded-full overflow-hidden glass-card-subtle">
            <div 
              className="h-full bg-gradient-to-r from-primary via-accent to-emerald-500 rounded-full transition-all duration-700 ease-out relative"
              style={{ width: `${((currentCard + 1) / totalCards) * 100}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-shimmer" />
            </div>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>Progress</span>
            <span>{Math.round(((currentCard + 1) / totalCards) * 100)}%</span>
          </div>
        </div>

        <div className="relative mb-12 animate-scale-in">
          <Card 
            className={`glass-card p-12 min-h-[400px] cursor-pointer transition-all duration-700 hover-lift hover-glow border-0 relative overflow-hidden group ${
              showAnswer ? 'ring-2 ring-emerald-500/50' : 'ring-2 ring-primary/20'
            }`}
            onClick={() => setShowAnswer(!showAnswer)}
          >
            <div className={`absolute inset-0 transition-opacity duration-500 ${
              showAnswer 
                ? 'bg-gradient-to-br from-emerald-500/10 to-blue-500/10 opacity-100' 
                : 'bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100'
            }`} />
            
            <div className="flex flex-col justify-center items-center h-full text-center relative z-10">
              {!showAnswer ? (
                <div className="animate-fade-in space-y-6">
                  <div className="floating">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                      <Eye className="h-10 w-10 text-primary" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-primary uppercase tracking-widest font-semibold mb-4">Question</p>
                    <h2 className="text-3xl font-bold leading-relaxed max-w-3xl">
                      {currentFlashcard?.question}
                    </h2>
                  </div>
                  <p className="text-muted-foreground text-lg font-light">Click anywhere to reveal the answer</p>
                </div>
              ) : (
                <div className="animate-fade-in space-y-6">
                  <div className="floating">
                    <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
                      <EyeOff className="h-10 w-10 text-emerald-500" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-emerald-500 uppercase tracking-widest font-semibold mb-4">Answer</p>
                    <h2 className="text-3xl font-bold leading-relaxed max-w-3xl mb-8">
                      {currentFlashcard?.answer}
                    </h2>
                  </div>
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardComplete();
                    }}
                    className="px-8 py-4 text-lg bg-gradient-to-r from-emerald-500 to-green-600 hover-glow border-0 text-white font-semibold"
                  >
                    Got it! Next Card
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="flex justify-between items-center animate-fade-in">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentCard === 0}
            className="flex items-center px-6 py-3 border-2 hover-lift glass-card-subtle disabled:opacity-50"
          >
            <ArrowLeft className="mr-3 h-5 w-5" />
            Previous
          </Button>

          <Button
            variant="outline"
            onClick={() => setShowAnswer(!showAnswer)}
            className="flex items-center px-6 py-3 border-2 hover-lift glass-card-subtle"
          >
            <RotateCcw className="mr-3 h-5 w-5" />
            {showAnswer ? 'Show Question' : 'Show Answer'}
          </Button>

          <Button
            onClick={handleNext}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-primary to-accent hover-glow border-0 text-white font-semibold"
          >
            {currentCard === totalCards - 1 ? 'Complete Session' : 'Next Card'}
            <ArrowRight className="ml-3 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
