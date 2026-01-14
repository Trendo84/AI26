# Quick Start Guide 🚀

Get InstaGrowth Studio running in 5 minutes!

## Step 1: Install Node.js (if needed)

Check if you have Node.js:
```bash
node --version
```

If not installed, download from: https://nodejs.org (v18 or higher)

## Step 2: Install Dependencies

```bash
cd instagrowth-app
npm install
```

This will take 2-3 minutes.

## Step 3: Configure API Key

Create a `.env` file:
```bash
cp .env.example .env
```

Edit `.env` and paste your Replicate API token:
```
VITE_REPLICATE_API_TOKEN=r8_UNy2qX51jGq4NJ9nDRmpxutypOJ8X2w3rUX0h
```

## Step 4: Run the App

```bash
npm run dev
```

Open http://localhost:3000 in your browser!

## Step 5: Try It Out

### Generate a Caption
1. Click "Caption Generator" in sidebar
2. Type: "A photo of my morning coffee at a cozy cafe"
3. Select tone: "Inspirational"
4. Click "Generate Captions"
5. Wait 10-15 seconds for AI magic ✨

### Research Hashtags
1. Click "Hashtag Research" in sidebar
2. Type niche: "Coffee"
3. Add description: "Morning routine with latte art"
4. Click "Research Hashtags"
5. Copy the best mix of hashtags!

## Troubleshooting

**"npm: command not found"**
→ Install Node.js first

**"Failed to generate"**
→ Check your Replicate API token
→ Ensure you have credits in Replicate account

**Port 3000 already in use**
→ Kill the process or change port in vite.config.js

**Slow generation**
→ Normal! AI takes 10-20 seconds
→ Check your internet connection

## Next Steps

- Customize the user profile
- Try different tones and niches
- Check out the Dashboard
- Explore placeholder features

## Deploy to Production

### Vercel (Easiest)
1. Push to GitHub
2. Connect to Vercel
3. Add environment variable
4. Deploy!

### Manual Build
```bash
npm run build
```

Upload `dist/` folder to any static host.

## Need Help?

- Check README.md for detailed docs
- Review src/api/replicate.js for API code
- Test with simple inputs first

---

Happy growing! 📈✨
