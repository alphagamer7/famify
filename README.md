# Famify - Family Management App

A comprehensive family management platform with web (React + Vite) and mobile (Flutter) apps, powered by Supabase.

![Famify](https://via.placeholder.com/1200x600/10B981/FFFFFF?text=Famify+-+Family+Management)

## Features

- **Dashboard**: View events, tasks, meal plans, reminders, and notes at a glance
- **Planner**: Manage family calendar, tasks, shopping lists, and meal plans
- **Feed**: Share family moments, photos, and updates
- **Needle**: Find and save family-friendly places (daycares, parks, medical centers, etc.)
- **Notifications**: Stay updated on family activities
- **Multi-platform**: Web app and Flutter mobile app (iOS + Android)

## Tech Stack

### Web App
- **Frontend**: React 18 + Vite + TypeScript
- **Routing**: React Router v6
- **Styling**: Tailwind CSS with emerald/green theme
- **UI Components**: Custom components inspired by shadcn/ui
- **Data Fetching**: TanStack React Query
- **Icons**: Lucide React
- **Date Utilities**: date-fns

### Mobile App
- **Framework**: Flutter 3.x
- **State Management**: Riverpod
- **Routing**: GoRouter
- **UI**: Material Design 3 with custom emerald theme
- **Fonts**: Google Fonts (Inter)

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (for avatars and post images)
- **Real-time**: Supabase Realtime (optional)
- **Security**: Row Level Security (RLS) policies

### Deployment
- **Web**: Vercel
- **Backend**: Supabase Cloud
- **Mobile**: App Store / Google Play (build locally)

---

## Project Structure

```
famify/
├── web/                  # React + Vite web app
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── context/      # React contexts (Auth, Family)
│   │   ├── hooks/        # Custom hooks
│   │   ├── lib/          # Utilities, types, constants, Supabase client
│   │   ├── pages/        # Page components
│   │   └── main.tsx      # App entry point
│   └── package.json
├── mobile/               # Flutter app
│   ├── lib/
│   │   ├── config/       # Theme, constants, router
│   │   ├── core/         # Models, Supabase client
│   │   ├── features/     # Feature modules (auth, dashboard, etc.)
│   │   └── shared/       # Shared widgets
│   └── pubspec.yaml
├── supabase/
│   └── migrations/       # SQL migration files
├── scripts/              # Seed scripts
└── README.md
```

---

## Setup Instructions

### Prerequisites

- **Node.js** 18+ and npm/yarn
- **Flutter** 3.x (for mobile app)
- **Supabase** account (free tier works)
- **Git**

---

## 1. Supabase Setup

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Note your **Project URL** and **anon key** from Settings → API

### Step 2: Run Database Migration

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the entire contents of `/supabase/migrations/001_initial_schema.sql`
4. Paste into the SQL Editor and click **RUN**
5. Wait for the migration to complete (creates all tables, indexes, RLS policies, triggers)

### Step 3: Create Storage Buckets

1. Navigate to **Storage** in Supabase dashboard
2. Create two **public** buckets:
   - `avatars` (for user profile pictures)
   - `posts` (for feed post images)
3. Set both buckets to **Public** (allow public access)

### Step 4: Get Service Role Key (for seeding)

1. Go to Settings → API
2. Copy the **service_role** key (secret, don't commit this!)

---

## 2. Web App Setup

### Step 1: Install Dependencies

```bash
cd web
npm install
```

### Step 2: Configure Environment Variables

Create a `.env.local` file in the `web/` directory:

```env
VITE_SUPABASE_URL=your-project-url-here
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_GOOGLE_PLACES_API_KEY=your-google-api-key-optional
```

You can copy `.env.local.example` as a template:

```bash
cp .env.local.example .env.local
# Then edit .env.local with your actual keys
```

### Step 3: Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Step 4: Build for Production

```bash
npm run build
```

Built files will be in `web/dist/`

---

## 3. Seed Demo Data (Optional but Recommended)

The seed script creates a demo family with realistic data (events, tasks, meals, etc.) with **dynamic dates** relative to today.

### Step 1: Install Dependencies

From the root `famify/` directory:

```bash
npm install -D tsx @types/node @supabase/supabase-js
```

### Step 2: Create `.env` File

Create a `.env` file in the root `famify/` directory:

```env
SUPABASE_URL=your-project-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Important**: Use the **service_role** key, NOT the anon key, for seeding.

### Step 3: Run Seed Script

```bash
npx tsx scripts/seed.ts
```

This creates:
- 2 demo users (John and Patricia)
- 1 family ("The Johnsons")
- 12 events across the current week
- 8 tasks (some overdue, some upcoming)
- 2 shopping lists with items
- 9 meal plans for the week
- 5 reminders
- 3 notes
- 8 family posts with likes and comments
- Sample notifications

### Step 4: Login with Demo Credentials

**Email**: `john@famify-demo.com`
**Password**: `Demo123!`

Or use the **"Try Demo"** button on the login page.

---

## 4. Mobile App Setup

### Step 1: Install Flutter Dependencies

```bash
cd mobile
flutter pub get
```

### Step 2: Configure Supabase Credentials

Edit `mobile/lib/config/constants.dart` and replace with your Supabase credentials:

```dart
static const String supabaseUrl = 'YOUR_SUPABASE_URL';
static const String supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
```

Alternatively, you can pass them via `--dart-define` when building.

### Step 3: Run on Emulator/Device

```bash
flutter run
```

For iOS (requires macOS):
```bash
flutter run -d ios
```

For Android:
```bash
flutter run -d android
```

### Step 4: Build for Production

**iOS**:
```bash
flutter build ios
```

**Android**:
```bash
flutter build apk --release
# or for app bundle:
flutter build appbundle --release
```

---

## 5. Deploy Web App to Vercel

### Option 1: Deploy with Vercel CLI

```bash
cd web
npm install -g vercel
vercel
```

Follow the prompts. Vercel will automatically detect the Vite configuration.

### Option 2: Deploy via GitHub

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Set the root directory to `web`
5. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Deploy

Vercel will automatically handle builds and deployments on every push to main.

---

## Demo Credentials

After seeding, you can log in with:

- **Email**: `john@famify-demo.com`
- **Password**: `Demo123!`

Or:

- **Email**: `patricia@famify-demo.com`
- **Password**: `Demo123!`

**Family Name**: The Johnsons

---

## Color Palette (Emerald/Green Theme)

- **Primary**: `#10B981` (emerald-500)
- **Primary Dark**: `#059669` (emerald-600)
- **Primary Light**: `#D1FAE5` (emerald-100)
- **Background**: `#F9FAFB` (gray-50)
- **Cards**: White with subtle shadows

**Category Colors**:
- Health: Rose 400
- Family: Emerald 400
- Activity: Sky 400
- Chores: Amber 400
- Other: Slate 400

**Member Colors** (for avatars):
- John: Blue 500
- Patricia: Emerald 500
- Julia: Orange 500

---

## Development Tips

### Web App

- The `Dashboard` page is the main feature showcase
- React Query handles all data fetching with caching
- Auth and Family contexts provide global state
- All dates in seed data are dynamic (relative to today)
- Use the demo login button for quick testing

### Mobile App

- Hot reload works for quick development: `r` in terminal
- Check `mobile/lib/config/constants.dart` for Supabase config
- Bottom navigation has 5 tabs matching the web app
- Login screen has a "Try Demo" button

### Supabase

- RLS policies protect all tables
- Use the SQL Editor for debugging queries
- Check Auth → Users to see registered users
- Storage buckets must be set to **public** for images to work

---

## Troubleshooting

### Web App won't connect to Supabase

- Check that `.env.local` exists and has correct keys
- Ensure you're using `VITE_` prefix for env variables
- Restart dev server after changing `.env.local`

### Mobile app build errors

- Run `flutter clean` then `flutter pub get`
- Check that `constants.dart` has valid Supabase URL
- For iOS: ensure Xcode is up to date
- For Android: check `minSdkVersion` in `android/app/build.gradle`

### Seed script fails

- Ensure you're using the **service_role** key, not anon key
- Check that the database migration ran successfully
- Delete existing demo users from Supabase Auth if re-seeding

### RLS errors (403 Forbidden)

- Check that you're logged in
- Verify RLS policies were created in migration
- Ensure user is a member of a family for family-scoped data

---

## Next Steps

After setup, you can:

1. Customize the theme colors in `web/tailwind.config.js` and `mobile/lib/config/theme.dart`
2. Add more features (meal planning details, photo galleries, music widget, etc.)
3. Implement Supabase Realtime for live updates
4. Add push notifications for reminders
5. Integrate Google Places API for the Needle feature
6. Set up CI/CD for automated deployments

---

## Architecture Decisions

- **Monorepo**: Web and mobile share the same Supabase backend
- **RLS**: All data is protected at the database level
- **Dynamic Seed Data**: Dates are always relative to today for realistic demo
- **Shared Auth**: Both apps use the same Supabase auth users
- **Storage**: Public buckets for simplicity (consider private with signed URLs for production)

---

## License

MIT

---

## Support

For issues or questions:
- Check the Supabase docs: [supabase.com/docs](https://supabase.com/docs)
- React Router docs: [reactrouter.com](https://reactrouter.com)
- Flutter docs: [flutter.dev](https://flutter.dev)

---

**Built with ❤️ using React, Flutter, and Supabase**
