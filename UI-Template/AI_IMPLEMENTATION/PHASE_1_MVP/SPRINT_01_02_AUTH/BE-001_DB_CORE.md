# BE-001: Database Core Setup

**Sprint**: 01-02 Authentication  
**Effort**: 4 hours  
**Priority**: P0 (Critical)  
**Status**: 🔴 Not Started

---

## 📋 Context

Setup Supabase PostgreSQL database làm foundation cho toàn bộ hệ thống. Đây là task đầu tiên và quan trọng nhất của Phase 1.

### Why this task?

- ✅ Database là core của mọi backend operations
- ✅ Supabase cung cấp PostgreSQL + Auth + Storage + Realtime
- ✅ Cần setup trước khi implement bất kỳ entity nào

### Business Value

- Enables tất cả backend features
- Provides scalable data storage
- Built-in authentication support
- Real-time capabilities for future features

---

## 🎯 Requirements

### Functional Requirements

1. **Supabase Project Setup**
   - Tạo project mới trên Supabase
   - Configure database settings
   - Setup connection pooling

2. **Database Schema**
   - Enable UUID extension
   - Setup timestamp functions
   - Create base schemas

3. **Migration System**
   - Setup Prisma ORM
   - Initialize migration folder
   - Create baseline migration

4. **Environment Configuration**
   - Setup environment variables
   - Configure connection strings
   - Setup dev/staging/prod environments

### Non-Functional Requirements

- **Security**: Connection strings must be in env vars
- **Performance**: Connection pooling enabled
- **Reliability**: Backup strategy defined
- **Scalability**: Support 1000+ concurrent users

---

## 🛠️ Implementation

### Step 1: Supabase Project Setup

```bash
# 1. Tạo Supabase project tại https://supabase.com
# - Project name: vstepro-dev
# - Region: Singapore (gần VN nhất)
# - Database password: Generate strong password

# 2. Lấy credentials từ Project Settings > API
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres:[password]@db.xxxxx.supabase.co:5432/postgres
```

### Step 2: Install Dependencies

```bash
# Backend dependencies
npm install @supabase/supabase-js
npm install prisma @prisma/client
npm install dotenv
npm install -D @types/node

# Initialize Prisma
npx prisma init
```

### Step 3: Configure Prisma

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Base configuration
// Actual models will be added in BE-002
```

### Step 4: Setup Database Extensions

```sql
-- Run in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create schemas
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS public;
CREATE SCHEMA IF NOT EXISTS storage;
```

### Step 5: Environment Configuration

```bash
# .env.local (NEVER commit this file!)
NODE_ENV=development

# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Database
DATABASE_URL=postgresql://postgres:[password]@db.xxxxx.supabase.co:5432/postgres

# JWT
JWT_SECRET=your_super_secret_jwt_key_min_32_characters
JWT_EXPIRES_IN=7d
```

```typescript
// .env.example (COMMIT this as template)
NODE_ENV=development

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Database
DATABASE_URL=postgresql://postgres:[password]@db.your-project.supabase.co:5432/postgres

# JWT
JWT_SECRET=generate_a_strong_secret_key
JWT_EXPIRES_IN=7d
```

### Step 6: Create Database Client

```typescript
// src/lib/db.ts
import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
```

### Step 7: Create Supabase Client

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

if (!process.env.SUPABASE_URL) {
  throw new Error('Missing SUPABASE_URL environment variable');
}

if (!process.env.SUPABASE_ANON_KEY) {
  throw new Error('Missing SUPABASE_ANON_KEY environment variable');
}

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
);

// Admin client (use with caution!)
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
```

### Step 8: Health Check Endpoint

```typescript
// src/api/health.ts
import { prisma } from '../lib/db';

export async function healthCheck(): Promise<{
  status: 'ok' | 'error';
  database: 'connected' | 'disconnected';
  timestamp: string;
}> {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    
    return {
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Health check failed:', error);
    
    return {
      status: 'error',
      database: 'disconnected',
      timestamp: new Date().toISOString(),
    };
  }
}
```

---

## 🧪 Testing

### Manual Testing

```bash
# 1. Test connection
npx prisma db pull

# 2. Test Prisma client
npx prisma generate

# 3. Test database query
npx prisma studio  # Opens GUI at http://localhost:5555

# 4. Test health endpoint
curl http://localhost:8000/api/health
```

### Automated Tests

```typescript
// src/lib/__tests__/db.test.ts
import { prisma } from '../db';

describe('Database Connection', () => {
  it('should connect to database', async () => {
    const result = await prisma.$queryRaw`SELECT 1 as value`;
    expect(result).toHaveLength(1);
    expect(result[0].value).toBe(1);
  });

  it('should have uuid extension enabled', async () => {
    const result = await prisma.$queryRaw`
      SELECT uuid_generate_v4() as id
    `;
    expect(result[0].id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  });
});
```

---

## ✅ Acceptance Criteria

### Must Have

- [ ] Supabase project created và configured
- [ ] Prisma ORM setup và working
- [ ] Environment variables configured
- [ ] Database extensions enabled (uuid-ossp, pgcrypto)
- [ ] Database client created và tested
- [ ] Health check endpoint working
- [ ] Connection pooling enabled
- [ ] .env.example file created
- [ ] .env.local in .gitignore
- [ ] Documentation updated

### Nice to Have

- [ ] Database backup strategy documented
- [ ] Monitoring alerts configured
- [ ] Migration rollback strategy defined
- [ ] Performance baseline established

---

## 🔗 Dependencies

### Prerequisite Tasks

- None (this is the first task!)

### Blocks These Tasks

- BE-002: User Entity & Migrations
- BE-010: Exercise Schema & Migrations
- BE-020: Result Schema & Migrations
- All backend tasks depend on this

---

## 📚 Resources

### Documentation

- [Supabase Docs](https://supabase.com/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

### Internal

- `00_GLOBAL_RULES.md` - Security rules
- `01_PROJECT_CONTEXT.md` - Database models

### Examples

```typescript
// Example: Query with Prisma
const users = await prisma.user.findMany({
  where: { role: 'student' },
  select: { id: true, email: true, fullName: true },
});

// Example: Raw query
const result = await prisma.$queryRaw`
  SELECT * FROM users WHERE role = 'student'
`;
```

---

## 🚨 Common Issues

### Issue 1: Connection Refused

```bash
Error: Can't reach database server at `db.xxxxx.supabase.co`
```

**Solution:**
- Check DATABASE_URL is correct
- Verify IP allowlist in Supabase (should be 0.0.0.0/0 for dev)
- Check firewall settings

### Issue 2: Authentication Failed

```bash
Error: password authentication failed
```

**Solution:**
- Reset database password in Supabase dashboard
- Update DATABASE_URL with new password
- Clear connection pool: `npx prisma migrate reset`

### Issue 3: Extension Not Found

```bash
Error: extension "uuid-ossp" does not exist
```

**Solution:**
- Run SQL in Supabase SQL Editor:
  ```sql
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  ```

---

## 🎯 Success Metrics

### Performance

- Database connection < 100ms
- Query execution < 50ms (simple queries)
- Connection pool size: 10-20 connections

### Reliability

- Uptime: 99.9%
- Backup frequency: Daily
- Recovery time: < 1 hour

---

## 📝 Notes

### Security

⚠️ **CRITICAL:**
- NEVER commit .env.local
- NEVER share service role key
- ALWAYS use environment variables
- ROTATE credentials regularly

### Best Practices

- Use connection pooling
- Close connections properly
- Handle errors gracefully
- Log database errors
- Monitor query performance

### Future Improvements

- [ ] Setup read replicas for scaling
- [ ] Implement query caching
- [ ] Add database monitoring
- [ ] Setup automated backups
- [ ] Configure point-in-time recovery

---

## ✍️ Completion Checklist

- [ ] Code written và tested
- [ ] Tests passing (manual + automated)
- [ ] Documentation updated
- [ ] Environment variables documented
- [ ] Security review passed
- [ ] Code review approved
- [ ] Deployed to dev environment
- [ ] Health check verified
- [ ] Task marked as complete in tracker

---

**Created**: December 21, 2024  
**Last Updated**: December 21, 2024  
**Completed**: _______________  
**Completed By**: _______________
