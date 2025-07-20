import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, type } = await req.json();

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { 
            role: 'system', 
            content: type === 'flashcards' 
              ? 'You are an expert educator. Generate exactly 10 flashcards from the given content. You MUST respond with ONLY a valid JSON array of objects with "question" and "answer" fields. Do not include any other text, explanations, or markdown formatting. Start your response with [ and end with ].'
              : 'You are an expert educator. Generate exactly 10 multiple-choice quiz questions from the given content. You MUST respond with ONLY a valid JSON array of objects with "question", "correct_answer", "option_a", "option_b", "option_c", "option_d" fields. Do not include any other text, explanations, or markdown formatting. Start your response with [ and end with ].'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    const generatedContent = data.choices[0].message.content.trim();

    console.log('Generated content:', generatedContent);

    // Clean and parse JSON from the response
    let parsedContent;
    try {
      // Remove any markdown formatting or extra text
      let cleanContent = generatedContent;
      if (cleanContent.includes('```json')) {
        cleanContent = cleanContent.split('```json')[1].split('```')[0].trim();
      } else if (cleanContent.includes('```')) {
        cleanContent = cleanContent.split('```')[1].split('```')[0].trim();
      }
      
      parsedContent = JSON.parse(cleanContent);
    } catch (e) {
      console.error('JSON parsing error:', e);
      console.error('Content that failed to parse:', generatedContent);
      throw new Error(`Failed to parse generated content as JSON: ${e.message}`);
    }

    return new Response(JSON.stringify({ content: parsedContent }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-content function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});