/// <reference path="../../typings/index.d.ts" />
/// <reference path="../../typings/wx/index.d.ts" />

// const app = getApp<IAppOption>();
import appInstance from '../../app';

// Mock data service for food recognition
class FoodRecognitionService {
  // Mock recognition data with sarcastic comments and advice
  static getFoodFeedback(imageUrl: string): Partial<FoodRecord> {
    console.log('Generating mock food feedback for:', imageUrl);
    
    // For demo purposes, we're using random food items
    const foods = [
      {
        category: 'fried' as FoodCategory,
        name: '炸鸡',
        sarcasticComment: '你这是在喝油，不是在吃饭。',
        advice: [
          '把皮去掉再吃，至少少摄入30%的油脂。',
          '吃之前喝一大杯水，填饱肚子少吃点。',
          '下次点烤鸡，而不是炸鸡。'
        ]
      },
      {
        category: 'beverage' as FoodCategory,
        name: '奶茶',
        sarcasticComment: '糖 + 奶 + 卡路里炸弹 = 体重飙升套餐。',
        advice: [
          '奶茶换成黑咖啡，少摄入300大卡。',
          '如果非要喝，只喝三分之一，其他倒掉。',
          '自己在家用茶叶和无糖牛奶冲泡，控制糖分。'
        ]
      },
      {
        category: 'carbs' as FoodCategory,
        name: '白米饭',
        sarcasticComment: '吃一碗等于吃三勺糖，你确定要这样？',
        advice: [
          '只吃半碗，另一半换成蔬菜。',
          '饭前喝汤，再吃菜，最后才吃饭。',
          '试试糙米或藜麦饭，升糖指数更低。'
        ]
      }
    ];
    
    // Randomly pick one for demo
    const randomIndex = Math.floor(Math.random() * foods.length);
    const selectedFood = foods[randomIndex];
    
    // Check if it's evening (after 8PM)
    const currentHour = new Date().getHours();
    let lateNightWarning = '';
    
    if (currentHour >= 20) {
      lateNightWarning = '晚上8点后吃东西？那你体重只会涨，不会掉。';
    }
    
    return {
      id: `food_${Date.now()}`,
      imageUrl,
      timestamp: Date.now(),
      recognitionResult: {
        items: [
          {
            name: selectedFood.name,
            confidence: 0.92,
            category: selectedFood.category,
            healthScore: 3
          }
        ],
        timestamp: Date.now()
      },
      feedback: {
        sarcasticComment: lateNightWarning || selectedFood.sarcasticComment,
        advice: selectedFood.advice
      }
    };
  }
}

Page({
  data: {
    stage: 'question', // 'question' or 'feedback'
    foodRecord: {} as Partial<FoodRecord>,
    userOpinion: '' as 'healthy' | 'unhealthy' | 'unknown',
    userOpinionText: ''
  },

  onLoad(options) {
    console.log('Feedback page loaded with options:', options);
    
    if (options.id && options.imageUrl) {
      // In a real app, we would fetch the food record from the database
      // but for this demo, we'll generate mock data
      const foodRecord = FoodRecognitionService.getFoodFeedback(decodeURIComponent(options.imageUrl as string));
      
      this.setData({
        foodRecord: foodRecord
      });
      
      console.log('Food record loaded:', foodRecord);
    } else {
      console.error('Missing required parameters');
      wx.showToast({
        title: '参数错误，请重试',
        icon: 'none'
      });
      
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }
  },

  onHealthyOption() {
    console.log('User selected: healthy');
    this.setData({
      stage: 'feedback',
      userOpinion: 'healthy',
      userOpinionText: '健康'
    });
  },

  onUnhealthyOption() {
    console.log('User selected: unhealthy');
    this.setData({
      stage: 'feedback',
      userOpinion: 'unhealthy',
      userOpinionText: '不健康'
    });
  },

  onUnsureOption() {
    console.log('User selected: unsure');
    this.setData({
      stage: 'feedback',
      userOpinion: 'unknown',
      userOpinionText: '不确定'
    });
  },

  onGotIt() {
    console.log('User acknowledged feedback - 开始处理');
    
    // Update ignored advice count if the user got feedback but is likely to ignore it
    // This would be used for the "silent AI" feature in a full implementation
    if (this.data.userOpinion === 'healthy') {
      appInstance.globalData.ignoredAdviceCount++;
      console.log('Ignored advice count:', appInstance.globalData.ignoredAdviceCount);
      
      if (appInstance.globalData.ignoredAdviceCount >= 3) {
        wx.showToast({
          title: '看来你不在乎减肥，那我闭嘴。',
          icon: 'none',
          duration: 2000
        });
        
        // Reset counter after showing the message
        appInstance.globalData.ignoredAdviceCount = 0;
      }
    }
    
    // Add to food history
    const historyRecord = {
      ...this.data.foodRecord,
      userHealthOpinion: this.data.userOpinion,
      ignored: this.data.userOpinion === 'healthy'
    };
    
    appInstance.globalData.foodHistory.unshift(historyRecord);
    console.log('Added to food history:', historyRecord);
    
    // 添加提示，让用户知道按钮确实被点击了
    wx.showToast({
      title: '处理中...',
      icon: 'loading',
      duration: 1000
    });
    
    // 使用延时确保提示显示
    setTimeout(() => {
      // 使用reLaunch代替switchTab
      wx.reLaunch({
        url: '/pages/index/index',
        success: () => {
          console.log('成功跳转到首页');
        },
        fail: (err) => {
          console.error('跳转到首页失败:', err);
          
          // 尝试navigateBack方法
          wx.navigateBack({
            delta: 1,
            fail: (err2) => {
              console.error('返回上一页也失败:', err2);
              wx.showToast({
                title: '返回失败，请手动返回',
                icon: 'none',
                duration: 2000
              });
            }
          });
        }
      });
    }, 1000); // 延时1秒
  }
}); 