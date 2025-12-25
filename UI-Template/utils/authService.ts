// Authentication Service for VSTEPRO

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: 'student' | 'teacher' | 'admin' | 'uploader';
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

// Local Storage Keys
const AUTH_STORAGE_KEY = 'vstep_auth_state';
const USER_STORAGE_KEY = 'vstep_user_data';
const TOKEN_STORAGE_KEY = 'vstep_auth_token';

/**
 * Get current authentication state
 */
export function getAuthState(): AuthState {
  try {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    const userStr = localStorage.getItem(USER_STORAGE_KEY);
    
    if (token && userStr) {
      const user = JSON.parse(userStr);
      return {
        isAuthenticated: true,
        user,
        token,
      };
    }
  } catch (error) {
    console.error('Error reading auth state:', error);
  }

  return {
    isAuthenticated: false,
    user: null,
    token: null,
  };
}

/**
 * Save authentication state
 */
export function saveAuthState(user: User, token: string): void {
  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    localStorage.setItem(AUTH_STORAGE_KEY, 'true');
  } catch (error) {
    console.error('Error saving auth state:', error);
  }
}

/**
 * Clear authentication state (logout)
 */
export function clearAuthState(): void {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing auth state:', error);
  }
}

/**
 * Login user
 */
export async function login(email: string, password: string): Promise<{ user: User; token: string }> {
  // TODO: Replace with actual API call
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock validation
  if (!email || !password) {
    throw new Error('Email và mật khẩu không được để trống');
  }

  // Mock user data based on email
  let role: User['role'] = 'student';
  if (email.includes('admin')) role = 'admin';
  else if (email.includes('teacher')) role = 'teacher';
  else if (email.includes('uploader')) role = 'uploader';

  const user: User = {
    id: `user_${Date.now()}`,
    email,
    fullName: email.split('@')[0],
    role,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  };

  const token = `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Save to localStorage
  saveAuthState(user, token);

  return { user, token };
}

/**
 * Register new user
 */
export async function register(data: {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}): Promise<{ user: User; token: string }> {
  // TODO: Replace with actual API call
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock validation
  if (!data.email || !data.password || !data.fullName) {
    throw new Error('Vui lòng điền đầy đủ thông tin');
  }

  // Check if email already exists (mock check)
  const existingUser = localStorage.getItem(`user_${data.email}`);
  if (existingUser) {
    throw new Error('Email đã được đăng ký');
  }

  const user: User = {
    id: `user_${Date.now()}`,
    email: data.email,
    fullName: data.fullName,
    phone: data.phone,
    role: 'student', // Default role
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  };

  const token = `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Save user data
  localStorage.setItem(`user_${data.email}`, JSON.stringify(user));
  saveAuthState(user, token);

  return { user, token };
}

/**
 * Logout user
 */
export function logout(): void {
  clearAuthState();
  
  // Optional: Clear other app-specific data
  // localStorage.removeItem('vstep_practice_state');
  // etc.
}

/**
 * Request password reset
 */
export async function requestPasswordReset(email: string): Promise<void> {
  // TODO: Replace with actual API call
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (!email) {
    throw new Error('Vui lòng nhập email');
  }

  // Mock check if email exists
  // In real app, this would send an email
  console.log(`Password reset email sent to: ${email}`);
}

/**
 * Reset password with token
 */
export async function resetPassword(token: string, newPassword: string): Promise<void> {
  // TODO: Replace with actual API call
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (!token || !newPassword) {
    throw new Error('Token và mật khẩu mới không được để trống');
  }

  // Mock password reset
  console.log('Password reset successful');
}

/**
 * Update user profile
 */
export async function updateProfile(userId: string, updates: Partial<User>): Promise<User> {
  // TODO: Replace with actual API call
  await new Promise(resolve => setTimeout(resolve, 500));

  const authState = getAuthState();
  if (!authState.user) {
    throw new Error('User not authenticated');
  }

  const updatedUser: User = {
    ...authState.user,
    ...updates,
  };

  // Save updated user
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));

  return updatedUser;
}

/**
 * Change password
 */
export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<void> {
  // TODO: Replace with actual API call
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (!currentPassword || !newPassword) {
    throw new Error('Vui lòng nhập đầy đủ thông tin');
  }

  // Mock validation
  console.log('Password changed successfully');
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  const authState = getAuthState();
  return authState.isAuthenticated;
}

/**
 * Get current user
 */
export function getCurrentUser(): User | null {
  const authState = getAuthState();
  return authState.user;
}

/**
 * Get auth token
 */
export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}
