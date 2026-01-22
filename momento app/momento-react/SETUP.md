# Momento App - Complete Setup Guide

## Quick Start (5 minutes)

### 1. Install Node.js
Download from https://nodejs.org/ (LTS version recommended)

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Opens automatically at `http://localhost:3000`

---

## Upload to GitHub

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Create repository name: `momento-app` (or your preferred name)
3. Choose Public or Private
4. **Don't** initialize with README (we already have one)
5. Click "Create repository"

### Step 2: Connect Local Project to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Momento app React project"
git branch -m main
git remote add origin https://github.com/YOUR_USERNAME/momento-app.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

### Step 3: Verify on GitHub
Visit `https://github.com/YOUR_USERNAME/momento-app` to see your repo

---

## Clone to Cursor IDE

### Option 1: Using Cursor's Git Clone
1. Open Cursor
2. `Cmd/Ctrl + K` → "Clone Repository"
3. Paste: `https://github.com/YOUR_USERNAME/momento-app.git`
4. Select a folder to clone to
5. Open the cloned folder in Cursor

### Option 2: Command Line
```bash
git clone https://github.com/YOUR_USERNAME/momento-app.git
cd momento-app
code . # Opens in Cursor if set as default
```

### Option 3: Using Cursor's Command Palette
1. `Cmd/Ctrl + Shift + P`
2. Type "Clone Repository"
3. Paste the repo URL
4. Select destination folder

---

## After Cloning - Initial Setup

Once you've cloned the repo to Cursor:

```bash
npm install
npm run dev
```

---

## Project Structure Explanation

```
momento-app/
├── index.html                 # HTML template - entry point for browser
├── package.json              # Node dependencies and build scripts
├── package-lock.json         # Locked dependency versions (auto-generated)
├── vite.config.js           # Vite bundler configuration
├── README.md                # Project documentation
├── .gitignore               # Files to ignore in Git
├── .editorconfig            # Code style consistency
│
├── src/
│   ├── index.jsx            # React root file - imports & renders MomentoApp
│   └── components/
│       └── MomentoApp.jsx    # Main app component (all logic & UI)
│
└── dist/                    # Generated build folder (don't commit)
    ├── index.html
    ├── style.css
    └── [bundled JS files]
```

### Key Files to Know

**index.html** - Your app's starting point in the browser. The `<div id="root">` is where React renders.

**src/index.jsx** - The glue between HTML and React. It imports MomentoApp and renders it.

**src/components/MomentoApp.jsx** - All your app logic and UI code in one file.

**package.json** - Lists what libraries you need (React, Vite, etc.)

---

## Development Workflow in Cursor

### Start Working
```bash
npm run dev
```
This opens a local server. Edit files and see changes instantly.

### Building for Production
```bash
npm run build
```
Creates optimized `dist/` folder ready for deployment.

### Preview Production Build
```bash
npm run preview
```
Test how your built app will look.

---

## Making Changes

1. Edit files in `src/components/MomentoApp.jsx`
2. Save the file (Cursor auto-saves by default)
3. See changes instantly in the browser (hot reload)
4. When satisfied, commit to Git:

```bash
git add .
git commit -m "Describe your changes here"
git push origin main
```

---

## Using Different IDEs

### Kiro (if available)
Same process - just clone the repo and open the folder.

### VS Code
```bash
code . # Opens current folder in VS Code
```

### WebStorm
1. File → Open → Select momento-app folder
2. Terminal → Run `npm install`
3. Terminal → Run `npm run dev`

---

## Troubleshooting

### `npm install` fails
- Make sure Node.js is installed: `node --version`
- Try clearing npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`, then run `npm install` again

### Port 3000 already in use
Edit `vite.config.js`:
```js
server: {
  port: 3001, // Change to 3001 or another available port
}
```

### Git errors when pushing
- Make sure you've created the GitHub repository first
- Check your remote is correct: `git remote -v`
- If stuck, try: `git remote remove origin` then add again

### Changes not showing
- Make sure dev server is running: `npm run dev`
- Hard refresh browser: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
- Check browser console for errors: `F12`

---

## Deploying Your App

### Vercel (Recommended - Free)
1. Connect your GitHub repo at https://vercel.com
2. Select the moment-app repo
3. Click Deploy - done!

### Netlify
1. Push to GitHub
2. Connect repo at https://netlify.com
3. Netlify auto-deploys on each push

### GitHub Pages
1. Update `vite.config.js`:
   ```js
   export default defineConfig({
     base: '/momento-app/',
     plugins: [react()],
   })
   ```
2. Run: `npm run build`
3. Push to GitHub
4. Go to Settings → Pages → Select `gh-pages` branch

---

## Next Steps

1. **Customize** - Modify themes and colors in MomentoApp.jsx
2. **Add Features** - Implement image upload, cloud sync, etc.
3. **Deploy** - Use Vercel or Netlify (free!)
4. **Share** - Share your GitHub repo link

---

## Useful Commands Reference

| Command | What it does |
|---------|------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create optimized production build |
| `npm run preview` | Preview the production build locally |
| `npm install` | Install all dependencies from package.json |
| `git status` | See what files changed |
| `git add .` | Stage all changes for commit |
| `git commit -m "message"` | Commit staged changes |
| `git push origin main` | Push commits to GitHub |
| `git pull origin main` | Get latest changes from GitHub |

---

## Getting Help

- **React Docs**: https://react.dev
- **Vite Docs**: https://vitejs.dev
- **GitHub Help**: https://docs.github.com

---

Happy coding! 🚀
