# Kori氷 — Premium Artisanal Japanese Ice Cream

> A premium, digital-first e-commerce web application. Japanese minimalism meets luxury dessert.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 19, Tailwind CSS v4 |
| Backend | Node.js, Express |
| Database | PostgreSQL (raw SQL via `pg`) |
| Caching | Redis (graceful fallback) |
| Auth | JWT + bcrypt |

## Quick Start

### Backend
```bash
cd backend
cp .env.example .env    # edit DATABASE_URL, REDIS_URL, JWT_SECRET
npm install
# Create DB tables: psql -f database/schema.sql
# Seed products: npm run seed
npm run dev              # → http://localhost:4000
```

### Frontend
```bash
cd frontend
npm install
npm run dev              # → http://localhost:3000
```

## Features

- **Flavor Discovery Quiz** — 3-question interactive quiz for personalized recommendations
- **Kori Club Subscription** — Monthly curated tasting box
- **Kori Points Loyalty** — Earn points per purchase, redeem for special access
- **Limited Batch Scarcity** — Real-time stock indicators per product
- **Admin SCM Dashboard** — Demand Forecast with waitlist + recommended batch production
- **Eco-friendly Packaging** — Dry-ice shipping note on every order

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/health` | Health check |
| POST | `/api/v1/auth/register` | Register |
| POST | `/api/v1/auth/login` | Login |
| GET | `/api/v1/products` | Product catalog |
| GET | `/api/v1/products/:id` | Product detail |
| POST | `/api/v1/products/:id/waitlist` | Join waitlist |
| GET | `/api/v1/products/scm` | SCM Dashboard (auth) |
| GET | `/api/v1/cart` | Get cart (auth) |
| POST | `/api/v1/cart/items` | Add to cart (auth) |
| POST | `/api/v1/orders/checkout` | Checkout (auth) |
| GET | `/api/v1/orders` | Order history (auth) |
| POST | `/api/v1/crm/quiz` | Flavor quiz |
| GET | `/api/v1/crm/loyalty` | Loyalty balance (auth) |
| POST | `/api/v1/crm/newsletter` | Newsletter signup (auth) |

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Landing | `/` | Hero, Quiz, Seasonal Drops, Kori Club CTA |
| Catalog | `/products` | Product grid, filters, scarcity badges |
| Checkout | `/checkout` | Cart, summary, eco-packaging |
| Dashboard | `/dashboard` | Orders, Kori Points, preferences |
| Admin | `/admin` | SCM table, demand forecast |
