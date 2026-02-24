/**
 * 移动端适配工具模块
 * 用于检测设备类型、处理视口高度、适配微信内置浏览器等
 */

// 设备类型
export type DeviceType = 'mobile' | 'tablet' | 'desktop';

// 浏览器类型
export type BrowserType = 'wechat' | 'qq' | 'safari' | 'chrome' | 'other';

// 操作系统类型
export type OSType = 'ios' | 'android' | 'windows' | 'mac' | 'other';

/**
 * 检测是否为移动设备
 */
export function isMobile(): boolean {
  const userAgent = navigator.userAgent.toLowerCase();
  const mobileKeywords = [
    'android',
    'iphone',
    'ipad',
    'ipod',
    'windows phone',
    'blackberry',
    'mobile',
    'touch'
  ];
  return mobileKeywords.some(keyword => userAgent.includes(keyword));
}

/**
 * 检测是否为平板设备
 */
export function isTablet(): boolean {
  const userAgent = navigator.userAgent.toLowerCase();
  return /ipad/.test(userAgent) || 
         (/android/.test(userAgent) && !/mobile/.test(userAgent)) ||
         (window.innerWidth >= 768 && window.innerWidth <= 1366 && 'ontouchstart' in window);
}

/**
 * 检测设备类型
 */
export function getDeviceType(): DeviceType {
  if (isTablet()) return 'tablet';
  if (isMobile()) return 'mobile';
  return 'desktop';
}

/**
 * 检测是否为微信内置浏览器
 */
export function isWechatBrowser(): boolean {
  const userAgent = navigator.userAgent.toLowerCase();
  return /micromessenger/.test(userAgent);
}

/**
 * 检测是否为 QQ 内置浏览器
 */
export function isQQBrowser(): boolean {
  const userAgent = navigator.userAgent.toLowerCase();
  return /qqbrowser|mqqbrowser/.test(userAgent);
}

/**
 * 获取浏览器类型
 */
export function getBrowserType(): BrowserType {
  if (isWechatBrowser()) return 'wechat';
  if (isQQBrowser()) return 'qq';
  const userAgent = navigator.userAgent.toLowerCase();
  if (/safari/.test(userAgent) && !/chrome/.test(userAgent)) return 'safari';
  if (/chrome/.test(userAgent)) return 'chrome';
  return 'other';
}

/**
 * 获取操作系统类型
 */
export function getOSType(): OSType {
  const userAgent = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod|ios/.test(userAgent)) return 'ios';
  if (/android/.test(userAgent)) return 'android';
  if (/windows/.test(userAgent)) return 'windows';
  if (/macintosh|mac os/.test(userAgent)) return 'mac';
  return 'other';
}

/**
 * 是否为 iOS 设备
 */
export function isIOS(): boolean {
  return getOSType() === 'ios';
}

/**
 * 是否为 Android 设备
 */
export function isAndroid(): boolean {
  return getOSType() === 'android';
}

/**
 * 设置视口高度变量（解决移动端 100vh 包含地址栏的问题）
 * 使用 --vh 变量代替 vh 单位
 */
export function setViewportHeight(): void {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

/**
 * 初始化视口高度监听
 */
export function initViewportHeightListener(): void {
  // 初始设置
  setViewportHeight();
  
  // 监听窗口大小变化
  let resizeTimer: ReturnType<typeof setTimeout> | null = null;
  window.addEventListener('resize', () => {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      setViewportHeight();
    }, 100);
  });
  
  // iOS 键盘弹出/收起处理
  if (isIOS()) {
    window.addEventListener('focusin', () => {
      setTimeout(setViewportHeight, 300);
    });
    window.addEventListener('focusout', () => {
      setTimeout(setViewportHeight, 300);
    });
  }
}

/**
 * 添加微信浏览器特殊处理类名
 */
export function addWechatClass(): void {
  if (isWechatBrowser()) {
    document.body.classList.add('wechat-browser');
  }
}

/**
 * 添加 iOS 设备特殊处理类名
 */
export function addIOSClass(): void {
  if (isIOS()) {
    document.body.classList.add('ios-device');
  }
}

/**
 * 禁止默认触摸行为（防止页面被拖动）
 */
export function preventDefaultTouch(): void {
  document.addEventListener('touchmove', (e) => {
    // 只允许在可滚动区域内滚动
    const target = e.target as HTMLElement;
    const scrollableParent = target.closest('.scrollable');
    if (!scrollableParent) {
      e.preventDefault();
    }
  }, { passive: false });
}

/**
 * 禁用双击缩放
 */
export function disableDoubleTapZoom(): void {
  let lastTouchEnd = 0;
  document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
      e.preventDefault();
    }
    lastTouchEnd = now;
  }, { passive: false });
}

/**
 * 初始化所有移动端适配
 */
export function initMobileAdapter(): void {
  // 设置视口高度
  initViewportHeightListener();
  
  // 添加特殊类名
  addWechatClass();
  addIOSClass();
  
  // 禁用双击缩放
  disableDoubleTapZoom();
  
  // 添加移动端特定的 meta 标签
  addMobileMetaTags();
}

/**
 * 添加移动端特定的 meta 标签（动态添加）
 */
function addMobileMetaTags(): void {
  // 如果已经存在 viewport，则不再添加
  if (document.querySelector('meta[name="viewport"]')) {
    return;
  }
  
  const meta = document.createElement('meta');
  meta.name = 'viewport';
  meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, viewport-fit=cover';
  document.head.appendChild(meta);
}

/**
 * 获取安全的窗口高度（减去 iOS 底部横条等）
 */
export function getSafeWindowHeight(): number {
  const safeAreaBottom = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--safe-area-bottom') || '0'
  );
  return window.innerHeight - safeAreaBottom;
}

/**
 * 设置安全区域变量（适配刘海屏、底部横条等）
 */
export function setSafeAreaInsets(): void {
  // 检测是否支持 safe-area-inset
  const safeAreaTop = getComputedStyle(document.documentElement).paddingTop;
  
  // 设置 CSS 变量
  document.documentElement.style.setProperty('--safe-area-top', 'env(safe-area-inset-top)');
  document.documentElement.style.setProperty('--safe-area-bottom', 'env(safe-area-inset-bottom)');
  document.documentElement.style.setProperty('--safe-area-left', 'env(safe-area-inset-left)');
  document.documentElement.style.setProperty('--safe-area-right', 'env(safe-area-inset-right)');
}

export default {
  isMobile,
  isTablet,
  getDeviceType,
  isWechatBrowser,
  isQQBrowser,
  getBrowserType,
  getOSType,
  isIOS,
  isAndroid,
  setViewportHeight,
  initViewportHeightListener,
  addWechatClass,
  addIOSClass,
  initMobileAdapter,
  getSafeWindowHeight,
  setSafeAreaInsets
};
