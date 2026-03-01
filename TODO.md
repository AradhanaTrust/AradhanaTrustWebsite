# Project TODO List

## Architecture & Scaling Improvements
- [ ] **Implement Background Job Queue for Payment Processing**
  - Problem: `api/payment/verify/route.ts` handles DB writes, PDF generation, and Email sending synchronously. If PDF engine is slow or email fails, the Razorpay webhook can timeout.
  - Goal: Push PDF generation and Emails to a Background Queue (e.g., Inngest, Upstash QStash) to ensure the webhook responds instantly.
- [ ] **Add Error Recovery for Receipt Generation**
  - Problem: If PDF fails to generate during payment verification, user must manually intervene.
  - Goal: Implement an automatic retry mechanism or fallback state for failed PDF generations.
- [ ] **Abstract UI Components**
  - Problem: UI logic and styling in components like `RazorpayButton` are tightly coupled.
  - Goal: Fully abstract these into reusable design system components for better maintainability and consistency.
