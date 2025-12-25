/**
 * Error Codes from Backend
 * These codes match the backend error codes in BE/src/common/exceptions/error-codes.ts
 */

// Error message mapping (Vietnamese)
export const ErrorMessages: Record<string, string> = {
  // General
  INTERNAL_SERVER_ERROR: 'Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.',
  VALIDATION_ERROR: 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.',
  NOT_FOUND: 'Không tìm thấy tài nguyên.',
  FORBIDDEN: 'Bạn không có quyền thực hiện hành động này.',
  UNAUTHORIZED: 'Vui lòng đăng nhập để tiếp tục.',

  // Auth
  AUTH_INVALID_CREDENTIALS: 'Email hoặc mật khẩu không đúng.',
  AUTH_ACCOUNT_SUSPENDED: 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ hỗ trợ.',
  AUTH_ACCOUNT_INACTIVE: 'Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email để xác thực.',
  AUTH_EMAIL_EXISTS: 'Email này đã được sử dụng.',
  AUTH_SESSION_EXPIRED: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
  AUTH_SESSION_REVOKED: 'Phiên đăng nhập đã bị thu hồi. Vui lòng đăng nhập lại.',
  AUTH_DEVICE_LIMIT_REACHED: 'Bạn đã đăng nhập trên số thiết bị tối đa. Vui lòng đăng xuất một thiết bị khác trước khi đăng nhập.',
  AUTH_TOKEN_INVALID: 'Token không hợp lệ. Vui lòng đăng nhập lại.',
  AUTH_TOKEN_EXPIRED: 'Token đã hết hạn. Vui lòng đăng nhập lại.',
  AUTH_REFRESH_TOKEN_INVALID: 'Refresh token không hợp lệ. Vui lòng đăng nhập lại.',
  AUTH_REFRESH_TOKEN_EXPIRED: 'Refresh token đã hết hạn. Vui lòng đăng nhập lại.',
  AUTH_PASSWORD_RESET_EXPIRED: 'Link đặt lại mật khẩu đã hết hạn. Vui lòng yêu cầu link mới.',
  AUTH_PASSWORD_RESET_INVALID: 'Link đặt lại mật khẩu không hợp lệ.',
  AUTH_EMAIL_NOT_VERIFIED: 'Email chưa được xác thực. Vui lòng kiểm tra hộp thư.',
  AUTH_OAUTH_FAILED: 'Đăng nhập bằng mạng xã hội thất bại. Vui lòng thử lại.',

  // User
  USER_NOT_FOUND: 'Không tìm thấy người dùng.',
  USER_EMAIL_EXISTS: 'Email này đã được sử dụng.',
  USER_UPDATE_FAILED: 'Cập nhật thông tin thất bại.',
  USER_DELETE_FAILED: 'Xóa người dùng thất bại.',

  // Exam
  EXAM_NOT_FOUND: 'Không tìm thấy đề thi.',
  EXAM_ALREADY_STARTED: 'Bài thi đã bắt đầu.',
  EXAM_ALREADY_COMPLETED: 'Bài thi đã hoàn thành.',
  EXAM_TIME_EXPIRED: 'Thời gian làm bài đã hết.',
  EXAM_ACCESS_DENIED: 'Bạn không có quyền truy cập đề thi này.',

  // Admin
  ADMIN_USER_NOT_FOUND: 'Không tìm thấy người dùng.',
  ADMIN_ROLE_NOT_FOUND: 'Không tìm thấy vai trò.',
  ADMIN_SESSION_NOT_FOUND: 'Không tìm thấy phiên đăng nhập.',
  ADMIN_ACTION_FORBIDDEN: 'Bạn không có quyền thực hiện hành động này.',

  // Payment
  PAYMENT_FAILED: 'Thanh toán thất bại. Vui lòng thử lại.',
  PAYMENT_INVALID_AMOUNT: 'Số tiền không hợp lệ.',
  PAYMENT_SUBSCRIPTION_EXPIRED: 'Gói đăng ký đã hết hạn.',
};

// Error codes that require logout
export const LogoutRequiredCodes = [
  'AUTH_SESSION_EXPIRED',
  'AUTH_SESSION_REVOKED',
  'AUTH_TOKEN_INVALID',
  'AUTH_TOKEN_EXPIRED',
  'AUTH_REFRESH_TOKEN_INVALID',
  'AUTH_REFRESH_TOKEN_EXPIRED',
  'AUTH_ACCOUNT_SUSPENDED',
];

// Error codes that show a special modal (e.g., device limit)
export const SpecialHandlingCodes = [
  'AUTH_DEVICE_LIMIT_REACHED',
  'AUTH_ACCOUNT_INACTIVE',
  'AUTH_EMAIL_NOT_VERIFIED',
];

export interface ApiError {
  code: string;
  statusCode: number;
  message?: string;
  details?: any;
  timestamp?: string;
  path?: string;
}

/**
 * Get error message from error code
 */
export function getErrorMessage(code: string, fallback?: string): string {
  return ErrorMessages[code] || fallback || 'Đã xảy ra lỗi. Vui lòng thử lại.';
}

/**
 * Check if error requires logout
 */
export function isLogoutRequired(code: string): boolean {
  return LogoutRequiredCodes.includes(code);
}

/**
 * Check if error needs special handling
 */
export function needsSpecialHandling(code: string): boolean {
  return SpecialHandlingCodes.includes(code);
}

/**
 * Parse API error response
 */
export function parseApiError(error: any): ApiError {
  // Axios error
  if (error.response?.data) {
    return {
      code: error.response.data.code || 'INTERNAL_SERVER_ERROR',
      statusCode: error.response.data.statusCode || error.response.status || 500,
      message: error.response.data.message,
      details: error.response.data.details,
      timestamp: error.response.data.timestamp,
      path: error.response.data.path,
    };
  }

  // Network error
  if (error.message === 'Network Error') {
    return {
      code: 'NETWORK_ERROR',
      statusCode: 0,
      message: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.',
    };
  }

  // Unknown error
  return {
    code: 'INTERNAL_SERVER_ERROR',
    statusCode: 500,
    message: error.message || 'Đã xảy ra lỗi không xác định.',
  };
}
