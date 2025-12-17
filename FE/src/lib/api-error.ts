export interface ApiErrorResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
}

export class ApiError extends Error {
  public statusCode: number;
  public errors: string[];

  constructor(response: ApiErrorResponse) {
    const message = Array.isArray(response.message)
      ? response.message[0]
      : response.message;
    
    super(message);
    this.name = 'ApiError';
    this.statusCode = response.statusCode;
    this.errors = Array.isArray(response.message)
      ? response.message
      : [response.message];
  }

  /**
   * Check if error is authentication error
   */
  isAuthError(): boolean {
    return this.statusCode === 401;
  }

  /**
   * Check if error is forbidden
   */
  isForbidden(): boolean {
    return this.statusCode === 403;
  }

  /**
   * Check if error is validation error
   */
  isValidationError(): boolean {
    return this.statusCode === 400;
  }

  /**
   * Check if error is not found
   */
  isNotFound(): boolean {
    return this.statusCode === 404;
  }

  /**
   * Check if error is rate limit
   */
  isRateLimited(): boolean {
    return this.statusCode === 429;
  }

  /**
   * Check if error is conflict (duplicate)
   */
  isConflict(): boolean {
    return this.statusCode === 409;
  }
}

/**
 * Helper to extract ApiError from axios error
 */
export function extractApiError(error: any): ApiError {
  if (error?.response?.data) {
    return new ApiError(error.response.data);
  }
  
  if (error instanceof ApiError) {
    return error;
  }
  
  return new ApiError({
    statusCode: 0,
    message: error?.message || 'Network error. Please check your connection.',
  });
}
