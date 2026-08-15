# ?? Mushroom Marketplace (mushroom.com)

> **India's Premium Production-Ready B2B & B2C Mushroom Trading Platform**

Connecting verified mushroom growers with restaurants, retailers, wholesalers, and conscious consumers across India.

---

## ?? Key Features

### ?? For Mushroom Growers (Supply)
- **Verified Farm Profile**: FSSAI certification upload, farm location mapping, capacity tracking.
- **Harvest Listings**: List fresh button, oyster, shiitake, milky, and exotic mushrooms with real-time stock levels.
- **Inventory Protection**: Atomic row-level inventory locks (`SELECT FOR UPDATE`) to prevent overselling.
- **Offer Engine**: Submit competitive quotes directly on buyer demand posts.
- **Payout Management**: Automated commission deduction (3%) and payout tracking via Razorpay Route.

### ?? For Buyers (Demand - B2B & B2C)
- **Unified Marketplace Search**: Full-text search across varieties, cities, grower verification, and price.
- **Requirement Posting**: Post recurring or bulk mushroom demand requirements.
- **Instant Checkout**: Server-calculated pricing with 256-bit SSL Razorpay integration (UPI, Cards, NetBanking).
- **Order Tracking**: 7-stage state machine (`PENDING` ? `CONFIRMED` ? `PREPARING` ? `READY` ? `OUT_FOR_DELIVERY` ? `DELIVERED` ? `COMPLETED`).
- **Verified Reviews**: Post-transaction review system with rating aggregation.

### ??? Admin & Operational Controls
- **Verification Desk**: FSSAI & business document approval workflow.
- **Dispute Resolution**: Evidence submission, refund processing, and escalation handling.
- **Platform Analytics**: Real-time GMV, order volume, revenue metrics, and grower performance tracking.
- **Audit Logging**: Full administrative action history for security compliance.

---

## ??? Architecture & Tech Stack

```
mushroom-marketplace/
+-- apps/
¦   +-- api/             # NestJS REST API (Swagger, JWT, BullMQ, Throttler)
¦   +-- web/             # Next.js 16 App Router (Tailwind CSS, Zustand, TanStack Query)
+-- packages/
    +-- database/        # PostgreSQL + Prisma ORM (22+ entities, full-text search)
    +-- types/           # Shared TypeScript interfaces & enums
    +-- utils/           # Shared formatters & validators
```

- **Backend**: NestJS, TypeScript, Passport JWT (AccessToken + HttpOnly RefreshToken Rotation), Swagger API docs.
- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS (Custom Dark Theme Tokens & Glassmorphism), Lucide Icons, Sonner.
- **Database**: PostgreSQL with Prisma ORM, Full-Text Search, Atomic Transactions.
- **Payment Gateway**: Razorpay (HMAC SHA-256 server-side signature verification & webhook processing).
- **Background Jobs**: BullMQ + Redis for async queues & notifications.

---

## ?? Getting Started

### Prerequisites
- **Node.js**: `v20.0.0+`
- **PostgreSQL**: `v14+`
- **Redis**: `v6+`

### Installation

1. **Clone Repository & Install Dependencies**
   ```bash
   git clone https://github.com/Channu0012/mushroom.com.git
   cd mushroom.com
   npm install
   ```

2. **Environment Configuration**
   Copy `.env.example` to `.env` in the root:
   ```bash
   cp .env.example .env
   ```

3. **Database Migration & Seeding**
   ```bash
   npm run db:push
   npm run db:seed
   ```

4. **Run Development Mode**
   ```bash
   npm run dev
   ```
   - **Frontend**: `http://localhost:3000`
   - **Backend API**: `http://localhost:3001`
   - **Swagger Docs**: `http://localhost:3001/api/docs`

---

## ?? Security Practices
- JWT access tokens (15m expiration) with rotating refresh tokens stored in `httpOnly` cookies.
- Server-side price & tax calculations — client inputs are never trusted.
- Rate limiting via `@nestjs/throttler` (Global & Auth tier throttles).
- Helmet HTTP security headers & strict CORS configuration.
- Password hashing using `bcrypt` (12 salt rounds).

---

## ?? License
Privately owned and managed by **Mushroom Marketplace India**. All rights reserved.
