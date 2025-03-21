/// <reference path="../../typings/index.d.ts" />
/// <reference path="../../typings/wx/index.d.ts" />

// 改用直接获取应用实例的方式
const appInstance = getApp<IAppOption>();
// import appInstance from '../../app';  // 这种方式导致undefined

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
    console.log('User acknowledged feedback - 点击了知道了按钮');
    
    try {
      // 检查appInstance是否存在
      if (!appInstance) {
        console.error('App instance is undefined');
        // 即使没有记录历史，也继续导航
        wx.showToast({
          title: '无法保存记录',
          icon: 'none',
          duration: 1500
        });
      } else {
        // 添加食物历史记录
        const historyRecord = {
          ...this.data.foodRecord,
          userHealthOpinion: this.data.userOpinion,
          ignored: this.data.userOpinion === 'healthy'
        };
        
        // 确保globalData存在
        if (!appInstance.globalData) {
          appInstance.globalData = { 
            userInfo: null, 
            foodHistory: [], 
            ignoredAdviceCount: 0 
          };
        }
        
        // 确保foodHistory数组存在
        if (!appInstance.globalData.foodHistory) {
          appInstance.globalData.foodHistory = [];
        }
        
        appInstance.globalData.foodHistory.unshift(historyRecord);
        console.log('Added to food history:', historyRecord);
        
        wx.showToast({
          title: '记录已保存',
          icon: 'success',
          duration: 1500
        });
      }
    } catch (error) {
      console.error('Error saving food record:', error);
      wx.showToast({
        title: '保存失败',
        icon: 'none',
        duration: 1500
      });
    }
    
    // 延时后返回上一页
    setTimeout(() => {
      console.log('准备返回上一页');
      wx.navigateBack({
        delta: 1
      });
    }, 1500);
  }
}); 