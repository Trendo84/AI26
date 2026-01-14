# Bruce - Your Cat Companion 🐱

A premium iOS cat care app featuring AI-powered chat assistant, comprehensive breed encyclopedia, and daily cat facts. Built with React Native and designed for cat lovers by cat lovers.

## ✨ Features

### 🤖 Bruce AI Chat
- Conversational AI assistant powered by your choice of models
- Quick-answer system for common questions (no API needed)
- Chat history with smooth animations
- Multiple AI provider options (free to premium)

### 🐈 Breed Encyclopedia
- 15+ detailed cat breed profiles
- Search and filter by category (Popular, Long Hair, Short Hair, Large, Active, Vocal)
- Comprehensive trait ratings (Affection, Energy, Grooming, Intelligence, Vocalization)
- Long-press context menu for sharing breeds
- Native modal presentation

### ✨ Daily Cat Facts
- Curated educational content
- Categories: Anatomy, Behavior, Science, History, Communication
- Tap-to-share functionality
- Beautiful card-based design

### 🎨 6 Theme Options
- **Midnight** - Classic black & amber (Bruce's signature)
- **Warm Hearth** - Cozy browns and oranges
- **Ocean Blue** - Calming blues and teals
- **Forest Green** - Natural greens
- **Sunset Rose** - Warm pinks and reds
- **Lavender Dream** - Soft purples
- Auto light/dark mode support for each theme

### ⚙️ Native iOS Features
- Large header titles that collapse on scroll
- Native bottom tabs (@bottom-tabs/react-navigation)
- iOS-style switches
- Zeego context menus (long-press)
- Haptic feedback throughout
- Smooth animations and transitions

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ installed
- iOS Simulator (Xcode) or iPhone for testing
- Expo CLI: `npm install -g expo-cli`

### Installation

1. **Clone or create the project:**
```bash
mkdir bruce-app
cd bruce-app
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm start
# or
npm run ios
```

4. **Scan QR code** with Expo Go app or press `i` to open in iOS Simulator

## 🤖 AI Configuration

Bruce supports multiple AI providers with options from **FREE to premium**:

### Recommended: OpenRouter (Best Value)
OpenRouter provides access to 100+ AI models through a single API.

**Get Started:**
1. Visit [openrouter.ai](https://openrouter.ai)
2. Create a free account
3. Copy your API key (starts with `sk-or-v1-...`)
4. Open Bruce app → Settings → AI Configuration
5. Paste your API key and save

**Free Models Available:**
- ✅ **Llama 3.1 8B** - Completely free, great quality
- ✅ **Gemma 2 9B** - Also free!

**Budget Options (~$0.01 per 50 messages):**
- 💰 **GPT-4o Mini** - Very affordable, excellent quality
- 💰 **Claude 3 Haiku** - Fast and cheap

**Premium Options:**
- ⚡ **Llama 3.1 70B** - Highest quality
- ⚡ **Claude 3 Sonnet** - Production-grade

### Alternative: Groq (Fast & Cheap)
- Visit [groq.com](https://groq.com)
- Extremely fast inference
- Free tier available

### Alternative: Together AI
- Visit [together.ai](https://together.ai)
- Good free tier
- Multiple model options

### Without API Key
Bruce still works! You'll get quick responses for common questions:
- Feeding & nutrition
- Cat behavior (kneading, sleeping, etc.)
- Grooming tips
- Water & hydration
- And more!

## 📱 App Structure

```
bruce-app/
├── App.tsx                 # Root component with navigation
├── context/
│   └── ThemeContext.tsx    # Theme management
├── constants/
│   └── themes.ts          # 6 theme definitions
├── services/
│   └── ai.ts              # AI service with multiple providers
├── data/
│   └── breeds.ts          # Cat breed database
├── screens/
│   ├── ChatScreen.tsx     # Bruce AI chat interface
│   ├── BreedsScreen.tsx   # Breed encyclopedia
│   ├── BreedDetailScreen.tsx  # Breed details modal
│   ├── FactsScreen.tsx    # Daily cat facts
│   └── SettingsScreen.tsx # App settings & themes
└── package.json
```

## 🎨 Customization

### Adding New Themes
Edit `constants/themes.ts`:

```typescript
export type ThemeName = 'midnight' | 'warm' | 'ocean' | 'forest' | 'sunset' | 'lavender' | 'yourtheme';

const themes: Record<ThemeName, { light: ThemeColors; dark: ThemeColors }> = {
  yourtheme: {
    light: {
      background: '#FFFFFF',
      card: '#F8F8F8',
      primary: '#000000',
      // ... other colors
    },
    dark: {
      // ... dark variant
    },
  },
};
```

### Adding New Breeds
Edit `data/breeds.ts`:

```typescript
{
  id: 'new-breed',
  name: 'New Breed',
  emoji: '😺',
  origin: 'Country',
  categories: ['popular', 'shorthair'],
  traits: {
    affection: 5,
    energy: 3,
    grooming: 2,
    intelligence: 4,
    vocalization: 3,
  },
  description: 'Breed description...',
  care: 'Care requirements...',
  temperament: ['Friendly', 'Playful'],
  lifespan: '12-15 years',
  weight: '8-12 lbs',
}
```

### Adding Quick Responses
Edit `services/ai.ts` in the `getQuickResponse` method:

```typescript
if (lowerQuery.includes('your-keyword')) {
  return "Your custom response here!";
}
```

## 🔧 Key Dependencies

- **expo** - React Native framework
- **@react-navigation/native-stack** - Navigation with large headers
- **@bottom-tabs/react-navigation** - Native iOS bottom tabs
- **zeego** - Native context menus
- **expo-haptics** - Haptic feedback
- **@react-native-async-storage/async-storage** - Local storage

## 💡 Tips for Development

### Testing on Real iPhone
1. Install Expo Go from App Store
2. Run `npm start`
3. Scan QR code with camera app
4. Opens in Expo Go automatically

### Haptic Feedback
The app uses haptics extensively:
- Light impact: UI interactions
- Medium impact: Important actions
- Success/Error: Notifications

### Theme Development
Test themes in both light and dark mode:
- Open Settings on iOS Simulator
- Toggle between Light/Dark appearance
- Verify all theme colors work well

### Performance
- Use `React.memo` for expensive components
- Optimize breed images if adding photos
- Keep API responses under 500 tokens

## 🐛 Common Issues

**"Module not found" errors:**
```bash
npm install
rm -rf node_modules
npm install
```

**iOS Simulator not opening:**
```bash
expo start --ios
# or
npx expo start --ios
```

**API key not working:**
- Verify key format: `sk-or-v1-...` for OpenRouter
- Check Settings → AI Configuration
- Try restarting app after saving key

**Themes not changing:**
- Check AsyncStorage is installed
- Clear app data and restart
- Verify ThemeProvider wraps entire app

## 📈 Future Enhancements

- [ ] Photo breed identification using vision AI
- [ ] Health tracking & reminders
- [ ] Vet finder with maps integration
- [ ] Community features (breed forums)
- [ ] Instagram story sharing
- [ ] Symptom checker
- [ ] Medication reminders
- [ ] Weight tracking graphs
- [ ] Premium subscription features
- [ ] iCloud sync for chat history

## 💰 Monetization Ideas

1. **Freemium Model**
   - Free: 10 AI messages/day, basic breed info
   - Premium ($2.99/mo): Unlimited AI, advanced features

2. **One-Time Purchases**
   - Breed packs ($0.99)
   - Theme packs ($1.99)
   - Pro features ($4.99)

3. **Affiliate Links**
   - Pet product recommendations
   - Vet service partnerships
   - Cat food brands

## 🤝 Contributing

This is a personal project for @cat.z0ne Instagram followers. Feel free to fork and customize for your own use!

## 📄 License

© 2024 Cat Zone. All rights reserved.

## 🙏 Acknowledgments

- Bruce the British Shorthair for inspiration
- OpenRouter for affordable AI access
- The React Native community
- All 100k+ @cat.z0ne Instagram followers!

---

Made with ❤️ and 🐱 by @cat.z0ne

**Follow for more cat content:**
Instagram: [@cat.z0ne](https://instagram.com/cat.z0ne)
