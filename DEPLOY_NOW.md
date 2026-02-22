# 🚀 Quick Deploy to Vercel - Do This Now!

## Step 1: Deploy (2 minutes)

```bash
cd /Users/athifshaffy/Documents/Repo/famify/web
vercel --prod
```

**When prompted:**
- Project name: `famify`
- Directory: `./` (current directory)
- Settings: **Accept defaults**

## Step 2: Set Environment Variables (1 minute)

After deployment completes, run:

```bash
# Set Supabase URL
vercel env add VITE_SUPABASE_URL production
# When prompted, paste: https://vqyqygnhencugzavuffh.supabase.co

# Set Supabase Anon Key
vercel env add VITE_SUPABASE_ANON_KEY production
# When prompted, paste: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxeXF5Z25oZW5jdWd6YXZ1ZmZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2OTU1MjcsImV4cCI6MjA4NzI3MTUyN30.SypSmhKT6qKhEDKlbT72AcBnRNbEz_vAr_PqT28l2Ng
```

## Step 3: Redeploy with Environment Variables

```bash
vercel --prod
```

## Step 4: Get Your URL

After deployment:
```bash
vercel inspect --wait
```

Your app will be at: **https://famify.vercel.app** (or similar)

## Step 5: Update Supabase

1. Go to: https://supabase.com/dashboard/project/vqyqygnhencugzavuffh/auth/url-configuration
2. Add your Vercel URL to:
   - **Site URL**: `https://your-app.vercel.app`
   - **Redirect URLs**: `https://your-app.vercel.app/*`

## Step 6: Test It!

Visit your production URL and:
1. Login with: `john@famify-demo.com` / `Demo123!`
2. Check Dashboard loads
3. Test Planner tabs
4. Everything should work!

---

## 🎉 Done!

Your Famify app is now live at: **[Your Vercel URL]**

Copy this URL and use it in the email to George!
