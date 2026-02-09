# Database Migration Guide: PostgreSQL ↔ SQLite
**Aradhana Trust Website**  
**Last Updated**: February 9, 2026

---

## Overview

This guide covers migrating between PostgreSQL (Neon) and SQLite databases. While technically simple, **we recommend staying with PostgreSQL** even on Hostinger VPS.

---

## Migration Difficulty Assessment

### Complexity Score: 🟢 **1/10 (Very Easy)**

**Why it's easy**:
- ✅ Schema is fully compatible with both databases
- ✅ Prisma handles database abstraction
- ✅ No raw SQL queries in codebase
- ✅ Small dataset (2 users, sample data)
- ✅ Total migration time: ~45 minutes

---

## Schema Compatibility Analysis

### ✅ Fully Compatible Features

Your current schema uses only features supported by both databases:

| Feature | PostgreSQL | SQLite | Status |
|---------|-----------|--------|--------|
| `@id @default(cuid())` | ✅ | ✅ | Compatible |
| `@unique` constraints | ✅ | ✅ | Compatible |
| `@@unique` composite | ✅ | ✅ | Compatible |
| `@default(now())` | ✅ | ✅ | Compatible |
| `@updatedAt` | ✅ | ✅ | Compatible |
| Enums (`Role`) | Native | Emulated by Prisma | Compatible |
| Relations | ✅ | ✅ | Compatible |
| Foreign Keys | ✅ | ✅ | Compatible |
| Indexes `@@index` | ✅ | ✅ | Compatible |

**Result**: ✅ **No schema changes needed** (except provider)

### ⚠️ SQLite Limitations (FYI)

These won't affect your use case but good to know:

| Limitation | Impact on You | Severity |
|------------|---------------|----------|
| **Concurrent writes** | 2 admins won't conflict | 🟢 None |
| **ALTER TABLE restrictions** | Prisma handles via recreate | 🟡 Low |
| **Transaction isolation** | Low traffic = no issue | 🟢 None |
| **JSON operations** | Not using JSON fields | 🟢 None |
| **Scale limit** | Temple site = low traffic | 🟢 None |

---

## Migration Options

### Option 1: PostgreSQL → SQLite (45 minutes)

**When to use**: Deploying to Hostinger with self-hosted SQLite

#### Step-by-Step Process

**1. Update Prisma Schema** (1 minute)

```bash
# Edit web/prisma/schema.prisma
```

**Before**:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**After**:
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

**2. Update Environment Variables** (1 minute)

```bash
# Edit web/.env
```

**Before**:
```bash
# Update .env file with your Neon PostgreSQL connection string
# ⚠️ Get the actual DATABASE_URL from: deployment_secrets_DO_NOT_COMMIT.txt
DATABASE_URL="postgresql://[user]:[password]@[host]/[database]?sslmode=require"
```

> **🔒 Security Note**: The actual connection string is stored in `deployment_secrets_DO_NOT_COMMIT.txt` which is in `.gitignore` and never committed to Git.

**After**:
```env
DATABASE_URL="file:./dev.db"
```

**3. Regenerate Prisma Client** (30 seconds)

```bash
npx prisma generate
```

**4. Push Schema to SQLite** (30 seconds)

```bash
npx prisma db push
```

**5. Seed Database** (30 seconds)

```bash
npm run db-seed
```

**6. Test Locally** (10 minutes)

```bash
npm run dev

# Test:
# - Homepage loads
# - Admin login works
# - Database operations work
```

**7. Deploy to Hostinger** (30 minutes)

```bash
# On VPS via SSH
cd /var/www/AradhanaTrust/web

# Pull latest code
git pull origin main

# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Push schema
npx prisma db push

# Seed database
npm run db-seed

# Build application
npm run build

# Restart PM2
pm2 restart aradhana-web
```

#### Data Migration (If Needed)

**For small datasets** (your case):
```bash
# Just re-seed - easiest!
npm run db-seed
```

**For production data** (if you have real user data):

```bash
# 1. Export from PostgreSQL
npx prisma studio
# Manually export data or use pg_dump

# 2. Convert to CSV
pg_dump --data-only --column-inserts $DATABASE_URL > backup.sql

# 3. Import to SQLite
sqlite3 dev.db < converted_backup.sql
```

---

### Option 2: SQLite → PostgreSQL (30 minutes)

**When to use**: Moving from local SQLite to Neon for production

#### Process

**1. Create Neon Database**

```bash
# Using neonctl (recommended)
npx neonctl@latest init

# Or manually at https://neon.tech
```

**2. Update Schema**

```prisma
datasource db {
  provider = "postgresql"  // Change from "sqlite"
  url      = env("DATABASE_URL")
}
```

**3. Update .env**

```bash
# In web/.env
# ⚠️ Get the full connection string from: ../deployment_secrets_DO_NOT_COMMIT.txt
DATABASE_URL="postgresql://[user]:[password]@[host]/[database]?sslmode=require"
```

**4. Deploy**

```bash
npx prisma generate
npx prisma db push
npm run db-seed
npm run dev
```

---

## Recommended Approach

### 🏆 Best: Hostinger VPS + Neon PostgreSQL

**Setup**:
```bash
# In web/.env
# ⚠️ Get the full connection string from: ../deployment_secrets_DO_NOT_COMMIT.txt
DATABASE_URL="postgresql://[user]:[password]@[host]/[database]?sslmode=require"
```

**Why This is Better**:

| Factor | SQLite on VPS | Neon PostgreSQL |
|--------|--------------|-----------------|
| **Database Cost** | Included in VPS | $0/month (free tier) |
| **VPS Cost** | $6-12/month | $6-12/month (same) |
| **Backups** | Manual setup | Automatic (6hr PITR) |
| **Scalability** | Single server | Auto-scales |
| **Maintenance** | You manage | Fully managed |
| **Data Safety** | VPS-dependent | Independent service |
| **Migration** | Needed | **Not needed!** |

**Total Cost**: Same ($6-12/month for VPS), but better reliability

**Advantage**: Database is **independent** of hosting - you can:
- Switch hosting providers without touching database
- Scale hosting and database separately
- Get professional backups for free
- No migration needed!

---

## Migration Checklist

### Pre-Migration

- [ ] Backup current database (if has production data)
- [ ] Test migration on local development first
- [ ] Update `.gitignore` to exclude database files
- [ ] Document current admin credentials
- [ ] Verify Prisma version compatibility (5.22.0)

### During Migration

- [ ] Update `prisma/schema.prisma` provider
- [ ] Update `DATABASE_URL` in `.env`
- [ ] Run `npx prisma generate`
- [ ] Run `npx prisma db push`
- [ ] Run `npm run db-seed`
- [ ] Test application locally

### Post-Migration

- [ ] Verify admin login works
- [ ] Test all CRUD operations
- [ ] Check database file permissions (SQLite only)
- [ ] Set up backups
- [ ] Update deployment documentation
- [ ] Commit changes to Git

---

## Troubleshooting

### Issue: "Provider not supported"

**Error**: `Error: Unknown provider: sqlite`

**Solution**:
```bash
# Reinstall Prisma
npm install prisma@5.22.0 @prisma/client@5.22.0
npx prisma generate
```

### Issue: Migration fails

**Error**: `Migration engine failed`

**Solution**:
```bash
# Use db push instead (no migration history)
npx prisma db push --force-reset
```

### Issue: Foreign key constraint errors (SQLite)

**Error**: `FOREIGN KEY constraint failed`

**Solution**:
```bash
# SQLite has foreign keys disabled by default
# Prisma enables them automatically, but if issues persist:

# Check Prisma enables foreign keys:
# Add to schema.prisma:
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
  relationMode = "foreignKeys"  // Explicitly enable
}
```

### Issue: Data loss after migration

**Prevention**:
```bash
# Always backup first!
# For PostgreSQL:
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# For SQLite:
cp dev.db dev.db.backup
```

---

## Performance Comparison

### Your Use Case (Temple Website)

**Load**: 2 admin users, <1000 records, low traffic

| Metric | SQLite | PostgreSQL (Neon) |
|--------|--------|-------------------|
| **Read Speed** | ~0.1ms (local) | ~5-10ms (network) |
| **Write Speed** | ~0.2ms (local) | ~10-15ms (network) |
| **Concurrent Writes** | 1 at a time | Unlimited |
| **Max Database Size** | 281 TB | 512 GB (free tier) |
| **Suitable for You** | ✅ Yes | ✅ Yes |

**Verdict**: Both are fast enough for your use case. Neon's network latency (~10ms) is imperceptible to users.

---

## Cost Analysis

### Scenario 1: Hostinger VPS + SQLite

**Monthly Cost**:
- VPS: $6-12/month
- Database: $0 (on VPS)
- **Total**: $6-12/month

**Considerations**:
- ⚠️ Manual backups required
- ⚠️ Database lost if VPS fails
- ⚠️ Migration needed

### Scenario 2: Hostinger VPS + Neon PostgreSQL (Recommended)

**Monthly Cost**:
- VPS: $6-12/month
- Database: $0/month (Neon free tier)
- **Total**: $6-12/month

**Benefits**:
- ✅ Automatic backups
- ✅ Database independent of VPS
- ✅ No migration needed
- ✅ Professional management

### Scenario 3: Vercel + Neon PostgreSQL (Best)

**Monthly Cost**:
- Hosting: $0/month (Vercel free tier)
- Database: $0/month (Neon free tier)
- **Total**: $0/month

**Benefits**:
- ✅ Everything above
- ✅ Zero cost
- ✅ Automatic deployments
- ✅ Global CDN

---

## Final Recommendation

### ✅ DO THIS: Stay with PostgreSQL

**Reason**: No migration needed, better features, same cost (or free)

**Setup**:
1. Keep using Neon PostgreSQL
2. Deploy on Vercel (free) or Hostinger VPS ($6-12)
3. Use same `DATABASE_URL` everywhere

### ❌ DON'T DO THIS: Migrate to SQLite

**Unless**:
- You have air-gapped/offline requirements
- You need single-file deployment
- You have specific SQLite use case

---

## Migration Time Estimates

| Task | PostgreSQL → SQLite | SQLite → PostgreSQL |
|------|-------------------|-------------------|
| Schema changes | 2 minutes | 2 minutes |
| Prisma regeneration | 1 minute | 1 minute |
| Data migration | 2 minutes (re-seed) | 5 minutes (Neon setup) |
| Testing | 10 minutes | 10 minutes |
| Deployment | 30 minutes | 15 minutes |
| **Total** | **45 minutes** | **30 minutes** |

---

## Support Resources

**Prisma**:
- [Database Providers](https://www.prisma.io/docs/concepts/database-connectors)
- [Switching Databases](https://www.prisma.io/docs/guides/migrate/seed-database)

**Neon**:
- [Migration Guide](https://neon.tech/docs/import/migrate-from-postgres)

**SQLite**:
- [When to Use SQLite](https://www.sqlite.org/whentouse.html)

---

**Summary**: Migration is technically easy (45 min), but **not recommended**. Stay with PostgreSQL (Neon) for better reliability, features, and same/lower cost.
