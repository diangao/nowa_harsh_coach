// app.ts
/// <reference path="./typings/index.d.ts" />
/// <reference path="./typings/wx/index.d.ts" />

// @ts-ignore
const appInstance = App<IAppOption>({
  globalData: {
    userInfo: null,
    foodHistory: [],
    ignoredAdviceCount: 0
  },
  onLaunch() {
    console.log('App launched');
    
    // Initialize cloud
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: 'eat-or-not-123456',
        traceUser: true,
      });
      console.log('Cloud initialized');
    }
    
    // Check login status
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              this.globalData.userInfo = res.userInfo;
              console.log('User info retrieved:', res.userInfo);
            }
          });
        }
      }
    });
  }
});

export default appInstance; 