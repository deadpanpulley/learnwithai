import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, XCircle, Trophy } from "lucide-react";
import { StudyContent } from "@/pages/Index";
import { saveSessionResult } from "@/components/SessionTracker";

interface QuizSessionProps {
  content: StudyContent;
  onComplete: () => void;
  onBack: () => void;
}

export const QuizSession = ({ content, onComplete, onBack }: QuizSessionProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const quizQuestions = content.questions.filter(q => q.options);
  const totalQuestions = quizQuestions.length;

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = async () => {
    const isCorrect = selectedAnswer === quizQuestions[currentQuestion].answer;
    const newAnswers = [...answers, isCorrect];
    setAnswers(newAnswers);
    
    if (isCorrect) {
      setScore(score + 1);
    }
    
    setShowResult(true);
    
    setTimeout(async () => {
      if (currentQuestion < totalQuestions - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        // Save session result
        if (content.topicId) {
          await saveSessionResult({
            topicId: content.topicId,
            sessionType: 'quiz',
            score: score + (isCorrect ? 1 : 0),
            totalQuestions: totalQuestions
          });
        }
        setTimeout(onComplete, 1500);
      }
    }, 2000);
  };

  const currentQuiz = quizQuestions[currentQuestion];
  const isCorrect = selectedAnswer === currentQuiz?.answer;

  if (currentQuestion >= totalQuestions) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center animate-fade-in">
          <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Quiz Complete!</h1>
          <p className="text-2xl text-gray-600 mb-8">
            Final Score: {score} / {totalQuestions}
          </p>
          <Button onClick={onComplete} size="lg" className="px-8">
            View Results
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-4xl w-full">
        <div className="flex justify-between items-center mb-8">
          <Button variant="outline" onClick={onBack} className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Study
          </Button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">{content.topic} Quiz</h1>
            <p className="text-gray-600">
              Question {currentQuestion + 1} of {totalQuestions} • Score: {score}/{currentQuestion}
            </p>
          </div>
          
          <div className="w-24" />
        </div>

        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        <Card className="p-8 mb-8 bg-white shadow-xl border-0">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 leading-relaxed">
            {currentQuiz?.question}
          </h2>

          <div className="space-y-4">
            {currentQuiz?.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={showResult}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-300 ${
                  selectedAnswer === option
                    ? showResult
                      ? isCorrect
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-red-500 bg-red-50 text-red-700'
                      : 'border-blue-500 bg-blue-50 text-blue-700'
                    : showResult && option === currentQuiz.answer
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg">{option}</span>
                  {showResult && (
                    <>
                      {selectedAnswer === option && (
                        isCorrect ? (
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        ) : (
                          <XCircle className="h-6 w-6 text-red-600" />
                        )
                      )}
                      {option === currentQuiz.answer && selectedAnswer !== option && (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      )}
                    </>
                  )}
                </div>
              </button>
            ))}
          </div>

          {selectedAnswer && !showResult && (
            <div className="mt-8 text-center">
              <Button 
                onClick={handleSubmitAnswer}
                size="lg"
                className="px-8 bg-purple-600 hover:bg-purple-700"
              >
                Submit Answer
              </Button>
            </div>
          )}

          {showResult && (
            <div className="mt-8 text-center animate-fade-in">
              <div className={`text-lg font-semibold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                {isCorrect ? '🎉 Correct!' : '❌ Incorrect'}
              </div>
              {!isCorrect && (
                <p className="text-gray-600 mt-2">
                  The correct answer is: {currentQuiz.answer}
                </p>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
