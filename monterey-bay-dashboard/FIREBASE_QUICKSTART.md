# Firebase Deployment - Quick Start

## ✅ Setup Complete!

Your Monterey Bay Dashboard is ready to deploy to Firebase!

## What's Been Configured

- ✅ Firebase Hosting configuration (`firebase.json`, `.firebaserc`)
- ✅ Next.js static export enabled (`next.config.ts`)
- ✅ GitHub Actions workflows for automatic deployment
- ✅ Build scripts in `package.json`
- ✅ Firebase tools installed
- ✅ Build tested and working

## Deploy Now

### Option 1: Push to GitHub (Automatic Deployment)

```bash
git add .
git commit -m "Add Firebase deployment configuration"
git push origin main
```

GitHub Actions will automatically:
1. Build your app
2. Deploy to Firebase Hosting
3. Comment with the live URL

### Option 2: Manual Deployment

```bash
# From the monterey-bay-dashboard directory
npm run deploy
```

This will:
1. Build the static export
2. Deploy to Firebase Hosting

## Your Firebase Project

- **Project ID**: `montereydashboard`
- **Console**: https://console.firebase.google.com/u/0/project/montereydashboard/overview
- **Live URL**: https://montereydashboard.web.app (after first deployment)

## GitHub Secrets Required

Make sure you have this secret in your GitHub repository:
- `FIREBASE_SERVICE_ACCOUNT_MONTEREYDASHBOARD`

(You mentioned you already have this configured ✅)

## Verify Deployment

After deployment, visit:
- Production: https://montereydashboard.web.app
- Or: https://montereydashboard.firebaseapp.com

## What Gets Deployed

The `out/` directory containing:
- Static HTML pages
- Optimized JavaScript bundles
- CSS files
- Images and assets

All pre-rendered and ready to serve!

## Next Steps

1. **Deploy**: Push to GitHub or run `npm run deploy`
2. **Verify**: Check the live URL
3. **Custom Domain** (optional): Add in Firebase Console
4. **Monitor**: Check Firebase Console for analytics

## Troubleshooting

If deployment fails:
1. Check GitHub Actions logs
2. Verify Firebase project ID in `.firebaserc`
3. Ensure GitHub secret is set correctly
4. Try manual deployment: `npm run deploy`

## Support

- Full guide: See `DEPLOYMENT.md`
- Firebase docs: https://firebase.google.com/docs/hosting
- GitHub Actions logs: Check your repository's Actions tab

Ready to go live! 🚀
