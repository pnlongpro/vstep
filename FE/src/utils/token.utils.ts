const ACCESS_TOKEN_KEY = 'vstepro_access_token';
const REFRESH_TOKEN_KEY = 'vstepro_refresh_token';
const TOKEN_EXPIRY_KEY = 'vstepro_token_expiry';

export const tokenUtils = {
  /**
   * Get access token from storage
   */
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  /**
   * Get refresh token from storage
   */
  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  /**
   * Save tokens to storage
   */
  setTokens(accessToken: string, refreshToken: string, expiresIn: number): void {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    
    // Calculate and store expiry time
    const expiryTime = Date.now() + expiresIn * 1000;
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
  },

  /**
   * Clear all tokens
   */
  clearTokens(): void {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
  },

  /**
   * Check if token is expired or about to expire (within 1 minute)
   */
  isTokenExpired(): boolean {
    if (typeof window === 'undefined') return true;
    
    const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!expiryTime) return true;
    
    // Consider expired if less than 1 minute remaining
    return Date.now() > parseInt(expiryTime) - 60 * 1000;
  },

  /**
   * Check if user has valid tokens
   */
  hasValidTokens(): boolean {
    return !!this.getAccessToken() && !this.isTokenExpired();
  },

  /**
   * Decode JWT payload (without verification)
   */
  decodeToken(token: string): Record<string, any> | null {
    try {
      const base64Payload = token.split('.')[1];
      const payload = atob(base64Payload);
      return JSON.parse(payload);
    } catch {
      return null;
    }
  },
};
