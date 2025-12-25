# 🤖 AI Implementation Guide - VSTEPRO

## 📋 Tổng quan

Hệ thống tài liệu này được thiết kế để **AI (GitHub Copilot, Claude, ChatGPT, v.v.)** có thể:

✅ **Hiểu context** đầy đủ của dự án VSTEPRO  
✅ **Implement từng task** một cách chính xác và nhất quán  
✅ **Tự validate** kết quả theo acceptance criteria  
✅ **Handoff** giữa các AI sessions một cách mượt mà

---

## 🎯 Mục tiêu

### Cho AI Developer
- **Context đầy đủ**: Không cần đoán, mọi thứ đã documented
- **Step-by-step guide**: Từng task có hướng dẫn chi tiết
- **Validation built-in**: Tự check kết quả trước khi submit
- **Consistent output**: Follow conventions đã định sẵn

### Cho Human Developer
- **Review nhanh**: AI đã làm đúng pattern
- **Easy handoff**: Context preserved giữa sessions
- **Quality control**: QA checklist cho mỗi phase
- **Maintainable**: Dễ update khi requirements thay đổi

---

## 🚀 Quick Start

### Bước 1: Đọc Foundation (BẮT BUỘC)

```bash
1. 00_GLOBAL_RULES.md      # Luật chung cho mọi task
2. 01_PROJECT_CONTEXT.md   # Tech stack + conventions
```

⚠️ **Không được skip 2 file này!** Mọi task đều dựa trên foundation này.

### Bước 2: Chọn Phase

```bash
AI_IMPLEMENTATION/
├── PHASE_1_MVP/           # ← Bắt đầu đây (Authentication, Practice)
├── PHASE_2_AI_GRADING/    # ← Sau khi Phase 1 xong
└── PHASE_3_ENTERPRISE/    # ← Production features
```

### Bước 3: Follow Execution Order

Mỗi Phase có file `_EXECUTION_ORDER.md` chỉ rõ:
- Thứ tự implement các Sprint
- Dependencies giữa các task
- Timeline estimate

### Bước 4: Implement Task

Mỗi task file (VD: `BE-001_DB_CORE.md`) chứa:

```markdown
## Context
Giải thích tại sao cần task này

## Requirements
Yêu cầu chi tiết với acceptance criteria

## Implementation
Code mẫu + step-by-step guide

## Testing
Test cases cần cover

## Validation
Checklist để verify task done
```

### Bước 5: Quality Check

Sau khi hoàn thành Sprint, check với:
```bash
QA_REVIEW/
├── AUTH_QA.md          # Checklist cho Authentication
├── PRACTICE_QA.md      # Checklist cho Practice features
└── SECURITY_QA.md      # Security audit
```

---

## 📁 Cấu trúc Folder

```
AI_IMPLEMENTATION/
│
├── README.md                    # ← BẠN ĐANG Ở ĐÂY
├── 00_GLOBAL_RULES.md          # Luật chung (naming, structure, etc.)
├── 01_PROJECT_CONTEXT.md       # Tech stack, conventions, patterns
│
├── PHASE_1_MVP/                # 🎯 Core MVP features
│   ├── _EXECUTION_ORDER.md     # Thứ tự implement
│   │
│   ├── SPRINT_01_02_AUTH/      # Week 1-2: Authentication
│   │   ├── BE-001_DB_CORE.md
│   │   ├── BE-002_USER_ENTITY.md
│   │   ├── BE-003_AUTH_SERVICE.md
│   │   ├── BE-004_JWT_STRATEGY.md
│   │   ├── FE-001_AUTH_API.md
│   │   └── FE-002_LOGIN_PAGE.md
│   │
│   ├── SPRINT_03_04_PRACTICE/  # Week 3-4: Practice Features
│   │   ├── BE-010_EXERCISE_SCHEMA.md
│   │   ├── BE-011_READING_SERVICE.md
│   │   ├── BE-012_LISTENING_SERVICE.md
│   │   ├── BE-018_AUTO_GRADING_RL.md
│   │   ├── FE-010_READING_UI.md
│   │   └── FE-011_LISTENING_UI.md
│   │
│   └── SPRINT_05_06_RESULTS/   # Week 5-6: Results & History
│       ├── BE-020_RESULT_SCHEMA.md
│       ├── BE-021_SCORING_ENGINE.md
│       └── FE-020_RESULT_PAGE.md
│
├── PHASE_2_AI_GRADING/         # 🤖 AI-powered grading
│   ├── _AI_ARCHITECTURE.md
│   ├── AI-001_FASTAPI_SETUP.md
│   ├── AI-002_WRITING_GRADING.md
│   ├── AI-003_SPEAKING_GRADING.md
│   ├── AI-004_PROMPT_ENGINEERING.md
│   └── AI-007_SCORING_CRITERIA.md
│
├── PHASE_3_ENTERPRISE/         # 🏢 Enterprise features
│   ├── ADMIN/
│   │   ├── ADMIN-001_USER_MANAGEMENT.md
│   │   └── ADMIN-002_ANALYTICS.md
│   └── PAYMENT/
│       ├── PAY-001_STRIPE_INTEGRATION.md
│       └── PAY-002_SUBSCRIPTION.md
│
└── QA_REVIEW/                  # ✅ Quality assurance
    ├── AUTH_QA.md
    ├── PRACTICE_QA.md
    ├── AI_GRADING_QA.md
    └── SECURITY_QA.md
```

---

## 🎯 Quy tắc cho AI

### ✅ PHẢI làm

1. **Đọc 00_GLOBAL_RULES.md trước mọi task**
2. **Check dependencies** trong file task
3. **Follow code conventions** đã định sẵn
4. **Viết tests** cho mọi function
5. **Validate** với acceptance criteria
6. **Comment** logic phức tạp bằng tiếng Việt

### ❌ KHÔNG được

1. **KHÔNG** skip validation steps
2. **KHÔNG** hardcode credentials
3. **KHÔNG** tạo file ngoài scope
4. **KHÔNG** sửa code không liên quan
5. **KHÔNG** bỏ qua error handling
6. **KHÔNG** assume API responses

---

## 🔄 Workflow Pattern

### Chuẩn bị

```bash
1. Đọc 00_GLOBAL_RULES.md
2. Đọc 01_PROJECT_CONTEXT.md
3. Review current codebase state
```

### Implementation

```bash
1. Đọc task file (VD: BE-001_DB_CORE.md)
2. Check dependencies đã complete chưa
3. Follow implementation guide
4. Write code theo conventions
5. Add tests
6. Self-validate với checklist
```

### Handoff

```bash
1. Document changes made
2. List files modified
3. Note any blockers
4. Update task status
```

---

## 📊 Progress Tracking

### Task Status

| Status | Meaning | Icon |
|--------|---------|------|
| 🔴 Not Started | Chưa bắt đầu | 🔴 |
| 🟡 In Progress | Đang làm | 🟡 |
| 🟢 Completed | Đã xong | 🟢 |
| ⚠️ Blocked | Bị block bởi dependency | ⚠️ |
| 🔄 Needs Review | Cần review lại | 🔄 |

### Example

```markdown
## SPRINT_01_02_AUTH Status

- 🟢 BE-001_DB_CORE.md
- 🟢 BE-002_USER_ENTITY.md
- 🟡 BE-003_AUTH_SERVICE.md (In Progress)
- 🔴 BE-004_JWT_STRATEGY.md
- ⚠️ FE-001_AUTH_API.md (Blocked: waiting for BE-004)
- 🔴 FE-002_LOGIN_PAGE.md
```

---

## 🧪 Testing Strategy

### Unit Tests
- Test individual functions
- Mock external dependencies
- Cover edge cases

### Integration Tests
- Test API endpoints
- Test database operations
- Test service interactions

### E2E Tests
- Test user flows
- Test critical paths
- Test error scenarios

---

## 📚 Resources

### Documentation
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)

### VSTEPRO Specific
- Design System: `/docs/design/`
- API Docs: `/docs/api/`
- Component Library: `/docs/components/`

---

## 🤝 Contributing

### Updating Task Cards

Khi requirements thay đổi:

1. Update task file tương ứng
2. Update dependencies nếu cần
3. Update acceptance criteria
4. Notify affected tasks

### Adding New Tasks

Template cho task mới:

```markdown
# [TASK-ID] Task Title

## Context
Tại sao cần task này?

## Requirements
- Requirement 1
- Requirement 2

## Implementation
Step-by-step guide

## Testing
Test cases

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## Dependencies
- TASK-ID-1
- TASK-ID-2
```

---

## 🔧 Troubleshooting

### AI stuck ở một task?

1. Re-read task file
2. Check dependencies completed?
3. Review similar implementations
4. Check QA file for hints

### Code không compile?

1. Check TypeScript errors
2. Review imports
3. Verify types match
4. Check Global Rules

### Tests fail?

1. Review test cases trong task file
2. Check mock data
3. Verify API responses
4. Debug step-by-step

---

## 📞 Support

### For AI
- Check `/docs` for detailed documentation
- Review similar patterns in codebase
- Follow established conventions
- Ask for clarification in task comments

### For Humans
- Review AI output against acceptance criteria
- Check QA checklists
- Verify code follows Global Rules
- Test in development environment

---

## 🎓 Learning Path

### New to Project?

```
1. README.md (this file)          [15 min]
2. 00_GLOBAL_RULES.md             [20 min]
3. 01_PROJECT_CONTEXT.md          [30 min]
4. Browse PHASE_1_MVP structure   [15 min]
5. Read 1-2 task cards as example [20 min]
   
Total: ~1.5 hours to get started
```

### Ready to Implement?

```
1. Pick a task from SPRINT_01_02_AUTH
2. Follow the task file
3. Implement + test
4. Validate with checklist
5. Mark as complete
```

---

## 🎯 Success Criteria

### For AI Implementation

✅ **Code Quality**
- 0 TypeScript errors
- 0 ESLint warnings
- > 80% test coverage
- All acceptance criteria met

✅ **Consistency**
- Follows naming conventions
- Uses design system colors
- Matches existing patterns
- Proper file structure

✅ **Completeness**
- All requirements implemented
- Tests written and passing
- Error handling added
- Documentation updated

---

## 📅 Timeline

### Phase 1: MVP (6 weeks)
- Week 1-2: Authentication
- Week 3-4: Practice Features
- Week 5-6: Results & History

### Phase 2: AI Grading (4 weeks)
- Week 7-8: Writing/Speaking AI
- Week 9-10: Integration & Testing

### Phase 3: Enterprise (4 weeks)
- Week 11-12: Admin & Analytics
- Week 13-14: Payment & Deployment

---

## 🏆 Best Practices

### Code Organization
- One component per file
- Clear naming conventions
- Logical folder structure
- Consistent imports order

### Error Handling
- Try-catch for async operations
- User-friendly error messages
- Proper logging
- Graceful degradation

### Performance
- Memoize expensive operations
- Lazy load components
- Optimize re-renders
- Code splitting

### Security
- Never commit secrets
- Validate all inputs
- Sanitize user data
- Use environment variables

---

**Version**: 1.0.0  
**Last Updated**: December 21, 2024  
**Maintained by**: VSTEPRO Development Team

---

## 🚦 Getting Started Checklist

- [ ] Read this README
- [ ] Read 00_GLOBAL_RULES.md
- [ ] Read 01_PROJECT_CONTEXT.md
- [ ] Review PHASE_1_MVP/_EXECUTION_ORDER.md
- [ ] Pick first task to implement
- [ ] Set up development environment
- [ ] Ready to code! 🚀
