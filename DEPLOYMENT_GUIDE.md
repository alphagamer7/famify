# Famify - Vercel Deployment Guide

## Prerequisites

1. Vercel account (free tier works)
2. Supabase project already set up
3. Git repository

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com
   - Click "Add New" → "Project"

2. **Import Repository**
   - Connect your Git provider (GitHub/GitLab/Bitbucket)
   - Select the `famify` repository
   - Select `web` as the root directory

3. **Configure Build Settings**
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Set Environment Variables**
   Add these environment variables in Vercel:
   ```
   VITE_SUPABASE_URL=https://vqyqygnhencugzavuffh.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   VITE_GOOGLE_PLACES_API_KEY=your-google-key (optional)
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~2-3 minutes)
   - Get your production URL (e.g., `famify.vercel.app`)

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to web directory
cd /Users/athifshaffy/Documents/Repo/famify/web

# Login to Vercel
vercel login

# Deploy (first time)
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - What's your project's name? famify
# - In which directory is your code? ./
# - Want to modify settings? No

# Add environment variables
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY

# Deploy to production
vercel --prod
```

## Post-Deployment

### 1. Update Supabase Settings

Add your Vercel URL to Supabase:
1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add Site URL: `https://your-app.vercel.app`
3. Add Redirect URLs:
   - `https://your-app.vercel.app/auth/callback`
   - `https://your-app.vercel.app/`

### 2. Test the Deployment

Visit your production URL and test:
- ✅ Login with demo account: `john@famify-demo.com` / `Demo123!`
- ✅ Dashboard loads with family data
- ✅ Planner functionality works
- ✅ All tabs and features accessible

### 3. Custom Domain (Optional)

1. In Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain (e.g., `famify.com`)
3. Update DNS records as instructed
4. Update Supabase URLs accordingly

## Troubleshooting

### Build Fails
- Check environment variables are set correctly
- Ensure all dependencies in `package.json`
- Check build logs in Vercel dashboard

### Auth Not Working
- Verify Supabase URL and anon key
- Check Supabase redirect URLs include Vercel domain
- Clear browser cache and try again

### Blank Page After Deploy
- Check browser console for errors
- Verify Vite base path is correct
- Ensure `vercel.json` rewrites are configured

## Environment Variables

Required:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anon/public key

Optional:
- `VITE_GOOGLE_PLACES_API_KEY` - For Needle (places) feature

## Resources

- Vercel Documentation: https://vercel.com/docs
- Supabase + Vercel: https://supabase.com/docs/guides/hosting/vercel
- Vite + Vercel: https://vitejs.dev/guide/static-deploy.html#vercel

---

**Deployed by:** Claude Code
**Date:** February 22, 2026
**Production URL:** To be added after deployment
