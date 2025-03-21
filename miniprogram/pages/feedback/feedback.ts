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
        sarcasticOpening: '好家伙，又是炸鸡？你的动脉终于可以继续堵了。',
        sarcasticComment: '你这是在喝油，不是在吃饭。',
        responseOptions: {
          curious: '没事吧？',
          defiant: '我就想吃！',
          helpful: '有没有补救方案？'
        },
        responseReplies: {
          curious: '你觉得呢？你是来瘦的，不是来挑战物理定律的。',
          defiant: '随你，但等你后悔的时候别来找我。',
          helpful: '好吧，吃一半，然后今晚多走5000步。'
        },
        advice: [
          '把皮去掉再吃，至少少摄入30%的油脂。',
          '吃之前喝一大杯水，填饱肚子少吃点。',
          '下次点烤鸡，而不是炸鸡。'
        ]
      },
      {
        category: 'beverage' as FoodCategory,
        name: '奶茶',
        sarcasticOpening: '奶茶？认真的？这就是糖水加奶加珍珠的卡路里炸弹。',
        sarcasticComment: '糖 + 奶 + 卡路里炸弹 = 体重飙升套餐。',
        responseOptions: {
          curious: '有那么严重吗？',
          defiant: '偶尔喝一次没关系吧？',
          helpful: '应该怎么控制？'
        },
        responseReplies: {
          curious: '一杯奶茶的糖分能让你一整天的减肥计划泡汤，你说严重不严重？',
          defiant: '减肥没有"偶尔"，只有坚持和放弃的区别。',
          helpful: '要喝就点无糖，珍珠不要，或者换成美式咖啡。'
        },
        advice: [
          '奶茶换成黑咖啡，少摄入300大卡。',
          '如果非要喝，只喝三分之一，其他倒掉。',
          '自己在家用茶叶和无糖牛奶冲泡，控制糖分。'
        ]
      },
      {
        category: 'carbs' as FoodCategory,
        name: '白米饭',
        sarcasticOpening: '又是白米饭？你的碳水摄入量已经超标200%了！',
        sarcasticComment: '吃一碗等于吃三勺糖，你确定要这样？',
        responseOptions: {
          curious: '不吃饭吃什么？',
          defiant: '我需要能量啊！',
          helpful: '有什么替代方案？'
        },
        responseReplies: {
          curious: '吃饭可以，但是要控制量和时间，尤其晚上。',
          defiant: '需要能量没错，但不需要这么多无效能量。',
          helpful: '换成糙米、藜麦，或者只吃半碗，加倍吃蛋白质和蔬菜。'
        },
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
    
    console.log('Generated food feedback with sarcastic opening and responses');
    
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
        sarcasticOpening: selectedFood.sarcasticOpening,
        sarcasticComment: lateNightWarning || selectedFood.sarcasticComment,
        responseOptions: selectedFood.responseOptions,
        responseReplies: selectedFood.responseReplies,
        advice: selectedFood.advice
      }
    };
  }
}

Page({
  data: {
    stage: 'opening', // 'opening', 'response', 'feedback'
    foodRecord: {} as Partial<FoodRecord>,
    userOpinion: '' as 'healthy' | 'unhealthy' | 'unknown',
    userOpinionText: '',
    userResponse: '' as UserResponseType,
    showFullAdvice: false
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

  // Response handlers for initial AI opening
  onContinueFromOpening() {
    console.log('User continuing from AI opening');
    this.setData({
      stage: 'response'
    });
  },

  // Response handlers for user response options
  onCuriousResponse() {
    console.log('User selected curious response');
    this.setData({
      stage: 'feedback',
      userResponse: 'curious'
    });
  },

  onDefiantResponse() {
    console.log('User selected defiant response');
    this.setData({
      stage: 'feedback',
      userResponse: 'defiant'
    });
  },

  onHelpfulResponse() {
    console.log('User selected helpful response');
    this.setData({
      stage: 'feedback',
      userResponse: 'helpful'
    });
  },

  // Original opinion handlers (leaving them for backward compatibility)
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

  toggleAdvice() {
    console.log('Toggling advice display');
    this.setData({
      showFullAdvice: !this.data.showFullAdvice
    });
  },

  onIgnoreAdvice() {
    console.log('User ignoring advice');
    
    try {
      if (!appInstance) {
        console.error('App instance is undefined');
        wx.showToast({
          title: '无法保存记录',
          icon: 'none',
          duration: 1500
        });
      } else {
        // 添加食物历史记录
        const historyRecord = {
          ...this.data.foodRecord,
          userResponse: this.data.userResponse,
          ignored: true
        };
        
        // 确保globalData存在
        if (!appInstance.globalData) {
          appInstance.globalData = { 
            userInfo: null, 
            foodHistory: [], 
            ignoredAdviceCount: 0 
          };
        }
        
        // 确保foodHistory和ignoredAdviceCount存在
        if (!appInstance.globalData.foodHistory) {
          appInstance.globalData.foodHistory = [];
        }
        
        if (typeof appInstance.globalData.ignoredAdviceCount !== 'number') {
          appInstance.globalData.ignoredAdviceCount = 0;
        }
        
        // 增加忽略建议计数
        appInstance.globalData.ignoredAdviceCount += 1;
        appInstance.globalData.foodHistory.unshift(historyRecord);
        
        console.log('Added to food history (ignored):', historyRecord);
        console.log('Ignored advice count:', appInstance.globalData.ignoredAdviceCount);
        
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
    
    setTimeout(() => {
      console.log('准备返回上一页');
      wx.navigateBack({
        delta: 1
      });
    }, 1500);
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
          userResponse: this.data.userResponse,
          ignored: false
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