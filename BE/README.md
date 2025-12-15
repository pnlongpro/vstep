# VSTEP Backend

VSTEP AI Exam Platform - NestJS Backend API

## Project Structure

```
src/
├── api/
│   ├── controllers/       # REST endpoints với Swagger documentation
│   ├── services/          # Business logic layer
│   ├── entities/          # TypeORM database models
│   └── dto/               # Request/response schemas
├── config/                # Configuration services
├── guards/                # Authentication & authorization
├── interceptors/          # Request/response transformation
├── middleware/            # Custom middleware
├── migrations/            # Database schema migrations
├── models/                # Shared models and enums
├── providers/             # Dependency injection setup
└── utils/                 # Helper utilities
```

## Getting Started

### Prerequisites

- Node.js >= 18.x
- MySQL >= 8.0
- Redis (optional for caching)

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update .env with your database credentials
```

### Database Setup

```bash
# Run migrations
npm run migration:run

# Generate new migration (after changing entities)
npm run migration:generate -- src/migrations/MigrationName
```

### Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000`

Swagger documentation: `http://localhost:3000/api/docs`

## Development Guidelines

### Creating New Features

1. **Entity**: Define in `src/api/entities/`
2. **DTO**: Create validation schemas in `src/api/dto/`
3. **Service**: Implement business logic in `src/api/services/`
4. **Controller**: Add REST endpoints in `src/api/controllers/`

### Security

- All protected routes use `@UseGuards(JwtAuthGuard, RolesGuard)`
- Use `@Roles('student', 'teacher', 'admin')` decorator for RBAC
- DTOs with `class-validator` prevent injection attacks

### Database

- Never modify entities directly in production
- Always create migrations for schema changes
- Use transactions for multi-table operations

## API Endpoints

### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - User login

### Exams

- `GET /exams` - Get all exam sets
- `GET /exams/:id` - Get exam set details
- `POST /exams/attempt` - Create exam attempt (requires auth)
- `POST /exams/submit-answer` - Submit answer (requires auth)

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## License

MIT
