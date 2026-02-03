# Tech Stack & Implementation Details

## Overview
The **Aradhana Dharmika Trust** website will be a high-performance, responsive web application built with modern web technologies. It focuses on a premium user experience ("Wowed" factor) using strict typing, component-based architecture, and secure payment processing.

## 1. Core Framework & Language
-   **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
    -   *Why*: Hybrid rendering (SSR/SSG) for SEO, built-in API routes for backend, optimized image handling.
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
    -   *Why*: Type safety, better developer experience, fewer runtime errors.

## 2. Styling & UI Design
-   **CSS Framework**: [Tailwind CSS](https://tailwindcss.com/)
    -   *Why*: Utility-first, rapid development, easy customization for the "Purple & Gold" theme.
-   **Component Library**: [shadcn/ui](https://ui.shadcn.com/) (based on Radix UI)
    -   *Why*: Accessible, accessible, customizable, and premium-looking components (Dialogs, Cards, Inputs).
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)
    -   *Why*: Complex "micro-animations", smooth page transitions, and scroll-triggered reveals (mandala patterns).
-   **Icons**: [Lucide React](https://lucide.dev/)
    -   *Why*: Clean, consistent SVG icons.

## 3. State Management & Internationalization
-   **State**: [Zustand](https://github.com/pmndrs/zustand)
    -   *Why*: Lightweight global state for managing the "Language Toggle" (English/Kannada) and user session.
-   **i18n**: Custom Dictionary or `next-intl`
    -   *Why*: Seamless switching between English and Kannada content throughout the site.

## 4. Backend & Database
-   **Database**: [PostgreSQL](https://www.postgresql.org/) (via [Supabase](https://supabase.com/) or [Neon](https://neon.tech/))
    -   *Why*: Relational data (Users, Events, Donations) requires ACID compliance.
-   **ORM**: [Prisma](https://www.prisma.io/)
    -   *Why*: Type-safe database access, auto-generated migrations.
-   **Storage**: [Supabase Storage](https://supabase.com/storage) or [AWS S3](https://aws.amazon.com/s3/)
    -   *Why*: Hosting event images and gallery photos.

## 5. Information Security & Payments
-   **Authentication**: [NextAuth.js](https://next-auth.js.org/) (v5)
    -   *Why*: Secure session handling for Admins and Users.
-   **Payments**: [Razorpay](https://razorpay.com/)
    -   *Why*: Reliable Indian payment gateway, UPI support.
-   **Receipts**: [jspdf](https://github.com/parallax/jsPDF) + [nodemailer](https://nodemailer.com/)
    -   *Why*: Generate PDF receipts on the fly and email them to donors > 500rs.

## Trade-offs
| Decision | Alternative | Why we chose this |
| :--- | :--- | :--- |
| **Next.js App Router** | React (CRA/Vite) | SEO is critical for a trust. Server Components reduce bundle size. |
| **PostgreSQL** | MongoDB | Structured data (Donations, Events) fits relational models better than NoSQL. |
| **Tailwind + Headless** | Bootstrap/MUI | Full control over the "Premium" aesthetic without fighting framework overrides. |
| **Server Actions** | Separate Express API | Simplifies deployment (serverless) and keeps backend logic close to components. |
