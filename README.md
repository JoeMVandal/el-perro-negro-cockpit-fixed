# El Perro Negro Cockpit

A full-featured bar operations platform built with Next.js + Supabase for El Perro Negro.

## Features

- **Recipes** — Manage cocktail recipes with ingredient costs and pour costing
- **Inventory** — Track stock across multiple locations (main bar, service well, back stock, walk-in)
- **Prep Lists** — Daily prep checklist for house-made components and syrups
- **Staff Notes** — Team communication and shift reminders
- **Admin** — User management (manager/bartender roles)
- **Backbar Counting** — Bottle-fraction inventory counting system
- **Live Updates** — Real-time data powered by Supabase

## Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend:** Supabase (PostgreSQL, Auth, Realtime)
- **Styling:** El Perro Negro brand (agave gold #C29A2D, ink black)
- **Hosting:** Vercel (free tier compatible)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

**Create a Supabase project:**
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for it to initialize
3. Go to **Settings > API** and copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Set up the database:**
1. In Supabase, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `supabase-schema.sql` from this repo
4. Paste it in and click **Run**
5. Wait for all tables and policies to be created

**Enable email auth:**
1. In Supabase, go to **Authentication > Providers**
2. Enable **Email** (it's on by default)
3. Go to **Settings** and note the confirmation URL format

### 3. Configure Environment

Create `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Test the app:**
1. Click **Create Account**
2. Sign up with your email
3. Check your email for confirmation link
4. Sign in
5. You'll land on the dashboard!

---

## Deployment to Production

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: El Perro Negro Cockpit"
git remote add origin https://github.com/YOUR_USERNAME/el-perro-negro-app
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **Add New > Project**
3. Select your GitHub repo
4. In **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click **Deploy**

Vercel will auto-deploy whenever you push to `main`.

### Step 3: Set Up Email Confirmation URL

Your app is now live at a Vercel URL. Tell Supabase where to send confirmation emails:

1. In Supabase, go to **Authentication > Email Templates**
2. For the confirmation email, update the redirect URL to:
   ```
   https://your-app.vercel.app/login
   ```
   (Replace `your-app` with your actual Vercel domain)

---

## Usage

### First Login

1. **Create Account** at [your-app.vercel.app/signup](https://your-app.vercel.app/signup)
2. Confirm your email
3. Sign in
4. **If you're the manager:**
   - Go to **Admin** and set your role to `manager` (only managers can edit recipes, ingredients, inventory)
   - Invite staff: Click **Invite User** (this will be email-based via Supabase)

### Managing Recipes

- **Recipes** → Click **New Recipe**
- Add ingredients and their costs
- System calculates pour cost automatically
- Click on any recipe to see details and add components

### Inventory Tracking

- **Inventory** → Click **Start Count**
- Walk through each location (main bar, service well, etc.)
- Enter current amounts for each item
- System tracks variance automatically

### Daily Operations

- **Dashboard** — At-a-glance view of low stock, pending prep tasks, recent notes
- **Prep Lists** — Check off daily prep items as you complete them
- **Staff Notes** — Post messages, reminders, equipment issues for the team

### Admin Panel

- **Admin** — Manage users, view roles, export data
- Only managers can see this page

---

## Database

### Tables

- **user_profiles** — Staff members and their roles
- **ingredients** — All bar ingredients with costs
- **recipes** — Cocktail recipes
- **recipe_components** — Ingredients in each recipe
- **inventory** — Current stock levels by location
- **prep_list_items** — Daily prep tasks
- **staff_notes** — Team communication
- **counts** — Historical inventory count snapshots

### Permissions

- **Managers** can create/edit/delete recipes, ingredients, and inventory
- **Bartenders** can read recipes and inventory, add/check prep tasks, post notes
- All users can view all data (no hiding)

---

## Development

### Project Structure

```
el-perro-negro-app/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Login/signup pages
│   ├── dashboard/         # Main dashboard
│   ├── recipes/           # Recipe pages
│   ├── inventory/         # Inventory pages
│   ├── prep/              # Prep list page
│   ├── notes/             # Staff notes page
│   └── admin/             # Admin panel
├── components/            # React components
│   ├── Logo.tsx
│   ├── Sidebar.tsx
│   └── ProtectedLayout.tsx
├── lib/
│   ├── supabase.ts        # Supabase client
│   ├── db.ts              # Database operations
│   ├── types.ts           # TypeScript types
│   └── utils.ts           # Utilities
├── styles/                # Global CSS
├── public/                # Images, logos
├── supabase-schema.sql    # Database schema
├── BRAND.md               # Brand guidelines
└── README.md              # This file
```

### Adding a New Feature

1. **Create a new page:**
   ```bash
   mkdir -p app/feature
   touch app/feature/page.tsx
   touch app/feature/layout.tsx
   ```

2. **Use the ProtectedLayout** to ensure auth:
   ```tsx
   import { ProtectedLayout } from '@/components/ProtectedLayout'
   
   export default function FeatureLayout({ children }) {
     return <ProtectedLayout>{children}</ProtectedLayout>
   }
   ```

3. **Fetch data from Supabase:**
   ```tsx
   import { getRecipes } from '@/lib/db'
   
   useEffect(() => {
     const data = await getRecipes()
   }, [])
   ```

4. **Follow the branding** (see `BRAND.md`)

---

## Troubleshooting

### "Session not found" error
- Supabase auth session isn't set up. Make sure `.env.local` has the correct credentials.
- Clear browser cookies and try signing up again.

### Can't create recipes (403 error)
- Your user role is `bartender`, not `manager`.
- Go to Supabase > **Authentication > Users**, find your account, and in the user metadata, change the role.

### Inventory counts not saving
- Make sure you have an ingredient created before adding inventory.
- Check that the location field matches one of: `main_bar`, `service_well`, `back_stock`, `walk_in`

### Need to reset everything?
- Go to Supabase > **SQL Editor** and run:
  ```sql
  DELETE FROM recipes;
  DELETE FROM ingredients;
  DELETE FROM inventory;
  ```
- This will cascade delete related records.

---

## Support & Resources

- **Supabase Docs:** [supabase.com/docs](https://supabase.com/docs)
- **Next.js Docs:** [nextjs.org](https://nextjs.org)
- **Brand Guidelines:** See `BRAND.md`

---

**El Perro Negro Cockpit** — Operations made simple.

Built with ❤️ for craft bars. Agave y Amigos.
# ESLint Quote Fix
