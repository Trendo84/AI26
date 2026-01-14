# InstaGrowth Studio

AI-powered Instagram growth tools built with React, Vite, and Replicate AI.

## Features

- ✨ **AI Caption Generator** - Generate engaging Instagram captions with different tones
- 🔖 **Hashtag Research** - Find the perfect hashtags for your niche
- 📊 **Analytics Dashboard** - Track your Instagram performance (Coming Soon)
- 📅 **Content Calendar** - Plan and schedule posts (Coming Soon)
- 🎯 **Competitor Analysis** - Learn from competitors (Coming Soon)

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **AI**: Replicate API (Mixtral-8x7B)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Replicate API key

### Installation

1. Clone the repository:
```bash
cd instagrowth-app
```

2. Install dependencies:
```bash
npm install
```

3. Your Replicate API key is already configured in the app

4. Start the development server:
```bash
npm run dev
```

5. Open http://localhost:3000 in your browser

## Project Structure

```
instagrowth-app/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx
│   │   ├── CaptionGenerator.jsx
│   │   ├── HashtagResearch.jsx
│   │   ├── Analytics.jsx
│   │   ├── ContentCalendar.jsx
│   │   └── Competitors.jsx
│   ├── services/
│   │   └── replicate.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Usage

### Caption Generator

1. Navigate to "Caption Generator" from the sidebar
2. Describe your post in the text area
3. Select a tone (Inspirational, Funny, Educational, or Engaging)
4. Click "Generate Captions"
5. Wait 5-10 seconds for AI to generate 3 caption options
6. Copy your favorite caption

### Hashtag Research

1. Navigate to "Hashtag Research" from the sidebar
2. Enter your niche or topic
3. Select post type
4. Click "Generate Hashtags"
5. Wait 5-10 seconds for AI to research hashtags
6. Copy individual hashtags or copy all at once

## API Integration

The app uses Replicate's Mixtral-8x7B model for AI generation. Response times are typically 5-10 seconds depending on API load.

Model: `mixtralai/mixtral-8x7b-instruct-v0.1`

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Deploy (it will auto-detect Vite)

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

## Future Features

- [ ] User authentication with Supabase
- [ ] Save caption and hashtag history
- [ ] Instagram API integration for real analytics
- [ ] Best time to post analyzer
- [ ] Content calendar with scheduling
- [ ] Competitor tracking
- [ ] Payment integration (Stripe)
- [ ] Team collaboration features

## Cost Optimization

Replicate API costs approximately:
- $0.0002-0.001 per caption generation
- $0.0002-0.001 per hashtag research
- ~$1-5 for 1000-5000 generations

Much cheaper than Claude or GPT-4!

## Contributing

This is a personal project but feel free to fork and modify for your own use.

## License

Private - All Rights Reserved

## Support

For issues or questions, contact: ivan@example.com
