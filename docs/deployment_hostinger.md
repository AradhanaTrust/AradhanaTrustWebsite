# Deployment Guide: Hostinger
**Aradhana Trust Website**  
**Last Updated**: February 9, 2026

---

## Overview

This guide covers deploying on **Hostinger VPS** with self-hosted setup. For most users, **Vercel + Neon** (see `deployment_vercel.md`) is simpler and free.

Use Hostinger if you:
- Already have a VPS plan
- Need full server control
- Want to self-host everything

> **Recommended**: Use **Neon PostgreSQL** (free) instead of self-hosting MySQL for easier management.

---

## Prerequisites

1. **Hostinger VPS Plan** (KVM 1 or higher)
2. **SSH Access** to your VPS
3. **Basic Linux knowledge**
4. **Domain configured** (DNS pointing to VPS IP)

---

## Architecture

```
Your VPS
├──  Node.js 20.x (Next.js runtime)
├── PM2 (Process manager)
├── Nginx (Reverse proxy)
└── Database: Neon PostgreSQL (external, free)
```

---

## Part 1: VPS Initial Setup

### Step 1: Connect to VPS

```bash
ssh root@your-vps-ip
```

### Step 2: Update System

```bash
apt update && apt upgrade -y
```

### Step 3: Install Node.js 20.x

```bash
# Add NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js and npm
apt-get install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version
```

### Step 4: Install PM2 (Process Manager)

```bash
npm install -g pm2

# Configure PM2 to start on boot
pm2 startup systemd
# Run the command it outputs
```

### Step 5: Install Nginx

```bash
apt install nginx -y

# Start Nginx
systemctl start nginx
systemctl enable nginx
```

---

## Part 2: Database Setup (Neon PostgreSQL)

**Recommended**: Use Neon PostgreSQL (external, managed, free)

### Option A: Neon PostgreSQL (Recommended)

1. **Sign up** at [neon.tech](https://neon.tech)
2. **Create project**: Region `ap-southeast-1` (closest to India)
3. **Copy connection string**
4. **Save for later** (you'll add to `.env`)

> **Advantages**: Free, managed, automatic backups, no server maintenance

### Option B: Self-Hosted PostgreSQL (Advanced)

```bash
# Install PostgreSQL
apt install postgresql postgresql-contrib -y

# Start PostgreSQL
systemctl start postgresql
systemctl enable postgresql

# Create database
sudo -u postgres psql
CREATE DATABASE aradhana_db;
CREATE USER aradhana_user WITH ENCRYPTED PASSWORD 'secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE aradhana_db TO aradhana_user;
\q
```

---

## Part 3: Deploy Application

### Step 1: Clone Repository

```bash
# Create app directory
mkdir -p /var/www
cd /var/www

# Clone from GitHub
git clone https://github.com/YourUsername/AradhanaTrust.git
cd AradhanaTrust/web
```

### Step 2: Configure Environment

```bash
# Create .env file
nano .env
```

Add the following:

```env
# Neon PostgreSQL (recommended)
DATABASE_URL="postgresql://user:pass@ep-xxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

# Or self-hosted PostgreSQL
# DATABASE_URL="postgresql://aradhana_user:password@localhost:5432/aradhana_db"

# NextAuth
NEXTAUTH_URL="https://aradhanadharmikatrust.org"
NEXTAUTH_SECRET="your-32-char-random-string-here"
```

Save and exit (`Ctrl+X`, `Y`, `Enter`)

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Initialize Database

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed initial data
npm run db-seed
```

### Step 5: Build Application

```bash
npm run build
```

### Step 6: Start with PM2

```bash
# Start Next.js server
pm2 start npm --name "aradhana-web" -- start

# Save PM2 configuration
pm2 save

# Verify it's running
pm2 status
```

---

## Part 4: Configure Nginx Reverse Proxy

### Step 1: Create Nginx Configuration

```bash
nano /etc/nginx/sites-available/aradhana
```

Add the following:

```nginx
server {
    listen 80;
    server_name aradhanadharmikatrust.org www.aradhanadharmikatrust.org;

    # Redirect to HTTPS (after SSL setup)
    # return 301 https://$server_name$request_uri;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Step 2: Enable Site

```bash
# Create symbolic link
ln -s /etc/nginx/sites-available/aradhana /etc/nginx/sites-enabled/

# Test configuration
nginx -t

# Reload Nginx
systemctl reload nginx
```

---

## Part 5: SSL Certificate (HTTPS)

### Install Certbot

```bash
apt install certbot python3-certbot-nginx -y
```

### Generate SSL Certificate

```bash
# Obtain certificate (automatically configures Nginx)
certbot --nginx -d aradhanadharmikatrust.org -d www.aradhanadharmikatrust.org

# Follow prompts:
# - Enter email
# - Agree to terms
# - Choose redirect option (2 - Redirect HTTP to HTTPS)
```

### Auto-Renewal

```bash
# Test renewal
certbot renew --dry-run

# Certbot auto-renews via systemd timer (check with)
systemctl status certbot.timer
```

---

## Part 6: Deployment Workflow

### For Future Updates

```bash
# SSH into VPS
ssh root@your-vps-ip

# Navigate to project
cd /var/www/AradhanaTrust/web

# Pull latest changes
git pull origin main

# Install new dependencies (if any)
npm install

# Rebuild application
npm run build

# Restart PM2
pm2 restart aradhana-web

# Check status
pm2 logs aradhana-web
```

---

## Monitoring & Maintenance

### View Application Logs

```bash
# Real-time logs
pm2 logs aradhana-web

# Error logs only
pm2 logs aradhana-web --err

# View specific number of lines
pm2 logs aradhana-web --lines 100
```

### Monitor Resources

```bash
# PM2 monitoring dashboard
pm2 monit

# System resources
htop
```

### Database Backups (If Self-Hosted)

```bash
# Create backup script
nano /root/backup-db.sh
```

Add:

```bash
#!/bin/bash
BACKUP_DIR="/root/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

pg_dump -U aradhana_user aradhana_db > $BACKUP_DIR/backup_$TIMESTAMP.sql

# Keep only last 7 days
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
```

Make executable and schedule:

```bash
chmod +x /root/backup-db.sh

# Add to crontab (daily at 2 AM)
crontab -e
0 2 * * * /root/backup-db.sh
```

> **Note**: If using Neon, backups are automatic (6-hour PITR).

---

## Firewall Configuration

### Configure UFW

```bash
# Install UFW (if not installed)
apt install ufw -y

# Allow SSH
ufw allow 22/tcp

# Allow HTTP & HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Enable firewall
ufw enable

# Check status
ufw status
```

---

## Troubleshooting

### Application Won't Start

```bash
# Check PM2 logs
pm2 logs aradhana-web

# Common issues:
# - Missing .env file
# - Wrong DATABASE_URL
# - Port 3000 already in use
```

### Database Connection Failed

```bash
# Test connection
npx prisma db pull

# If using self-hosted PostgreSQL:
# Check PostgreSQL is running
systemctl status postgresql

# Verify user permissions
sudo -u postgres psql
\l  # List databases
\du  # List users
```

### Nginx 502 Bad Gateway

```bash
# Check if Next.js is running
pm2 status

# Check Nginx error logs
tail -f /var/log/nginx/error.log

# Restart services
pm2 restart aradhana-web
systemctl restart nginx
```

---

## Cost Comparison

| Item | Hostinger VPS | Vercel + Neon |
|------|---------------|----------------|
| **Hosting** | $6-12/month | $0/month |
| **Database** | $0 (Neon) or included | $0/month |
| **SSL** | Free (Let's Encrypt) | Free (automatic) |
| **Maintenance** | Manual updates | Automatic |
| **Setup Time** | ~2 hours | ~15 minutes |
| **Complexity** | High (Linux skills needed) | Low (GUI only) |

**Verdict**: Vercel + Neon is recommended unless you need specific VPS features.

---

## Security Checklist

- [ ] Change default SSH port (optional)
- [ ] Disable root SSH login
- [ ] Set up fail2ban for brute-force protection
- [ ] Configure UFW firewall
- [ ] Enable automatic security updates
- [ ] Set up monitoring (UptimeRobot, etc.)
- [ ] Regular backups (if using self-hosted DB)
- [ ] Keep Node.js, npm, and system packages updated

---

 ## Support Resources

**Hostinger**:
- [VPS Documentation](https://www.hostinger.com/tutorials/vps)
- [Support](https://www.hostinger.com/cpanel-login)

**Neon PostgreSQL**:
- [Connection Guides](https://neon.tech/docs/connect/connect-intro)

**PM2**:
- [PM2 Documentation](https://pm2.keymetrics.io/docs)

---

**Status**: ✅ Production-ready VPS deployment guide  
**Recommended for**: Advanced users needing full control  
**Estimated Cost**: $6-12/month (VPS) + $0 (Neon DB)
