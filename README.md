# Fuel EU Compliance Dashboard

A React + TypeScript dashboard for Fuel EU Compliance management, built with hexagonal architecture.

## Features

- **Routes Tab**: View and filter routes, set baselines
- **Compare Tab**: Compare baseline vs comparison routes with charts
- **Banking Tab**: Manage compliance balance banking (Article 20)
- **Pooling Tab**: Create and manage fuel pools (Article 21)

## Architecture

The project follows hexagonal architecture:

```
src/
  core/
    domain/          # Domain entities
    application/     # Use cases
    ports/           # Inbound/outbound ports
  adapters/
    ui/              # React components and hooks
    infrastructure/  # API clients
  shared/            # Shared utilities and config
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set API base URL (optional):
Create a `.env` file:
```
VITE_API_BASE_URL=http://localhost:3000/api
```

3. Run development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Tech Stack

- React 18
- TypeScript (strict mode)
- Tailwind CSS
- Recharts (for data visualization)
- Vite

## Code Quality

- ESLint for linting
- Prettier for formatting
- TypeScript strict mode enabled

