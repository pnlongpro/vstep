# ✅ Authentication QA Checklist

**Phase**: 1 - MVP  
**Sprint**: 01-02  
**Focus**: Authentication & User Management

---

## 📋 Overview

Checklist để verify Sprint 01-02 Authentication hoàn thành đúng chuẩn.

**All items must pass before moving to Sprint 03-04!**

---

## 🔐 Security Checklist

### Password Security

- [ ] Passwords hashed với bcrypt (min cost factor 10)
- [ ] Passwords không được log
- [ ] Passwords không được return trong API responses
- [ ] Password reset tokens expire sau 1 hour
- [ ] Minimum password requirements enforced:
  - [ ] Min 8 characters
  - [ ] At least 1 uppercase
  - [ ] At least 1 lowercase
  - [ ] At least 1 number

### JWT Security

- [ ] JWT tokens signed với strong secret (min 32 chars)
- [ ] JWT tokens expire (max 7 days)
- [ ] Refresh tokens implemented (optional for Phase 1)
- [ ] Tokens không được stored in localStorage (security risk)
  - [ ] Use httpOnly cookies instead (or sessionStorage)
- [ ] Token verification works correctly

### API Security

- [ ] CORS configured correctly
- [ ] Rate limiting implemented (prevent brute force)
- [ ] SQL injection prevention (using Prisma ORM)
- [ ] XSS prevention (input sanitization)
- [ ] HTTPS only in production
- [ ] Environment variables secured:
  - [ ] .env.local in .gitignore
  - [ ] .env.example provided
  - [ ] No secrets in code

---

## 🧪 Functional Testing

### Registration Flow

- [ ] **Valid Registration**
  - [ ] User can register với valid data
  - [ ] Email confirmation sent (optional Phase 1)
  - [ ] User redirected to dashboard
  - [ ] User data saved in database
  - [ ] JWT token returned

- [ ] **Invalid Registration**
  - [ ] Duplicate email rejected
  - [ ] Invalid email format rejected
  - [ ] Weak password rejected
  - [ ] Password mismatch detected
  - [ ] Required fields validation
  - [ ] Clear error messages displayed

- [ ] **Edge Cases**
  - [ ] Email case-insensitive (test@example.com = TEST@example.com)
  - [ ] Whitespace trimmed from inputs
  - [ ] Special characters in name handled
  - [ ] Long inputs handled (max length validation)

### Login Flow

- [ ] **Valid Login**
  - [ ] User can login với valid credentials
  - [ ] JWT token returned
  - [ ] User data returned (no password!)
  - [ ] Redirected to correct dashboard based on role
  - [ ] "Remember me" works:
    - [ ] Checked: token in localStorage
    - [ ] Unchecked: token in sessionStorage

- [ ] **Invalid Login**
  - [ ] Wrong password rejected
  - [ ] Non-existent email rejected
  - [ ] Empty fields rejected
  - [ ] Generic error message (don't reveal if email exists)

- [ ] **Edge Cases**
  - [ ] Multiple failed attempts handled (rate limiting)
  - [ ] Case-insensitive email login
  - [ ] Whitespace handling
  - [ ] Account locked after X failed attempts (optional Phase 1)

### Logout Flow

- [ ] Token invalidated/removed
- [ ] User redirected to login page
- [ ] Protected routes inaccessible after logout
- [ ] Session cleared

### Protected Routes

- [ ] Unauthenticated users redirected to login
- [ ] Authenticated users can access protected routes
- [ ] Role-based access control works:
  - [ ] Student routes → Student only
  - [ ] Teacher routes → Teacher only
  - [ ] Admin routes → Admin only
- [ ] Invalid tokens rejected
- [ ] Expired tokens rejected

---

## 🎨 UI/UX Testing

### Login Page

- [ ] **Layout**
  - [ ] Centered on page
  - [ ] Logo/branding visible
  - [ ] Clear call-to-action
  - [ ] Link to register page
  - [ ] "Forgot password" link

- [ ] **Form Fields**
  - [ ] Email input with proper type
  - [ ] Password input masked
  - [ ] Password visibility toggle works
  - [ ] "Remember me" checkbox
  - [ ] All labels clear
  - [ ] Placeholders helpful

- [ ] **Validation**
  - [ ] Real-time validation feedback
  - [ ] Error messages clear và helpful
  - [ ] Success states shown
  - [ ] Field highlighting on error

- [ ] **Interactions**
  - [ ] Tab order logical
  - [ ] Enter key submits form
  - [ ] Submit button disabled during loading
  - [ ] Loading spinner shows
  - [ ] Focus states visible

### Register Page

- [ ] All login page checks +
- [ ] Password strength indicator
- [ ] Confirm password field
- [ ] Role selector (if applicable)
- [ ] Terms & conditions checkbox
- [ ] Privacy policy link

### Error States

- [ ] Network errors handled gracefully
- [ ] Server errors displayed clearly
- [ ] Validation errors inline
- [ ] Error messages in Vietnamese
- [ ] Error messages actionable (tell user what to do)

### Loading States

- [ ] Button shows spinner during submit
- [ ] Form disabled during submission
- [ ] Clear indication of progress
- [ ] Timeout handling (> 30s)

---

## 📱 Responsive Design

### Desktop (1360px+)

- [ ] Form centered và readable
- [ ] Appropriate spacing
- [ ] All elements visible
- [ ] No horizontal scroll

### Tablet (768px - 1359px)

- [ ] Form adapts to width
- [ ] Touch targets large enough (min 44px)
- [ ] All features accessible

### Mobile (< 768px)

- [ ] Single column layout
- [ ] Full-width form
- [ ] No text overflow
- [ ] Keyboard doesn't obstruct form
- [ ] Auto-zoom disabled on input focus

---

## ♿ Accessibility

### Keyboard Navigation

- [ ] All interactive elements focusable
- [ ] Tab order logical
- [ ] Focus indicators visible
- [ ] Enter/Space activate buttons
- [ ] Escape closes modals (if any)

### Screen Readers

- [ ] Form labels associated with inputs
- [ ] Error messages announced
- [ ] Loading states announced
- [ ] Success messages announced
- [ ] ARIA labels where needed

### Visual

- [ ] Color contrast ratio ≥ 4.5:1 (WCAG AA)
- [ ] Focus indicators clearly visible
- [ ] Error states not color-only
- [ ] Text resizable to 200%

---

## ⚡ Performance

### Page Load

- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] No render-blocking resources

### Form Submission

- [ ] API response < 1s (normal network)
- [ ] Perceived performance (loading feedback)
- [ ] No unnecessary re-renders

### Bundle Size

- [ ] Auth pages code-split
- [ ] Dependencies optimized
- [ ] No unused imports

---

## 🧪 API Testing

### Registration Endpoint

```bash
# Test valid registration
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@vstepro.com",
    "password": "Test123!",
    "fullName": "Test User",
    "role": "student"
  }'

# Expected: 201 Created + JWT token + user data
```

- [ ] Returns 201 on success
- [ ] Returns JWT token
- [ ] Returns user data (no password)
- [ ] Returns 400 for invalid data
- [ ] Returns 409 for duplicate email

### Login Endpoint

```bash
# Test valid login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@vstepro.com",
    "password": "Test123!"
  }'

# Expected: 200 OK + JWT token + user data
```

- [ ] Returns 200 on success
- [ ] Returns JWT token
- [ ] Returns user data (no password)
- [ ] Returns 401 for invalid credentials
- [ ] Returns 400 for missing fields

### Protected Endpoint

```bash
# Test with valid token
curl -X GET http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer <valid_token>"

# Expected: 200 OK + user data

# Test without token
curl -X GET http://localhost:8000/api/auth/me

# Expected: 401 Unauthorized
```

- [ ] Returns 200 with valid token
- [ ] Returns user data
- [ ] Returns 401 without token
- [ ] Returns 401 with invalid token
- [ ] Returns 401 with expired token

---

## 🗄️ Database Testing

### User Table

```sql
-- Verify user created
SELECT * FROM users WHERE email = 'test@vstepro.com';
```

- [ ] User record created
- [ ] Password hashed (not plaintext)
- [ ] Created_at timestamp set
- [ ] Updated_at timestamp set
- [ ] UUID generated correctly
- [ ] Email unique constraint works

### Data Integrity

- [ ] No duplicate emails possible
- [ ] Cascade deletes configured (if needed)
- [ ] Indexes on email field
- [ ] Default values applied

---

## 🔄 Edge Cases & Error Scenarios

### Network Issues

- [ ] Timeout handled (> 30s)
- [ ] Connection lost during request
- [ ] Server 500 error
- [ ] Server 503 (maintenance)

### Race Conditions

- [ ] Simultaneous registrations with same email
- [ ] Multiple login attempts
- [ ] Token refresh during request

### Data Corruption

- [ ] Missing required fields in response
- [ ] Malformed JSON response
- [ ] Unexpected data types

---

## 📊 Metrics

### Success Criteria

- [ ] Registration completion rate > 90%
- [ ] Login success rate > 95%
- [ ] Average registration time < 30s
- [ ] Average login time < 5s
- [ ] Error rate < 1%

### Performance Benchmarks

- [ ] API latency p95 < 500ms
- [ ] Database query time < 100ms
- [ ] Page load time < 2s
- [ ] Bundle size < 100KB (gzipped)

---

## 🚀 Pre-Production Checklist

### Code Quality

- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] All tests passing
- [ ] Code coverage > 80%
- [ ] No console.log() statements

### Security Audit

- [ ] All security items checked
- [ ] Penetration testing done (optional Phase 1)
- [ ] OWASP Top 10 vulnerabilities checked
- [ ] Dependencies audit clean (npm audit)

### Documentation

- [ ] API endpoints documented
- [ ] Environment variables documented
- [ ] Setup instructions clear
- [ ] Common issues documented

### Deployment

- [ ] Environment variables set
- [ ] Database migrations run
- [ ] HTTPS configured
- [ ] Monitoring setup
- [ ] Backup strategy in place

---

## ✍️ Sign-Off

### Backend Developer

- [ ] All backend tasks completed
- [ ] All API tests passing
- [ ] Database migrations tested
- [ ] Security review done

**Signed**: _____________ **Date**: _____________

### Frontend Developer

- [ ] All UI components completed
- [ ] All user flows tested
- [ ] Responsive design verified
- [ ] Accessibility checked

**Signed**: _____________ **Date**: _____________

### QA Engineer

- [ ] All test cases executed
- [ ] All critical bugs fixed
- [ ] Performance verified
- [ ] Ready for next sprint

**Signed**: _____________ **Date**: _____________

---

## 📝 Notes

### Known Issues

(List any known issues that are acceptable to defer to later sprints)

### Future Improvements

- [ ] Social login (Google, Facebook)
- [ ] Two-factor authentication (2FA)
- [ ] Email verification
- [ ] Password reset via email
- [ ] Account recovery
- [ ] Session management improvements

---

**Version**: 1.0.0  
**Last Updated**: December 21, 2024  
**Sprint 01-02 Status**: 🔴 Not Started
