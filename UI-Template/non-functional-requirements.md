# 🔒 NON-FUNCTIONAL REQUIREMENTS - YÊU CẦU PHI CHỨC NĂNG

## Mục lục
1. [Security (Bảo mật)](#security-bảo-mật)
2. [Performance (Hiệu năng)](#performance-hiệu-năng)
3. [Scalability (Khả năng mở rộng)](#scalability-khả-năng-mở-rộng)
4. [Reliability (Độ tin cậy)](#reliability-độ-tin-cậy)
5. [Availability (Tính sẵn sàng)](#availability-tính-sẵn-sàng)
6. [Usability (Khả năng sử dụng)](#usability-khả-năng-sử-dụng)
7. [Compliance (Tuân thủ)](#compliance-tuân-thủ)
8. [Maintainability (Khả năng bảo trì)](#maintainability-khả-năng-bảo-trì)

---

## Security (Bảo mật)

### 1. Authentication & Authorization

#### 1.1. Password Policy
- **Minimum length**: 8 characters
- **Complexity**: At least 1 uppercase, 1 lowercase, 1 number
- **Password hashing**: bcrypt with cost factor 12
- **Salt**: Unique salt per password
- **Storage**: Never store plain text passwords

#### 1.2. Session Management
- **JWT Tokens**: For stateless authentication
- **Token expiry**: Access token 1 hour, Refresh token 7 days
- **Secure storage**: HttpOnly cookies or secure storage
- **Token rotation**: Refresh tokens rotate on use
- **Revocation**: Support token blacklist for logout

#### 1.3. Multi-Factor Authentication (MFA)
- **Optional MFA**: Email OTP
- **Future**: TOTP (Google Authenticator), SMS OTP
- **Backup codes**: Provide recovery codes

#### 1.4. Role-Based Access Control (RBAC)
```typescript
Roles:
  - Student: Can access practice, take tests, view results
  - Teacher: + Can manage classes, grade assignments
  - Admin: + Full system access

Permissions:
  - practice.access
  - exam.take
  - class.manage
  - user.create
  - user.edit
  - user.delete
  - admin.access

Enforcement:
  - API level: Check permissions before processing
  - UI level: Hide unauthorized features
  - Database level: Row-level security
```

### 2. Data Protection

#### 2.1. Encryption
- **Data in Transit**: TLS 1.3
- **Data at Rest**: AES-256 encryption for sensitive data
- **Database**: Encrypted columns for PII
- **Backups**: Encrypted backup files

#### 2.2. Personal Data Protection
- **PII fields**: name, email, phone, address, date_of_birth
- **Data minimization**: Only collect necessary data
- **Consent**: Explicit consent for data collection
- **Right to deletion**: Support data deletion requests
- **Data export**: Allow users to export their data

#### 2.3. Payment Security
- **PCI DSS Compliance**: If storing card data
- **Tokenization**: Store payment tokens, not card numbers
- **3D Secure**: Support for additional authentication
- **Fraud detection**: Monitor suspicious transactions

### 3. Input Validation & Sanitization

#### 3.1. Input Validation
- **Client-side**: Immediate feedback
- **Server-side**: Mandatory validation
- **Whitelist approach**: Allow known good inputs
- **Data type checking**: Strict type validation
- **Length limits**: Enforce maximum lengths

#### 3.2. SQL Injection Prevention
- **Parameterized queries**: Always use prepared statements
- **ORM**: Use ORM (e.g., TypeORM, Sequelize)
- **No string concatenation**: Never build SQL with strings
- **Least privilege**: Database user with minimum permissions

#### 3.3. XSS Prevention
- **Output encoding**: Escape all user-generated content
- **Content Security Policy (CSP)**: Restrict script sources
- **HTTPOnly cookies**: Prevent JavaScript cookie access
- **React**: Auto-escaping with JSX

#### 3.4. CSRF Prevention
- **CSRF tokens**: Unique tokens for forms
- **SameSite cookies**: Set to Strict or Lax
- **Double submit**: Verify token in header and body

### 4. Security Headers

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'
Permissions-Policy: geolocation=(), microphone=(), camera=()
Referrer-Policy: strict-origin-when-cross-origin
```

### 5. File Upload Security

#### 5.1. File Validation
- **File type**: Check MIME type and extension
- **File size**: Limit to reasonable size (10MB docs, 100MB videos)
- **Virus scan**: Scan uploads with antivirus
- **Content validation**: Validate file content

#### 5.2. Storage
- **Separate domain**: Serve uploads from different domain
- **No execution**: Prevent script execution in upload directory
- **CDN**: Use CDN for serving files
- **Access control**: Signed URLs for private files

### 6. API Security

#### 6.1. Rate Limiting
```typescript
Limits:
  - Unauthenticated: 100 requests/hour
  - Authenticated: 1000 requests/hour
  - Admin: 5000 requests/hour

Per endpoint:
  - Login: 5 attempts/15 minutes
  - Password reset: 3 attempts/hour
  - File upload: 10 uploads/hour

Implementation:
  - Redis for rate limit tracking
  - Return 429 Too Many Requests
  - Include Retry-After header
```

#### 6.2. API Key Management
- **Secure generation**: Cryptographically secure random
- **Rotation**: Support key rotation
- **Scope**: Limit key permissions
- **Expiry**: Optional expiration dates

### 7. Logging & Monitoring

#### 7.1. Security Logging
```typescript
Log events:
  - Failed login attempts
  - Password changes
  - Permission changes
  - Admin actions
  - Data exports
  - Suspicious activities

Log format:
  {
    timestamp: "2024-12-11T10:00:00Z",
    event: "failed_login",
    userId: "uuid",
    ipAddress: "192.168.1.1",
    userAgent: "...",
    details: {...}
  }

Retention:
  - Security logs: 1 year
  - Access logs: 90 days
  - Error logs: 30 days
```

#### 7.2. Intrusion Detection
- **Failed login monitoring**: Alert on multiple failures
- **Unusual access patterns**: Detect anomalies
- **Privilege escalation**: Alert on permission changes
- **Data exfiltration**: Monitor large data exports

### 8. Vulnerability Management

#### 8.1. Security Testing
- **Code review**: Security-focused code reviews
- **SAST**: Static Application Security Testing
- **DAST**: Dynamic Application Security Testing
- **Dependency scanning**: Check for vulnerable dependencies
- **Penetration testing**: Annual pen tests

#### 8.2. Patch Management
- **Regular updates**: Keep dependencies updated
- **Security patches**: Apply critical patches immediately
- **Version tracking**: Monitor for vulnerabilities
- **Automated scanning**: GitHub Dependabot, Snyk

---

## Performance (Hiệu năng)

### 1. Response Time Targets

```typescript
API Endpoints:
  - Simple queries (GET user): < 100ms (p95)
  - Complex queries (dashboard): < 500ms (p95)
  - File uploads: < 2s for 10MB
  - AI grading: < 10s (p95)

Page Load Times:
  - First Contentful Paint (FCP): < 1.5s
  - Largest Contentful Paint (LCP): < 2.5s
  - Time to Interactive (TTI): < 3.5s
  - Cumulative Layout Shift (CLS): < 0.1
```

### 2. Database Optimization

#### 2.1. Indexing Strategy
```sql
-- Primary indexes on all foreign keys
CREATE INDEX idx_class_students_class_id ON class_students(class_id);
CREATE INDEX idx_class_students_student_id ON class_students(student_id);

-- Composite indexes for common queries
CREATE INDEX idx_submissions_assignment_student 
  ON submissions(assignment_id, student_id);

-- Partial indexes for active records
CREATE INDEX idx_active_users 
  ON users(created_at) WHERE deleted_at IS NULL;

-- JSONB indexes
CREATE INDEX idx_questions_tags ON questions USING GIN (tags);
```

#### 2.2. Query Optimization
- **Avoid N+1 queries**: Use JOINs or batch loading
- **Pagination**: Always paginate large result sets
- **SELECT specific columns**: Avoid SELECT *
- **Use EXPLAIN**: Analyze query plans
- **Connection pooling**: Reuse database connections

#### 2.3. Caching Strategy
```typescript
Cache Layers:

1. Browser Cache:
   - Static assets: 1 year
   - API responses: No cache (dynamic)

2. CDN Cache (CloudFlare):
   - Static files: Edge caching
   - Images: Auto-optimization
   - API: No cache

3. Application Cache (Redis):
   - User sessions: 1 hour
   - Dashboard stats: 5 minutes
   - Class lists: 10 minutes
   - Exam questions: 1 hour

4. Database Query Cache:
   - Frequently accessed data
   - Invalidate on update

Cache Invalidation:
  - Time-based (TTL)
  - Event-based (on update/delete)
  - Manual purge
```

### 3. Frontend Optimization

#### 3.1. Code Splitting
- **Route-based**: Split by page
- **Component-based**: Lazy load heavy components
- **Vendor splitting**: Separate vendor bundle

#### 3.2. Asset Optimization
- **Image optimization**: 
  - WebP format
  - Responsive images (srcset)
  - Lazy loading
  - Compression
- **Minification**: JS, CSS minification
- **Compression**: Gzip/Brotli
- **Tree shaking**: Remove unused code

#### 3.3. Performance Monitoring
```typescript
Metrics to track:
  - Core Web Vitals (LCP, FID, CLS)
  - Page load times
  - API response times
  - Error rates
  - User engagement

Tools:
  - Google Lighthouse
  - WebPageTest
  - Chrome DevTools
  - New Relic / Datadog
```

### 4. Backend Optimization

#### 4.1. Async Processing
```typescript
Use background jobs for:
  - Email sending
  - AI grading
  - Report generation
  - File processing
  - Bulk operations

Implementation:
  - Bull Queue (Redis-based)
  - Worker processes
  - Job priorities
  - Retry logic
  - Dead letter queue
```

#### 4.2. Load Balancing
- **Horizontal scaling**: Multiple server instances
- **Load balancer**: Nginx or AWS ALB
- **Session affinity**: Sticky sessions if needed
- **Health checks**: Monitor server health

---

## Scalability (Khả năng mở rộng)

### 1. Horizontal Scaling

#### 1.1. Stateless Architecture
- **No server state**: All state in database/cache
- **JWT tokens**: Stateless authentication
- **Shared sessions**: Redis for session storage
- **File storage**: External (S3, not local)

#### 1.2. Microservices (Future)
```
Current: Monolith
Future: Microservices

Services:
  - Auth Service
  - User Service
  - Class Service
  - Exam Service
  - AI Grading Service
  - Notification Service
  - Analytics Service

Communication:
  - REST APIs
  - Event-driven (message queue)
  - Service mesh
```

### 2. Database Scaling

#### 2.1. Read Replicas
- **Master-Slave**: Write to master, read from slaves
- **Read replica**: For analytics and reports
- **Lag monitoring**: Alert on replication lag

#### 2.2. Sharding (Future)
- **Shard key**: User ID or tenant ID
- **Horizontal partitioning**: Split tables
- **Distributed queries**: Query across shards

#### 2.3. Database Optimization
- **Partitioning**: Partition large tables by date
- **Archiving**: Archive old data
- **Denormalization**: For performance-critical queries

### 3. Caching Scaling

#### 3.1. Redis Cluster
- **Distributed cache**: Multiple Redis nodes
- **Failover**: Automatic failover
- **Persistence**: RDB + AOF

### 4. CDN Strategy

```typescript
CDN Configuration:
  - Static assets: CloudFlare
  - Images: Auto WebP conversion
  - Videos: Adaptive bitrate streaming
  - Global distribution: Edge locations

Cache Rules:
  - HTML: No cache
  - CSS/JS: Cache with hash versioning
  - Images: 1 year cache
  - API: No cache
```

### 5. Capacity Planning

```typescript
Current Capacity (per server):
  - Concurrent users: 500
  - Requests/second: 100
  - Database connections: 100

Growth Projections:
  Year 1: 10,000 users
  Year 2: 50,000 users
  Year 3: 200,000 users

Scaling Plan:
  10K users: 2 app servers + 1 DB
  50K users: 5 app servers + 2 DB (master + slave)
  200K users: 20 app servers + DB cluster + cache cluster
```

---

## Reliability (Độ tin cậy)

### 1. Error Handling

#### 1.1. Graceful Degradation
- **Fallbacks**: Provide alternatives when services fail
- **Circuit breaker**: Prevent cascade failures
- **Retry logic**: Automatic retries with backoff
- **Timeouts**: Set appropriate timeouts

#### 1.2. Error Logging
```typescript
Error tracking:
  - Tool: Sentry
  - Capture: All unhandled exceptions
  - Context: User ID, request ID, stack trace
  - Alerts: Critical errors notify team

Error categories:
  - Client errors (4xx): User mistakes
  - Server errors (5xx): System issues
  - Database errors: Connection, query errors
  - External service errors: API failures
```

### 2. Data Integrity

#### 2.1. Transactions
- **ACID properties**: Ensure data consistency
- **BEGIN/COMMIT/ROLLBACK**: Proper transaction handling
- **Isolation levels**: Read committed or higher
- **Deadlock handling**: Retry on deadlock

#### 2.2. Data Validation
- **Schema validation**: Enforce database constraints
- **Application validation**: Validate before saving
- **Foreign key constraints**: Maintain referential integrity
- **Check constraints**: Validate data ranges

### 3. Backup & Recovery

#### 3.1. Database Backups
```typescript
Backup Strategy:
  - Full backup: Daily at 2 AM
  - Incremental backup: Every 6 hours
  - Transaction logs: Continuous
  - Retention: 30 days

Backup storage:
  - Location: AWS S3
  - Encryption: AES-256
  - Geographic redundancy: Multiple regions
  - Accessibility: Retrieve within 1 hour

Testing:
  - Restore test: Monthly
  - Disaster recovery drill: Quarterly
  - Recovery time objective (RTO): 4 hours
  - Recovery point objective (RPO): 6 hours
```

#### 3.2. File Backups
- **User uploads**: Replicated across regions
- **System files**: Version controlled (Git)
- **Configuration**: Backed up to secure storage

---

## Availability (Tính sẵn sàng)

### 1. Uptime Target
- **Target**: 99.9% uptime (8.76 hours downtime/year)
- **Monitoring**: 24/7 monitoring
- **Alerting**: Immediate alerts on downtime

### 2. High Availability Architecture

```
                   [Load Balancer]
                         |
        +----------------+----------------+
        |                |                |
   [App Server 1]  [App Server 2]  [App Server 3]
        |                |                |
        +----------------+----------------+
                         |
                  [Database Cluster]
                  Master + 2 Slaves
```

### 3. Disaster Recovery Plan

#### 3.1. Failure Scenarios
```typescript
Scenarios:
  1. Single server failure
     - Impact: None (load balancer redirects)
     - Recovery: Auto-scaling replaces
     
  2. Database failure
     - Impact: Service degradation
     - Recovery: Failover to slave (< 1 minute)
     
  3. Region outage
     - Impact: Service down
     - Recovery: Failover to backup region (< 1 hour)
     
  4. Complete data center loss
     - Impact: Major outage
     - Recovery: Restore from backups (< 4 hours)
```

### 4. Maintenance Windows
- **Scheduled**: Weekly, Sunday 2-4 AM
- **Notification**: 48 hours advance notice
- **Zero-downtime**: Deploy using blue-green
- **Rollback plan**: Always have rollback ready

---

## Usability (Khả năng sử dụng)

### 1. User Interface Requirements

#### 1.1. Responsive Design
- **Desktop**: 1920x1080 and above
- **Laptop**: 1366x768
- **Tablet**: 768x1024 (portrait & landscape)
- **Mobile**: 375x667 and above

#### 1.2. Accessibility (WCAG 2.1 Level AA)
- **Keyboard navigation**: All features accessible via keyboard
- **Screen readers**: Proper ARIA labels
- **Color contrast**: Minimum 4.5:1 ratio
- **Text size**: Adjustable font size
- **Alt text**: All images have alt text

#### 1.3. Browser Support
- **Chrome**: Latest 2 versions
- **Firefox**: Latest 2 versions
- **Safari**: Latest 2 versions
- **Edge**: Latest 2 versions
- **Mobile browsers**: iOS Safari, Chrome Android

### 2. User Experience

#### 2.1. Loading States
- **Skeleton screens**: Show content structure
- **Progress bars**: For long operations
- **Spinners**: For quick operations
- **Optimistic updates**: Update UI immediately

#### 2.2. Error Messages
- **User-friendly**: Clear, actionable messages
- **No technical jargon**: Avoid stack traces
- **Suggestions**: How to fix the error
- **Contact info**: Support link for help

#### 2.3. Onboarding
- **First-time tour**: Interactive walkthrough
- **Tooltips**: Context-sensitive help
- **Documentation**: Comprehensive help docs
- **Video tutorials**: Step-by-step guides

---

## Compliance (Tuân thủ)

### 1. GDPR Compliance (if applicable)

#### 1.1. Data Protection Rights
- **Right to access**: Users can view their data
- **Right to rectification**: Users can correct data
- **Right to erasure**: Users can delete data
- **Right to portability**: Export data in JSON/CSV
- **Right to object**: Opt-out of processing

#### 1.2. Consent Management
- **Explicit consent**: Clear consent for data collection
- **Granular consent**: Separate consent for different purposes
- **Consent log**: Record when/how consent given
- **Easy withdrawal**: Simple opt-out process

### 2. Educational Compliance

#### 2.1. Student Privacy
- **FERPA compliance** (if US students)
- **Minimal data collection**: Only necessary data
- **Parental consent**: For under-18 students
- **Data sharing**: No third-party sharing without consent

### 3. Payment Compliance

#### 3.1. PCI DSS (if storing cards)
- **Level**: Determine PCI level
- **Tokenization**: Use payment gateway tokenization
- **No card storage**: Never store full card numbers
- **Audit**: Annual PCI audit

---

## Maintainability (Khả năng bảo trì)

### 1. Code Quality

#### 1.1. Coding Standards
```typescript
Standards:
  - Style guide: Airbnb JavaScript Style Guide
  - Linting: ESLint
  - Formatting: Prettier
  - Type checking: TypeScript strict mode

Code Review:
  - Mandatory for all changes
  - At least 1 approval required
  - Automated checks must pass
  - Security review for sensitive changes
```

#### 1.2. Documentation
```typescript
Required documentation:
  - README: Project overview, setup instructions
  - API docs: OpenAPI/Swagger specification
  - Architecture docs: System design, diagrams
  - Component docs: Purpose, props, usage
  - Database docs: Schema, relationships
  - Deployment docs: How to deploy

Format:
  - Markdown for text docs
  - JSDoc for code comments
  - Inline comments for complex logic
```

### 2. Testing Strategy

#### 2.1. Test Coverage
```typescript
Coverage targets:
  - Unit tests: > 80% coverage
  - Integration tests: Critical paths
  - E2E tests: User flows

Testing pyramid:
  - 70% Unit tests
  - 20% Integration tests
  - 10% E2E tests
```

#### 2.2. Test Types
```typescript
Unit Tests:
  - Framework: Jest
  - Coverage: Functions, modules
  - Fast: < 1s per test

Integration Tests:
  - Framework: Jest + Supertest
  - Coverage: API endpoints, database
  - Moderate: < 5s per test

E2E Tests:
  - Framework: Cypress
  - Coverage: Critical user flows
  - Slow: < 30s per test
```

### 3. Monitoring & Observability

#### 3.1. Application Monitoring
```typescript
Metrics:
  - Response times (p50, p95, p99)
  - Error rates
  - Request rates
  - Active users
  - Database performance
  - Memory usage
  - CPU usage

Tools:
  - APM: New Relic / Datadog
  - Logs: ELK Stack / CloudWatch
  - Errors: Sentry
  - Uptime: Pingdom / UptimeRobot
```

#### 3.2. Alerting
```typescript
Alert rules:
  - Error rate > 1%: Critical
  - Response time > 1s (p95): Warning
  - Database connection pool > 90%: Warning
  - Disk usage > 80%: Warning
  - Memory usage > 90%: Critical
  - Service down: Critical

Notification channels:
  - Email: All alerts
  - SMS: Critical alerts
  - Slack: All alerts
  - PagerDuty: Critical alerts (24/7)
```

### 4. Deployment

#### 4.1. CI/CD Pipeline
```yaml
Pipeline:
  1. Commit to Git
  2. Trigger CI build
  3. Run linting
  4. Run tests
  5. Build artifacts
  6. Security scan
  7. Deploy to staging
  8. Run smoke tests
  9. Manual approval
  10. Deploy to production
  11. Run smoke tests
  12. Monitor

Tools:
  - CI: GitHub Actions / GitLab CI
  - CD: Docker + Kubernetes
  - Monitoring: Datadog
```

#### 4.2. Release Strategy
```typescript
Strategy: Blue-Green Deployment

Process:
  1. Current version (Blue) running
  2. Deploy new version (Green)
  3. Run health checks on Green
  4. Switch traffic to Green
  5. Monitor for issues
  6. Keep Blue ready for rollback
  7. After 24h, decomission Blue

Rollback:
  - Instant: Switch traffic back to Blue
  - Database: Maintain backward compatibility
```

---

## Summary

### Tổng quan yêu cầu phi chức năng:

**Security**:
- ✅ Authentication với JWT
- ✅ RBAC với 3 roles
- ✅ Password hashing (bcrypt)
- ✅ HTTPS mandatory
- ✅ Input validation
- ✅ SQL injection prevention
- ✅ XSS prevention

**Performance**:
- ✅ API response < 500ms (p95)
- ✅ Page load < 3.5s
- ✅ Database indexing
- ✅ Redis caching
- ✅ CDN for static assets

**Scalability**:
- ✅ Stateless architecture
- ✅ Horizontal scaling ready
- ✅ Database read replicas
- ✅ Background job processing

**Reliability**:
- ✅ Error handling
- ✅ Data validation
- ✅ Daily backups
- ✅ Transaction support

**Availability**:
- ✅ 99.9% uptime target
- ✅ Load balancing
- ✅ Auto-scaling
- ✅ Disaster recovery plan

**Usability**:
- ✅ Responsive design
- ✅ WCAG 2.1 Level AA
- ✅ Browser compatibility
- ✅ User onboarding

**Compliance**:
- ✅ GDPR ready
- ✅ Student privacy
- ✅ PCI DSS (payment)

**Maintainability**:
- ✅ Code quality standards
- ✅ 80% test coverage
- ✅ Comprehensive documentation
- ✅ CI/CD pipeline

**Ngày tạo**: 2024-12-11  
**Phiên bản**: 1.0
