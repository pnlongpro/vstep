# ⚙️ Non-Functional Requirements

> **Yêu cầu phi chức năng cho hệ thống VSTEPRO**
> 
> File: `27-NON-FUNCTIONAL-REQUIREMENTS.md`  
> Version: 1.0  
> Last Updated: 15/12/2024

---

## 📑 Mục lục

- [1. Performance](#1-performance)
- [2. Security](#2-security)
- [3. Scalability](#3-scalability)
- [4. Availability](#4-availability)
- [5. Usability](#5-usability)
- [6. Compliance](#6-compliance)

---

## 1. Performance

### 1.1. Response Time

**Page Load**:
- Initial page load: < 3 seconds
- Subsequent navigation: < 1 second
- API response time: < 500ms (p95)
- Search results: < 200ms

**Exercise Performance**:
- Load exercise: < 2 seconds
- Submit answer: < 1 second
- Auto-save: < 500ms (background)
- Result calculation: < 2 seconds

**AI Grading**:
- Writing: 30-60 seconds
- Speaking: 60-120 seconds
- Queue processing: < 5 minutes max

### 1.2. Throughput

**Concurrent Users**:
- Support: 10,000 concurrent users
- Peak load: 50,000 concurrent users
- Requests per second: 10,000 RPS

**Database**:
- Read queries: < 100ms
- Write queries: < 200ms
- Complex queries: < 1 second

---

## 2. Security

### 2.1. Authentication & Authorization

**Password Security**:
- Minimum 8 characters
- Must include: uppercase, lowercase, number, special char
- Bcrypt hashing (salt rounds: 10)
- No password reuse (last 5)

**Session Management**:
- JWT tokens with expiry
- Access token: 15 minutes
- Refresh token: 7-30 days
- Token blacklist on logout
- Auto-logout on inactivity (30 minutes)

**Account Protection**:
- Rate limiting: 5 login attempts per 15 minutes
- Account lockout after 5 failed attempts
- CAPTCHA after 3 failed attempts
- Email notification on suspicious activity
- Device management (max 3 devices)

### 2.2. Data Protection

**Encryption**:
- HTTPS/TLS 1.3 for all traffic
- Database encryption at rest
- API keys encrypted in environment variables
- Sensitive data encrypted in database

**Data Privacy**:
- GDPR compliant
- User consent for data collection
- Right to be forgotten
- Data export capability
- Minimal data collection

**File Security**:
- Virus scanning on upload
- File type validation
- Size limits enforced
- CDN with signed URLs
- No direct file access

### 2.3. API Security

**Authentication**:
- JWT bearer tokens required
- API key for server-to-server
- OAuth 2.0 for third-party

**Rate Limiting**:
- 100 requests per minute per user
- 1000 requests per hour per IP
- Burst allowance: 20 requests

**Input Validation**:
- All inputs sanitized
- SQL injection prevention
- XSS prevention
- CSRF tokens

---

## 3. Scalability

### 3.1. Horizontal Scaling

**Application Servers**:
- Stateless design
- Load balancer (Round-robin, Least connections)
- Auto-scaling based on CPU/Memory
- Min instances: 2
- Max instances: 20

**Database**:
- Read replicas (3+)
- Connection pooling (max 100 connections)
- Query optimization
- Indexes on frequent queries

**File Storage**:
- CDN for static assets
- S3/R2 for user uploads
- Image optimization
- Lazy loading

### 3.2. Caching Strategy

**Application Cache**:
- Redis for session data
- Cache frequently accessed data
- TTL: 5-60 minutes based on data type

**Browser Cache**:
- Static assets: 1 year
- API responses: No cache (vary by user)
- Images: 30 days

**Database Cache**:
- Query result caching
- Materialized views for reports
- Refresh on data change

---

## 4. Availability

### 4.1. Uptime

**Target**: 99.9% uptime
- Downtime allowed: 43.8 minutes/month
- Maintenance windows: Announced 48h in advance
- Off-peak hours: 2-4 AM (UTC+7)

### 4.2. Backup & Recovery

**Database Backup**:
- Full backup: Daily (midnight)
- Incremental backup: Every 6 hours
- Retention: 30 days
- Offsite storage: AWS S3 Glacier

**Disaster Recovery**:
- RPO (Recovery Point Objective): 6 hours
- RTO (Recovery Time Objective): 4 hours
- Failover to backup region

**File Backup**:
- User uploads: Replicated 3x
- Backup to secondary region
- Version history: 30 days

### 4.3. Monitoring

**Health Checks**:
- Server health: Every 30 seconds
- Database health: Every minute
- External API health: Every 5 minutes

**Alerts**:
- Email/SMS on critical errors
- Slack integration for warnings
- Escalation policy (L1 → L2 → L3)

**Logging**:
- Application logs: 90 days retention
- Access logs: 30 days
- Error logs: 180 days
- Log aggregation (ELK stack)

---

## 5. Usability

### 5.1. User Experience

**Responsive Design**:
- Mobile-first approach
- Breakpoints: 375px, 768px, 1024px, 1440px
- Touch-friendly (min 44px buttons)
- Optimized for common devices

**Accessibility**:
- WCAG 2.1 Level AA compliance
- Keyboard navigation
- Screen reader support
- Alt text for images
- Color contrast ratio: 4.5:1 minimum
- Font size: 14px minimum

**Browser Support**:
- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)
- No IE support

### 5.2. Internationalization

**Languages**:
- Primary: Vietnamese
- Secondary: English (future)

**Localization**:
- Date/time format: DD/MM/YYYY, 24-hour
- Currency: VND
- Number format: 1.000,00 (European)

### 5.3. Error Handling

**User-Friendly Messages**:
- No technical jargon
- Clear action steps
- Contact support option

**Error Pages**:
- 404: "Trang không tồn tại"
- 500: "Lỗi hệ thống. Vui lòng thử lại sau"
- 403: "Bạn không có quyền truy cập"
- Offline: "Không có kết nối mạng"

---

## 6. Compliance

### 6.1. Legal

**Terms of Service**:
- User agreement
- Acceptable use policy
- Refund policy

**Privacy Policy**:
- Data collection disclosure
- Third-party services
- Cookie policy
- User rights

**GDPR Compliance**:
- User consent management
- Right to access data
- Right to deletion
- Data portability
- Breach notification (72 hours)

### 6.2. Academic Integrity

**Anti-Cheating**:
- No copy-paste during exams
- Tab switching detection
- Multiple attempt limits
- Randomized questions
- Time limits enforced

**Content Protection**:
- Watermark on premium content
- Download prevention
- Screenshot detection (future)
- DMCA compliance

### 6.3. Payment Compliance

**PCI DSS** (if applicable):
- No storing credit card data
- Payment gateway integration
- SSL/TLS required
- Audit logs

---

## 7. Operational Requirements

### 7.1. Deployment

**CI/CD Pipeline**:
- Automated testing
- Staging environment
- Blue-green deployment
- Rollback capability

**Environment**:
- Development
- Staging
- Production
- Environment parity

### 7.2. Maintenance

**Updates**:
- Security patches: Within 24 hours
- Feature updates: Bi-weekly
- Major releases: Monthly
- Database migrations: Zero-downtime

**Support**:
- Email support: < 24 hours response
- Live chat: Business hours
- Knowledge base
- FAQs

---

## 8. Quality Metrics

### 8.1. Code Quality

**Standards**:
- TypeScript strict mode
- ESLint + Prettier
- Code coverage: > 80%
- No console.log in production

**Testing**:
- Unit tests: Jest
- Integration tests: Playwright
- E2E tests: Cypress
- Load testing: k6

### 8.2. Performance Metrics

**Core Web Vitals**:
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

**Lighthouse Score**:
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 90
- SEO: > 90

---

## 9. Infrastructure Requirements

### 9.1. Server Specifications

**Production**:
- CPU: 8 cores minimum
- RAM: 16GB minimum
- Storage: 500GB SSD
- Network: 1Gbps

**Database**:
- CPU: 4 cores
- RAM: 32GB
- Storage: 1TB SSD
- Replication: Master + 3 replicas

### 9.2. Third-Party Services

**Required**:
- OpenAI API (AI grading)
- Email service (SendGrid/AWS SES)
- CDN (Cloudflare)
- File storage (AWS S3/R2)
- Payment gateway (Stripe/PayPal)

**Optional**:
- Analytics (Google Analytics)
- Error tracking (Sentry)
- Monitoring (Datadog)
- A/B testing (Optimizely)

---

## Kết thúc Non-Functional Requirements

Tài liệu này định nghĩa các yêu cầu phi chức năng cần đáp ứng để đảm bảo hệ thống VSTEPRO hoạt động ổn định, bảo mật và hiệu quả.
