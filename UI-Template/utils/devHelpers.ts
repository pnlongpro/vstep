/**
 * Development Helper Functions
 * These functions are for development and testing purposes only
 */

import { saveAuthState, clearAuthState, User } from './authService';

/**
 * Quick login for development/testing
 * Usage: In browser console, type: quickLogin('student')
 */
export function quickLogin(role: 'student' | 'teacher' | 'admin' | 'uploader' = 'student'): void {
  const mockUsers: Record<string, User> = {
    student: {
      id: 'dev_student_001',
      email: 'student@vstepro.com',
      fullName: 'Nguyễn Văn Student',
      phone: '0123456789',
      role: 'student',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    },
    teacher: {
      id: 'dev_teacher_001',
      email: 'teacher@vstepro.com',
      fullName: 'Nguyễn Văn Teacher',
      phone: '0123456788',
      role: 'teacher',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    },
    admin: {
      id: 'dev_admin_001',
      email: 'admin@vstepro.com',
      fullName: 'Nguyễn Văn Admin',
      phone: '0123456787',
      role: 'admin',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    },
    uploader: {
      id: 'dev_uploader_001',
      email: 'uploader@vstepro.com',
      fullName: 'Nguyễn Văn Uploader',
      phone: '0123456786',
      role: 'uploader',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    },
  };

  const user = mockUsers[role];
  const token = `dev_token_${role}_${Date.now()}`;
  
  saveAuthState(user, token);
  console.log(`✅ Quick login as ${role}:`, user);
  console.log('🔄 Reloading page...');
  window.location.reload();
}

/**
 * Quick logout for development/testing
 */
export function quickLogout(): void {
  clearAuthState();
  console.log('✅ Logged out successfully');
  console.log('🔄 Reloading page...');
  window.location.reload();
}

/**
 * Get current auth status
 */
export function getAuthStatus(): void {
  const token = localStorage.getItem('vstep_auth_token');
  const userStr = localStorage.getItem('vstep_user_data');
  
  if (token && userStr) {
    try {
      const user = JSON.parse(userStr);
      console.log('✅ Authenticated as:', user);
      console.log('📧 Email:', user.email);
      console.log('👤 Role:', user.role);
      console.log('🔑 Token:', token.substring(0, 20) + '...');
    } catch (error) {
      console.error('❌ Error reading auth data:', error);
    }
  } else {
    console.log('❌ Not authenticated');
  }
}

// Make functions available in browser console for development
if (typeof window !== 'undefined') {
  (window as any).quickLogin = quickLogin;
  (window as any).quickLogout = quickLogout;
  (window as any).getAuthStatus = getAuthStatus;
  
  console.log(`
🔧 VSTEPRO Dev Helper Functions:
  - quickLogin('student')   → Quick login as student
  - quickLogin('teacher')   → Quick login as teacher
  - quickLogin('admin')     → Quick login as admin
  - quickLogin('uploader')  → Quick login as uploader
  - quickLogout()           → Quick logout
  - getAuthStatus()         → Check current auth status
  `);
}
