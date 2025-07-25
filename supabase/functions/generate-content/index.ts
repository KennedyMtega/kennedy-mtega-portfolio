import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();
    
    if (!prompt) {
      throw new Error('Prompt is required');
    }

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const GEMINI_MODEL = 'gemini-2.0-flash-exp';
    
    console.log('Generating content for prompt:', prompt);

    const aiPrompt = `You are an expert blog writer for Kennedy Mtega's portfolio. Write a high-quality, SEO-optimized blog post for the following topic. Return ONLY a valid JSON object with these exact keys: title, meta (SEO meta description), subheading, excerpt (1-2 sentence summary), and body (full markdown content).

Topic: ${prompt}

Return the response as a JSON object with NO additional text or formatting outside the JSON.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        contents: [{ 
          parts: [{ text: aiPrompt }] 
        }],
        generationConfig: { 
          temperature: 0.7, 
          maxOutputTokens: 2048,
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Gemini API response:', data);
    
    // Extract text from Gemini response
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      console.error('No text in response:', data);
      throw new Error('No response from AI');
    }

    // Parse JSON response
    let result;
    try {
      result = JSON.parse(text);
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Text:', text);
      // Fallback: try to extract JSON from text
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        result = JSON.parse(match[0]);
      } else {
        throw new Error('AI response is not valid JSON');
      }
    }

    // Validate required fields
    const requiredFields = ['title', 'meta', 'subheading', 'body', 'excerpt'];
    for (const field of requiredFields) {
      if (!result[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    console.log('Content generated successfully');
    
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-content function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to generate content' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});