# Deployment Guide: Vercel
**Aradhana Trust Website**  
**Last Updated**: February 9, 2026

---

## Overview

This guide covers deploying the Aradhana Trust website on **Vercel's Hobby (Free) Plan** with **Neon PostgreSQL** (also free). This is the recommended setup for production.

**Why Vercel + Neon?**
- ✅ **$0/month** total cost (both platforms free tier)
- ✅ Native Next.js optimization
- ✅ Automatic HTTPS/SSL
- ✅ Global CDN
- ✅ Easy `git push` deployments

---

## Prerequisites

1. **GitHub Account** - [Sign up](https://github.com/)
2. **Vercel Account** - [Sign up with GitHub](https://vercel.com/signup)
3. **Neon Account** - [Sign up](https://neon.tech) (free, no credit card)
4. **Project pushed to GitHub**

---

## Part 1: Database Setup (Neon PostgreSQL)

### Step 1: Create Neon Database

1. **Go to** [neon.tech](https://neon.tech) and sign in
2. **Create Project**:
   - Name: `aradhana-trust-db`
   - PostgreSQL Version: `16`
   - Region: `ap-southeast-1` (Singapore - closest to India)
3. **Copy Connection String**:
   - Navigate to **Dashboard** → **Connection Details**
   - Copy the **Connection string** (starts with `postgresql://`)
   - It looks like:
     ```
     postgresql://user:password@ep-xxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
     ```

> **Note**: Save this connection string - you'll need it for Vercel environment variables.

### Step 2: Initialize Database Schema

**On your local machine**:

```bash
# Navigate to project
cd AradhanaTrust/web

# Update .env with Neon connection string
DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require"

# Push schema to Neon database
npx prisma db push

# Seed initial data (admin users)
npm run db-seed
```

> **Important**: This creates all tables and seeds admin users in the Neon database.

---

## Part 2: Vercel Deployment

### Step 1: Import Project

1. **Go to** [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. **Select Repository**: `AradhanaTrust/website` (or your repo name)
4. Click **Import**

### Step 2: Configure Project

| Setting | Value | Notes |
|---------|-------|-------|
| **Framework Preset** | `Next.js` | Auto-detected |
| **Root Directory** | `/web` | ⚠️ **CRITICAL** Click "Edit" and select `web` folder |
| **Build Command** | `next build` | Default |
| **Output Directory** | `.next` | Default |
| **Install Command** | `npm install` | Default |

### Step 3: Environment Variables

Expand **"Environment Variables"** section and add:

| Key | Value | Notes |
|-----|-------|-------|
| `DATABASE_URL` | `postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require` | From Neon dashboard |
| `NEXTAUTH_URL` | `https://aradhanadharmikatrust.org` | Your production domain (or `.vercel.app` for testing) |
| `NEXTAUTH_SECRET` | `<random-32-char-string>` | Generate at [generate-secret.vercel.app/32](https://generate-secret.vercel.app/32) |

> **Important**: Click **"Add"** button after typing each key-value pair!

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait ~1-2 minutes for build
3. **Success!** Your site is live at `yourproject.vercel.app`

---

## Part 3: Custom Domain Setup

### Add Domain in Vercel

1. **Go to** Project → **Settings** → **Domains**
2. **Add Domain**: `aradhanadharmikatrust.org`
3. Vercel will show DNS configuration instructions

### Configure DNS (at Your Registrar)

**If using Wix/GoDaddy/Namecheap**:

1. **A Record**:
   - **Type**: `A`
   - **Name**: `@` (or leave empty)
   - **Value**: `76.76.21.21` (Vercel IP)
   - **TTL**: `3600` (1 hour)

2. **WWW CNAME**:
   - **Type**: `CNAME`
   - **Name**: `www`
   - **Value**: `cname.vercel-dns.com`
   - **TTL**: `3600`

3. **Remove old records** pointing to previous hosting

### SSL/HTTPS

✅ **Automatic!** Vercel generates free SSL certificate once DNS propagates (1-48 hours).

---

## Part 4: Post-Deployment Verification

### 1. Test Website
- Visit `https://aradhanadharmikatrust.org`
- Verify pages load correctly
- Check responsive design on mobile

### 2. Test Admin Login
- Navigate to `/login` (or wherever you implement it)
- Login with seeded credentials:
  - **Primary Admin**: `admin@aradhanatrust.org` / `Admin@2026`
  - **Secondary Admin**: `events@aradhanatrust.org` / `Events@2026`

### 3. Verify Database Connection
- Check that admin dashboards load
- Test creating/editing content
- Verify data persists in Neon

### 4. Change Default Passwords
⚠️ **CRITICAL**: Update admin passwords immediately!

---

## Troubleshooting

### Build Fails: "Module not found"

**Cause**: Missing dependencies or incorrect root directory

**Solution**:
```bash
# Verify package.json is in web/ folder
# Check Root Directory is set to "/web" in Vercel settings
```

### Database Connection Error

**Cause**: Incorrect `DATABASE_URL` or Neon database not initialized

**Solution**:
1. Verify connection string format: `postgresql://user:pass@host/db?sslmode=require`
2. Check string is copied correctly (no extra spaces)
3. Ensure you ran `npx prisma db push` locally first

### Deploy Button Grayed Out

**Cause**: Environment variables not added

**Solution**:
- Click **"Add"** after each key-value pair
- They should appear in a list below the input fields

### 404 on Custom Domain

**Cause**: DNS not propagated or incorrect configuration

**Solution**:
1. Wait 24-48 hours for DNS propagation
2. Use [whatsmydns.net](https://whatsmydns.net) to check DNS status
3. Verify A record points to `76.76.21.21`

---

## Deployment Workflow

### For Future Updates

```bash
# 1. Make code changes locally
# 2. Test locally
npm run dev

# 3. Commit and push to GitHub
git add .
git commit -m "Update: description"
git push origin main

# 4. Vercel auto-deploys! (< 2 minutes)
```

✅ Vercel automatically redeploys when you push to `main` branch.

---

## Cost Breakdown

| Service | Plan | Monthly Cost |
|---------|------|--------------|
| **Vercel Hosting** | Hobby (Free) | $0 |
| **Neon Database** | Free Tier | $0 |
| **Domain** | (Existing) | ~$12/year |
| **SSL Certificate** | Auto (Free) | $0 |

**Total**: **$0/month** (excluding domain registration)

### Vercel Free Tier Limits

- ✅ 100 GB bandwidth/month (sufficient for temple website)
- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Serverless Functions (100k invocations)

### Neon Free Tier Limits

- ✅ 0.5 GB storage (you're using ~10 MB)
- ✅ 100 compute hours/month (well within limits)
- ✅ Always online (no auto-pause)
- ✅ 6-hour Point-in-Time Recovery

---

## Comparison: Vercel Postgres vs Neon

| Feature | Vercel Postgres | Neon PostgreSQL |
|---------|----------------|-----------------|
| **Free Tier Storage** | 256 MB | 512 MB |
| **Free Compute Hours** | 60 hours | 100 hours |
| **Auto-Pause** | Yes (after inactivity) | No (always on) |
| **Cost if Exceeded** | $0.30/GB storage | $0 (generous free tier) |
| **Integration** | Native Vercel | Manual env var |
| **Recommendation** | ⚠️ Use for testing only | ✅ **Use for production** |

**Verdict**: Neon offers better free tier limits and no auto-pause. Recommended for production.

---

## Monitoring & Maintenance

### View Deployment Logs
1. Go to Vercel Dashboard
2. Select your project
3. Click on a deployment
4. View **Build Logs** and **Function Logs**

### Database Monitoring
1. Go to Neon Dashboard
2. **Monitoring** tab shows:
   - Query performance
   - Storage usage
   - Compute hours used

### Analytics
Vercel provides basic analytics:
- Page views
- Visitors
- Top pages

---

## Security Checklist

Before going live:

- [ ] Change default admin passwords
- [ ] Verify `.env` is in `.gitignore` (never commit secrets!)
- [ ] Enable Vercel's **Deployment Protection** (optional)
- [ ] Set up **Vercel Analytics** for monitoring
- [ ] Configure **CORS** if using API routes
- [ ] Review Neon **IP Allow List** (optional, for extra security)

---

## Support Resources

**Vercel**:
- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

**Neon**:
- [Neon Docs](https://neon.tech/docs)
- [Connection Guides](https://neon.tech/docs/connect/connect-intro)

**Need Help?**
- Check `docs/DATABASE_SETUP.md` for database issues
-Vercel Support: [vercel.com/support](https://vercel.com/support)
- Neon Community: [neon.tech/community](https://neon.tech/community)

---

**Status**: ✅ Production-ready deployment guide  
**Total Cost**: $0/month (Vercel Hobby + Neon Free)  
**Deployment Time**: ~15 minutes initial setup, <2 min for updates
