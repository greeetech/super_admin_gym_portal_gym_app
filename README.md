# Super Admin Portal — Gym SaaS Platform Control Center

A high-performance React 19 + Vite + Tailwind CSS dashboard engineered for the central SaaS platform administrator to manage gym tenants, SaaS subscription tiers, global recurring revenue (MRR / ARR), and platform-wide Razorpay transactions.

---

## Features

- **Platform Analytics & Growth:**
  - Real-time MRR, ARR, and total platform SaaS revenue.
  - Interactive monthly revenue trend charts (Recharts AreaChart) and tenant acquisition volume (BarChart).
  - Subscription tier distribution donut chart (Pro, Basic, Free).
  - Quick recent tenants and transaction feed.
- **Gym Tenants Management:**
  - Search tenants by gym name, owner name, or email.
  - Filter by account status (`active` / `suspended`) and subscription tier (`pro` / `basic` / `free`).
  - Detailed tenant inspector drawer with complete owner contact, website slug, active members count, and subscription breakdown.
  - Instant account suspension and reactivation controls.
  - Manual SaaS subscription provisioner (grant custom trial or enterprise duration without payment gateway).
- **SaaS Subscription Plans:**
  - Create and edit subscription plans (monthly & annual pricing, member quotas, feature bullets, highlight badge).
  - Instant plan activation / deactivation toggle.
  - Soft-archive obsolete tiers.
- **Global Revenue Ledger:**
  - Comprehensive transaction log with Razorpay Order ID and Payment ID lookup.
  - Filter by payment status (`paid`, `pending`, `failed`) and billing cycle.
  - Single-click CSV export of payment records.
  - Copy transaction IDs and gateway references to clipboard.
- **Settings & System Health:**
  - SuperAdmin profile inspector.
  - Cloud infrastructure status (MongoDB, Razorpay, Cloudinary, Public site engines).
  - Integrated demo seeder commands.

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
The SuperAdmin portal runs on **`http://localhost:5174`** by default and automatically proxies `/admin` API calls to `http://localhost:3001`.

### 3. Production Build
```bash
npm run build
```
Creates an optimized production bundle inside `dist/`.

---

## Authentication

- **Master Super Admin Email:** `admin@gym.com`
- **Master Password:** `Admin@123`
- Single-click auto-fill button available on the `/login` screen for fast evaluation.
- Authentication utilizes isolated `x-admin-token` JWT headers.