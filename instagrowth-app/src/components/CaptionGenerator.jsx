import { useState } from 'react';
import { Copy, Check, Loader2 } from 'lucide-react';
import { replicateService } from '../services/replicate';

function CaptionGenerator() {
  const [description, setDescription] = useState('');
  const [tone, setTone] = useState('inspirational');
  const [loading, setLoading] = useState(false);
  const [captions, setCaptions] = useState([]);
  const [error, setError] = useState('');

  const tones = [
    { id: 'inspirational', label: '✨ Inspirational', emoji: '✨' },
    { id: 'funny', label: '😄 Funny', emoji: '😄' },
    { id: 'educational', label: '📚 Educational', emoji: '📚' },
    { id: 'engaging', label: '💬 Engaging', emoji: '💬' }
  ];

  const generateCaptions = async () => {
    if (!description.trim()) {
      setError('Please enter a post description');
      return;
    }
    
    setLoading(true);
    setError('');
    setCaptions([]);

    try {
      const generatedCaptions = await replicateService.generateCaptions(description, tone);
      setCaptions(generatedCaptions);
    } catch (err) {
      setError('Failed to generate captions. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">AI Caption Generator</h1>
        <p className="text-gray-600">Create engaging Instagram captions in seconds with AI</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Side */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Describe your post
            </label>
            <textarea 
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setError('');
              }}
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="Example: A photo of my morning coffee at a cozy cafe with a good book..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select tone
            </label>
            <div className="grid grid-cols-2 gap-3">
              {tones.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTone(t.id)}
                  className={`px-4 py-3 rounded-lg font-medium transition ${
                    tone === t.id
                      ? 'border-2 border-purple-500 bg-purple-50 text-purple-700'
                      : 'border border-gray-300 text-gray-700 hover:border-purple-500 hover:bg-purple-50'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button 
            onClick={generateCaptions}
            disabled={loading || !description.trim()}
            className="w-full instagram-gradient text-white py-4 rounded-lg font-bold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Captions'
            )}
          </button>

          <div className="text-xs text-gray-500 text-center">
            Powered by Replicate AI • Response time: ~5-10 seconds
          </div>
        </div>

        {/* Output Side */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Generated Captions</h3>
          
          {captions.length === 0 && !loading ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <p className="text-gray-500">Your captions will appear here</p>
            </div>
          ) : loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 text-purple-500 mx-auto mb-4 animate-spin" />
              <p className="text-gray-600">Generating your captions...</p>
              <p className="text-sm text-gray-500 mt-2">This may take 5-10 seconds</p>
            </div>
          ) : (
            <div className="space-y-4">
              {captions.map((caption, idx) => (
                <CaptionCard key={idx} caption={caption} index={idx} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CaptionCard({ caption, index }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(caption.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="caption-output bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs font-semibold text-purple-700">Option {index + 1}</span>
      </div>
      <p className="text-gray-800 text-sm leading-relaxed mb-3">{caption.text}</p>
      <div className="flex items-center justify-between pt-3 border-t border-purple-200">
        <span className="text-xs text-purple-600 font-medium">{caption.length} characters</span>
        <button 
          onClick={copyToClipboard}
          className="text-xs text-purple-600 font-semibold hover:text-purple-800 flex items-center transition"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-1" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-1" />
              Copy
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default CaptionGenerator;
