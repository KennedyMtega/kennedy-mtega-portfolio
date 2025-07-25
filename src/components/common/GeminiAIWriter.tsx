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

// Note: API key should be stored securely in Supabase Edge Functions
// This component requires the GEMINI_API_KEY to be set up in Supabase secrets
const GEMINI_MODEL = 'gemini-2.5-pro-exp-03-25';

const GeminiAIWriter: React.FC<GeminiAIWriterProps> = ({ prompt, onGenerate, buttonText = 'Generate with AI', className }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      setError('AI content generation requires API key configuration. Please contact the administrator to set up the GEMINI_API_KEY in Supabase secrets.');
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