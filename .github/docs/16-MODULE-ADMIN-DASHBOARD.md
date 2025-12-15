# 🔐 Module 16: Admin Dashboard

> **Dashboard trang chủ cho quản trị viên**
> 
> File: `16-MODULE-ADMIN-DASHBOARD.md`  
> Version: 1.0  
> Last Updated: 15/12/2024

---

## 📑 Mục lục

- [1. Giới thiệu module](#1-giới-thiệu-module)
- [2. Dashboard Components](#2-dashboard-components)
- [3. System Analytics](#3-system-analytics)

---

## 1. Giới thiệu module

### 1.1. Mục đích
Admin Dashboard cung cấp:
- System-wide overview
- User management summary
- Content moderation
- Platform health monitoring
- Revenue analytics (if applicable)
- Quick admin actions

### 1.2. Key Metrics

**User Metrics**:
- Total users
- New registrations (daily/weekly/monthly)
- Active users (DAU/MAU)
- User retention rate
- Churn rate

**Content Metrics**:
- Total exercises
- Pending approval
- User-generated content
- Popular content

**Platform Health**:
- System uptime
- API response time
- Error rate
- Database performance

**Revenue Metrics** (if applicable):
- Total revenue
- Premium subscribers
- Conversion rate
- MRR (Monthly Recurring Revenue)

---

## 2. Dashboard Components

### 2.1. System Overview

```tsx
<SystemOverview>
  <Header>System Overview</Header>
  
  <MetricsGrid>
    <MetricCard highlight>
      <Icon>👥</Icon>
      <Value>12,456</Value>
      <Label>Total Users</Label>
      <Trend up>+234 this month</Trend>
    </MetricCard>
    
    <MetricCard>
      <Icon>📚</Icon>
      <Value>1,234</Value>
      <Label>Total Exercises</Label>
      <Trend>+45 this week</Trend>
    </MetricCard>
    
    <MetricCard>
      <Icon>👨‍🏫</Icon>
      <Value>456</Value>
      <Label>Teachers</Label>
      <Trend up>+12 this month</Trend>
    </MetricCard>
    
    <MetricCard>
      <Icon>🎓</Icon>
      <Value>234</Value>
      <Label>Active Classes</Label>
      <Trend>+8 this week</Trend>
    </MetricCard>
  </MetricsGrid>
</SystemOverview>
```

---

### 2.2. User Activity

```tsx
<UserActivity>
  <Header>User Activity (Last 7 Days)</Header>
  
  <Chart>
    <LineChart>
      <Line name="Daily Active Users" data={dauData} />
      <Line name="New Registrations" data={newUsersData} />
    </LineChart>
  </Chart>
  
  <Summary>
    <Stat>
      <Label>DAU</Label>
      <Value>3,456</Value>
      <Change up>+12%</Change>
    </Stat>
    <Stat>
      <Label>WAU</Label>
      <Value>8,234</Value>
      <Change up>+8%</Change>
    </Stat>
    <Stat>
      <Label>MAU</Label>
      <Value>11,234</Value>
      <Change up>+15%</Change>
    </Stat>
  </Summary>
</UserActivity>
```

---

### 2.3. Pending Actions

```tsx
<PendingActions>
  <Header>⚠️ Requires Attention</Header>
  
  <ActionList>
    <ActionItem urgent priority="high">
      <Icon>📝</Icon>
      <Content>
        <Title>Exam Approval</Title>
        <Description>12 exams pending approval</Description>
      </Content>
      <Button>Review</Button>
    </ActionItem>
    
    <ActionItem priority="medium">
      <Icon>🚨</Icon>
      <Content>
        <Title>User Reports</Title>
        <Description>5 reports to review</Description>
      </Content>
      <Button>View</Button>
    </ActionItem>
    
    <ActionItem priority="low">
      <Icon>💬</Icon>
      <Content>
        <Title>Support Tickets</Title>
        <Description>8 open tickets</Description>
      </Content>
      <Button>Manage</Button>
    </ActionItem>
  </ActionList>
</PendingActions>
```

---

### 2.4. Content Overview

```tsx
<ContentOverview>
  <Header>📚 Content Management</Header>
  
  <ContentStats>
    <Stat>
      <Label>Total Exercises</Label>
      <Value>1,234</Value>
      <Breakdown>
        <Item>Reading: 456</Item>
        <Item>Listening: 345</Item>
        <Item>Writing: 234</Item>
        <Item>Speaking: 199</Item>
      </Breakdown>
    </Stat>
    
    <Stat>
      <Label>Pending Approval</Label>
      <Value warning>12</Value>
      <Link>Review now →</Link>
    </Stat>
    
    <Stat>
      <Label>Quality Score</Label>
      <Value>4.6/5.0</Value>
      <Progress value={92} />
    </Stat>
  </ContentStats>
</ContentOverview>
```

---

### 2.5. Platform Health

```tsx
<PlatformHealth>
  <Header>🏥 Platform Health</Header>
  
  <HealthMetrics>
    <Metric status="good">
      <Label>System Uptime</Label>
      <Value>99.98%</Value>
      <Icon check />
    </Metric>
    
    <Metric status="good">
      <Label>API Response Time</Label>
      <Value>245ms</Value>
      <Threshold>Target: &lt;500ms</Threshold>
    </Metric>
    
    <Metric status="warning">
      <Label>Error Rate</Label>
      <Value>0.12%</Value>
      <Threshold>Target: &lt;0.1%</Threshold>
    </Metric>
    
    <Metric status="good">
      <Label>Database Performance</Label>
      <Value>Good</Value>
      <Details>Avg query: 85ms</Details>
    </Metric>
  </HealthMetrics>
  
  <ViewDetails>
    <Link>View detailed metrics →</Link>
  </ViewDetails>
</PlatformHealth>
```

---

### 2.6. Revenue Dashboard (Optional)

```tsx
<RevenueDashboard>
  <Header>💰 Revenue Overview</Header>
  
  <RevenueMetrics>
    <MetricCard highlight>
      <Label>Total Revenue</Label>
      <Value>$45,678</Value>
      <Change up>+12% vs last month</Change>
    </MetricCard>
    
    <MetricCard>
      <Label>MRR</Label>
      <Value>$12,345</Value>
      <Change up>+8%</Change>
    </MetricCard>
    
    <MetricCard>
      <Label>Premium Users</Label>
      <Value>1,234</Value>
      <Percentage>9.9% of total</Percentage>
    </MetricCard>
    
    <MetricCard>
      <Label>Conversion Rate</Label>
      <Value>3.2%</Value>
      <Change down>-0.3%</Change>
    </MetricCard>
  </RevenueMetrics>
  
  <RevenueChart>
    <BarChart data={monthlyRevenue} />
  </RevenueChart>
</RevenueDashboard>
```

---

### 2.7. Recent Admin Actions

```tsx
<RecentActions>
  <Header>📋 Recent Admin Actions</Header>
  
  <ActionLog>
    <LogEntry>
      <Admin>Admin John</Admin>
      <Action>approved exam "Reading Test B2"</Action>
      <Time>5 minutes ago</Time>
    </LogEntry>
    
    <LogEntry>
      <Admin>Admin Jane</Admin>
      <Action>suspended user account</Action>
      <Target>user@example.com</Target>
      <Time>30 minutes ago</Time>
    </LogEntry>
    
    <LogEntry>
      <Admin>Admin Mike</Admin>
      <Action>created new teacher account</Action>
      <Time>2 hours ago</Time>
    </LogEntry>
  </ActionLog>
  
  <ViewAll>View full activity log →</ViewAll>
</RecentActions>
```

---

### 2.8. Quick Admin Actions

```tsx
<QuickActions>
  <Title>Quick Actions</Title>
  
  <ActionGrid>
    <Action>
      <Icon>👥</Icon>
      <Label>Manage Users</Label>
      <Link>/admin/users</Link>
    </Action>
    
    <Action>
      <Icon>📝</Icon>
      <Label>Approve Exams</Label>
      <Badge>12</Badge>
      <Link>/admin/exam-approval</Link>
    </Action>
    
    <Action>
      <Icon>👨‍🏫</Icon>
      <Label>Manage Teachers</Label>
      <Link>/admin/teachers</Link>
    </Action>
    
    <Action>
      <Icon>🔧</Icon>
      <Label>System Config</Label>
      <Link>/admin/settings</Link>
    </Action>
    
    <Action>
      <Icon>📊</Icon>
      <Label>View Reports</Label>
      <Link>/admin/reports</Link>
    </Action>
    
    <Action>
      <Icon>💬</Icon>
      <Label>Support Tickets</Label>
      <Badge>8</Badge>
      <Link>/admin/support</Link>
    </Action>
  </ActionGrid>
</QuickActions>
```

---

## 3. System Analytics

### 3.1. User Growth Chart

```tsx
<UserGrowthChart>
  <Header>User Growth Trend</Header>
  <TimeRangeSelector>
    <Option>Last 7 days</Option>
    <Option>Last 30 days</Option>
    <Option selected>Last 3 months</Option>
    <Option>Last year</Option>
  </TimeRangeSelector>
  
  <Chart>
    <AreaChart data={userGrowthData}>
      <Area name="Total Users" fill="blue" />
      <Area name="Premium Users" fill="gold" />
    </AreaChart>
  </Chart>
</UserGrowthChart>
```

---

### 3.2. Engagement Metrics

```tsx
<EngagementMetrics>
  <Header>User Engagement</Header>
  
  <MetricsGrid>
    <Metric>
      <Label>Avg Session Duration</Label>
      <Value>24 minutes</Value>
      <Trend up>+3 min</Trend>
    </Metric>
    
    <Metric>
      <Label>Pages per Session</Label>
      <Value>8.5</Value>
      <Trend up>+0.8</Trend>
    </Metric>
    
    <Metric>
      <Label>Bounce Rate</Label>
      <Value>32%</Value>
      <Trend down>-5%</Trend>
    </Metric>
    
    <Metric>
      <Label>Retention Rate (30d)</Label>
      <Value>68%</Value>
      <Trend up>+4%</Trend>
    </Metric>
  </MetricsGrid>
</EngagementMetrics>
```

---

## API Endpoints

### GET /api/dashboard/admin

**Request**:
```typescript
GET /api/dashboard/admin
Authorization: Bearer {admin_token}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalUsers": 12456,
      "totalExercises": 1234,
      "totalTeachers": 456,
      "activeClasses": 234,
      "trends": {
        "usersThisMonth": 234,
        "exercisesThisWeek": 45
      }
    },
    "userActivity": {
      "dau": 3456,
      "wau": 8234,
      "mau": 11234,
      "dailyStats": [
        { "date": "2024-12-15", "dau": 3456, "newUsers": 45 }
      ]
    },
    "pendingActions": {
      "examApprovals": 12,
      "userReports": 5,
      "supportTickets": 8
    },
    "platformHealth": {
      "uptime": 99.98,
      "apiResponseTime": 245,
      "errorRate": 0.12,
      "dbPerformance": "good"
    },
    "revenue": {
      "totalRevenue": 45678,
      "mrr": 12345,
      "premiumUsers": 1234,
      "conversionRate": 3.2
    },
    "recentActions": [
      {
        "admin": "John Doe",
        "action": "approved exam",
        "target": "Reading Test B2",
        "timestamp": "2024-12-15T10:00:00Z"
      }
    ]
  }
}
```

---

## Kết thúc Module Admin Dashboard

Dashboard cung cấp cái nhìn tổng quan về toàn bộ hệ thống cho quản trị viên.
