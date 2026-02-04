# Deployment Guide: Hostinger (Production)

This guide covers how to deploy the Aradhana Dharmika Trust website on Hostinger's **Business Web Hosting** (with Node.js support) or **VPS** plan.

> **Important**: This guide assumes you have a plan that explicitly supports **Node.js**. Standard "Single Shared Hosting" will NOT work for the User System/Backend.

## Prerequisites
1.  Hostinger Business Plan (or higher) / VPS Plan.
2.  Access to Hostinger hPanel.
3.  Project built locally (`npm run build`).

## Option A: Business Web Hosting (Managed Node.js)

1.  **Prepare the App**:
    - While Vercel handles the build, for Hostinger, it's often safer to upload the *source* and build there, or upload the *standalone* build.
    - Update `next.config.ts`:
      ```ts
      const nextConfig = {
        output: 'standalone', // Critical for self-hosting
      };
      ```
    - Run `npm run build`. This creates a `.next/standalone` folder.

2.  **Create Node.js App in hPanel**:
    - Go to **Websites** -> **Manage** -> **Advanced** -> **Node.js App**.
    - Click **"Create Application"**.
    - **Node.js Version**: Select the version matching your local dev (e.g., v18 or v20).
    - **Application Mode**: Production.
    - **Application Root**: `public_html/web` (or where you want it).
    - **Startup File**: `server.js` (Next.js standalone creates this).

3.  **Upload Files**:
    - Use File Manager or FTP.
    - Upload the contents of `.next/standalone` to your Application Root.
    - Upload the contents of `.next/static` to `public_html/web/.next/static` (Standalone build doesn't bundle static assets by default).
    - Upload `public` folder to `public_html/web/public`.

4.  **Install Dependencies**:
    - In the Node.js App dashboard, click **"Enter Control Panel"** (or NPM Install).
    - Run `npm install` (if `package.json` is uploaded) to install production dependencies (Prisma, NextAuth).

5.  **Database Setup (MySQL)**:
    - Go to **Databases** -> **Management**.
    - Create a new MySQL Database.
    - Note the Database Name, Username, and Password.
    - Update your code's `.env` (or create one on the server) with `DATABASE_URL="mysql://user:pass@localhost:3306/dbname"`.
    - Update `schema.prisma` to use `provider = "mysql"`.
    - Run `npx prisma migrate deploy` on the server terminal to set up tables.

6.  **Start Server**:
    - In Node.js App dashboard, click **"Restart"**.
    - Your app should now be live.

## Option B: VPS (Virtual Private Server)

1.  **Connect via SSH**: `ssh root@your_vps_ip`
2.  **Install Node.js**:
    ```bash
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
    ```
3.  **Install Database (MySQL/Postgres)**:
    ```bash
    sudo apt install mysql-server
    ```
4.  **Clone & Build**:
    ```bash
    git clone https://github.com/AradhanaTrust/AradhanaTrustWebsite.git
    cd AradhanaTrustWebsite/web
    npm install
    npm run build
    ```
5.  **Run with PM2**:
    ```bash
    npm install -g pm2
    pm2 start npm --name "aradhana-web" -- start
    pm2 save
    pm2 startup
    ```
6.  **Nginx Reverse Proxy**:
    - Set up Nginx to forward traffic from Port 80 -> Port 3000.
