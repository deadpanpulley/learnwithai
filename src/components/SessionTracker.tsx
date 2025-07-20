
import { supabase } from "@/integrations/supabase/client";

interface SessionResult {
  topicId: string;
  sessionType: 'flashcards' | 'quiz';
  score: number;
  totalQuestions: number;
}

export const saveSessionResult = async (result: SessionResult) => {
  try {
    const { error } = await supabase
      .from('study_sessions')
      .insert({
        topic_id: result.topicId,
        session_type: result.sessionType,
        score: result.score,
        total_questions: result.totalQuestions
      });

    if (error) {
      console.error('Error saving session result:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to save session result:', error);
  }
};

export const getStudyHistory = async () => {
  try {
    const { data, error } = await supabase
      .from('study_sessions')
      .select(`
        *,
        study_topics (
          title,
          description
        )
      `)
      .order('completed_at', { ascending: false });

    if (error) {
      console.error('Error fetching study history:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch study history:', error);
    return [];
  }
};
