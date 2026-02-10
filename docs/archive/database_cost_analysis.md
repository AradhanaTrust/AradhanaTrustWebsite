# PostgreSQL Hosting Cost Analysis for Aradhana Trust
**Date**: February 8, 2026  
**Use Case**: 2 admin users, <1000 event records, temple trust website

---

## Your Specific Requirements

- **Users**: 2 admin users (Primary + Secondary Admin)
- **Data Volume**: 
  - ~1000 event records
  - DonationRecords, EventRegistrations, ContactSubmissions
  - **Estimated Total**: <10 MB database size
- **Traffic**: Low to moderate (temple trust website)
- **Uptime**: Needs to be always available (not hobby project)

---

## Recommendation: **Use Neon Free Tier** ✅

### Why Neon is Best for You

✅ **FREE** for your use case  
✅ Generous limits (0.5 GB storage, 100 compute hours/month)  
✅ Auto-scales to zero when idle (saves costs)  
✅ Always online (no 7-day pause like Supabase)  
✅ 6 hours Point-in-Time Recovery included  
✅ Easy to upgrade if you grow  

---

## Detailed Cost Comparison

### 1. Neon (Recommended) 💚

#### **Free Tier** - Perfect for Aradhana Trust
| Feature | Free Tier Limit | Your Usage | Cost |
|---------|----------------|------------|------|
| **Storage** | 0.5 GB per project (5 GB total across 10 projects) | ~10 MB (your entire database) | **$0/month** |
| **Compute** | 100 CU-hours/month (0.25 CU = 1 vCPU + 4GB RAM) | ~50 hours/month (estimated) | **$0/month** |
| **Transfer** | 5 GB egress/month | ~500 MB/month (low traffic site) | **$0/month** |
| **Branches** | 10 database branches | 1 production branch needed | **$0/month** |
| **PITR** | 6 hours history | Included | **$0/month** |
| **Projects** | Up to 100 projects | 1 project | **$0/month** |

**Compute Scaling**:
- Auto-scales from 0.25 CU up to 2 CU during high load
- Scales to zero after 5 minutes of inactivity
- 0.25 CU runs continuously for 400 hours/month (well within free tier)

#### If You Ever Need to Upgrade (Future)
**Launch Plan** ($5/month minimum):
- $0.106 per CU-hour beyond free tier
- $0.30/GB for first 50 GB storage
- 100 GB network transfer included
- Still very affordable for growing websites

**Estimated Cost for Your Use Case**: **$0/month** (stays in free tier)

---

### 2. Supabase

#### **Free Tier** - **NOT Recommended ⚠️**
| Feature | Free Tier Limit | Issue for You |
|---------|----------------|---------------|
| **Storage** | 500 MB | ✅ Sufficient (you need ~10 MB) |
| **Transfer** | 2-5 GB/month | ✅ Sufficient |
| **Projects** | 2 active projects | ✅ You only need 1 |
| **Auto-Pause** | **Pauses after 7 days inactivity** | ❌ **DEALBREAKER** - Temple site must stay online |
| **Users** | 50,000 MAUs | ✅ Way more than you need |

**Why NOT Supabase Free**:
- **Auto-pause is unacceptable** for a live temple website
- Requires manual intervention to unpause every week
- Bad user experience for devotees visiting the site

#### Paid Plan (If forced to use)
**Pro Plan** ($25/month):
- 8 GB storage
- 50 GB transfer
- No auto-pause
- Automatic backups
- **Expensive for your needs**

**Estimated Cost**: **$25/month** (overkill for your use case)

---

### 3. Vercel Postgres

#### **Hobby Plan** (Free)
| Feature | Free Tier Limit | Your Usage | Sufficient? |
|---------|----------------|------------|-------------|
| **Compute** | 4 hours Active CPU | ~2-3 hours/month | ⚠️ Borderline |
| **Memory** | 360 GB-hours | Adequate | ✅ |
| **Invocations** | 1 million | Low traffic site | ✅ |
| **Transfer** | 100 GB | ~500 MB/month | ✅ |

**Concerns**:
- ⚠️ Only 4 hours compute (Neon gives 100 hours)
- ⚠️ Compute costs add up quickly if exceeded
- ⚠️ Storage pricing is high ($0.30/GB, same as Neon but less free allowance)

#### Paid Plan (Pro)
**Pro Plan** ($20/user/month = **$40/month for 2 users**):
- 100 free compute hours
- $0.10/hour beyond that
- $0.30/GB storage
- $0.20/GB data transfer

**Estimated Cost**: **$40/month** (way too expensive)

---

### 4. Alternative: SQLite (Current Setup)

#### **Keep SQLite + Litestream Backups**
**Cost**: **$0/month** (completely free)

**Pros**:
- ✅ Already working in your project
- ✅ Zero cost
- ✅ Fast (no network latency)
- ✅ Simple deployment (one file)
- ✅ Litestream can backup to AWS S3 ($0.023/GB/month)

**Cons**:
- ❌ Single-server only (no horizontal scaling)
- ❌ No concurrent writes from multiple servers
- ❌ Backup complexity (need Litestream or similar)

**When SQLite is OK**:
- Small websites (<100k visitors/month)
- Single-server deployment
- Read-heavy workloads (temple website: 99% reads, 1% admin writes)

**Your Use Case**: ✅ **SQLite is actually perfect for you!**

With Litestream backups to AWS S3:
- Storage: ~10 MB × $0.023/GB = **$0.0002/month** (essentially free)
- No compute charges
- Continuous backups to cloud

---

## Final Recommendation Matrix

| Solution | Monthly Cost | Uptime | Scalability | Ease of Use | **Best For** |
|----------|--------------|--------|-------------|-------------|--------------|
| **Neon Free** | **$0** | ✅ Always on | ✅ Auto-scales | ✅ Easy | **Small to medium websites** |
| **SQLite + Litestream** | **~$0** | ✅ Always on | ⚠️ Single server | ✅✅ Simplest | **Low-traffic sites** |
| Supabase Free | $0 | ❌ Pauses after 7 days | ✅ Good | ✅ Easy | Hobby projects only |
| Supabase Pro | $25/month | ✅ Always on | ✅✅ Excellent | ✅ Easy | High-traffic apps |
| Vercel Pro | $40/month | ✅ Always on | ✅✅ Excellent | ✅ Easy | Enterprise apps |

---

## Recommended Path Forward

### **Option 1: Neon Free Tier** (Best Value) ⭐

**Setup Steps**:
1. Sign up at [neon.tech](https://neon.tech) (free)
2. Create new project (PostgreSQL 16)
3. Copy connection string
4. Update `.env`:
   ```
   DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
   ```
5. Run migrations:
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

**Long-term Cost**: **$0/month** (within free tier forever for your traffic)

---

### **Option 2: Keep SQLite** (Simplest) ⭐⭐

**Why This Makes Sense**:
- Your site will have low traffic (temple website)
- 2 admin users won't cause concurrency issues
- Deployment is simpler (no external DB to manage)
- Cost: $0/month

**Add Backups**:
1. Install Litestream (free tool)
2. Configure S3 backups (AWS free tier: 5GB free)
3. Cost: **$0/month** with AWS free tier

**Setup**:
```bash
# Install Litestream
# Configure litestream.yml
replicas:
  - url: s3://your-bucket/db
    access-key-id: $AWS_ACCESS_KEY
    secret-access-key: $AWS_SECRET_KEY
```

**Long-term Cost**: **$0/month**

---

### **Option 3: Supabase Pro** (Premium Features)

**Only if you need**:
- Built-in auth UI
- Real-time subscriptions
- Storage for images (1 GB → 100 GB)
- Priority support

**Cost**: **$25/month**

---

## My Strong Recommendation

### **For Now: Keep SQLite** ✅

**Reasoning**:
1. Your traffic will be low initially (temple trust website)
2. SQLite handles 100k+ requests/day easily
3. Zero cost, zero complexity
4. Add Litestream backups to S3 (still $0 with AWS free tier)
5. You can migrate to Neon later if traffic grows

### **Future (if traffic grows): Switch to Neon Free** ✅

**When to Migrate**:
- Site gets >10k visitors/month
- Multiple admin users editing simultaneously
- Need database branching for testing
- Want hosted backups without setup

**Migration Cost**: **$0** (Neon free tier is generous)

---

## Cost Summary Table

| Database | Initial Cost | Annual Cost | 3-Year Cost |
|----------|-------------|-------------|-------------|
| **SQLite (current)** | **$0** | **$0** | **$0** |
| **SQLite + Litestream + S3** | **$0** | **$0** | **$0** (within AWS free tier) |
| **Neon Free** | **$0** | **$0** | **$0** |
| **Neon Launch** | $5/month | $60/year | $180 |
| Supabase Pro | $25/month | $300/year | $900 |
| Vercel Pro (2 users) | $40/month | $480/year | $1,440 |

---

## Bottom Line

**For Aradhana Trust with 2 users and <1000 events**:

✅ **Best Choice**: Keep SQLite for now, add Litestream backups  
**Cost**: **$0/month**

✅ **Backup Plan**: Migrate to Neon Free when you need PostgreSQL  
**Cost**: **$0/month**

⛔ **Avoid**: Supabase Free (auto-pauses), Vercel Pro (too expensive)

**You can run this database for FREE indefinitely!** 🎉
