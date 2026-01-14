// AI Service with multiple provider options
// OpenRouter provides access to many models at competitive prices
// Including GPT-4, Claude, Llama, and more through a single API

export type AIProvider = 'openrouter' | 'groq' | 'together';

export type AIModel = 
  | 'meta-llama/llama-3.1-8b-instruct:free' // Free!
  | 'google/gemma-2-9b-it:free' // Free!
  | 'gpt-3.5-turbo' // $0.0005/1K tokens
  | 'gpt-4o-mini' // $0.00015/1K tokens (very cheap)
  | 'claude-3-haiku' // $0.00025/1K tokens
  | 'mixtral-8x7b-instruct' // $0.00027/1K tokens
  | 'llama-3.1-70b-instruct'; // $0.00035/1K tokens

type AIConfig = {
  provider: AIProvider;
  model: AIModel;
  apiKey: string;
};

const OPENROUTER_BASE = 'https://openrouter.ai/api/v1';
const GROQ_BASE = 'https://api.groq.com/openai/v1';
const TOGETHER_BASE = 'https://api.together.xyz/v1';

const BRUCE_SYSTEM_PROMPT = `You are Bruce, a sophisticated British Shorthair cat and personal AI assistant for cat owners. You have years of experience as a cat and deep knowledge about feline behavior, health, care, and breeds.

Your personality:
- Witty and slightly sassy with British charm
- Knowledgeable but not condescending
- Use "we cats" or "us felines" naturally
- Occasionally reference your British Shorthair heritage
- Warm and helpful, but maintain feline dignity

Keep responses conversational and concise (2-4 paragraphs max). Be practical and actionable. If asked about serious health issues, always recommend consulting a vet while providing helpful context.`;

export class AIService {
  private config: AIConfig;

  constructor(config: AIConfig) {
    this.config = config;
  }

  private getBaseURL(): string {
    switch (this.config.provider) {
      case 'openrouter':
        return OPENROUTER_BASE;
      case 'groq':
        return GROQ_BASE;
      case 'together':
        return TOGETHER_BASE;
    }
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.config.provider === 'openrouter') {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
      headers['HTTP-Referer'] = 'https://bruce-cat-companion.app';
      headers['X-Title'] = 'Bruce Cat Companion';
    } else {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    }

    return headers;
  }

  async chat(message: string, conversationHistory: Array<{ role: string; content: string }> = []): Promise<string> {
    try {
      const messages = [
        { role: 'system', content: BRUCE_SYSTEM_PROMPT },
        ...conversationHistory,
        { role: 'user', content: message },
      ];

      const response = await fetch(`${this.getBaseURL()}/chat/completions`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          model: this.config.model,
          messages,
          temperature: 0.8,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`AI API Error: ${response.status} - ${error}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('AI Service Error:', error);
      throw error;
    }
  }

  // Quick responses for common questions (no API call needed)
  getQuickResponse(query: string): string | null {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('feed') || lowerQuery.includes('food') || lowerQuery.includes('eat')) {
      return "Food! My favorite topic. Cats are obligate carnivores - we need meat-based protein. High-quality wet food is ideal as it provides hydration. Feed adult cats 2-3 meals daily. Portion control is crucial - we British Shorthairs can get rather rotund! Fresh water should always be available. And please, no milk - most adult cats are lactose intolerant!";
    }

    if (lowerQuery.includes('knead')) {
      return "Ah, the kneading question! This is a leftover behavior from kittenhood when we'd knead our mother's belly to stimulate milk flow. When we knead you, it means we're feeling content and safe - you remind us of our mother. It's actually quite the compliment! Some cats knead throughout their lives, others rarely do it. Both are perfectly normal.";
    }

    if (lowerQuery.includes('sleep') || lowerQuery.includes('tired')) {
      return "Ah yes, sleep - one of my specialties! Cats sleep 12-16 hours daily on average. We're crepuscular, meaning most active at dawn and dusk (sorry about those 5am wake-up calls). This sleeping pattern helped our wild ancestors conserve energy for hunting. Older cats can sleep up to 20 hours! If your cat's sleep pattern suddenly changes drastically, do mention it to your vet.";
    }

    if (lowerQuery.includes('water') || lowerQuery.includes('drink')) {
      return "Hydration is crucial for us felines! Many cats don't drink enough water, which can lead to kidney issues. Try these tricks: Use a cat water fountain (we prefer running water), place multiple water bowls around the house, ensure bowls are away from litter boxes, and consider wet food to boost hydration. We British Shorthairs need about 3.5-4.5 ounces per 5 pounds of body weight daily.";
    }

    return null;
  }
}

// Recommended configurations for different budgets
export const AI_CONFIGS = {
  free: {
    provider: 'openrouter' as AIProvider,
    model: 'meta-llama/llama-3.1-8b-instruct:free' as AIModel,
    description: 'Free - Llama 3.1 8B',
  },
  budget: {
    provider: 'openrouter' as AIProvider,
    model: 'gpt-4o-mini' as AIModel,
    description: 'Very Cheap - GPT-4o Mini (~$0.01 per 50 messages)',
  },
  balanced: {
    provider: 'openrouter' as AIProvider,
    model: 'claude-3-haiku' as AIModel,
    description: 'Good Balance - Claude 3 Haiku (~$0.02 per 50 messages)',
  },
  premium: {
    provider: 'openrouter' as AIProvider,
    model: 'llama-3.1-70b-instruct' as AIModel,
    description: 'Premium - Llama 3.1 70B (~$0.03 per 50 messages)',
  },
};

// Example usage:
// const ai = new AIService({
//   provider: 'openrouter',
//   model: 'meta-llama/llama-3.1-8b-instruct:free',
//   apiKey: 'YOUR_OPENROUTER_API_KEY'
// });
// const response = await ai.chat('How do I know if my cat is healthy?');
