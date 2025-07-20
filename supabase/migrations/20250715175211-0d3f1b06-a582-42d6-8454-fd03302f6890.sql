
-- Create a table to store study topics and content
CREATE TABLE public.study_topics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table to store generated flashcards
CREATE TABLE public.flashcards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID REFERENCES public.study_topics(id) ON DELETE CASCADE NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table to store quiz questions
CREATE TABLE public.quiz_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID REFERENCES public.study_topics(id) ON DELETE CASCADE NOT NULL,
  question TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table to track user study sessions
CREATE TABLE public.study_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID REFERENCES public.study_topics(id) ON DELETE CASCADE NOT NULL,
  session_type TEXT NOT NULL CHECK (session_type IN ('flashcards', 'quiz')),
  score INTEGER DEFAULT 0,
  total_questions INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_flashcards_topic_id ON public.flashcards(topic_id);
CREATE INDEX idx_quiz_questions_topic_id ON public.quiz_questions(topic_id);
CREATE INDEX idx_study_sessions_topic_id ON public.study_sessions(topic_id);

-- Add RLS policies (making tables publicly accessible for now)
ALTER TABLE public.study_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies that allow public access
CREATE POLICY "Allow public access to study topics" ON public.study_topics FOR ALL USING (true);
CREATE POLICY "Allow public access to flashcards" ON public.flashcards FOR ALL USING (true);
CREATE POLICY "Allow public access to quiz questions" ON public.quiz_questions FOR ALL USING (true);
CREATE POLICY "Allow public access to study sessions" ON public.study_sessions FOR ALL USING (true);
