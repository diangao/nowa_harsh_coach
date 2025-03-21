/**
 * 微信API封装工具
 * 用于解决TypeScript中wx API类型问题
 */

// 声明wx对象上的方法
declare namespace wx {
  function setStorageSync(key: string, data: any): void;
  function getStorageSync(key: string): any;
  function request(options: any): any;
  function previewImage(options: { urls: string[]; current?: string }): void;
  function getFileSystemManager(): any;
  function navigateBack(options?: { delta?: number }): void;
  function navigateTo(options: { url: string }): void;
  function showToast(options: { title: string; icon?: string; duration?: number }): void;
  function chooseImage(options: any): void;
  function createCameraContext(): any;
}

/**
 * 存储数据到本地
 */
export const setStorageSync = (key: string, data: any) => {
  return wx.setStorageSync(key, data);
};

/**
 * 从本地获取数据
 */
export const getStorageSync = (key: string) => {
  return wx.getStorageSync(key);
};

/**
 * 请求API
 */
export const request = (options: any) => {
  return wx.request(options);
};

/**
 * 预览图片
 */
export const previewImage = (options: { urls: string[]; current?: string }) => {
  return wx.previewImage(options);
};

/**
 * 获取文件系统管理器
 */
export const getFileSystemManager = () => {
  return wx.getFileSystemManager();
};

/**
 * 导航返回
 */
export const navigateBack = (options?: { delta?: number }) => {
  return wx.navigateBack(options || {});
};

/**
 * 导航到页面
 */
export const navigateTo = (options: { url: string }) => {
  return wx.navigateTo(options);
};

/**
 * 显示Toast提示
 */
export const showToast = (options: { title: string; icon?: string; duration?: number }) => {
  return wx.showToast(options);
};

/**
 * 选择图片
 */
export const chooseImage = (options: any) => {
  return wx.chooseImage(options);
};

/**
 * 创建相机上下文
 */
export const createCameraContext = () => {
  return wx.createCameraContext();
}; 