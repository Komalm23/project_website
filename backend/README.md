# Fuel EU Compliance Backend

Backend API for the Fuel EU Compliance Dashboard, built with Node.js, TypeScript, PostgreSQL, and Prisma.

## Architecture

This project follows **Hexagonal Architecture** (Ports & Adapters):

```
src/
  core/
    domain/          # Domain entities and business logic
    application/     # Use cases
    ports/           # Interfaces (inbound/outbound)
  adapters/
    inbound/http/    # Express routes (HTTP adapters)
    outbound/postgres/ # Prisma repositories (database adapters)
  shared/
    db/              # Prisma client
    di/              # Dependency injection
  server/            # Express app setup
```

## Features

- **Routes Management**: CRUD operations for routes, set baseline
- **Compliance Balance (CB)**: Calculate and store CB per ship/year
- **Banking**: Bank surplus CB and apply to deficits (Article 20)
- **Pooling**: Create pools with greedy allocation (Article 21)
- **Comparison**: Compare routes against baseline

## Core Formulas

- **Target Intensity (2025)**: 89.3368 gCO₂e/MJ
- **Energy in scope**: `fuelConsumption × 41,000 MJ/t`
- **Compliance Balance**: `(Target - Actual) × Energy in scope`
- **Positive CB** = Surplus, **Negative CB** = Deficit

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your PostgreSQL connection string
```

3. Set up database:
```bash
# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database
npm run db:seed
```

4. Start development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3000/api`

## API Endpoints

### Routes

- `GET /api/routes` - Get all routes (with optional filters: `?vesselType=&fuelType=&year=`)
- `POST /api/routes/:routeId/baseline` - Set route as baseline
- `GET /api/routes/comparison` - Get comparison data (baseline vs others)

### Compliance

- `GET /api/compliance/cb?shipId=&year=` - Get compliance balance
- `GET /api/compliance/adjusted-cb?shipId=&year=` - Get adjusted CB (single ship or all for year)

### Banking

- `GET /api/banking/records?shipId=&year=` - Get bank records
- `POST /api/banking/bank` - Bank surplus CB
  ```json
  { "shipId": "R001", "year": 2024 }
  ```
- `POST /api/banking/apply` - Apply banked surplus
  ```json
  { "shipId": "R001", "year": 2024 }
  ```

### Pools

- `POST /api/pools` - Create pool
  ```json
  {
    "members": ["R001", "R002"],
    "year": 2024
  }
  ```

## Testing

Run all tests:
```bash
npm test
```

Run with coverage:
```bash
npm run test:coverage
```

## Database Schema

- `routes` - Route data with baseline flag
- `ship_compliance` - Computed CB records
- `bank_entries` - Banked surplus entries
- `pools` - Pool registry
- `pool_members` - Pool allocations (cb_before, cb_after)

## Development

- **Lint**: `npm run lint`
- **Format**: `npm run format`
- **DB Studio**: `npm run db:studio` (Prisma Studio GUI)

## Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL + Prisma ORM
- **Testing**: Vitest + Supertest
- **Architecture**: Hexagonal (Ports & Adapters)

