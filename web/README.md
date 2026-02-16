# Aradhana Trust Website

A Next.js 13+ application for Aradhana Dharmika Trust, featuring an admin dashboard, donation management, and event galleries.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL (Prisma ORM)
- **Auth**: NextAuth.js
- **Storage**: Vercel Blob (Cloud) or Local Filesystem (Self-hosted)
- **Styling**: Tailwind CSS

## Getting Started

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/AradhanaTrust/AradhanaTrustWebsite.git
    cd AradhanaTrustWebsite/web
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Set up Environment Variables**:
    Copy `.env.example` (or create `.env`) and add:
    ```env
    DATABASE_URL="postgresql://..."
    NEXTAUTH_SECRET="your-secret"
    NEXTAUTH_URL="http://localhost:3000"
    BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..." # Optional for local dev if not using Vercel Blob
    ```

4.  **Run the development server**:
    ```bash
    npm run dev
    ```

## Deployment

This project handles storage flexibly. You can deploy it on:
- **Vercel**: Zero-config deployment.
- **Hostinger / VPS**: Requires Node.js environment.

👉 **[Read the Deployment Guide](../docs/deployment_hostinger.md)** for detailed VPS instruction.
