/**
 * VSTEPRO Design System - Layout Constants
 * 
 * Định nghĩa nhất quán cho spacing, padding, width, và heading styles
 * để đảm bảo UI consistency trên toàn bộ hệ thống
 */

// ============================================================================
// CONTAINER WIDTHS
// ============================================================================
export const LAYOUT = {
  // Main container: max-width 1280px, center-aligned với padding responsive
  CONTAINER: 'max-w-7xl mx-auto px-6',
  
  // Container cho các page đơn giản (không cần rộng quá)
  CONTAINER_NARROW: 'max-w-5xl mx-auto px-6',
  
  // Container cho forms, settings
  CONTAINER_SMALL: 'max-w-3xl mx-auto px-6',
} as const;

// ============================================================================
// PADDING & SPACING
// ============================================================================
export const SPACING = {
  // Page padding (Main content area)
  PAGE_PADDING: 'px-6 py-8', // 24px horizontal, 32px vertical
  
  // Section spacing (khoảng cách giữa các sections)
  SECTION_GAP: 'space-y-6', // 24px
  SECTION_GAP_LARGE: 'space-y-8', // 32px
  
  // Card padding
  CARD_PADDING: 'p-6', // 24px all sides
  CARD_PADDING_LARGE: 'p-8', // 32px all sides
  
  // Grid/Flex gaps
  GRID_GAP: 'gap-6', // 24px
  GRID_GAP_SMALL: 'gap-4', // 16px
  GRID_GAP_LARGE: 'gap-8', // 32px
} as const;

// ============================================================================
// TYPOGRAPHY - HEADINGS
// ============================================================================
export const HEADINGS = {
  // Page Title (H1) - Dùng cho title chính của mỗi page
  PAGE_TITLE: 'text-3xl font-bold text-gray-900 mb-8',
  
  // Section Title (H2) - Dùng cho các section lớn
  SECTION_TITLE: 'text-2xl font-bold text-gray-900 mb-6',
  
  // Subsection Title (H3) - Dùng cho các subsection
  SUBSECTION_TITLE: 'text-xl font-semibold text-gray-900 mb-4',
  
  // Card Title (H4) - Dùng cho tiêu đề của cards
  CARD_TITLE: 'text-lg font-semibold text-gray-900 mb-3',
  
  // Small Title (H5) - Dùng cho các tiêu đề nhỏ
  SMALL_TITLE: 'text-base font-semibold text-gray-900 mb-2',
} as const;

// ============================================================================
// COMMON COMPONENTS
// ============================================================================
export const COMPONENTS = {
  // Button heights
  BUTTON_HEIGHT: 'h-10', // 40px
  BUTTON_HEIGHT_LARGE: 'h-12', // 48px
  BUTTON_HEIGHT_SMALL: 'h-8', // 32px
  
  // Input heights
  INPUT_HEIGHT: 'h-10', // 40px
  INPUT_HEIGHT_LARGE: 'h-12', // 48px
  
  // Border radius
  ROUNDED: 'rounded-lg', // 8px
  ROUNDED_LARGE: 'rounded-xl', // 12px
  ROUNDED_FULL: 'rounded-full',
  
  // Shadows
  SHADOW: 'shadow-sm',
  SHADOW_MEDIUM: 'shadow-md',
  SHADOW_LARGE: 'shadow-lg',
} as const;

// ============================================================================
// COLORS - Primary & Secondary only
// ============================================================================
export const COLORS = {
  // Primary - Blue
  PRIMARY: {
    BG: 'bg-blue-600',
    BG_HOVER: 'hover:bg-blue-700',
    BG_LIGHT: 'bg-blue-50',
    TEXT: 'text-blue-600',
    BORDER: 'border-blue-600',
    GRADIENT: 'from-blue-600 to-blue-700',
  },
  
  // Secondary - Orange
  SECONDARY: {
    BG: 'bg-orange-600',
    BG_HOVER: 'hover:bg-orange-700',
    BG_LIGHT: 'bg-orange-50',
    TEXT: 'text-orange-600',
    BORDER: 'border-orange-600',
    GRADIENT: 'from-orange-600 to-orange-700',
  },
  
  // Neutral
  NEUTRAL: {
    BG_WHITE: 'bg-white',
    BG_GRAY_50: 'bg-gray-50',
    BG_GRAY_100: 'bg-gray-100',
    TEXT_GRAY_600: 'text-gray-600',
    TEXT_GRAY_900: 'text-gray-900',
    BORDER: 'border-gray-200',
  },
} as const;

// ============================================================================
// HELPER FUNCTIONS - Kết hợp các classes
// ============================================================================

/**
 * Tạo class cho page wrapper tiêu chuẩn
 * Usage: <div className={getPageWrapper()}>
 */
export const getPageWrapper = () => {
  return `${LAYOUT.CONTAINER} ${SPACING.PAGE_PADDING}`;
};

/**
 * Tạo class cho page với container nhỏ hơn
 */
export const getPageWrapperNarrow = () => {
  return `${LAYOUT.CONTAINER_NARROW} ${SPACING.PAGE_PADDING}`;
};

/**
 * Tạo class cho page với container nhỏ (forms, settings)
 */
export const getPageWrapperSmall = () => {
  return `${LAYOUT.CONTAINER_SMALL} ${SPACING.PAGE_PADDING}`;
};

/**
 * Tạo class cho card tiêu chuẩn
 */
export const getCard = () => {
  return `${COMPONENTS.ROUNDED} ${SPACING.CARD_PADDING} ${COLORS.NEUTRAL.BG_WHITE} ${COMPONENTS.SHADOW}`;
};

/**
 * Tạo class cho button primary
 */
export const getButtonPrimary = () => {
  return `${COLORS.PRIMARY.BG} ${COLORS.PRIMARY.BG_HOVER} text-white ${COMPONENTS.BUTTON_HEIGHT} px-6 ${COMPONENTS.ROUNDED} transition-colors`;
};

/**
 * Tạo class cho button secondary
 */
export const getButtonSecondary = () => {
  return `${COLORS.SECONDARY.BG} ${COLORS.SECONDARY.BG_HOVER} text-white ${COMPONENTS.BUTTON_HEIGHT} px-6 ${COMPONENTS.ROUNDED} transition-colors`;
};
