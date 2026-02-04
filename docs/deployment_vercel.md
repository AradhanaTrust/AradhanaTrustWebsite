# Deployment Guide: Vercel (Recommended)

This guide covers how to deploy the Aradhana Dharmika Trust website on Vercel's Free Tier. This is the recommended approach for Stage 1 and Stage 2 development.

## Why Vercel?
- **Zero Cost**: The Hobby plan is free forever for personal/non-commercial projects (startups/non-profits often use it for years).
- **Native Next.js Support**: Best performance, automatic image optimization.
- **Easy Updates**: Just `git push` to update the live site.

## Prerequisites
1.  A [GitHub Account](https://github.com/).
2.  A [Vercel Account](https://vercel.com/signup) (Sign up using GitHub).
3.  The project code pushed to your GitHub repository.

## Step-by-Step Deployment

1.  **Import Project**:
    - Go to your [Vercel Dashboard](https://vercel.com/dashboard).
    - Click **"Add New..."** -> **"Project"**.
    - Select your GitHub repository (`AradhanaTrustWebsite`).

2.  **Configure Project**:
    You will be asked to configure the "Import Project" settings. Use the following exact values:

    | Setting | Value | Notes |
    | :--- | :--- | :--- |
    | **Framework Preset** | `Next.js` | Vercel usually detects this automatically. |
    | **Root Directory** | `web` | **Important:** Click "Edit" and select the `web` folder. Do NOT use the root `./`. |
    | **Build Command** | `next build` | Default value. Leave as is. |
    | **Output Directory** | `.next` | Default value. Leave as is. |
    | **Install Command** | `npm install` | Default value. Leave as is. |

    **Environment Variables**:
    Expand the "Environment Variables" section and add the following keys.

    | Key | Value Description |
    | :--- | :--- |
    | `DATABASE_URL` | Connection string for your Database (e.g., from Neon/Supabase). Format: `postgres://user:pass@host/db` |
    | `NEXTAUTH_SECRET` | A random 32-character string used to encrypt sessions. Generate one here: [generate-secret.vercel.app](https://generate-secret.vercel.app/32) |
    | `NEXTAUTH_URL` | The URL of your deployed site (e.g., `https://aradhana-trust.vercel.app`). *Note: For the initial deployment, you can leave this blank or update it after the first deploy.* |

3.  **Database Setup (Postgres)**:
    - *Note: SQLite does not work on Vercel.* You need a cloud Postgres DB.
    - **Option A (Vercel Postgres)**:
        - In the Vercel dashboard, go to "Storage" -> "Create Database".
        - Select "Postgres".
        - Once created, it will automatically add the `POSTGRES_PRISMA_URL` and related env vars to your project.
        - Update your `schema.prisma` to use `provider = "postgresql"`.
    - **Option B (Neon/Supabase)**:
        - Create a free DB on Neon.tech.
        - Get the connection string.
        - Add it as `DATABASE_URL` in Vercel.

4.  **Deploy**:
    - Click **"Deploy"**.
    - Vercel will build your site. Wait ~1 minute.
    - Success! Your site is live.

## Domain Setup
- Go to "Settings" -> "Domains".
- Add your custom domain (e.g., `aradhanatrust.org`).
- Update the DNS settings in your domain registrar (Hostinger/GoDaddy) to point to Vercel (CNAME record).
