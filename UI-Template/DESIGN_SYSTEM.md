# VSTEPRO Design System Guidelines

## 📋 Overview
Hệ thống design nhất quán cho toàn bộ VSTEPRO web application, đảm bảo spacing, typography, và layout consistency.

---

## 🎨 Color Palette

### Primary Colors
- **Blue (Primary)**: `#3B82F6` - Dùng cho CTA buttons, links, active states
- **Orange (Secondary)**: `#F97316` - Dùng cho highlights, warnings, notifications

### Neutral Colors
- White: `#FFFFFF`
- Gray 50: `#F9FAFB`
- Gray 100: `#F3F4F6`
- Gray 200: `#E5E7EB`
- Gray 600: `#4B5563`
- Gray 900: `#111827`

### Quy tắc:
✅ **CHẤP NHẬN**: Blue, Orange, Gray colors  
❌ **KHÔNG DÙNG**: Purple, Violet, Indigo, Pink, Rose, Emerald, Green, Teal, Cyan, Yellow, Lime, Sky, Fuchsia

---

## 📐 Layout & Container

### Container Widths
```tsx
import { LAYOUT } from '../constants/layout';

// Standard container (1280px max)
<div className={LAYOUT.CONTAINER}>  // max-w-7xl mx-auto px-6

// Narrow container (1024px max)
<div className={LAYOUT.CONTAINER_NARROW}>  // max-w-5xl mx-auto px-6

// Small container (768px max) - for forms/settings
<div className={LAYOUT.CONTAINER_SMALL}>  // max-w-3xl mx-auto px-6
```

### Page Wrapper
```tsx
import { getPageWrapper } from '../constants/layout';

// Full page with padding
<div className={getPageWrapper()}>  // max-w-7xl mx-auto px-6 py-8
  {/* content */}
</div>
```

---

## 📏 Spacing

### Section Spacing
```tsx
import { SPACING } from '../constants/layout';

// Vertical spacing between sections
<div className={SPACING.SECTION_GAP}>  // space-y-6 (24px)
<div className={SPACING.SECTION_GAP_LARGE}>  // space-y-8 (32px)
```

### Grid Gaps
```tsx
// Grid/Flex gaps
<div className="grid grid-cols-3 gap-6">  // SPACING.GRID_GAP
<div className="grid grid-cols-2 gap-4">  // SPACING.GRID_GAP_SMALL
```

### Card Padding
```tsx
// Standard card
<div className={SPACING.CARD_PADDING}>  // p-6 (24px)

// Large card
<div className={SPACING.CARD_PADDING_LARGE}>  // p-8 (32px)
```

---

## 🔤 Typography

### Headings
```tsx
import { HEADINGS } from '../constants/layout';

// Page Title (H1)
<h1 className={HEADINGS.PAGE_TITLE}>  
// text-3xl font-bold text-gray-900 mb-8

// Section Title (H2)
<h2 className={HEADINGS.SECTION_TITLE}>  
// text-2xl font-bold text-gray-900 mb-6

// Subsection Title (H3)
<h3 className={HEADINGS.SUBSECTION_TITLE}>  
// text-xl font-semibold text-gray-900 mb-4

// Card Title (H4)
<h4 className={HEADINGS.CARD_TITLE}>  
// text-lg font-semibold text-gray-900 mb-3
```

### ⚠️ Important Rules
- **KHÔNG tự custom** `text-2xl`, `text-3xl`, `font-bold`, `font-semibold` NGOẠI TRỪ khi sử dụng HEADINGS constants
- Tailwind default typography (`/styles/globals.css`) sẽ handle tất cả font sizing

---

## 🎯 Components

### Buttons
```tsx
import { getButtonPrimary, getButtonSecondary } from '../constants/layout';

// Primary button (Blue)
<button className={getButtonPrimary()}>
  Button Text
</button>

// Secondary button (Orange)
<button className={getButtonSecondary()}>
  Button Text
</button>

// Custom button with consistent height
<button className="bg-blue-600 hover:bg-blue-700 text-white h-10 px-6 rounded-lg">
  Custom
</button>
```

### Cards
```tsx
import { getCard } from '../constants/layout';

// Standard card
<div className={getCard()}>
  {/* content */}
</div>

// Custom card with border
<div className="bg-white rounded-lg p-6 shadow-sm border-2 border-blue-100">
  {/* content */}
</div>
```

---

## 📱 Page Structure Template

### Standard Page Layout
```tsx
import { getPageWrapper, HEADINGS, SPACING } from '../constants/layout';

export function MyPage() {
  return (
    <div className={getPageWrapper()}>  {/* Container + Padding */}
      {/* Page Title */}
      <h1 className={HEADINGS.PAGE_TITLE}>Page Title</h1>
      
      {/* Sections with consistent spacing */}
      <div className={SPACING.SECTION_GAP_LARGE}>
        {/* Section 1 */}
        <section>
          <h2 className={HEADINGS.SECTION_TITLE}>Section Title</h2>
          <div className="grid grid-cols-3 gap-6">
            {/* Cards */}
          </div>
        </section>
        
        {/* Section 2 */}
        <section>
          <h2 className={HEADINGS.SECTION_TITLE}>Another Section</h2>
          <div className="grid grid-cols-2 gap-6">
            {/* Cards */}
          </div>
        </section>
      </div>
    </div>
  );
}
```

---

## ✅ Best Practices

### DO ✅
1. **Always import layout constants** instead of hardcoding values
2. **Use semantic HTML**: `<section>`, `<article>`, `<header>`, `<main>`
3. **Consistent spacing**: Use `gap-6` (24px) or `gap-4` (16px) for grids
4. **Padding**: `px-6 py-8` for main page content
5. **Colors**: Stick to Blue (primary) và Orange (secondary) only

### DON'T ❌
1. **Don't hardcode** `max-w-7xl mx-auto px-6` → Use `LAYOUT.CONTAINER`
2. **Don't use** purple, violet, pink, emerald, etc. → Use blue/orange only
3. **Don't custom** font sizes without HEADINGS constants
4. **Don't mix** different spacing values in one section
5. **Don't create** inconsistent card padding

---

## 🔧 Migration Guide

### Step-by-step để convert existing pages:

#### 1. Import constants
```tsx
import { LAYOUT, SPACING, HEADINGS, getPageWrapper, getCard } from '../constants/layout';
```

#### 2. Replace container
```tsx
// Before
<div className="max-w-7xl mx-auto px-6 py-8">

// After
<div className={getPageWrapper()}>
```

#### 3. Replace headings
```tsx
// Before
<h1 className="text-3xl font-bold mb-8">Title</h1>

// After
<h1 className={HEADINGS.PAGE_TITLE}>Title</h1>
```

#### 4. Replace section spacing
```tsx
// Before
<div className="space-y-8">

// After
<div className={SPACING.SECTION_GAP_LARGE}>
```

#### 5. Replace grid gaps
```tsx
// Before
<div className="grid grid-cols-3 gap-6">

// After
<div className={`grid grid-cols-3 ${SPACING.GRID_GAP}`}>
```

#### 6. Update colors
```tsx
// Before
className="bg-purple-600 hover:bg-purple-700"
className="text-violet-600"
className="border-indigo-200"

// After
className="bg-blue-600 hover:bg-blue-700"
className="text-blue-600"
className="border-blue-200"
```

---

## 📊 Checklist

Trước khi commit, kiểm tra:
- [ ] Đã import layout constants?
- [ ] Đã dùng `getPageWrapper()` cho page container?
- [ ] Đã dùng `HEADINGS.*` cho tất cả headings?
- [ ] Đã dùng `SPACING.*` cho section gaps?
- [ ] Đã thay thế TẤT CẢ màu cũ (purple, violet, etc.) → Blue/Orange?
- [ ] Grid gaps nhất quán (gap-6 hoặc gap-4)?
- [ ] Card padding nhất quán (p-6 hoặc p-8)?

---

## 🎓 Examples

Các pages đã được convert thành công:
- ✅ `/components/PracticeHome.tsx` - Student dashboard
- ✅ `/App.tsx` - Main layout with footer
- ✅ `/components/Footer.tsx` - Footer component

Tham khảo các file này để hiểu cách áp dụng design system!
