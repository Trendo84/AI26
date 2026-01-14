const REPLICATE_API_TOKEN = 'r8_UNy2qX51jGq4NJ9nDRmpxutypOJ8X2w3rUX0h';

export const replicateService = {
  async generateCaptions(description, tone) {
    try {
      // Build prompt based on tone
      const tonePrompts = {
        inspirational: 'inspirational and uplifting',
        funny: 'humorous and playful',
        educational: 'informative and educational',
        engaging: 'engaging and conversational'
      };

      const prompt = `Generate 3 unique Instagram captions for the following post description. Make them ${tonePrompts[tone]} in tone. Each caption should be 120-200 characters, include relevant emojis, and end with an engaging question or call to action.

Post description: ${description}

Format: Return ONLY the 3 captions, numbered 1-3, with each caption on a new line. No additional explanation or text.`;

      // Create prediction
      const response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: '2c1608e18606fad2812020dc541930f2d0495ce32eee50074220b87300bc16e1', // Mixtral-8x7B
          input: {
            prompt: prompt,
            max_new_tokens: 500,
            temperature: 0.8,
            top_p: 0.95,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      let prediction = await response.json();

      // Poll for results
      while (prediction.status !== 'succeeded' && prediction.status !== 'failed') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const pollResponse = await fetch(
          `https://api.replicate.com/v1/predictions/${prediction.id}`,
          {
            headers: {
              'Authorization': `Token ${REPLICATE_API_TOKEN}`,
            }
          }
        );
        
        prediction = await pollResponse.json();
      }

      if (prediction.status === 'failed') {
        throw new Error('Caption generation failed');
      }

      // Parse the output
      const output = prediction.output.join('');
      const captions = output
        .split('\n')
        .filter(line => line.trim().match(/^\d+[.)]/))
        .map(line => line.replace(/^\d+[.)]/, '').trim())
        .filter(caption => caption.length > 20);

      return captions.slice(0, 3).map(text => ({
        text,
        length: text.length
      }));

    } catch (error) {
      console.error('Replicate API error:', error);
      throw error;
    }
  },

  async generateHashtags(niche, postType = 'general') {
    try {
      const prompt = `Generate 30 relevant Instagram hashtags for the following niche: ${niche}. Post type: ${postType}.

Include a mix of:
- 5 popular hashtags (100k-1M posts)
- 15 medium hashtags (10k-100k posts)
- 10 niche hashtags (1k-10k posts)

Format: Return ONLY the hashtags, one per line, with the # symbol. No categories, explanations, or additional text.`;

      const response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: '2c1608e18606fad2812020dc541930f2d0495ce32eee50074220b87300bc16e1',
          input: {
            prompt: prompt,
            max_new_tokens: 300,
            temperature: 0.7,
          }
        })
      });

      let prediction = await response.json();

      // Poll for results
      while (prediction.status !== 'succeeded' && prediction.status !== 'failed') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const pollResponse = await fetch(
          `https://api.replicate.com/v1/predictions/${prediction.id}`,
          {
            headers: {
              'Authorization': `Token ${REPLICATE_API_TOKEN}`,
            }
          }
        );
        prediction = await pollResponse.json();
      }

      if (prediction.status === 'failed') {
        throw new Error('Hashtag generation failed');
      }

      const output = prediction.output.join('');
      const hashtags = output
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.startsWith('#') && line.length > 2)
        .slice(0, 30);

      return hashtags;

    } catch (error) {
      console.error('Replicate API error:', error);
      throw error;
    }
  }
};
