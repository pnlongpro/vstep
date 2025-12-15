export const ROLES = {
  STUDENT: "Student",
  TEACHER: "Teacher",
  ADMIN: "Admin",
  UPLOADER: "Uploader",
} as const;

export const ROLE_PERMISSIONS = {
  [ROLES.STUDENT]: [
    "practice.access",
    "exam.take",
    "chat.send",
    "profile.edit",
  ],
  [ROLES.TEACHER]: [
    "practice.access",
    "exam.take",
    "class.manage",
    "assignment.create",
    "student.view",
    "chat.send",
  ],
  [ROLES.ADMIN]: [
    "*", // All permissions
  ],
  [ROLES.UPLOADER]: [
    "exam.upload",
    "exam.edit_own",
    "question.create",
  ],
} as const;

export function hasPermission(userRole: string, permission: string): boolean {
  const permissions = ROLE_PERMISSIONS[userRole as keyof typeof ROLE_PERMISSIONS];
  if (!permissions) return false;
  
  return permissions.includes("*") || permissions.includes(permission);
}

export function canAccessRoute(userRole: string, route: string): boolean {
  if (route.startsWith("/admin")) {
    return userRole === ROLES.ADMIN;
  }
  
  if (route.startsWith("/teacher")) {
    return userRole === ROLES.TEACHER || userRole === ROLES.ADMIN;
  }
  
  return true;
}
