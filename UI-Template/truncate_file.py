#!/usr/bin/env python3
# Script to truncate FreePlanDashboard.tsx at line 1153

with open('/components/FreePlanDashboard.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Keep only first 1153 lines
with open('/components/FreePlanDashboard.tsx', 'w', encoding='utf-8') as f:
    f.writelines(lines[:1153])

print("✅ File truncated successfully at line 1153!")
