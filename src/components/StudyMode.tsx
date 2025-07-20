import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Upload, PenTool, BookOpen, Brain, Loader2 } from "lucide-react";
import { SessionType, StudyContent } from "@/pages/Index";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface StudyModeProps {
  onStartStudy: (type: SessionType, content: StudyContent) => void;
}

export const StudyMode = ({ onStartStudy }: StudyModeProps) => {
  const [mode, setMode] = useState<'upload' | 'topic' | null>(null);
  const [content, setContent] = useState("");
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateAndStoreContent = async (text: string, topicName: string): Promise<StudyContent> => {
    // First, store the topic in Supabase
    const { data: topicData, error: topicError } = await supabase
      .from('study_topics')
      .insert({
        title: topicName,
        content: text,
        description: mode === 'topic' ? description : null
      })
      .select()
      .single();

    if (topicError) {
      console.error('Error storing topic:', topicError);
      throw new Error('Failed to store topic');
    }

    // Generate flashcards and quiz questions with edge function
    const flashcardsResponse = await supabase.functions.invoke('generate-content', {
      body: { 
        prompt: `Create 10 flashcard questions and answers from this content about "${topicName}":\n\n${text}`,
        type: 'flashcards'
      }
    });

    if (flashcardsResponse.error) {
      throw new Error('Failed to generate flashcards');
    }

    const quizResponse = await supabase.functions.invoke('generate-content', {
      body: { 
        prompt: `Create 10 multiple choice quiz questions from this content about "${topicName}":\n\n${text}`,
        type: 'quiz'
      }
    });

    if (quizResponse.error) {
      throw new Error('Failed to generate quiz questions');
    }

    const flashcards = flashcardsResponse.data.content;
    const quizQuestions = quizResponse.data.content;
    
    // Store flashcards in database
    const flashcardsToInsert = flashcards.map((card: any) => ({
      topic_id: topicData.id,
      question: card.question,
      answer: card.answer
    }));

    const { error: flashcardsError } = await supabase
      .from('flashcards')
      .insert(flashcardsToInsert);

    if (flashcardsError) {
      console.error('Error storing flashcards:', flashcardsError);
      throw new Error('Failed to store flashcards');
    }

    // Store quiz questions in database
    const quizToInsert = quizQuestions.map((quiz: any) => ({
      topic_id: topicData.id,
      question: quiz.question,
      correct_answer: quiz.correct_answer,
      option_a: quiz.option_a,
      option_b: quiz.option_b,
      option_c: quiz.option_c,
      option_d: quiz.option_d
    }));

    const { error: quizError } = await supabase
      .from('quiz_questions')
      .insert(quizToInsert);

    if (quizError) {
      console.error('Error storing quiz questions:', quizError);
      throw new Error('Failed to store quiz questions');
    }

    // Return the study content in the expected format
    return {
      topic: topicName,
      content: text,
      topicId: topicData.id,
      questions: [
        ...flashcards.map((card: any) => ({
          question: card.question,
          answer: card.answer
        })),
        ...quizQuestions.map((quiz: any) => ({
          question: quiz.question,
          answer: quiz.correct_answer,
          options: [quiz.option_a, quiz.option_b, quiz.option_c, quiz.option_d]
        }))
      ]
    };
  };

  const handleStart = async (sessionType: SessionType) => {
    if (!content.trim() && !topic.trim()) {
      toast({
        title: "Missing Content",
        description: "Please provide content or topic information.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const textContent = mode === 'upload' ? content : description;
      const topicName = mode === 'upload' ? 'Uploaded Content' : topic;
      
      const studyContent = await generateAndStoreContent(textContent, topicName);
      onStartStudy(sessionType, studyContent);
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: "Error",
        description: "Failed to generate study content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="text-center animate-fade-in relative z-10">
          <div className="glass-card p-12 rounded-3xl">
            <div className="relative mb-8">
              <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto" />
              <div className="absolute inset-0 animate-glow rounded-full" />
            </div>
            <h2 className="text-3xl font-bold mb-4 gradient-text">Creating Your Study Materials</h2>
            <p className="text-lg text-muted-foreground mb-6">AI is generating personalized flashcards and quizzes...</p>
            <div className="w-64 h-2 bg-muted rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-accent animate-shimmer" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      
      <div className="max-w-5xl w-full relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <div className="floating">
            <div className="glass-card-subtle p-6 rounded-full w-fit mx-auto mb-8">
              <Brain className="h-16 w-16 text-primary" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-6 gradient-text">Choose Your Learning Path</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">How would you like to create your study materials?</p>
        </div>

        {!mode ? (
          <div className="grid md:grid-cols-2 gap-12 stagger-in">
            <Card 
              className="glass-card p-10 cursor-pointer hover-lift hover-glow group border-0 relative overflow-hidden transition-all duration-500"
              onClick={() => setMode('upload')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Upload className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-3xl font-bold mb-4 group-hover:text-primary transition-colors">Upload Content</h3>
                <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                  Paste or upload any text content and we'll automatically generate personalized flashcards and quizzes using advanced AI
                </p>
                <div className="flex items-center text-primary font-semibold text-lg group-hover:translate-x-2 transition-transform duration-300">
                  Get Started <Upload className="ml-3 h-5 w-5" />
                </div>
              </div>
            </Card>

            <Card 
              className="glass-card p-10 cursor-pointer hover-lift hover-glow group border-0 relative overflow-hidden transition-all duration-500"
              onClick={() => setMode('topic')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-20 h-20 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <PenTool className="h-10 w-10 text-accent" />
                </div>
                <h3 className="text-3xl font-bold mb-4 group-hover:text-accent transition-colors">Describe Topic</h3>
                <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                  Tell us what you want to learn and we'll create comprehensive study materials tailored to your interests
                </p>
                <div className="flex items-center text-accent font-semibold text-lg group-hover:translate-x-2 transition-transform duration-300">
                  Get Started <PenTool className="ml-3 h-5 w-5" />
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <div className="animate-scale-in">
            <Card className="glass-card p-12 border-0 max-w-4xl mx-auto">
              {mode === 'upload' ? (
                <div className="space-y-8">
                  <div className="flex items-center justify-center mb-8">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mr-4">
                      <Upload className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-3xl font-bold gradient-text">Upload Your Content</h3>
                  </div>
                  <Textarea
                    placeholder="Paste your text content here... The more detailed content you provide, the better AI can create personalized study materials for you."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[250px] resize-none text-lg p-6 border-2 focus:border-primary/50 transition-colors glass-card-subtle"
                  />
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="flex items-center justify-center mb-8">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mr-4">
                      <PenTool className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="text-3xl font-bold gradient-text">Describe Your Topic</h3>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-lg font-semibold text-foreground mb-3">
                        What topic do you want to learn?
                      </label>
                      <Input
                        placeholder="e.g., Photosynthesis, World War II, Python Programming, Machine Learning"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="text-lg p-4 border-2 focus:border-accent/50 transition-colors glass-card-subtle"
                      />
                    </div>
                    <div>
                      <label className="block text-lg font-semibold text-foreground mb-3">
                        What specific aspects should we focus on?
                      </label>
                      <Textarea
                        placeholder="Describe what you want to learn about this topic... Include any specific areas you want to focus on or particular learning goals you have."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="min-h-[180px] resize-none text-lg p-4 border-2 focus:border-accent/50 transition-colors glass-card-subtle"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center mt-12">
                <Button 
                  variant="outline" 
                  onClick={() => setMode(null)}
                  className="px-8 py-4 text-lg border-2 hover-lift"
                >
                  Back
                </Button>
                
                <div className="space-x-6">
                  <Button 
                    onClick={() => handleStart('flashcards')}
                    className="px-8 py-4 text-lg bg-gradient-to-r from-primary to-primary/80 hover-glow border-0 text-white"
                  >
                    <BookOpen className="mr-3 h-5 w-5" />
                    Start Flashcards
                  </Button>
                  <Button 
                    onClick={() => handleStart('quiz')}
                    className="px-8 py-4 text-lg bg-gradient-to-r from-accent to-accent/80 hover-glow border-0 text-white"
                  >
                    <Brain className="mr-3 h-5 w-5" />
                    Start Quiz
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
