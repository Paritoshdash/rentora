# 🏠 Rentora — Smart Property Management Platform

A modern, full-stack rental and property management SaaS application built with **Next.js 15**, **Supabase**, and **Tailwind CSS**.

![Rentora Dashboard](https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=400&fit=crop)

## ✨ Features

- 🏢 **Property Management** — Add/edit/delete properties with images, units, and occupancy tracking
- 👥 **Tenant Management** — Full tenant profiles with documents, agreements, and contact info
- 💰 **Rent Tracking** — Monthly payment tracking with paid/pending/overdue status and late fees
- 📊 **Reports & Analytics** — Income charts, expense breakdowns, and downloadable PDF reports
- 🔔 **Smart Notifications** — Automated reminders for rent due, overdue, and agreement expiry
- 🧾 **PDF Receipts** — Generate professional rent receipts instantly
- 📅 **Calendar View** — Visual calendar for all rent dates and agreement events
- 💸 **Expense Management** — Track electricity, water, repairs, and maintenance costs
- 🌙 **Dark/Light Mode** — Toggle between themes
- 📱 **Fully Responsive** — Works perfectly on mobile, tablet, and desktop

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS v4 |
| UI Components | Radix UI primitives |
| Authentication | Supabase Auth |
| Database | Supabase (PostgreSQL) |
| File Storage | Supabase Storage |
| Charts | Recharts |
| PDF Generation | jsPDF |
| Icons | Lucide React |
| Animations | Framer Motion |
| Deployment | Vercel |

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd rentora
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In the SQL Editor, run the contents of `supabase-schema.sql`
3. Copy your project URL and anon key

### 3. Configure Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
rentora/
├── src/
│   ├── app/
│   │   ├── api/                    # API routes
│   │   │   ├── properties/
│   │   │   ├── tenants/
│   │   │   ├── payments/
│   │   │   └── expenses/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── dashboard/
│   │   │   ├── page.tsx            # Main dashboard
│   │   │   ├── properties/
│   │   │   ├── tenants/
│   │   │   ├── rent/
│   │   │   ├── expenses/
│   │   │   ├── reports/
│   │   │   ├── calendar/
│   │   │   ├── notifications/
│   │   │   └── settings/
│   │   ├── layout.tsx
│   │   └── page.tsx                # Landing page
│   ├── components/
│   │   ├── ui/                     # Reusable UI components
│   │   ├── layout/                 # Sidebar, Header, DashboardLayout
│   │   ├── dashboard/              # Dashboard widgets
│   │   ├── properties/             # Property components
│   │   ├── tenants/                # Tenant components
│   │   ├── expenses/               # Expense components
│   │   └── landing/                # Landing page
│   ├── lib/
│   │   ├── supabase/               # Supabase client/server
│   │   ├── utils.ts                # Utility functions
│   │   ├── dummy-data.ts           # Demo data
│   │   └── pdf-generator.ts        # PDF generation
│   ├── types/
│   │   └── index.ts                # TypeScript types
│   └── middleware.ts               # Auth middleware
├── supabase-schema.sql             # Database schema
├── .env.local                      # Environment variables
└── package.json
```

## 🗄 Database Schema

The app uses 6 main tables:
- `properties` — Property listings
- `tenants` — Tenant profiles
- `payments` — Monthly rent records
- `expenses` — Property expenses
- `notifications` — User notifications
- `activity_logs` — Audit trail

All tables have Row Level Security (RLS) enabled — users can only access their own data.

## 🚢 Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

## 🔐 Authentication

In **demo mode**, authentication is bypassed so you can explore the dashboard freely.

To enable real authentication:
1. Set up Supabase Auth in your project
2. Uncomment the auth check in `src/middleware.ts`
3. The login/signup pages will connect to Supabase automatically

## 📱 WhatsApp/SMS Integration

The notification system is architected for future WhatsApp and SMS integration:
- Configure Twilio credentials in Settings
- Enable SMS/WhatsApp toggles in Notification Preferences
- Automated reminders will be sent via the configured channels

## 🎨 Color Palette

| Color | Usage |
|-------|-------|
| `#0f172a` | Sidebar background |
| `#2563eb` | Primary blue |
| `#10b981` | Success/paid green |
| `#f59e0b` | Warning/pending yellow |
| `#ef4444` | Error/overdue red |
| `#f8fafc` | Page background |

## 📄 License

MIT License — free to use for personal and commercial projects.

---

Built with ❤️ for Indian Landlords | [rentora.in](https://rentora.in)
