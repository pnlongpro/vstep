import { HttpException } from '@nestjs/common';
import { ErrorCode, ErrorCodes } from './error-codes';

/**
 * Application Exception - Custom exception with error codes
 * Used for standardized error responses across the application
 */
export class ApplicationException extends HttpException {
  public readonly errorCode: string;

  constructor(
    errorCode: ErrorCode,
    message?: string,
    public readonly details?: any,
  ) {
    const responseBody = {
      code: errorCode.code,
      statusCode: errorCode.status,
      message: message || errorCode.code,
      details: details || null,
    };

    super(responseBody, errorCode.status);
    this.errorCode = errorCode.code;
  }

  /**
   * Get the error code
   */
  getErrorCode(): string {
    return this.errorCode;
  }

  // ==================== STATIC FACTORY METHODS ====================

  // Auth errors
  static invalidCredentials(): ApplicationException {
    return new ApplicationException(ErrorCodes.AUTH_INVALID_CREDENTIALS);
  }

  static accountSuspended(): ApplicationException {
    return new ApplicationException(ErrorCodes.AUTH_ACCOUNT_SUSPENDED);
  }

  static accountInactive(): ApplicationException {
    return new ApplicationException(ErrorCodes.AUTH_ACCOUNT_INACTIVE);
  }

  static emailExists(email?: string): ApplicationException {
    return new ApplicationException(
      ErrorCodes.AUTH_EMAIL_EXISTS,
      undefined,
      email ? { email } : undefined,
    );
  }

  static sessionExpired(): ApplicationException {
    return new ApplicationException(ErrorCodes.AUTH_SESSION_EXPIRED);
  }

  static sessionRevoked(): ApplicationException {
    return new ApplicationException(ErrorCodes.AUTH_SESSION_REVOKED);
  }

  static deviceLimitReached(limit: number, current: number): ApplicationException {
    return new ApplicationException(
      ErrorCodes.AUTH_DEVICE_LIMIT_REACHED,
      undefined,
      { limit, current },
    );
  }

  static tokenInvalid(): ApplicationException {
    return new ApplicationException(ErrorCodes.AUTH_TOKEN_INVALID);
  }

  static tokenExpired(): ApplicationException {
    return new ApplicationException(ErrorCodes.AUTH_TOKEN_EXPIRED);
  }

  static refreshTokenInvalid(): ApplicationException {
    return new ApplicationException(ErrorCodes.AUTH_REFRESH_TOKEN_INVALID);
  }

  static refreshTokenExpired(): ApplicationException {
    return new ApplicationException(ErrorCodes.AUTH_REFRESH_TOKEN_EXPIRED);
  }

  // User errors
  static userNotFound(userId?: string): ApplicationException {
    return new ApplicationException(
      ErrorCodes.USER_NOT_FOUND,
      undefined,
      userId ? { userId } : undefined,
    );
  }

  // Admin errors
  static adminUserNotFound(userId?: string): ApplicationException {
    return new ApplicationException(
      ErrorCodes.ADMIN_USER_NOT_FOUND,
      undefined,
      userId ? { userId } : undefined,
    );
  }

  static adminSessionNotFound(): ApplicationException {
    return new ApplicationException(ErrorCodes.ADMIN_SESSION_NOT_FOUND);
  }

  static adminRoleNotFound(roleName?: string): ApplicationException {
    return new ApplicationException(
      ErrorCodes.ADMIN_ROLE_NOT_FOUND,
      undefined,
      roleName ? { roleName } : undefined,
    );
  }

  // Exam errors
  static examNotFound(examId?: string): ApplicationException {
    return new ApplicationException(
      ErrorCodes.EXAM_NOT_FOUND,
      undefined,
      examId ? { examId } : undefined,
    );
  }

  static examAccessDenied(): ApplicationException {
    return new ApplicationException(ErrorCodes.EXAM_ACCESS_DENIED);
  }

  // General errors
  static notFound(resource?: string): ApplicationException {
    return new ApplicationException(
      ErrorCodes.NOT_FOUND,
      undefined,
      resource ? { resource } : undefined,
    );
  }

  static forbidden(reason?: string): ApplicationException {
    return new ApplicationException(
      ErrorCodes.FORBIDDEN,
      reason,
    );
  }

  static unauthorized(reason?: string): ApplicationException {
    return new ApplicationException(
      ErrorCodes.UNAUTHORIZED,
      reason,
    );
  }

  static validationError(errors: any): ApplicationException {
    return new ApplicationException(
      ErrorCodes.VALIDATION_ERROR,
      undefined,
      errors,
    );
  }

  static internalError(message?: string): ApplicationException {
    return new ApplicationException(
      ErrorCodes.INTERNAL_SERVER_ERROR,
      message,
    );
  }
}
