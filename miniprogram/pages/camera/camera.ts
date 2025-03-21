/// <reference path="../../typings/index.d.ts" />
/// <reference path="../../typings/wx/index.d.ts" />

import appInstance from '../../app';

// Define food recognition and feedback interfaces
interface FoodItem {
  name: string;
  confidence: number;
  category: string;
  healthScore: number;
}

interface FoodRecognitionResult {
  items: FoodItem[];
  timestamp: number;
}

interface FoodFeedback {
  sarcasticComment: string;
  responseOptions: {
    curious: string;
    defiant: string;
    helpful: string;
  };
  responseReplies: {
    curious: string;
    defiant: string;
    helpful: string;
  };
  advice: string[];
  isHealthy: boolean;
}

Page({
  data: {
    imageTaken: false,
    tempImagePath: '',
    isUploading: false,
    showIntro: true
  },

  onLoad() {
    console.log('Camera page loaded');
  },

  dismissIntro() {
    console.log('Dismissing intro');
    this.setData({
      showIntro: false
    });
  },

  takePhoto() {
    console.log('Taking photo');
    
    const cameraContext = wx.createCameraContext();
    
    cameraContext.takePhoto({
      quality: 'high',
      success: (res) => {
        console.log('Photo taken successfully:', res.tempImagePath);
        this.setData({
          imageTaken: true,
          tempImagePath: res.tempImagePath
        });
      },
      fail: (error) => {
        console.error('Failed to take photo:', error);
        wx.showToast({
          title: '拍照失败，请重试',
          icon: 'none'
        });
      }
    });
  },

  onChooseFromAlbum() {
    console.log('Choosing from album');
    
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success: (res) => {
        console.log('Image chosen from album:', res.tempFilePaths[0]);
        this.setData({
          imageTaken: true,
          tempImagePath: res.tempFilePaths[0]
        });
      },
      fail: (error) => {
        console.error('Failed to choose image:', error);
      }
    });
  },

  onCancelPreview() {
    console.log('Preview cancelled');
    this.setData({
      imageTaken: false,
      tempImagePath: ''
    });
  },

  onConfirmPhoto() {
    console.log('Photo confirmed');
    this.uploadAndAnalyzeImage();
  },

  onCameraError(error: any) {
    console.error('Camera error:', error);
    wx.showToast({
      title: '相机初始化失败，请检查权限设置',
      icon: 'none'
    });
  },

  uploadAndAnalyzeImage() {
    console.log('Uploading and analyzing image');
    
    this.setData({
      isUploading: true
    });

    // Simulate image analysis with a timeout
    // In a real app, this would call an AI service
    setTimeout(() => {
      console.log('Image analysis completed');
      
      this.setData({
        isUploading: false
      });

      // Generate mock food recognition result
      const mockFoodItems: FoodItem[] = this.generateMockFoodItems();
      
      // Generate a unique ID for this food record
      const recordId = `food_${Date.now()}`;

      // Create mock recognition result
      const mockResult: FoodRecognitionResult = {
        items: mockFoodItems,
        timestamp: Date.now()
      };

      // Generate sarcastic feedback
      const feedback = this.generateSarcasticFeedback(mockFoodItems);

      // Store the data in global state or pass it to chat page
      wx.navigateTo({
        url: `/pages/chat/chat?id=${recordId}&imageUrl=${encodeURIComponent(this.data.tempImagePath)}&foodData=${encodeURIComponent(JSON.stringify(mockResult))}&feedback=${encodeURIComponent(JSON.stringify(feedback))}`
      });
    }, 2000);
  },

  generateMockFoodItems(): FoodItem[] {
    // Mock food items based on random data
    // In a real app, this would come from AI service
    const foods = [
      { name: '炸鸡', category: '油炸食品', healthScore: 20 },
      { name: '炸酱面', category: '面食', healthScore: 50 },
      { name: '汉堡', category: '快餐', healthScore: 30 },
      { name: '薯条', category: '油炸食品', healthScore: 25 },
      { name: '沙拉', category: '蔬菜', healthScore: 90 },
      { name: '奶茶', category: '饮料', healthScore: 40 },
      { name: '蛋糕', category: '甜点', healthScore: 35 }
    ];

    const randomIndex = Math.floor(Math.random() * foods.length);
    const selectedFood = foods[randomIndex];

    return [{
      name: selectedFood.name, 
      confidence: 0.85 + Math.random() * 0.15,
      category: selectedFood.category,
      healthScore: selectedFood.healthScore
    }];
  },

  generateSarcasticFeedback(foods: FoodItem[]): FoodFeedback {
    console.log('Generating sarcastic feedback for:', foods);

    // Default values
    let sarcasticComment = '看来有人今天不想减肥了？';
    let isHealthy = false;
    let advice = ['减少摄入量', '多喝水', '做30分钟运动'];

    // Generate feedback based on the food
    if (foods.length > 0) {
      const food = foods[0];
      
      if (food.healthScore < 30) {
        sarcasticComment = `好家伙，${food.name}？你是想挑战今天的热量目标吗？`;
        advice = ['只吃一半', '额外增加45分钟有氧运动', '晚餐只吃蔬菜'];
      } else if (food.healthScore < 60) {
        sarcasticComment = `${food.name}...嗯，你确定现在是吃这个的好时机？`;
        advice = ['控制份量', '配合一些蔬菜', '今天额外走5000步'];
      } else {
        sarcasticComment = `${food.name}！我都怀疑这是不是假照片，你竟然吃健康食品？`;
        isHealthy = true;
        advice = ['很好，继续保持', '合理搭配其他食物', '适量即可'];
      }
    }

    return {
      sarcasticComment: sarcasticComment,
      responseOptions: {
        curious: '没事吧？',
        defiant: '我就想吃！',
        helpful: '有没有补救方案？'
      },
      responseReplies: {
        curious: '你觉得呢？你是来瘦的，不是来挑战物理定律的。',
        defiant: '随你，但等你后悔的时候别来找我。',
        helpful: '好吧，' + advice[0] + '，然后' + advice[2] + '。'
      },
      advice: advice,
      isHealthy: isHealthy
    };
  }
}); 