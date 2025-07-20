
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, Target, Brain, BookOpen, ArrowLeft } from "lucide-react";

interface ProgressDashboardProps {
  onBackToStudy: () => void;
}

export const ProgressDashboard = ({ onBackToStudy }: ProgressDashboardProps) => {
  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Button variant="outline" onClick={onBackToStudy} className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            New Study Session
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900">Learning Dashboard</h1>
          
          <div className="w-32" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="p-6 text-center bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">95%</h3>
            <p className="text-gray-600">Success Rate</p>
          </Card>
          
          <Card className="p-6 text-center bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <Target className="h-8 w-8 text-blue-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">127</h3>
            <p className="text-gray-600">Cards Studied</p>
          </Card>
          
          <Card className="p-6 text-center bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <Brain className="h-8 w-8 text-purple-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">15</h3>
            <p className="text-gray-600">Quiz Score</p>
          </Card>
          
          <Card className="p-6 text-center bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <BookOpen className="h-8 w-8 text-green-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">8</h3>
            <p className="text-gray-600">Topics Mastered</p>
          </Card>
        </div>

        <div className="text-center mb-12 animate-fade-in">
          <div className="mb-6">
            <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Excellent Progress!</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              You're making great strides in your learning journey. Keep up the fantastic work!
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Recent Achievements</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Completed AI Basics flashcards</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Scored 90% on Machine Learning quiz</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Mastered Neural Networks concepts</span>
              </div>
            </div>
          </Card>

          <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Study Recommendations</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Brain className="h-4 w-4 text-blue-500 mr-3" />
                <span className="text-gray-700">Review Deep Learning fundamentals</span>
              </div>
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 text-green-500 mr-3" />
                <span className="text-gray-700">Practice Natural Language Processing</span>
              </div>
              <div className="flex items-center">
                <Target className="h-4 w-4 text-purple-500 mr-3" />
                <span className="text-gray-700">Explore Computer Vision topics</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="text-center mt-12">
          <Button 
            onClick={onBackToStudy}
            size="lg"
            className="px-8 py-4 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Start New Study Session
            <Brain className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
