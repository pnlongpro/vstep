# ⚙️ Module 18: System Configuration

> **Module cấu hình hệ thống cho Admin**
> 
> File: `18-MODULE-SYSTEM-CONFIG.md`  
> Version: 1.0  
> Last Updated: 15/12/2024

---

## Giới thiệu

System Configuration cho phép Admin cấu hình:
- Platform settings
- Email templates
- Feature flags
- Payment settings
- AI/API configurations
- Security settings

---

## Configuration Sections

### 1. General Settings

```tsx
<GeneralSettings>
  <Section>
    <Title>Platform Information</Title>
    <Field>
      <Label>Platform Name</Label>
      <Input value="VSTEPRO" />
    </Field>
    <Field>
      <Label>Support Email</Label>
      <Input value="support@vstepro.com" />
    </Field>
    <Field>
      <Label>Timezone</Label>
      <Select value="Asia/Ho_Chi_Minh" />
    </Field>
  </Section>
  
  <Section>
    <Title>User Settings</Title>
    <Field>
      <Label>Free Trial Duration (days)</Label>
      <Input type="number" value={30} />
    </Field>
    <Field>
      <Label>Max Devices per User</Label>
      <Input type="number" value={3} />
    </Field>
    <Field>
      <Toggle checked>Allow Self Registration</Toggle>
    </Field>
    <Field>
      <Toggle checked>Require Email Verification</Toggle>
    </Field>
  </Section>
</GeneralSettings>
```

---

### 2. Feature Flags

```tsx
<FeatureFlags>
  <Title>Feature Flags</Title>
  
  <FeatureToggle>
    <Name>Mock Exam System</Name>
    <Toggle checked />
    <Description>Enable/disable mock exam feature</Description>
  </FeatureToggle>
  
  <FeatureToggle>
    <Name>AI Grading</Name>
    <Toggle checked />
    <Description>Use AI for writing/speaking grading</Description>
  </FeatureToggle>
  
  <FeatureToggle>
    <Name>Class System</Name>
    <Toggle checked />
    <Description>Enable class management</Description>
  </FeatureToggle>
  
  <FeatureToggle>
    <Name>Gamification</Name>
    <Toggle checked />
    <Description>Badges and achievements</Description>
  </FeatureToggle>
  
  <FeatureToggle>
    <Name>Social Features</Name>
    <Toggle />
    <Description>Friend list, leaderboards</Description>
  </FeatureToggle>
</FeatureFlags>
```

---

### 3. Email Settings

```tsx
<EmailSettings>
  <Section>
    <Title>SMTP Configuration</Title>
    <Field>
      <Label>SMTP Host</Label>
      <Input value="smtp.sendgrid.net" />
    </Field>
    <Field>
      <Label>SMTP Port</Label>
      <Input value={587} />
    </Field>
    <Field>
      <Label>From Email</Label>
      <Input value="noreply@vstepro.com" />
    </Field>
    <Field>
      <Label>From Name</Label>
      <Input value="VSTEPRO" />
    </Field>
  </Section>
  
  <Section>
    <Title>Email Templates</Title>
    <TemplateList>
      <Template>
        <Name>Welcome Email</Name>
        <Button>Edit</Button>
      </Template>
      <Template>
        <Name>Password Reset</Name>
        <Button>Edit</Button>
      </Template>
      <Template>
        <Name>Assignment Notification</Name>
        <Button>Edit</Button>
      </Template>
    </TemplateList>
  </Section>
</EmailSettings>
```

---

### 4. API Configuration

```tsx
<APIConfiguration>
  <Section>
    <Title>OpenAI API</Title>
    <Field>
      <Label>API Key</Label>
      <Input type="password" value="sk-..." />
      <Button>Test Connection</Button>
    </Field>
    <Field>
      <Label>Model</Label>
      <Select>
        <Option>gpt-4</Option>
        <Option selected>gpt-4-turbo</Option>
        <Option>gpt-3.5-turbo</Option>
      </Select>
    </Field>
    <Field>
      <Label>Monthly Budget ($)</Label>
      <Input type="number" value={1000} />
    </Field>
    <Field>
      <CurrentUsage>
        Current month: $245.50 / $1000
      </CurrentUsage>
    </Field>
  </Section>
  
  <Section>
    <Title>Payment Gateway</Title>
    <Field>
      <Label>Provider</Label>
      <Select>
        <Option selected>Stripe</Option>
        <Option>PayPal</Option>
        <Option>VNPay</Option>
      </Select>
    </Field>
    <Field>
      <Label>Public Key</Label>
      <Input value="pk_..." />
    </Field>
    <Field>
      <Label>Secret Key</Label>
      <Input type="password" value="sk_..." />
    </Field>
    <Field>
      <Toggle checked>Test Mode</Toggle>
    </Field>
  </Section>
</APIConfiguration>
```

---

### 5. Security Settings

```tsx
<SecuritySettings>
  <Section>
    <Title>Password Policy</Title>
    <Field>
      <Label>Minimum Length</Label>
      <Input type="number" value={8} />
    </Field>
    <Field>
      <Toggle checked>Require Uppercase</Toggle>
    </Field>
    <Field>
      <Toggle checked>Require Lowercase</Toggle>
    </Field>
    <Field>
      <Toggle checked>Require Number</Toggle>
    </Field>
    <Field>
      <Toggle checked>Require Special Character</Toggle>
    </Field>
  </Section>
  
  <Section>
    <Title>Session Management</Title>
    <Field>
      <Label>Access Token Expiry (minutes)</Label>
      <Input type="number" value={15} />
    </Field>
    <Field>
      <Label>Refresh Token Expiry (days)</Label>
      <Input type="number" value={30} />
    </Field>
    <Field>
      <Label>Session Timeout (minutes)</Label>
      <Input type="number" value={30} />
    </Field>
  </Section>
  
  <Section>
    <Title>Rate Limiting</Title>
    <Field>
      <Label>Login Attempts</Label>
      <Input type="number" value={5} />
      <Helper>per 15 minutes</Helper>
    </Field>
    <Field>
      <Label>API Requests</Label>
      <Input type="number" value={100} />
      <Helper>per minute</Helper>
    </Field>
  </Section>
</SecuritySettings>
```

---

### 6. Notification Settings

```tsx
<NotificationSettings>
  <Section>
    <Title>Default Notification Preferences</Title>
    <Field>
      <Toggle checked>Email Notifications</Toggle>
    </Field>
    <Field>
      <Toggle checked>In-App Notifications</Toggle>
    </Field>
    <Field>
      <Toggle>Push Notifications</Toggle>
    </Field>
  </Section>
  
  <Section>
    <Title>Notification Frequency</Title>
    <Field>
      <Label>Digest Email</Label>
      <Select>
        <Option>Never</Option>
        <Option selected>Daily</Option>
        <Option>Weekly</Option>
      </Select>
    </Field>
  </Section>
</NotificationSettings>
```

---

## Database Design

### Table: system_config

```sql
CREATE TABLE system_config (
  key VARCHAR(100) PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  category VARCHAR(50),
  updated_by UUID REFERENCES users(id),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Example records
INSERT INTO system_config (key, value, category) VALUES
('platform.name', '"VSTEPRO"', 'general'),
('platform.timezone', '"Asia/Ho_Chi_Minh"', 'general'),
('trial.duration_days', '30', 'user'),
('email.smtp_host', '"smtp.sendgrid.net"', 'email'),
('openai.api_key', '"sk-..."', 'api'),
('security.min_password_length', '8', 'security'),
('feature.mock_exam', 'true', 'features');
```

---

## API Endpoints

### GET /api/admin/config

Get all configurations

**Response**:
```json
{
  "general": {
    "platformName": "VSTEPRO",
    "timezone": "Asia/Ho_Chi_Minh"
  },
  "features": {
    "mockExam": true,
    "aiGrading": true
  },
  "security": {
    "minPasswordLength": 8,
    "requireUppercase": true
  }
}
```

### PUT /api/admin/config

Update configuration

**Request**:
```json
{
  "key": "trial.duration_days",
  "value": 30
}
```

---

## Configuration Management

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://...

# Redis
REDIS_URL=redis://...

# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_ORG_ID=org-...

# Email
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=...

# Payment
STRIPE_PUBLIC_KEY=pk_...
STRIPE_SECRET_KEY=sk_...

# Storage
AWS_S3_BUCKET=vstepro-uploads
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
```

### Config Validation

```typescript
function validateConfig(key: string, value: any): boolean {
  const validators = {
    'trial.duration_days': (v) => v >= 0 && v <= 90,
    'security.min_password_length': (v) => v >= 8 && v <= 32,
    'email.smtp_port': (v) => v > 0 && v <= 65535,
  };
  
  const validator = validators[key];
  return validator ? validator(value) : true;
}
```

---

## Kết thúc Module System Configuration

Tích hợp với tất cả modules để cấu hình behavior của hệ thống.
