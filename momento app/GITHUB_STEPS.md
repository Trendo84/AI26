# 📤 Push to GitHub - Step by Step

## Prerequisites
- GitHub account (create free at https://github.com)
- Git installed (https://git-scm.com/download)
- This proyecto folder on your computer

---

## Step 1: Create Repository on GitHub

1. Go to https://github.com/new
2. Fill in:
   - **Repository name**: `momento-app` (or your preferred name)
   - **Description**: "A beautiful memory journaling app with daily capture streaks"
   - **Public** or **Private** (your choice)
   - **Uncheck** "Add a README file" (we already have one)
3. Click **"Create repository"**
4. You'll see instructions - **copy the HTTPS URL** (you'll need this in Step 3)

---

## Step 2: Open Terminal in Your Project Folder

**Mac/Linux:**
```bash
cd /path/to/momento-app
```

**Windows (PowerShell):**
```powershell
cd C:\path\to\momento-app
```

Verify you're in the right place:
```bash
ls   # Mac/Linux
dir  # Windows
```

You should see: `package.json`, `src`, `README.md`, etc.

---

## Step 3: Push Your Code to GitHub

**Copy and paste these commands in order:**

```bash
# Initialize git in this folder
git init

# Add all your files to git
git add .

# Create first commit
git commit -m "Initial commit: Momento app"

# Rename branch to main (GitHub default)
git branch -m main

# Add GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/momento-app.git

# Push code to GitHub
git push -u origin main
```

**Replace `YOUR_USERNAME`** with your actual GitHub username!

---

## Step 4: Verify on GitHub

1. Go to https://github.com/YOUR_USERNAME/momento-app
2. You should see all your files there! 🎉

---

## Making Updates (After Initial Push)

Every time you make changes and want to upload:

```bash
git add .
git commit -m "Describe what you changed"
git push origin main
```

---

## Common Issues & Fixes

### ❌ "fatal: not a git repository"
**Fix:** Make sure you ran `git init` in the correct folder
```bash
pwd  # Shows current folder path
```

### ❌ "fatal: pathspec 'main' did not match any files"
**Fix:** You have local changes not committed
```bash
git status  # See what changed
git add .
git commit -m "Fix"
```

### ❌ "Permission denied (publickey)"
**Fix:** Your SSH isn't set up. Use HTTPS instead:
```bash
git remote set-url origin https://github.com/YOUR_USERNAME/momento-app.git
git push -u origin main
```

### ❌ "Error: src refspec main does not match any"
**Fix:** Branch hasn't been created yet
```bash
git branch -m main
git push -u origin main
```

### ❌ "403 Forbidden"
**Fix:** Either wrong username, wrong password, or repo doesn't exist
- Verify repo exists at https://github.com/YOUR_USERNAME/momento-app
- Check your GitHub password in git credential manager

---

## Verify Your Git Setup (Optional)

Check your git configuration:
```bash
git config --global user.name
git config --global user.email
```

Set them if not configured:
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

## Next: Clone into Your IDE

After pushing to GitHub:

### Cursor
1. Open Cursor
2. `Cmd/Ctrl + K` → "Clone Repository"
3. Paste: `https://github.com/YOUR_USERNAME/momento-app.git`
4. Select folder
5. Open folder
6. Terminal → `npm install`
7. Terminal → `npm run dev`

### VS Code
1. Open VS Code
2. `Cmd/Ctrl + Shift + P` → "Clone Repository"
3. Paste GitHub URL
4. Select folder
5. Open the cloned folder
6. Terminal → `npm install && npm run dev`

### WebStorm
1. File → New → Project from Version Control
2. Paste GitHub URL
3. Open the project
4. Terminal → `npm install && npm run dev`

---

## Check Git Status Anytime

```bash
git status
```

Shows:
- Which files changed
- Which files are staged
- Which branch you're on

---

## View Your Commit History

```bash
git log
```

Shows all commits with messages and dates.

---

## Final Checklist

- [ ] GitHub account created
- [ ] Repository created on GitHub
- [ ] Ran `git init` in momento-app folder
- [ ] Ran `git add .`
- [ ] Ran `git commit -m "Initial commit"`
- [ ] Ran `git branch -m main`
- [ ] Ran `git remote add origin https://...`
- [ ] Ran `git push -u origin main`
- [ ] Can see files at github.com/YOUR_USERNAME/momento-app
- [ ] Successfully cloned into IDE
- [ ] Ran `npm install`
- [ ] Ran `npm run dev`
- [ ] App running in browser ✅

---

## Need More Help?

- **GitHub Help**: https://docs.github.com/
- **Git Documentation**: https://git-scm.com/doc
- **Git Cheat Sheet**: https://github.github.com/training-kit/

---

**You've got this! Your Momento app is now on GitHub! 🚀**
