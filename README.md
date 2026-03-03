<p align="center">
  <img src="https://img.icons8.com/3d-fluency/94/graduation-cap.png" width="80" alt="EduNex Logo"/>
</p>

<h1 align="center">EduNex — The Elegant OS for Modern Education</h1>

<p align="center">
  <strong>A production-grade, multi-tenant School Management SaaS platform.</strong><br/>
  Built for scale. Designed for elegance. Engineered for security.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React 19"/>
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 7"/>
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind 4"/>
  <img src="https://img.shields.io/badge/Supabase-Backend-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Active%20Development-brightgreen?style=flat-square" alt="Status"/>
  <img src="https://img.shields.io/badge/License-Proprietary-red?style=flat-square" alt="License"/>
  <img src="https://img.shields.io/badge/Multi--Tenant-Yes-blue?style=flat-square" alt="Multi-Tenant"/>
  <img src="https://img.shields.io/badge/Tables-54-orange?style=flat-square" alt="54 Tables"/>
  <img src="https://img.shields.io/badge/RLS%20Policies-211-purple?style=flat-square" alt="RLS Policies"/>
</p>

---

## ⚠️ Security Notice

> **Some critical files have been intentionally excluded from this repository for security purposes.**
> Without these files, the application **will not compile, build, or run.**
>
> This is by design — the source code is viewable, but the application is non-functional without the private configuration files maintained by the project owner.

<details>
<summary><strong>🔒 Files excluded from this repository</strong></summary>

| File | Purpose | Without it... |
|------|---------|---------------|
| `PRIVATE/.env` | All API keys & environment variables | ❌ No backend connection |
| `PRIVATE/security-keys.md` | Key reference & rotation guide | — |
| `vite.config.ts` | Build system configuration | ❌ `npm run dev` fails |
| `index.html` | App entry point | ❌ Nothing renders |
| `Many More` | Many More | — |

</details>

---

## 🎯 What is EduNex?

EduNex is a **multi-tenant School Management System** built as a full SaaS platform. It is not a template, not a demo, and not a prototype — it is a scalable, modular, backend-connected production system designed to manage **multiple schools** from a single deployment.

```
┌──────────────────────────────────────────────────────────────┐
│                     EDUNEX PLATFORM                          │
│                                                              │
│   🏫 School A    🏫 School B    🏫 School C    🏫 School N  │
│   ┌──────────┐   ┌──────────┐   ┌──────────┐               │
│   │ Students │   │ Students │   │ Students │    ...         │
│   │ Teachers │   │ Teachers │   │ Teachers │               │
│   │ Finance  │   │ Finance  │   │ Finance  │               │
│   │ Exams    │   │ Exams    │   │ Exams    │               │
│   └──────────┘   └──────────┘   └──────────┘               │
│                                                              │
│              🔐 Tenant Isolation (Row Level Security)        │
│              👤 Role-Based Access Control (7 Roles)          │
│              📊 Unified Super Admin Dashboard                │
└──────────────────────────────────────────────────────────────┘
```

---

## ✨ Key Features

<table>
<tr>
<td width="50%">

### 🏢 Multi-Tenant Architecture
- Complete school isolation via `school_id`
- Row Level Security on all 54 tables
- No cross-tenant data leakage
- Per-school feature flags & subscriptions

</td>
<td width="50%">

### 🔐 Enterprise Security
- Supabase Auth with JWT
- 211 RLS policies enforced
- Service Role keys isolated to Edge Functions
- Audit logging & session tracking

</td>
</tr>
<tr>
<td>

### 👥 7-Role RBAC System
- **Super Admin** — Platform-wide control
- **Admin** — School-level management
- **Teacher** — Classes, attendance, grading
- **Student** — Personal dashboard
- **Parent** — Child monitoring
- **Accountant** — Finance & payroll
- **Receptionist** — Visitors & inquiries

</td>
<td>

### 📊 Super Admin Dashboard
- Real-time revenue overview (live from DB)
- Total schools, students, teachers
- Active subscriptions tracking
- System health & alerts monitoring
- School creation & admin management

</td>
</tr>
<tr>
<td>

### 💰 Finance & Billing
- Fee structure management
- Invoice generation & tracking
- Transaction processing
- Salary & payroll system
- SaaS subscription tiers (Starter/Pro/Enterprise)

</td>
<td>

### 📋 Academic Management
- Class & section management
- Subject-teacher mapping
- Timetable scheduling
- Attendance tracking
- Homework & submission system
- Examination & grading

</td>
</tr>
</table>

---

## 🛠 Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | React | 19.2 |
| **Language** | TypeScript | 5.9 |
| **Build** | Vite | 7.3 |
| **Styling** | Tailwind CSS | 4.2 |
| **Animations** | Framer Motion | 12.x |
| **Icons** | Lucide React | Latest |
| **Backend** | Supabase (PostgreSQL + Auth) | — |
| **Edge Functions** | Deno (Supabase Functions) | — |
| **Routing** | React Router | 7.x |

---

## 🏗 Architecture

```
EduNex/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── auth/            # Login modals, protected routes
│   │   ├── dashboard/       # Dashboard widgets
│   │   ├── ui/              # Buttons, toasts, transitions
│   │   ├── effects/         # Visual effects
│   │   └── layout/          # App shell, sidebar, navbar
│   │
│   ├── pages/               # Route pages
│   │   ├── LandingPage      # Marketing homepage
│   │   ├── SuperAdminDashboard
│   │   ├── SuperAdminDatabase
│   │   ├── SchoolsManagement
│   │   ├── UserManagement
│   │   ├── FinanceBilling
│   │   ├── AttendancePage
│   │   ├── SystemAlerts
│   │   └── GlobalSetup
│   │
│   ├── config/              # Roles & route configuration
│   ├── context/             # Auth provider (excluded)
│   ├── lib/                 # Supabase client, logger (excluded)
│   └── hooks/               # Custom React hooks
│
├── supabase/
│   ├── functions/           # Edge Functions (server-side)
│   │   ├── create_tenant_admin/
│   │   └── update_admin/
│   ├── schema.sql           # 54-table schema (excluded)
│   └── migrations/          # RLS policies (excluded)
│
├── PRIVATE/                 # 🔒 Excluded — API keys & secrets
├── .MD/                     # 🔒 Excluded — Internal docs
└── ExWeb/                   # Design reference files
```

---

## 📦 Database Schema — 54 Tables

The database is organized into **8 logical layers**:

| # | Layer | Tables | Purpose |
|---|-------|--------|---------|
| 1 | **Core** | `schools`, `profiles`, `academic_years` | Foundation entities |
| 2 | **Identity** | `roles`, `permissions`, `role_permissions`, `memberships` | RBAC system |
| 3 | **Academic** | `classes`, `subjects`, `enrollments`, `timetable`, `attendance`, `homework` | Teaching & learning |
| 4 | **Exams** | `exams`, `exam_subjects`, `exam_results`, `grading_scales` | Assessment |
| 5 | **Finance** | `fee_structures`, `invoices`, `transactions`, `salary` | Money management |
| 6 | **Billing** | `subscription_plans`, `school_subscriptions`, `payment_methods` | SaaS billing |
| 7 | **Communication** | `notifications`, `events`, `messages`, `threads` | Messaging |
| 8 | **Security** | `system_logs`, `audit_logs`, `login_attempts`, `user_sessions` | Monitoring |

> All tables enforce tenant isolation via `school_id` + Row Level Security.

---

## 🔑 Subscription Tiers

| | Starter | Pro | Enterprise |
|---|---------|-----|-----------|
| **Price** | ₹999/mo | ₹2,999/mo | ₹7,999/mo |
| **Students** | 100 | 500 | 5,000 |
| **Admins** | 2 | 5 | 20 |
| **Teachers** | 10 | 50 | 500 |
| **Storage** | 1 GB | 5 GB | 50 GB |
| **Messaging** | ❌ | ✅ | ✅ |
| **Online Classes** | ❌ | ✅ | ✅ |
| **API Access** | ❌ | ❌ | ✅ |
| **White Labeling** | ❌ | ❌ | ✅ |
| **SMS Notifications** | ❌ | ✅ | ✅ |
| **Advanced Reports** | ❌ | ✅ | ✅ |
| **Custom Roles** | ❌ | ✅ | ✅ |

---

## 🎨 Design Philosophy

EduNex follows a **premium, soft-layered design system**:

- 🎯 **Clay-morphism** — Soft shadows with depth
- 🟢 **Emerald + Lime accent palette** — Professional education aesthetic
- ✍️ **Plus Jakarta Sans** — Modern, bold typography
- 🌊 **Framer Motion** — Smooth page transitions & micro-interactions
- 📱 **Responsive** — Desktop-first, mobile-ready

---

## 🚀 Getting Started

> ⚠️ **This project cannot be run without the private configuration files.** The instructions below are for the project maintainer only.

```bash
# 1. Clone the repository
git clone https://github.com/your-username/SaaSSchool.git
cd SaaSSchool

# 2. Install dependencies
npm install

# 3. Add your PRIVATE/ folder with .env file
# (Contains Supabase URL, API keys, security config)

# 4. Add the excluded critical files
# (vite.config.ts, index.html, src/lib/supabase.ts, src/context/AuthContext.tsx)

# 5. Start development server
npm run dev
```

---

## 📄 Environment Variables Required

Create a `PRIVATE/.env` file with:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
VITE_SECURITY_CODE=your-security-code
```

---

## 🗺 Roadmap

- [x] Multi-tenant database schema (54 tables)
- [x] Super Admin dashboard with live data
- [x] School CRUD with admin creation
- [x] Edge Functions for secure user management
- [x] 7-role RBAC system
- [x] Finance & billing module
- [x] Attendance tracking
- [x] System alerts & monitoring
- [ ] Parent portal
- [ ] Student self-service portal
- [ ] Teacher class management
- [ ] Online class integration (Zoom/Meet)
- [ ] SMS/Push notification gateway
- [ ] Mobile-responsive redesign
- [ ] Advanced analytics & reporting
- [ ] Data export (CSV/PDF)

---

## 🤝 Contributing

This is a **proprietary project**. Contributions are not accepted at this time.

If you have questions or want to discuss the architecture, open an issue.

---

## 📜 License

**Proprietary** — All rights reserved.

This software is the intellectual property of the project owner. Unauthorized copying, distribution, modification, or deployment is strictly prohibited.

---

<p align="center">
  <img src="https://img.icons8.com/3d-fluency/48/graduation-cap.png" width="24" alt="EduNex"/>
  <br/>
  <strong>EduNex</strong> — Empowering Education, Simplifying Management
  <br/>
  <sub>Built with ❤️ using React, TypeScript, Supabase & Tailwind</sub>
</p>

---

```
Copyright (c) 2026 Arth
All rights reserved.

This source code is proprietary and confidential.
Unauthorized copying, modification, distribution, public display,
or commercial use of this software is strictly prohibited.

This repository is provided for review purposes only.
No license is granted to use, reproduce, or distribute this code.
```
