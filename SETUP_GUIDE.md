# 🚀 Famify - 5-Minute Setup Guide

Follow these steps to get Famify running with a real database and demo login.

---

## Step 1: Create Supabase Project (2 minutes)

1. Go to **https://supabase.com**
2. Click **"Start your project"** or **"New Project"**
3. Fill in:
   - **Name**: `famify-demo`
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
4. Click **"Create new project"**
5. ⏳ Wait ~2 minutes for provisioning

---

## Step 2: Get Your Supabase Keys (30 seconds)

1. In your Supabase dashboard, click **Settings** (gear icon) → **API**
2. Copy these two values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)
   - **service_role** key (for seeding - keep this secret!)

---

## Step 3: Run Database Migration (1 minute)

1. In Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **"+ New query"**
3. Open this file: `/supabase/migrations/001_initial_schema.sql`
4. **Copy the ENTIRE contents** (all ~700 lines)
5. **Paste into SQL Editor**
6. Click **"Run"** (or press Cmd/Ctrl + Enter)
7. ✅ You should see "Success. No rows returned"

---

## Step 4: Create Storage Buckets (1 minute)

1. Go to **Storage** in Supabase sidebar
2. Click **"New bucket"**
3. Create bucket:
   - **Name**: `avatars`
   - **Public bucket**: ✅ YES (toggle on)
   - Click **"Create bucket"**
4. Repeat for second bucket:
   - **Name**: `posts`
   - **Public bucket**: ✅ YES
   - Click **"Create bucket"**

---

## Step 5: Configure Web App (30 seconds)

1. Open `/web/.env.local` in your editor
2. Replace with your real keys:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_GOOGLE_PLACES_API_KEY=
```

3. Save the file
4. The dev server will auto-reload (if it's running)

---

## Step 6: Seed Demo Data (1 minute)

1. Open `/.env` in the ROOT famify directory (not /web!)
2. Add your keys:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

3. Run the seed script:

```bash
cd /Users/athifshaffy/Documents/Repo/famify
npm run seed
```

This creates:
- 2 demo users (John & Patricia)
- 1 family ("The Johnsons")
- 12 events
- 8 tasks
- 2 shopping lists
- 9 meal plans
- 5 reminders
- 3 notes
- 8 posts with likes and comments

---

## Step 7: Test Login! 🎉

### Option A: Use Demo Credentials

The app is already running at **http://localhost:5173/**

**Login with:**
- **Email**: `john@famify-demo.com`
- **Password**: `Demo123!`

Or click the **"Try Demo"** button which auto-fills these credentials!

### Option B: Create Your Own Account

1. Click **"Create Account"**
2. Fill in your name, email, and password
3. You'll be redirected to family setup
4. Create a new family or join one with an invite code

---

## 🎯 What You'll See After Login

1. **Dashboard** with:
   - Today's events
   - Pending tasks
   - Meal planner
   - Reminders
   - Notes

2. **Sidebar Navigation**:
   - Dashboard
   - Planner
   - Feed
   - Needle
   - Notifications
   - Profile

3. **All data is REAL** - any changes you make are saved to Supabase!

---

## 🐛 Troubleshooting

### "Invalid API credentials"
- Check that you copied the **anon public** key (not service_role)
- Make sure the URL has `https://` prefix
- Restart the dev server: `npm run dev`

### "No rows returned" error
- The migration ran successfully! This is normal.

### Seed script fails
- Make sure you're using the **service_role** key (not anon)
- Check that the migration completed
- Delete existing demo users from Supabase Auth if re-running

### Page is blank
- Check browser console for errors (F12)
- Make sure .env.local has correct keys
- Try clearing browser cache

---

## 📱 Bonus: Test Mobile App

After web setup works:

1. Edit `/mobile/lib/config/constants.dart`
2. Replace with your Supabase URL and anon key
3. Run:
```bash
cd mobile
flutter pub get
flutter run
```

4. Login with same credentials!

---

## 🎉 You're Done!

Your Famify app is now fully functional with:
- ✅ Real authentication
- ✅ Database with demo data
- ✅ File storage for avatars and posts
- ✅ Row-level security protecting your data
- ✅ Both web and mobile apps connected

**Demo Credentials (after seeding):**
- Email: `john@famify-demo.com` or `patricia@famify-demo.com`
- Password: `Demo123!`

Enjoy exploring Famify! 🌿
