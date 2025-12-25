# Internationalization (i18n) Guide

Hướng dẫn sử dụng đa ngôn ngữ trong dự án VSTEP Frontend.

## Setup Overview

Dự án sử dụng thư viện `next-intl` để hỗ trợ đa ngôn ngữ.

### Cấu hình

- **Supported locales**: `vi` (Tiếng Việt - default), `en` (English)
- **Locale files**: `src/locales/vi.json`, `src/locales/en.json`
- **Configuration**: `src/i18n.ts`
- **Locale cookie**: `NEXT_LOCALE`

## Sử dụng trong Components

### 1. Client Components

```tsx
'use client';

import { useTranslations } from 'next-intl';

export function MyComponent() {
  const t = useTranslations('common');
  
  return (
    <button>{t('save')}</button>
  );
}
```

### 2. Nested Translations

```tsx
const t = useTranslations('admin.users');

// Truy cập: admin.users.title
t('title');

// Truy cập: admin.users.status.active
t('status.active');
```

### 3. Multiple Namespaces

```tsx
const tCommon = useTranslations('common');
const tErrors = useTranslations('errors');
const tNav = useTranslations('nav');

return (
  <>
    <nav>{tNav('home')}</nav>
    <button>{tCommon('save')}</button>
    {error && <span>{tErrors(errorCode)}</span>}
  </>
);
```

### 4. Interpolation (Variables)

```json
{
  "deviceLimit": {
    "slotsRemaining": "{count} slots remaining"
  }
}
```

```tsx
t('deviceLimit.slotsRemaining', { count: 2 });
// Output: "2 slots remaining"
```

## Chuyển đổi ngôn ngữ

### Sử dụng LanguageSwitcher Component

```tsx
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export function Header() {
  return (
    <header>
      {/* ... */}
      <LanguageSwitcher />
    </header>
  );
}
```

### Programmatic Language Change

```tsx
import { setLocale } from '@/lib/locale';

// In a server action or server component
await setLocale('en');
```

## Error Messages với i18n

### Sử dụng useApiError Hook

```tsx
import { useApiError } from '@/hooks/useApiError';

function MyComponent() {
  const { handleError, getErrorMessage } = useApiError();
  
  const submitForm = async () => {
    try {
      await api.post('/data', formData);
    } catch (error) {
      handleError(error); // Tự động hiển thị toast với message đã translate
    }
  };
}
```

### Sử dụng useErrorMessage Hook

```tsx
import { useErrorMessage } from '@/hooks/useErrorMessage';

function ErrorDisplay({ code }: { code: string }) {
  const { getErrorMessage } = useErrorMessage();
  
  return <p className="text-red-500">{getErrorMessage(code)}</p>;
}
```

## Structure của Locale Files

```json
{
  "common": {
    "loading": "Loading...",
    "save": "Save",
    "cancel": "Cancel"
  },
  "auth": {
    "login": "Sign In",
    "logout": "Sign Out"
  },
  "nav": {
    "home": "Home",
    "dashboard": "Dashboard"
  },
  "skills": {
    "reading": "Reading",
    "listening": "Listening"
  },
  "levels": {
    "a1": "A1 - Beginner",
    "b1": "B1 - Intermediate"
  },
  "admin": {
    "users": {
      "title": "User Management",
      "status": {
        "active": "Active",
        "inactive": "Inactive"
      }
    }
  },
  "errors": {
    "default": "An error occurred. Please try again.",
    "AUTH_INVALID_CREDENTIALS": "Invalid email or password."
  },
  "messages": {
    "success": {
      "saved": "Saved successfully"
    },
    "confirm": {
      "delete": "Are you sure you want to delete?"
    }
  }
}
```

## Thêm Translation Mới

1. **Thêm vào cả 2 file**: `src/locales/vi.json` và `src/locales/en.json`
2. **Giữ cùng cấu trúc key** trong cả 2 file
3. **Sử dụng nested objects** để tổ chức theo module/feature

### Ví dụ thêm translation cho feature mới:

```json
// vi.json
{
  "myFeature": {
    "title": "Tính năng mới",
    "description": "Mô tả tính năng",
    "actions": {
      "start": "Bắt đầu",
      "stop": "Dừng"
    }
  }
}

// en.json
{
  "myFeature": {
    "title": "New Feature",
    "description": "Feature description",
    "actions": {
      "start": "Start",
      "stop": "Stop"
    }
  }
}
```

## Best Practices

1. **Luôn sử dụng namespace rõ ràng**: `useTranslations('admin.users')` thay vì `useTranslations()`
2. **Không hardcode text** trong components - luôn dùng translations
3. **Đặt tên key có ý nghĩa**: `saveButton` thay vì `btn1`
4. **Group theo feature/module**: `admin.users.title`, `admin.settings.title`
5. **Error codes khớp với backend**: `AUTH_INVALID_CREDENTIALS` phải giống backend
