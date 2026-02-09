# Database Setup Guide
**Aradhana Trust Website**  
**Last Updated**: February 9, 2026

---

## Overview

This project uses **Neon PostgreSQL** (serverless) for production, with Prisma as the ORM. This guide covers:
- Fresh system installation
- Database setup
- Common issues and fixes
- Cost analysis

---

## Quick Start (Fresh System)

### Prerequisites
- Node.js 18+ and npm installed
- Git installed
- VS Code (recommended)

### 1. Clone and Install

```bash
# Clone repository
git clone https://github.com/AradhanaTrust/website.git
cd website/web

# Install dependencies
npm install
```

### 2. Database Setup (Neon PostgreSQL)

#### Option A: Using neonctl (Recommended)

```bash
# Initialize Neon project
npx neonctl@latest init

# Follow prompts:
# - Authenticate with browser
# - Select "VS Code" editor
# - Connection string will be auto-configured
```

#### Option B: Manual Setup

1. **Sign up** at [neon.tech](https://neon.tech) (free, no credit card)
2. **Create project**: PostgreSQL 16, region: `ap-southeast-1`
3. **Copy connection string** from dashboard
4. **Create `.env` file** in `web/` directory:

```env
# Neon PostgreSQL Database
DATABASE_URL="postgresql://user:password@ep-xxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

# NextAuth Configuration
NEXT AUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-32-char-random-string-here"
```

> **Generate NEXTAUTH_SECRET**: Use [generate-secret.vercel.app/32](https://generate-secret.vercel.app/32)

### 3. Initialize Database

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed initial data (admin users + samples)
npm run db-seed
```

**Admin Credentials** (change in production!):
- **Primary Admin**: `admin@aradhanatrust.org` / `Admin@2026`
- **Secondary Admin**: `events@aradhanatrust.org` / `Events@2026`

### 4. Start Development Server

```bash
npm run dev
# Opens at http://localhost:3000
```

---

## Database Schema

The schema includes:

### Authentication Models
- `User` - Admin users with role-based access (PRIMARY_ADMIN, SECONDARY_ADMIN)
- `Account` - NextAuth account linking
- `Session` - User sessions
- `VerificationToken` - Email verification

### Application Models
- `Event` - Temple events
- `Donation` - Razorpay payment tracking
- `DonationRecord` - Admin-tracked donations with 80G certificate support
- `EventRegistration` - Event attendee tracking
- `ContactSubmission` - Contact form submissions

---

## Cost Analysis

### Neon Free Tier (Recommended) - $0/month

**Your Usage** (2 admins, <1000 event records, ~10 MB database):

| Resource | Free Tier Limit | Your Usage | Cost |
|----------|----------------|------------|------|
| **Storage** | 0.5 GB | ~10 MB | **$0** |
| **Compute** | 100 CU-hours/month | ~50 hours/month | **$0** |
| **Transfer** | 5 GB/month | ~500 MB/month | **$0** |
| **Branches** | 10 branches | 1 needed | **$0** |

**Features**:
- ✅ Always online (no auto-pause)
- ✅ Auto-scales to zero when idle
- ✅ 6-hour Point-in-Time Recovery
- ✅ Easy migration path to paid tier

### Alternatives

| Provider | Monthly Cost | Notes |
|----------|--------------|-------|
| **Neon Free** | $0 | ⭐ Recommended for this project |
| Neon Launch | $5 | If you exceed free tier |
| Supabase Free | $0 | ❌ Auto-pauses after 7 days (not suitable) |
| Supabase Pro | $25 | Overkill for current needs |
| Vercel Postgres Pro | $40 | Too expensive (2 users @ $20 each) |

**Verdict**: Neon Free Tier is perfect for this use case and will remain free indefinitely.

---

## Common Issues & Fixes

### Issue 1: PrismaClient Import Error

**Error**: `Module '"@prisma/client"' has no exported member 'PrismaClient'`

**Cause**: TypeScript cache or Prisma Client not generated

**Solution**:
```bash
# Regenerate Prisma Client
npx prisma generate

# Restart TypeScript Server in VS Code
# Press: Ctrl + Shift + P
# Type: "TypeScript: Restart TS Server"
```

### Issue 2: Database Connection Failed

**Error**: `Can't reach database server`

**Solutions**:
1. **Check `.env` file exists** in `web/` directory
2. **Verify connection string** format:
   ```
   postgresql://user:pass@host/db?sslmode=require
   ```
3. **Test connection**:
   ```bash
   npx prisma db pull
   ```

### Issue 3: Migration Lock Provider Mismatch

**Error**: Migration errors or wrong provider

**Solution**:
```bash
# Check migration_lock.toml
cat prisma/migrations/migration_lock.toml

# Should say: provider = "postgresql"
# If it says "sqlite", update it manually:
echo 'provider = "postgresql"' > prisma/migrations/migration_lock.toml
```

### Issue 4: Seeding Fails with Unique Constraint Violation

**Error**: `Unique constraint failed`

**Cause**: Database already seeded

**Solution**: This is expected if you already ran `npm run db-seed`. The data exists!

To reset database (WARNING: deletes all data):
```bash
npx prisma db push --force-reset
npm run db-seed
```

### Issue 5: Prisma Version Mismatch

**Error**: Configuration errors, `url` property not supported

**Cause**: Using Prisma 7.x (has breaking changes)

**Solution**: Downgrade to Prisma 5.22.0:
```bash
npm install -D prisma@5.22.0
npm install @prisma/client@5.22.0
npx prisma generate
```

---

## Database Maintenance

### View Database Data

```bash
# Open Prisma Studio (GUI)
npx  prisma studio

# Opens at http://localhost:5555
```

### Backup Database

Neon provides automatic backups with 6-hour Point-in-Time Recovery on free tier.

**Manual Export**:
```bash
# Connect to database and export
pg_dump $DATABASE_URL > backup.sql
```

### Update Schema

```bash# 1. Modify prisma/schema.prisma

# 2. Push changes
npx prisma db push

# 3. Regenerate client
npx prisma generate
```

---

## Production Deployment

### Vercel (Recommended)

1. **Add Environment Variables** in Vercel dashboard:
   - `DATABASE_URL` - Your Neon connection string
   - `NEXTAUTH_URL` - Your production URL
   - `NEXTAUTH_SECRET` - Random 32-char string

2. **Deploy**:
   ```bash
   vercel deploy --prod
   ```

### Hostinger VPS

1. **Install PostgreSQL** or use Neon (recommended)
2. **Set Environment Variables** in `.env`
3. **Build and Start**:
   ```bash
   npm run build
   pm2 start npm --name "aradhana-web" -- start
   ```

> **Note**: SQLite does NOT work on Vercel (serverless). Always use PostgreSQL for deployment.

---

## Schema Migration History

**Current Version**: PostgreSQL schema (February 2026)

**Changes from Initial Setup**:
- ✅ Migrated from SQLite to PostgreSQL
- ✅ Added role-based authentication (PRIMARY_ADMIN, SECONDARY_ADMIN)
- ✅ Added DonationRecord with 80G certificate fields
- ✅ Added EventRegistration and ContactSubmission tracking
- ✅ Configured for Neon serverless PostgreSQL

**Migration Lock**: `provider = "postgresql"`

---

## Database Configuration Files

```
web/
├── .env                          # Database connection string (DO NOT COMMIT!)
├── prisma/
│   ├── schema.prisma             # Database schema definition
│   ├── seed.ts                   # Seed data script
│   └── migrations/
│       └── migration_lock.toml   # Prevents provider mismatch
└── package.json                  # Prisma version: 5.22.0
```

---

## Support & Resources

**Official Documentation**:
- [Neon PostgreSQL Docs](https://neon.tech/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth.js Docs](https://next-auth.js.org)

**Common Commands Reference**:
```bash
# View schema status
npx prisma validate

# Format schema file
npx prisma format

# Open database GUI
npx prisma studio

# Generate TypeScript types
npx prisma generate

# Apply schema changes
npx prisma db push

# Seed database
npm run db-seed
```

---

## Security Checklist

Before deploying to production:

- [ ] Change default admin passwords
- [ ] Generate new `NEXTAUTH_SECRET`
- [ ] Verify `.env` is in `.gitignore`
- [ ] Enable SSL for database connection (`sslmode=require`)
- [ ] Set up database backups
- [ ] Rotate database credentials periodically
- [ ] Review Prisma security best practices

---

**Status**: ✅ Database fully configured and operational  
**Cost**: $0/month (Neon Free Tier)  
**Performance**: Optimal for temple trust website traffic
