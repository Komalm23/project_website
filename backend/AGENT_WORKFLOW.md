# AI Agent Workflow Documentation

This document describes the workflow and prompts used to build the Fuel EU Compliance Backend.

## Project Overview

Built a Node.js + TypeScript backend API following hexagonal architecture for Fuel EU Compliance Dashboard.

## Development Phases

### Phase 1: Project Setup
**Prompt**: Set up backend project structure with TypeScript, Express, Prisma, and testing framework.

**Actions**:
- Created `package.json` with dependencies
- Configured `tsconfig.json` with strict mode
- Set up Prisma schema for PostgreSQL
- Configured Vitest for testing
- Added ESLint and Prettier

### Phase 2: Domain Layer
**Prompt**: Create domain entities, ports, and core business logic following hexagonal architecture.

**Actions**:
- Created domain entities (Route, Compliance, Banking, Pooling, Comparison)
- Defined inbound ports (services) and outbound ports (repositories)
- Implemented `ComplianceCalculator` with core formulas:
  - Energy in scope = fuelConsumption × 41,000 MJ/t
  - CB = (Target - Actual) × Energy in scope
  - Target = 89.3368 gCO₂e/MJ

### Phase 3: Application Layer (Use Cases)
**Prompt**: Implement use cases for routes, compliance, banking, and pooling.

**Actions**:
- `RouteUseCase`: Get routes, set baseline, get comparison data
- `ComparisonUseCase`: Compute comparison with percentDiff and compliance flags
- `ComplianceUseCase`: Calculate and store CB, get adjusted CB
- `BankingUseCase`: Bank surplus, apply banked amount
- `PoolingUseCase`: Create pools with greedy allocation algorithm

**Key Logic**:
- Pooling validation: Sum(adjustedCB) ≥ 0
- Deficit ship cannot exit worse
- Surplus ship cannot exit negative
- Greedy allocation: Sort desc by CB, transfer surplus to deficits

### Phase 4: Infrastructure Adapters
**Prompt**: Create Prisma repositories and Express HTTP routes.

**Actions**:
- Implemented Prisma repositories for all entities
- Created Express routes for all endpoints
- Set up dependency injection in `shared/di/services.ts`
- Configured CORS and error handling

### Phase 5: Testing
**Prompt**: Write unit tests for use cases and integration tests for HTTP endpoints.

**Actions**:
- Unit tests for `ComplianceCalculator`
- Unit tests for `ComparisonUseCase`, `BankingUseCase`, `PoolingUseCase`
- Integration tests for all HTTP routes
- Used Vitest and Supertest

### Phase 6: Database & Seeding
**Prompt**: Create Prisma schema and seed data with 5 routes, one baseline.

**Actions**:
- Defined Prisma schema with all tables
- Created seed script with 5 routes (R001-R005)
- Set R001 as baseline (isBaseline = true)

## Key Design Decisions

1. **Hexagonal Architecture**: Strict separation between core and adapters
   - Core has no framework dependencies
   - All Express/Prisma code in adapters

2. **Compliance Balance Calculation**:
   - Computed on-demand and stored in `ship_compliance` table
   - Adjusted CB accounts for applied banked amounts

3. **Banking Logic**:
   - Positive entries represent banked surplus
   - Negative entries represent applied amounts
   - Total banked = sum of all entries

4. **Pooling Algorithm**:
   - Greedy allocation: sort by CB descending
   - Transfer surplus to deficits
   - Validate constraints before creating pool

## Validation Steps

1. ✅ TypeScript strict mode - no errors
2. ✅ ESLint clean - no warnings
3. ✅ All unit tests pass
4. ✅ Integration tests validate endpoints
5. ✅ Prisma schema matches requirements
6. ✅ Seed data loads correctly
7. ✅ All endpoints return correct formats

## API Endpoint Validation

- ✅ `GET /api/routes` - Returns filtered routes
- ✅ `POST /api/routes/:id/baseline` - Sets baseline
- ✅ `GET /api/routes/comparison` - Returns comparison with percentDiff and compliant
- ✅ `GET /api/compliance/cb` - Returns CB with cb_before, applied, cb_after
- ✅ `GET /api/compliance/adjusted-cb` - Returns adjusted CB
- ✅ `POST /api/banking/bank` - Banks surplus (validates CB > 0)
- ✅ `POST /api/banking/apply` - Applies banked (validates available)
- ✅ `POST /api/pools` - Creates pool (validates sum ≥ 0, constraints)

## Edge Cases Handled

- Negative CB (deficit)
- Over-apply banked amount
- Invalid pool (negative sum)
- Deficit ship exiting worse
- Surplus ship exiting negative
- Missing route/ship
- Year mismatch

## Next Steps (if needed)

- Add authentication/authorization
- Add request validation with Zod
- Add rate limiting
- Add logging/monitoring
- Add API documentation (OpenAPI/Swagger)

