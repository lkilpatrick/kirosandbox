# Firebase Deployment Guide

## Overview

This Next.js app is configured to deploy to Firebase Hosting with automatic GitHub Actions deployment.

## Firebase Project

- **Project ID**: `montereydashboard`
- **Console**: https://console.firebase.google.com/u/0/project/montereydashboard/overview
- **Hosting URL**: https://montereydashboard.web.app (or your custom domain)

## Prerequisites

✅ Firebase project created (`montereydashboard`)
✅ GitHub repository connected
✅ GitHub secrets configured:
  - `FIREBASE_SERVICE_ACCOUNT_MONTEREYDASHBOARD`

## Configuration Files

### 1. `firebase.json`
Configures Firebase Hosting:
- Public directory: `out` (Next.js static export)
- Rewrites all routes to `index.html` for client-side routing
- Cache headers for static assets

### 2. `.firebaserc`
Specifies the Firebase project ID

### 3. `next.config.ts`
Updated with:
- `output: 'export'` - Enables static HTML export
- `images: { unoptimized: true }` - Required for static export

### 4. GitHub Actions Workflows

**`.github/workflows/firebase-hosting-merge.yml`**
- Triggers on push to `main` or `master` branch
- Builds and deploys to production

**`.github/workflows/firebase-hosting-pull-request.yml`**
- Triggers on pull requests
- Deploys preview channels for testing

## Deployment Methods

### Method 1: Automatic (GitHub Actions) - RECOMMENDED

1. **Push to main branch**:
   ```bash
   git add .
   git commit -m "Deploy to Firebase"
   git push origin main
   ```

2. **GitHub Actions will automatically**:
   - Install dependencies
   - Build the Next.js app
   - Deploy to Firebase Hosting
   - Comment on the commit with the deployment URL

3. **Monitor deployment**:
   - Go to your GitHub repository
   - Click "Actions" tab
   - Watch the deployment progress

### Method 2: Manual Deployment

1. **Build the app**:
   ```bash
   npm run build
   ```

2. **Deploy to Firebase**:
   ```bash
   npm run deploy
   ```

   Or use Firebase CLI directly:
   ```bash
   npx firebase deploy --only hosting
   ```

3. **Login if needed**:
   ```bash
   npx firebase login
   ```

## Build Output

The build process creates:
- `out/` directory with static HTML/CSS/JS files
- Optimized for production
- All pages pre-rendered as static HTML

## Environment Variables

Currently, no environment variables are needed since all APIs are public NOAA endpoints.

If you add API keys in the future:
1. Add them to `.env.local` (for local development)
2. Add them to GitHub Secrets (for CI/CD)
3. Update the workflow to pass them during build

## Custom Domain Setup

To use a custom domain:

1. **In Firebase Console**:
   - Go to Hosting section
   - Click "Add custom domain"
   - Follow the DNS configuration steps

2. **Update DNS records** with your domain provider:
   - Add the A records provided by Firebase
   - Wait for DNS propagation (can take 24-48 hours)

3. **SSL Certificate**:
   - Firebase automatically provisions SSL certificates
   - HTTPS is enforced by default

## Deployment Checklist

Before deploying:
- [ ] All tests passing
- [ ] Build completes without errors: `npm run build`
- [ ] App works locally: `npm run dev`
- [ ] Real data providers are working
- [ ] No console errors in browser
- [ ] Mobile responsive design verified

## Troubleshooting

### Build Fails

**Error**: "Module not found"
- **Solution**: Run `npm install` to ensure all dependencies are installed

**Error**: "Image optimization not supported"
- **Solution**: Already configured with `images: { unoptimized: true }`

### Deployment Fails

**Error**: "Firebase project not found"
- **Solution**: Verify `.firebaserc` has correct project ID

**Error**: "Permission denied"
- **Solution**: Check GitHub secret `FIREBASE_SERVICE_ACCOUNT_MONTEREYDASHBOARD` is set correctly

### Runtime Errors After Deployment

**Error**: "Failed to fetch" from APIs
- **Solution**: Check browser console for CORS errors
- **Note**: NOAA APIs should work from any domain

**Error**: "404 on page refresh"
- **Solution**: Already configured with rewrites in `firebase.json`

## Monitoring

### Firebase Console
- View deployment history
- Monitor hosting usage
- Check analytics (if enabled)

### GitHub Actions
- View build logs
- Check deployment status
- Review error messages

## Rollback

To rollback to a previous version:

1. **In Firebase Console**:
   - Go to Hosting → Release history
   - Find the previous working version
   - Click "Rollback"

2. **Or via CLI**:
   ```bash
   npx firebase hosting:rollback
   ```

## Performance Optimization

The app is already optimized with:
- Static HTML generation
- Asset caching (1 year for immutable assets)
- Image optimization disabled (required for static export)
- Minified JavaScript and CSS

## Cost

Firebase Hosting free tier includes:
- 10 GB storage
- 360 MB/day bandwidth
- Custom domain support
- SSL certificates

This should be more than sufficient for a dashboard app.

## Support

- **Firebase Documentation**: https://firebase.google.com/docs/hosting
- **Next.js Static Export**: https://nextjs.org/docs/app/building-your-application/deploying/static-exports
- **GitHub Actions**: https://docs.github.com/en/actions

## Next Steps

1. Push your code to GitHub
2. Watch the automatic deployment
3. Visit your Firebase Hosting URL
4. (Optional) Set up a custom domain
5. (Optional) Enable Firebase Analytics

Your Monterey Bay Conditions Dashboard will be live! 🌊
