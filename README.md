# Construction Management PWA

A beginner-friendly construction management progressive web app built with Next.js (App Router), Tailwind CSS, Prisma ORM, and PostgreSQL. It includes site management, daily work logs, material tracking, labour management, attendance, payroll, and dynamic ideal consumption rules.

## Features

- Email/password authentication with Admin and Supervisor roles
- Site CRUD with assigned supervisors
- Daily work logs with progress and optional image upload
- Material management and stock tracking
- Dynamic ideal consumption rules for work types and units
- Labour management, attendance, and payroll
- Dashboard overview, alerts, and reports
- CSV and PDF exports
- PWA installable manifest + offline support with service worker

## Setup

1. Install dependencies

```bash
npm install
```

2. Copy environment file

```bash
cp .env.example .env
```

3. Set `DATABASE_URL` for your PostgreSQL / Neon database

4. Create the database schema

```bash
npx prisma migrate dev --name init
```

5. Seed the default admin user

```bash
npx prisma db seed
```

6. Run the app

```bash
npm run dev
```

7. Open `http://localhost:3000`

## Default Admin

- Email: `admin@construction.app`
- Password: `admin123`

## Project structure

- `app/` - Next.js App Router pages and layouts
- `app/actions/` - Server Actions for data updates
- `app/components/` - Reusable UI components
- `lib/` - Prisma client and auth helpers
- `prisma/` - Prisma schema and seed script

## Notes

- Use a PostgreSQL database URL compatible with Neon
- The PWA service worker is enabled in production builds
- The ideal consumption system is dynamic and driven from the Admin panel
