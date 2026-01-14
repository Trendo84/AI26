import { useState } from 'react';
import { Copy, Check, Loader2, Hash } from 'lucide-react';
import { replicateService } from '../services/replicate';

function HashtagResearch() {
  const [niche, setNiche] = useState('');
  const [postType, setPostType] = useState('general');
  const [loading, setLoading] = useState(false);
  const [hashtags, setHashtags] = useState([]);
  const [error, setError] = useState('');
  const [copiedAll, setCopiedAll] = useState(false);

  const postTypes = [
    { id: 'general', label: '🎯 General' },
    { id: 'product', label: '🛍️ Product' },
    { id: 'lifestyle', label: '✨ Lifestyle' },
    { id: 'educational', label: '📚 Educational' },
    { id: 'promotional', label: '🎉 Promotional' },
  ];

  const generateHashtags = async () => {
    if (!niche.trim()) {
      setError('Please enter your niche');
      return;
    }
    
    setLoading(true);
    setError('');
    setHashtags([]);

    try {
      const generatedHashtags = await replicateService.generateHashtags(niche, postType);
      setHashtags(generatedHashtags);
    } catch (err) {
      setError('Failed to generate hashtags. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyAllHashtags = () => {
    const allHashtags = hashtags.join(' ');
    navigator.clipboard.writeText(allHashtags);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const copyHashtag = (hashtag) => {
    navigator.clipboard.writeText(hashtag);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Hashtag Research</h1>
        <p className="text-gray-600">Find the perfect hashtags for your niche with AI</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Side */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Your niche or topic
            </label>
            <input 
              type="text"
              value={niche}
              onChange={(e) => {
                setNiche(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Example: fitness, coffee, travel photography, fashion..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Post type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {postTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => setPostType(type.id)}
                  className={`px-4 py-3 rounded-lg font-medium transition ${
                    postType === type.id
                      ? 'border-2 border-pink-500 bg-pink-50 text-pink-700'
                      : 'border border-gray-300 text-gray-700 hover:border-pink-500 hover:bg-pink-50'
                  }`}
                >
                  {type.label}
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
            onClick={generateHashtags}
            disabled={loading || !niche.trim()}
            className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-4 rounded-lg font-bold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Hash className="w-5 h-5 mr-2" />
                Generate Hashtags
              </>
            )}
          </button>

          <div className="text-xs text-gray-500 text-center">
            Powered by Replicate AI • Response time: ~5-10 seconds
          </div>
        </div>

        {/* Output Side */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">
              Generated Hashtags {hashtags.length > 0 && `(${hashtags.length})`}
            </h3>
            {hashtags.length > 0 && (
              <button 
                onClick={copyAllHashtags}
                className="text-sm text-pink-600 font-semibold hover:text-pink-800 flex items-center transition"
              >
                {copiedAll ? (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    Copy All
                  </>
                )}
              </button>
            )}
          </div>
          
          {hashtags.length === 0 && !loading ? (
            <div className="text-center py-12">
              <Hash className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Your hashtags will appear here</p>
            </div>
          ) : loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 text-pink-500 mx-auto mb-4 animate-spin" />
              <p className="text-gray-600">Researching hashtags...</p>
              <p className="text-sm text-gray-500 mt-2">This may take 5-10 seconds</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-pink-50 to-red-50 rounded-lg p-4 border border-pink-200">
                <div className="flex flex-wrap gap-2">
                  {hashtags.map((hashtag, idx) => (
                    <HashtagPill key={idx} hashtag={hashtag} onCopy={copyHashtag} />
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-600 mb-2 font-semibold">Ready to paste:</p>
                <p className="text-sm text-gray-700 break-words">
                  {hashtags.join(' ')}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function HashtagPill({ hashtag, onCopy }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy(hashtag);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center px-3 py-1.5 bg-white border border-pink-300 rounded-full text-sm font-medium text-pink-700 hover:bg-pink-50 transition"
    >
      {copied ? (
        <Check className="w-3 h-3 mr-1" />
      ) : (
        <Hash className="w-3 h-3 mr-1" />
      )}
      {hashtag.replace('#', '')}
    </button>
  );
}

export default HashtagResearch;
