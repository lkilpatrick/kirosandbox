# Remove API Key from Git History (Optional)

## ⚠️ Important Notice

**Firebase web API keys are designed to be public and are safe when properly restricted.**

You do NOT need to remove the key from git history if you:
1. ✅ Add API key restrictions in Google Cloud Console
2. ✅ Limit to your authorized domains only

However, if you want to completely remove it from history, follow these steps.

## Option 1: Add Restrictions (Recommended) ✅

This is the easiest and recommended approach:

1. Go to: https://console.cloud.google.com/apis/credentials?project=montereydashboard
2. Find your Firebase API key
3. Click "Edit"
4. Add HTTP referrer restrictions:
   - `https://montereydashboard.web.app/*`
   - `https://montereydashboard.firebaseapp.com/*`
   - `http://localhost:3000/*`
5. Save

**Done!** Your key is now secure even though it's in git history.

## Option 2: Rewrite Git History (Nuclear Option) ⚠️

**WARNING**: This will rewrite git history and break any existing clones/forks!

### Prerequisites

1. **Backup your repository**
   ```bash
   git clone https://github.com/lkilpatrick/kirosandbox.git kirosandbox-backup
   ```

2. **Notify collaborators** (if any) that history will be rewritten

3. **Install BFG Repo-Cleaner** (easier than git filter-branch)
   - Download from: https://rtyley.github.io/bfg-repo-cleaner/
   - Or use: `brew install bfg` (Mac) or `choco install bfg` (Windows)

### Steps to Remove Key

#### Using BFG Repo-Cleaner (Recommended)

1. **Create a text file with the API key**
   ```bash
   echo "AIzaSyCIgZj9sGTVlG9_4Lsu9rI7gZVMumsQrto" > api-keys.txt
   ```

2. **Clone a fresh bare repository**
   ```bash
   git clone --mirror https://github.com/lkilpatrick/kirosandbox.git
   cd kirosandbox.git
   ```

3. **Run BFG to remove the key**
   ```bash
   bfg --replace-text ../api-keys.txt
   ```

4. **Clean up and push**
   ```bash
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
   git push --force
   ```

#### Using git filter-branch (Alternative)

```bash
git filter-branch --tree-filter '
  find . -type f -name "*.ts" -o -name "*.md" | xargs sed -i "s/AIzaSyCIgZj9sGTVlG9_4Lsu9rI7gZVMumsQrto/REDACTED/g"
' --prune-empty --tag-name-filter cat -- --all

git push --force --all
git push --force --tags
```

### After Rewriting History

1. **All collaborators must re-clone**
   ```bash
   cd ..
   rm -rf kirosandbox
   git clone https://github.com/lkilpatrick/kirosandbox.git
   ```

2. **Regenerate the Firebase API key** (optional but recommended)
   - Go to Firebase Console
   - Regenerate the config
   - Update your environment variables
   - Redeploy

3. **Verify the key is gone**
   ```bash
   git log --all --full-history -S "AIzaSyCIgZj9sGTVlG9_4Lsu9rI7gZVMumsQrto"
   # Should return no results
   ```

## Option 3: Regenerate the Key (Simplest) ✅

Instead of rewriting history, just get a new key:

1. **Go to Firebase Console**
   - https://console.firebase.google.com/project/montereydashboard/settings/general

2. **Delete the old web app** (or just regenerate)
   - Click the settings icon next to your web app
   - "Delete app" or "Regenerate config"

3. **Create a new web app** (if deleted)
   - Click "Add app" → Web
   - Register the app
   - Copy the new config

4. **Update your environment variables**
   ```bash
   # In your .env.local file
   NEXT_PUBLIC_FIREBASE_API_KEY=your_new_key_here
   # ... other config
   ```

5. **Redeploy**
   ```bash
   npm run build
   firebase deploy
   ```

6. **Add restrictions to the NEW key**
   - Follow Option 1 steps above

**Done!** The old key in git history is now useless.

## Comparison

| Option | Difficulty | Effectiveness | Breaks History | Recommended |
|--------|-----------|---------------|----------------|-------------|
| Add Restrictions | Easy | High | No | ✅ Yes |
| Rewrite History | Hard | High | Yes | ❌ No |
| Regenerate Key | Easy | High | No | ✅ Yes |

## Recommendation

**Use Option 1 (Add Restrictions) or Option 3 (Regenerate Key)**

Both are easy, effective, and don't break git history. Option 2 (Rewrite History) is overkill for a Firebase web API key.

## Why Firebase Web Keys Are Safe

Firebase web API keys are different from traditional API keys:

1. **Designed to be public** - They're meant to be in client-side code
2. **Not secret credentials** - They identify your project, not authenticate users
3. **Protected by Firebase Security Rules** - Real security is in your rules
4. **Can be restricted** - You can limit which domains can use them

See: https://firebase.google.com/docs/projects/api-keys

## Current Status

✅ **Code updated** - No hardcoded keys in current codebase
✅ **Documentation updated** - No keys in docs
✅ **Environment variables** - Properly configured
⏳ **Restrictions** - Need to be added in Google Cloud Console

## Questions?

- **Is my key compromised?** - No, Firebase web keys are designed to be public
- **Should I regenerate?** - Optional, but adding restrictions is sufficient
- **Will this cost money?** - No, Firebase free tier is generous
- **What if someone uses my key?** - Restrictions prevent unauthorized domains

---

**Recommendation**: Add API key restrictions (Option 1) and move on. No need to rewrite history.
