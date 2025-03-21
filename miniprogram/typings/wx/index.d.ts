declare namespace wx {
  const cloud: {
    init(options: { env: string; traceUser: boolean }): void;
  };
  function getSetting(options: { success: (res: any) => void }): void;
  function getUserInfo(options: { success: (res: any) => void }): void;
  function navigateTo(options: { 
    url: string;
    success?: () => void;
    fail?: (error: any) => void;
  }): void;
  function navigateBack(options?: { 
    delta?: number;
    success?: () => void;
    fail?: (error: any) => void;
  }): void;
  function createCameraContext(): CameraContext;
  function showToast(options: { title: string; icon?: string; duration?: number }): void;
  function chooseImage(options: {
    count: number;
    sizeType: string[];
    sourceType: string[];
    success: (res: { tempFilePaths: string[] }) => void;
    fail?: (error: any) => void;
  }): void;
  function switchTab(options: { 
    url: string;
    success?: () => void;
    fail?: (error: any) => void;
  }): void;
  function reLaunch(options: { 
    url: string;
    success?: () => void;
    fail?: (error: any) => void;
  }): void;
  function showLoading(options: { title: string; mask?: boolean }): void;
  function hideLoading(): void;
}

interface CameraContext {
  takePhoto(options: {
    quality?: string;
    success?: (res: { tempImagePath: string }) => void;
    fail?: (error: any) => void;
  }): void;
}

declare function getApp<T = any>(): T;
declare function Page(options: any): void; 