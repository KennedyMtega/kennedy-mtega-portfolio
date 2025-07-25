// AI content generation component using Gemini API via Supabase Edge Function
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

const GeminiAIWriter: React.FC<GeminiAIWriterProps> = ({ prompt, onGenerate, buttonText = 'Generate with AI', className }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Calling generate-content function with prompt:', prompt);
      
      const { data, error: functionError } = await supabase.functions.invoke('generate-content', {
        body: { prompt }
      });

      if (functionError) {
        console.error('Function error:', functionError);
        throw new Error(functionError.message || 'Failed to call content generation function');
      }

      if (data?.error) {
        console.error('Function returned error:', data.error);
        throw new Error(data.error);
      }

      if (!data) {
        throw new Error('No data returned from content generation');
      }

      console.log('Content generation successful:', data);
      onGenerate(data);
      
    } catch (err: any) {
      console.error('Content generation error:', err);
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