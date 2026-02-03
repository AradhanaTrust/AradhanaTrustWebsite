# Aradhana Dharmika Trust Website - Project Plan

**Reference URL:** [Creative Moccasin Draft](https://creative-moccasin-ygq-draft.caffeine.xyz/)
**UI Reference:** `Website_UI.jpeg`
**Timeline:**
- Stage 1: Static Website (7 Days)
- Stage 2: User System
- Stage 3: Payment Gateway

---

## 1. Requirement Analysis & Setup

### User Roles
1.  **Admin**: Full access to backend, manage events, manage payments, manage gallery/content.
2.  **User (Second Name)**: Limited access (if defined) or standard registered user who is donating.

### Core Features
-   **Configurable Events**: Admin can add/edit/delete events.
-   **Homepage Reflection**: New events automatically appear on the homepage.
-   **Content Management**: Images and text details configurable by Admin.
-   **Payment Integration**: UPI (QR Code) and Razorpay.
-   **Donation Receipt**: PDF generation for donations > 500rs.

---

## 2. Technical Stack
-   **Frontend**: Next.js (React), Tailwind CSS.
-   **Backend**: Next.js API Routes / Server Actions (Node.js).
-   **Database**: PostgreSQL or MongoDB (for users, events, payments).
-   **Authentication**: NextAuth.js (Admin/User logic).
-   **Payments**: Razorpay SDK.
-   **Storage**: Cloudinary or AWS S3 (for image hosting).

---

## 3. Step-by-Step Development Plan

### Stage 1: Static Website (7 Days)
*Goal: High-quality UI, responsive design, static content.*

1.  **Project Initialization**:
    -   Setup Next.js project.
    -   Configure Tailwind CSS with "Aradhana" theme (Deep Royal Purple, Gold).
    -   Setup folder structure (`components`, `pages`, `public`).

2.  **UI Implementation (Page-by-Page)**:
    -   **Header**: Logo, Navigation (Home, About, Gallery, Donations, Events, Contact).
    -   **Hero Section**: Purple gradient, Temple illustration, "Donate Now" button.
    -   **Welcome Section**: Bilingual text (English + Kannada).
    -   **Objectives Section**: 6 Icon cards (Temple Activities, Annadanam, etc.).
    -   **Donation / UPI Section**: Static QR Code display, UPI ID `aradhana@upi`.
    -   **Upcoming Events**: Static cards with dates.
    -   **Photo Gallery**: Grid of images.
    -   **Footer**: Links, Copyright.

3.  **Responsive Testing**:
    -   Ensure mobile compatibility (stacked sections, touch-friendly buttons).

### Stage 2: User System & Backend
*Goal: Dynamic content, admin dashboard.*

1.  **Database Setup**:
    -   Design Schema: `User`, `Event`, `Donation`, `GalleryImage`.
    -   Connect Database to Next.js.

2.  **Authentication**:
    -   Implement Login/Signup pages.
    -   Create Admin route protection.

3.  **Event Management**:
    -   Create Admin Dashboard for Events.
    -   Implement CRUD (Create, Read, Update, Delete) for Events.
    -   Connect Homepage "Upcoming Events" to Database.

4.  **Gallery/Content Integration**:
    -   Admin interface to upload images.
    -   Dynamic rendering of Gallery section.

### Stage 3: Payment Gateway & Donations
*Goal: Secure payments, automated receipts.*

1.  **Registration Form**:
    -   Fields: Name, Email, Referred By, Contact No, Address, Organisation.
    -   Save details to database before payment.

2.  **Payment Integration**:
    -   **UPI**: Display QR Code.
    -   **Razorpay**: Implement Checkout flow.

3.  **Post-Payment Logic**:
    -   Verify payment status.
    -   **Conditional Logic**: If Amount > 500rs:
        -   Generate unique Token Number.
        -   Generate PDF Receipt (using `jspdf` or similar).
        -   Email receipt to user.

4.  **Admin Reports**:
    -   View all registrations/donations.
    -   Filter by "Paid" vs "Pending".

---

## 4. UI/UX Design Specifications
*Based on prompt:*
-   **Theme**: Deep Royal Purple & Gold.
-   **Typography**: Cinzel/Playfair (Headings), Poppins (Body).
-   **Aesthetics**: Mandala patterns, soft glows, temple illustrations.
-   **Language**: Bilingual (English + Kannada).

---

## 5. Deliverables per Stage
-   **Stage 1**: Deployed Static URL (Vercel/Netlify).
-   **Stage 2**: Admin Login credentials, Dynamic Event modification.
-   **Stage 3**: Full Payment flow, Receipt generation.
