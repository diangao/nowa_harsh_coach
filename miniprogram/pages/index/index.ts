/// <reference path="../../typings/index.d.ts" />
/// <reference path="../../typings/wx/index.d.ts" />

// const app = getApp<IAppOption>();
import appInstance from '../../app';

Page({
  data: {
    recentRecords: [] as Array<{
      id: string;
      imageUrl: string;
      formattedTime: string;
      feedback: {
        sarcasticComment: string;
      };
    }>
  },

  onLoad() {
    console.log('Index page loaded');
  },

  onShow() {
    console.log('Index page shown');
    this.loadRecentRecords();
  },

  loadRecentRecords() {
    console.log('Loading recent records');
    
    // Mock data for now - will be replaced with cloud database calls
    const mockRecords = [
      {
        id: '1',
        imageUrl: '/images/mock/food1.jpg',
        timestamp: Date.now() - 3600000, // 1 hour ago
        feedback: {
          sarcasticComment: '你这是在喝油，不是在吃饭。'
        }
      },
      {
        id: '2',
        imageUrl: '/images/mock/food2.jpg',
        timestamp: Date.now() - 86400000, // 1 day ago
        feedback: {
          sarcasticComment: '糖 + 奶 + 卡路里炸弹 = 体重飙升套餐。'
        }
      }
    ];
    
    // Format timestamps
    const formattedRecords = mockRecords.map(record => {
      const date = new Date(record.timestamp);
      return {
        ...record,
        formattedTime: `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`
      };
    });
    
    this.setData({
      recentRecords: formattedRecords
    });
    
    console.log('Recent records loaded:', formattedRecords);
  },

  onTakePhoto() {
    console.log('Take photo button pressed');
    wx.navigateTo({
      url: '/pages/camera/camera'
    });
  },

  onViewRecord(event: any) {
    const recordId = event.currentTarget.dataset.id;
    console.log('Viewing record:', recordId);
    
    wx.navigateTo({
      url: `/pages/feedback/feedback?id=${recordId}`
    });
  }
}); 