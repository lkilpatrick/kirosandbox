# Add API Key Restrictions - Action Required

## ✅ Code Fixed and Deployed

The exposed API key has been removed from the public repository and the code now uses environment variables.

## 🔒 Next Step: Add API Key Restrictions

To fully secure your Firebase API key, add restrictions in Google Cloud Console:

### Step 1: Go to Google Cloud Console

**Visit**: https://console.cloud.google.com/apis/credentials?project=montereydashboard

### Step 2: Find Your API Key

Look for "Browser key (auto created by Firebase)" in the credentials list

### Step 3: Click "Edit" (pencil icon)

### Step 4: Add Application Restrictions

**Select**: "HTTP referrers (web sites)"

**Add these referrers**:
```
https://montereydashboard.web.app/*
https://montereydashboard.firebaseapp.com/*
http://localhost:3000/*
http://localhost:*
```

### Step 5: Add API Restrictions

**Select**: "Restrict key"

**Enable these APIs**:
- ✅ Firebase Hosting API
- ✅ Firebase Management API
- ✅ Cloud Firestore API
- ✅ Firebase Installations API
- ✅ Token Service API
- ✅ Firebase Analytics API

### Step 6: Save

Click "Save" at the bottom

## Why This Is Important

Even though Firebase web API keys are designed to be public, adding restrictions:
- ✅ Prevents unauthorized domains from using your Firebase project
- ✅ Limits which APIs can be accessed with this key
- ✅ Reduces potential for abuse
- ✅ Follows security best practices

## What This Protects Against

With restrictions in place:
- ❌ Someone can't use your API key from their own website
- ❌ Someone can't access APIs you're not using
- ✅ Only your authorized domains can use the key
- ✅ Only the APIs you need are accessible

## Optional: Regenerate the Key

If you want a completely fresh start:

1. **Go to Firebase Console**:
   https://console.firebase.google.com/project/montereydashboard/settings/general

2. **Scroll to "Your apps"** → Find your web app

3. **Click settings icon** → "Regenerate config"

4. **Update your code** with the new API key

5. **Redeploy** the application

## Verify Restrictions Are Working

After adding restrictions:

1. **Visit your live site**: https://montereydashboard.web.app
2. **Check browser console** - Should work normally
3. **Try from another domain** - Should be blocked

## Current Status

✅ **Code updated** - API key removed from public files
✅ **Environment variables** - Configured for flexibility
✅ **Deployed** - Latest secure version is live
⏳ **Restrictions** - Need to be added in Google Cloud Console

## Need Help?

If you encounter any issues:
1. Check the browser console for errors
2. Verify the restrictions match your domains exactly
3. Make sure all required APIs are enabled
4. Try regenerating the key if problems persist

---

**Action Required**: Add API key restrictions in Google Cloud Console
**Link**: https://console.cloud.google.com/apis/credentials?project=montereydashboard
