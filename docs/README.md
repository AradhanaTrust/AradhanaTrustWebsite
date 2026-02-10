# Documentation Index
**Aradhana Trust Website**  
**Last Updated**: February 9, 2026

---

## Quick Start

New to the project? Read in this order:

1. **[DATABASE_SETUP.md](DATABASE_SETUP.md)** - Complete database setup guide
2. **[deployment_vercel.md](deployment_vercel.md)** - Deploy to production (recommended)
3. **[tech_stack.md](tech_stack.md)** - Technologies used

---

## Core Documentation

### Setup & Installation

| Document | Purpose | For Whom |
|----------|---------|----------|
| **[DATABASE_SETUP.md](DATABASE_SETUP.md)** | Complete database setup, troubleshooting, cost analysis | Everyone |
| [tech_stack.md](tech_stack.md) | Technology choices and versions | Developers |

### Deployment

| Document | Purpose | Cost | Recommended |
|----------|---------|------|-------------|
| **[deployment_vercel.md](deployment_vercel.md)** | Deploy with Vercel + Neon | $0/month | ✅ **Yes** |
| [deployment_hostinger.md](deployment_hostinger.md) | Self-hosted VPS deployment | $6-12/month | For advanced users |

### Architecture

| Document | Purpose |
|----------|---------|
| [architecture.md](architecture.md) | System architecture overview |
| [architecture_alignment.md](architecture_alignment.md) | Implementation vs documented architecture analysis |
| [project_plan.md](project_plan.md) | Development stages and timeline |

### Reference

| Document | Purpose |
|----------|---------|
| [WebsiteData.txt](WebsiteData.txt) | Temple information, content data |
| [nextjs_vs_react.md](nextjs_vs_react.md) | Why we chose Next.js |

---

## Database Documentation

**Primary Guide**: [DATABASE_SETUP.md](DATABASE_SETUP.md)

This consolidated guide includes:
- ✅ Fresh system installation steps
- ✅ Neon PostgreSQL setup (recommended, free)
- ✅ Cost analysis ($0/month solution)
- ✅ Common issues & fixes
- ✅ Prisma troubleshooting
- ✅ Migration guide
- ✅ Security checklist

**Archived** (historical reference only):
- `archive/database_cost_analysis.md` - Merged into DATABASE_SETUP.md
- `archive/prisma_status_report.md` - Merged into DATABASE_SETUP.md
- `archive/prisma_client_import_fix.md` - Merged into DATABASE_SETUP.md
- `archive/DbCmdGuide.txt` - Single command, superseded

---

## Deployment Comparison

| Feature | Vercel + Neon | Hostinger VPS |
|---------|---------------|---------------|
| **Setup Time** | 15 minutes | 2 hours |
| **Monthly Cost** | $0 | $6-12 |
| **Difficulty** | Easy (GUI) | Hard (CLI/Linux) |
| **Auto-Deploy** | ✅ Git push | ❌ Manual |
| **SSL** | ✅ Automatic | Manual (Certbot) |
| **Maintenance** | ✅ Zero | Regular updates |
| **Scaling** | ✅ Automatic | Manual |
| **Best For** | Most users | Advanced control |

**Recommendation**: Use **Vercel + Neon** unless you have specific VPS requirements.

---

## Tech Stack Summary

**Frontend**:
- Next.js 16.1.6 (React 19.2.3)
- TypeScript 5
- Tailwind CSS 4.0

**Backend**:
- NextAuth.js 4.24.13 (authentication)
- Prisma 5.22.0 (ORM)
- Neon PostgreSQL (database)

**Deployment**:
- Vercel (hosting)
- GitHub (version control)

**Cost**: $0/month (all free tiers)

---

## Project Status

### Stage 1: Static Website ✅ Complete
- ✅ Home, About, Events, Contact, Donate pages
- ✅ Responsive design
- ✅ Bilingual support (English/Kannada)

### Stage 2: User System 🔄 In Progress (60%)
- ✅ Database schema (Prisma)
- ✅ Neon PostgreSQL configured
- ✅ Admin users seeded
- ⏳ Login UI (next)
- ⏳ Admin dashboards (next)

### Stage 3: Payment Gateway ⏳ Planned
- Razorpay integration
- Donation tracking
- 80G certificate generation

---

## Common Tasks

### Start Development Server
```bash
cd web
npm run dev
# Opens at http://localhost:3000
```

### Database Commands
```bash
# Generate Prisma Client
npx prisma generate

# Push schema changes
npx prisma db push

# Seed database
npm run db-seed

# Open database GUI
npx prisma studio
```

### Deploy to Vercel
```bash
git add .
git commit -m "Update: description"
git push origin main
# Vercel auto-deploys!
```

---

## Getting Help

### Documentation
1. **Database issues** → [DATABASE_SETUP.md](DATABASE_SETUP.md)
2. **Deployment** → [deployment_vercel.md](deployment_vercel.md)
3. **Architecture questions** → [architecture.md](architecture.md)

### External Resources
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Neon Docs](https://neon.tech/docs)
- [Vercel Docs](https://vercel.com/docs)

---

## Contributing

This is a private project for Aradhana Dharmika Trust. For internal team members:

1. Read [tech_stack.md](tech_stack.md) to understand technologies
2. Follow setup in [DATABASE_SETUP.md](DATABASE_SETUP.md)
3. Make changes on feature branches
4. Test locally before pushing

---

## Security Notes

⚠️ **Never commit**:
- `.env` files (contains database credentials)
- Admin passwords
- API keys
- `NEXTAUTH_SECRET`

✅ **Always**:
- Use environment variables for secrets
- Change default passwords in production
- Enable SSL/HTTPS
- Keep dependencies updated

---

## File Organization

```
docs/
├── README.md                      ← You are here
├── DATABASE_SETUP.md             ← Start here for setup
├── deployment_vercel.md          ← Production deployment
├── deployment_hostinger.md       ← VPS deployment
├── architecture.md               ← System design
├── architecture_alignment.md     ← Implementation status
├── tech_stack.md                 ← Technologies used
├── project_plan.md               ← Development roadmap
├── WebsiteData.txt               ← Temple content
├── nextjs_vs_react.md            ← Tech decision rationale
└── archive/                      ← Historical documents
    ├── database_cost_analysis.md
    ├── prisma_status_report.md
    ├── prisma_client_import_fix.md
    └── DbCmdGuide.txt
```

---

**Last Review**: February 9, 2026  
**Status**: ✅ Documentation consolidated and up-to-date  
**Next Review**: Before Stage 3 (Payment Gateway) implementation
