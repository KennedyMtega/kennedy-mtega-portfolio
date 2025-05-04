// AI content generation component using Gemini API
import React, { useState } from 'react';

interface GeminiAIWriterProps {
  prompt: string;
  onGenerate: (result: {
    title: string;
    meta: string;
    subheading: string;
    body: string;
    excerpt: string;
  }) => void;
  buttonText?: string;
  className?: string;
}

const GEMINI_API_KEY = 'AIzaSyDLXkUhoQLL5suLQ4Q__tIXZL3cVlMdIbA';
const GEMINI_MODEL = 'gemini-2.5-pro-exp-03-25';

const GeminiAIWriter: React.FC<GeminiAIWriterProps> = ({ prompt, onGenerate, buttonText = 'Generate with AI', className }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const aiPrompt = `You are an expert blog writer for Kennedy Mtega's portfolio. Write a high-quality, SEO-optimized blog post for the following topic. Return a JSON object with: title, meta (SEO meta description), subheading, excerpt (1-2 sentence summary), and body (full markdown content).\n\nTopic: ${prompt}`;
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: aiPrompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
        })
      });
      const data = await response.json();
      // Gemini returns text in data.candidates[0].content.parts[0].text
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error('No response from AI');
      // Try to parse JSON from the response
      let result;
      try {
        result = JSON.parse(text);
      } catch {
        // Fallback: try to extract JSON from text
        const match = text.match(/\{[\s\S]*\}/);
        if (match) {
          result = JSON.parse(match[0]);
        } else {
          throw new Error('AI response is not valid JSON');
        }
      }
      onGenerate(result);
    } catch (err: any) {
      setError(err.message || 'Failed to generate content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      <button
        type="button"
        onClick={handleGenerate}
        disabled={loading}
        className="inline-flex items-center px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-60"
      >
        {loading ? 'Generating...' : buttonText}
      </button>
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
    </div>
  );
};

export default GeminiAIWriter; 