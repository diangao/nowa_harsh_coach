/// <reference path="./types/index.d.ts" />

interface IAppOption {
  globalData: {
    userInfo: WechatMiniprogram.UserInfo | null;
    foodHistory: FoodRecord[];
    ignoredAdviceCount: number;
  };
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback;
}

// Food recognition result
interface FoodRecognitionResult {
  items: FoodItem[];
  timestamp: number;
}

// Individual food item identified
interface FoodItem {
  name: string;
  confidence: number;
  category: FoodCategory;
  healthScore: number; // 0-10, 10 being healthiest
}

// Food record stored in history
interface FoodRecord {
  id: string;
  imageUrl: string;
  recognitionResult: FoodRecognitionResult;
  userHealthOpinion: 'healthy' | 'unhealthy' | 'unknown';
  feedback: {
    sarcasticComment: string;
    advice: string[];
  };
  timestamp: number;
  ignored: boolean;
}

// Food categories
type FoodCategory = 
  | 'fried' 
  | 'dessert' 
  | 'beverage' 
  | 'protein' 
  | 'carbs' 
  | 'vegetables' 
  | 'fruits' 
  | 'processed' 
  | 'other'; 