# Quick Setup Guide 🚀

## 1. Install Dependencies

```bash
cd bruce-app
npm install
```

## 2. Start Development Server

```bash
npm start
```

Then press `i` for iOS Simulator or scan QR code with Expo Go app on your iPhone.

## 3. Configure AI (Optional)

### Get Free API Key:
1. Go to https://openrouter.ai
2. Sign up (free)
3. Get API key from dashboard
4. In app: Settings → AI Configuration → Paste key

### Free Models:
- Llama 3.1 8B (completely free!)
- Gemma 2 9B (also free!)

### Budget Models (~$0.01 per 50 messages):
- GPT-4o Mini
- Claude 3 Haiku

**Without API key:** Bruce still works with quick responses for common questions!

## 4. Customize Your App

### Change Default Theme
Edit `context/ThemeContext.tsx` line 13:
```typescript
const [themeName, setThemeNameState] = useState<ThemeName>('warm'); // or any theme
```

### Add Your Instagram Handle
Edit `screens/SettingsScreen.tsx` line 264:
```typescript
<Text style={[styles.value, { color: theme.text }]}>@your.handle</Text>
```

## 5. Test Features

✅ **Chat Tab** - Ask Bruce questions
✅ **Breeds Tab** - Browse cat breeds, tap for details
✅ **Facts Tab** - Tap facts to share
✅ **Settings Tab** - Change themes, configure AI

## 6. iOS Native Features

- **Large Headers** - Scroll to see headers collapse
- **Bottom Tabs** - Native iOS style tabs
- **Context Menu** - Long-press on breed cards
- **Haptics** - Feel the feedback on interactions
- **Switches** - Native iOS switches in Settings

## Common Commands

```bash
# Start fresh
npm start

# iOS Simulator
npm run ios

# Clear cache
expo start -c

# Install new package
npm install package-name
```

## Troubleshooting

**App won't start?**
```bash
rm -rf node_modules
npm install
npm start
```

**Simulator not opening?**
```bash
npx expo start --ios
```

**Need help?**
Check the full README.md for detailed documentation!

---

🎉 **You're ready to go!** Start the app and explore Bruce's features.
