// chat.ts
import { config, logDebug } from '../../utils/config';
import { 
  getStorageSync, 
  setStorageSync, 
  previewImage, 
  showToast, 
  navigateBack, 
  createCameraContext, 
  chooseImage, 
  getFileSystemManager, 
  request 
} from '../../utils/wx-api';

// Define utility functions directly to avoid TypeScript module resolution issues
const formatTime = (date: Date): string => {
  const hour = date.getHours();
  const minute = date.getMinutes();
  return `${formatNumber(hour)}:${formatNumber(minute)}`;
};

const formatNumber = (n: number): string => {
  const s = n.toString();
  return s[1] ? s : '0' + s;
};

// Message interface
interface MessageOption {
  id: string;
  text: string;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  type: 'text' | 'image';
  content: string;
  time: string;
  imageUrl?: string;
  responseOptions?: MessageOption[];
}

// Food item interface 
interface FoodItem {
  name: string;
  confidence: number;
  category: string;
  healthScore: number;
  calories?: number;
}

// Food recognition result interface
interface FoodRecognitionResult {
  items: FoodItem[];
  timestamp: number;
}

// Food feedback interface
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

// User profile interface
interface UserProfile {
  weight: number;
  goalWeight: number;
  dailyCalorieTarget: number;
  activityLevel: 'low' | 'moderate' | 'high';
}

// Daily food log
interface DailyFoodLog {
  date: string;
  meals: {
    time: string;
    imageUrl: string;
    foodItems: FoodItem[];
    calories: number;
    advice: string;
    followed: boolean;
  }[];
  totalCalories: number;
}

// Food record interface matching project's definition
interface FoodRecord {
  id: string;
  imageUrl: string;
  recognitionResult: FoodRecognitionResult;
  userHealthOpinion: 'healthy' | 'unhealthy' | 'unknown';
  userResponse?: 'curious' | 'defiant' | 'helpful';
  feedback: FoodFeedback;
  timestamp: number;
  ignored: boolean;
}

Page({
  data: {
    messages: [] as Message[],
    inputText: '',
    isTyping: false,
    showCamera: false,
    showPreview: false,
    isUploading: false,
    tempImagePath: '',
    scrollToView: '',
    imageUrl: '',
    feedback: null as FoodFeedback | null,
    foodData: null as FoodRecognitionResult | null,
    userChoice: '',
    userAccepted: false,
    feedbackData: null as FoodFeedback | null,
    userProfile: {
      weight: 75,
      goalWeight: 68,
      dailyCalorieTarget: 1800,
      activityLevel: 'moderate'
    } as UserProfile
  },

  onLoad(options: any) {
    logDebug('Chat page loaded with options:', options);
    
    // Load user profile from storage
    const storedProfile = getStorageSync('userProfile');
    if (storedProfile) {
      this.setData({
        userProfile: storedProfile
      });
      logDebug('Loaded user profile:', storedProfile);
    }
    
    // If we have image data from the camera page, process it
    if (options.imageUrl && options.foodData && options.feedback) {
      logDebug('Retrieved food data from parameters');
      
      // Decode the image URL and food data
      const imageUrl = decodeURIComponent(options.imageUrl);
      const foodData = JSON.parse(decodeURIComponent(options.foodData));
      const feedback = JSON.parse(decodeURIComponent(options.feedback));
      
      this.setData({
        imageUrl: imageUrl,
        foodData: foodData,
        feedback: feedback,
        feedbackData: feedback
      });
      
      // Process the food image
      this.processFoodImage(imageUrl, foodData, feedback);
    } else {
      // If no image data, show welcome message with minimal text
      // Keep the initial message minimal to fit the sophisticated tone
      this.addAIMessage('来让我看看你吃什么，给我看了你更有可能变瘦');
    }
  },

  onUnload() {
    // Make sure camera is properly closed when leaving page
    logDebug('Unloading chat page, closing camera if open');
    this.closeCamera();
  },

  onHide() {
    // Also close camera when page is hidden
    logDebug('Hiding chat page, closing camera if open');
    this.closeCamera();
  },

  // Text input handlers
  onInputChange(e: any) {
    this.setData({
      inputText: e.detail.value
    });
  },

  sendTextMessage() {
    const { inputText } = this.data;
    
    if (!inputText.trim()) return;
    
    this.addUserMessage(inputText.trim(), 'text');
    
    this.setData({
      inputText: ''
    });
    
    // Simulate AI thinking
    this.simulateAITyping();
    
    // After a delay, have AI respond with minimal but stern responses
    setTimeout(() => {
      // Short, terse responses to text messages
      const responses = [
        '拍照。我需要看你吃的东西。',
        '不是来聊天的。拍你的食物。',
        '照片。不是文字。'
      ];
      
      const randomIndex = Math.floor(Math.random() * responses.length);
      this.addAIMessage(responses[randomIndex]);
    }, 1000);
  },

  // Camera functionality
  onOpenCamera() {
    logDebug('Opening camera');
    this.setData({
      showCamera: true
    });
  },

  onCloseCamera() {
    logDebug('Closing camera');
    this.closeCamera();
  },

  closeCamera() {
    // Unified method to close the camera
    if (this.data.showCamera) {
      logDebug('Closing camera and releasing resources');
      this.setData({
        showCamera: false
      });
    }
  },

  onCameraOverlayClick() {
    // Only close if clicked on the overlay, not the camera content
    this.closeCamera();
  },

  onPreviewOverlayClick() {
    // Only close if clicked on the overlay, not the preview content
    this.onCancelPreview();
  },

  stopPropagation() {
    // Prevent clicks inside content from bubbling to the overlay
    return;
  },

  takePhoto() {
    logDebug('Taking photo');
    
    const cameraContext = createCameraContext();
    
    cameraContext.takePhoto({
      quality: 'high',
      success: (res) => {
        logDebug('Photo taken successfully:', res.tempImagePath);
        this.setData({
          showCamera: false,
          showPreview: true,
          tempImagePath: res.tempImagePath
        });
      },
      fail: (error) => {
        console.error('Failed to take photo:', error);
        showToast({
          title: '拍照失败，请重试',
          icon: 'none'
        });
      }
    });
  },

  onChooseFromAlbum() {
    logDebug('Choosing from album');
    
    chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success: (res) => {
        logDebug('Image chosen from album:', res.tempFilePaths[0]);
        this.setData({
          showCamera: false,
          showPreview: true,
          tempImagePath: res.tempFilePaths[0]
        });
      },
      fail: (error) => {
        console.error('Failed to choose image:', error);
      }
    });
  },

  onCameraError(error: any) {
    console.error('Camera error:', error);
    showToast({
      title: '相机初始化失败，请检查权限设置',
      icon: 'none'
    });
    // Close the camera on error
    this.closeCamera();
  },

  onCancelPreview() {
    logDebug('Preview cancelled');
    this.setData({
      showPreview: false,
      tempImagePath: ''
    });
  },

  onConfirmPhoto() {
    logDebug('Photo confirmed');
    this.analyzeFood();
  },

  // Food analysis with OpenAI
  async analyzeFood() {
    logDebug('Analyzing food with OpenAI');
    
    this.setData({
      showPreview: false,
      isUploading: true
    });

    try {
      // Get current date string in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];
      
      // Get or initialize today's food log
      const foodLogs = getStorageSync('foodLogs') || {};
      const dailyLog: DailyFoodLog = foodLogs[today] || { 
        date: today, 
        meals: [],
        totalCalories: 0
      };
      
      // Get user profile
      const userProfile = this.data.userProfile;
      
      // Convert image to base64
      const base64Image = await imageToBase64(this.data.tempImagePath);
      
      // Call OpenAI API
      const result = await callOpenAI(base64Image, userProfile, dailyLog);
      
      logDebug('Analysis completed:', result);
      
      this.setData({
        isUploading: false
      });
      
      // Create enhanced feedback
      const feedback: FoodFeedback = {
        sarcasticComment: result.feedback,
        responseOptions: {
          curious: '怎么说？',
          defiant: '管不了那么多',
          helpful: '有什么建议？'
        },
        responseReplies: {
          curious: `你已摄入${dailyLog.totalCalories}卡路里，目标${userProfile.dailyCalorieTarget}。继续吃你就知道后果了。`,
          defiant: `随便你。不过你的体重秤不会撒谎。`,
          helpful: result.tacticalTips.join('。 ') + '。'
        },
        advice: result.tacticalTips,
        isHealthy: result.foodItems[0].healthScore > 70
      };
      
      // Record this meal in today's log
      const meal = {
        time: formatTime(new Date()),
        imageUrl: this.data.tempImagePath,
        foodItems: result.foodItems,
        calories: result.totalCalories,
        advice: result.tacticalTips.join('. '),
        followed: false
      };
      
      dailyLog.meals.push(meal);
      dailyLog.totalCalories += result.totalCalories;
      
      // Save updated log
      foodLogs[today] = dailyLog;
      setStorageSync('foodLogs', foodLogs);
      
      // Process the food image with enhanced feedback
      this.processFoodImage(this.data.tempImagePath, {
        items: result.foodItems,
        timestamp: Date.now()
      }, feedback);
      
    } catch (error) {
      console.error('Error in food analysis:', error);
      this.setData({
        isUploading: false
      });
      this.addAIMessage('分析失败。再试一次。');
    }
  },

  // Message handling
  processFoodImage(imageUrl: string, foodData: FoodRecognitionResult, feedback: FoodFeedback) {
    logDebug('Processing food image:', imageUrl);
    
    // Add the image message from user
    this.addUserMessage('', 'image', imageUrl);
    
    // Simulate AI typing
    this.simulateAITyping();
    
    // After a short delay, show AI's response
    setTimeout(() => {
      // Create response options based on the feedback
      const responseOptions: MessageOption[] = [
        { id: 'curious', text: feedback.responseOptions.curious },
        { id: 'defiant', text: feedback.responseOptions.defiant }, 
        { id: 'helpful', text: feedback.responseOptions.helpful }
      ];
      
      // Add the AI message with the feedback comment
      this.addAIMessage(feedback.sarcasticComment, responseOptions);
    }, 1500);
  },

  addUserMessage(content: string, type: 'text' | 'image', imageUrl: string = '') {
    logDebug(`Adding user ${type} message:`, content);
    
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      type: type,
      content: content,
      time: formatTime(new Date()),
      imageUrl: imageUrl
    };
    
    const messages = [...this.data.messages, newMessage];
    
    this.setData({
      messages: messages,
      scrollToView: `msg-${newMessage.id}`
    });
  },

  addAIMessage(content: string, responseOptions: MessageOption[] = []) {
    logDebug('Adding AI message:', content);
    
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      sender: 'ai',
      type: 'text',
      content: content,
      time: formatTime(new Date()),
      responseOptions: responseOptions
    };
    
    this.setData({
      messages: [...this.data.messages, newMessage],
      isTyping: false,
      scrollToView: `msg-${newMessage.id}`
    });
  },

  simulateAITyping() {
    this.setData({
      isTyping: true
    });
  },

  onSelectResponse(e: any) {
    const optionId = e.currentTarget.dataset.optionId;
    const optionText = e.currentTarget.dataset.optionText;
    const feedback = this.data.feedback;
    
    logDebug('User selected response option:', optionId, optionText);
    
    // Add user's selected response
    this.addUserMessage(optionText, 'text');
    
    // Simulate AI typing
    this.simulateAITyping();
    
    // Store user's choice
    this.setData({
      userChoice: optionId
    });
    
    // After a delay, show AI's response based on user's choice
    setTimeout(() => {
      if (feedback) {
        let responseText = '';
        
        switch (optionId) {
          case 'curious':
            responseText = feedback.responseReplies.curious;
            break;
          case 'defiant':
            responseText = feedback.responseReplies.defiant;
            break;
          case 'helpful':
            responseText = feedback.responseReplies.helpful;
            // After helpful advice, offer accept/ignore options
            this.showAcceptIgnoreOptions(responseText);
            return;
          case 'accept':
            responseText = '至少还听劝。';
            
            // Mark last meal as advice followed
            this.updateLastMealFollowedStatus(true);
            break;
          case 'ignore':
            responseText = '随便你。';
            
            // Mark last meal as advice not followed
            this.updateLastMealFollowedStatus(false);
            break;
          default:
            responseText = '继续。';
        }
        
        this.addAIMessage(responseText);
      }
    }, 1500);
  },

  updateLastMealFollowedStatus(followed: boolean) {
    // Get current date
    const today = new Date().toISOString().split('T')[0];
    
    // Get food logs
    const foodLogs = getStorageSync('foodLogs') || {};
    const dailyLog = foodLogs[today];
    
    if (dailyLog && dailyLog.meals.length > 0) {
      // Update the last meal's followed status
      const lastIndex = dailyLog.meals.length - 1;
      dailyLog.meals[lastIndex].followed = followed;
      
      // Save updated logs
      foodLogs[today] = dailyLog;
      setStorageSync('foodLogs', foodLogs);
      
      logDebug(`Updated last meal followed status to: ${followed}`);
    }
  },

  showAcceptIgnoreOptions(responseText: string) {
    // Create accept/ignore options
    const responseOptions: MessageOption[] = [
      { id: 'accept', text: '好' },
      { id: 'ignore', text: '太难了' }
    ];
    
    // Add the AI message with the advice and accept/ignore options
    this.addAIMessage(responseText, responseOptions);
  },

  previewImage(e: any) {
    const url = e.currentTarget.dataset.url;
    // Use WX API to preview image
    previewImage({
      urls: [url],
      current: url
    });
  },

  loadMoreMessages() {
    // In a real app, you'd load older messages here
  },

  takeAnotherPhoto() {
    navigateBack();
  },
  
  // Generate daily summary
  generateDailySummary() {
    const today = new Date().toISOString().split('T')[0];
    const foodLogs = getStorageSync('foodLogs') || {};
    const dailyLog = foodLogs[today];
    
    if (!dailyLog || dailyLog.meals.length === 0) {
      this.addAIMessage('今天还没有记录食物。');
      return;
    }
    
    const totalCalories = dailyLog.totalCalories;
    const remainingCalories = this.data.userProfile.dailyCalorieTarget - totalCalories;
    const followedAdviceCount = dailyLog.meals.filter(meal => meal.followed).length;
    const followedPercentage = Math.round((followedAdviceCount / dailyLog.meals.length) * 100);
    
    let summaryText = '';
    
    if (remainingCalories < 0) {
      summaryText = `今日：${dailyLog.meals.length}餐，${totalCalories}卡路里。超标${Math.abs(remainingCalories)}卡。`;
    } else {
      summaryText = `今日：${dailyLog.meals.length}餐，${totalCalories}卡路里。剩余${remainingCalories}卡。`;
    }
    
    summaryText += ` 建议采纳率：${followedPercentage}%。`;
    
    this.addAIMessage(summaryText);
  }
});

// Function to call OpenAI GPT-4o API
async function callOpenAI(base64Image: string, userProfile: UserProfile, dailyLog: DailyFoodLog): Promise<any> {
  logDebug('Preparing to call OpenAI API...');
  
  // Get OpenAI API configuration from config file
  const apiKey = config.OPENAI_API_KEY;
  const apiUrl = config.OPENAI_API_URL;
  const model = config.OPENAI_MODEL;
  
  // Calculate calories already consumed today
  const consumedCalories = dailyLog.totalCalories || 0;
  const remainingCalories = userProfile.dailyCalorieTarget - consumedCalories;
  
  // Get meal time context
  const timeOfDay = new Date().getHours();
  const mealTime = timeOfDay < 11 ? '早餐' : timeOfDay < 16 ? '午餐' : '晚餐';
  
  try {
    logDebug('Calling OpenAI API...');
    
    // Prepare prompt with user context
    const contextPrompt = `
    用户信息:
    - 当前体重: ${userProfile.weight}kg
    - 目标体重: ${userProfile.goalWeight}kg
    - 日卡路里目标: ${userProfile.dailyCalorieTarget}卡
    - 活动水平: ${userProfile.activityLevel === 'low' ? '低' : userProfile.activityLevel === 'moderate' ? '中等' : '高'}
    
    今日饮食记录:
    - 已摄入卡路里: ${consumedCalories}卡
    - 剩余卡路里额度: ${remainingCalories}卡
    - 已记录餐数: ${dailyLog.meals.length}
    - 当前时间段: ${mealTime}
    
    请根据图片内容分析:
    1. 识别出食物及估计卡路里
    2. 为用户提供一句简短、直接、微带讽刺的评价(不超过15字)
    3. 提供3条具体的用餐战术建议(每条不超过10字)，帮助控制摄入量。这些建议应该越狠越好，例如"只吃一半、去掉所有酱料、先喝水再吃"等。
    4. 考虑用户当天已经吃过的食物和卡路里摄入情况，作出个性化建议。
    
    回答格式为JSON:
    {
      "foodItems": [{"name": "食物名称", "calories": 估计卡路里, "healthScore": 1-100的健康分数}],
      "totalCalories": 总卡路里,
      "feedback": "简短直接的评价",
      "tacticalTips": ["具体建议1", "具体建议2", "具体建议3"]
    }
    `;
    
    // Make API request to OpenAI
    const response = await request({
      url: apiUrl,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      data: {
        model: model,
        messages: [
          {
            role: 'system',
            content: '你是一位严厉的饮食教练Nowy，使用简短、直接、有力的语言。不要废话，言简意赅，专注于给出有效的饮食建议。'
          },
          {
            role: 'user',
            content: [
              { type: 'text', text: contextPrompt },
              { 
                type: 'image_url', 
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
        response_format: { type: 'json_object' }
      }
    });
    
    if (response.statusCode === 200) {
      const result = JSON.parse(response.data.choices[0].message.content);
      logDebug('OpenAI response:', result);
      return result;
    } else {
      console.error('OpenAI API error:', response);
      throw new Error('API request failed');
    }
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    // Return mock data as fallback
    return generateMockAnalysis(userProfile, dailyLog);
  }
}

// Fallback function to generate mock analysis if API fails
function generateMockAnalysis(userProfile: UserProfile, dailyLog: DailyFoodLog) {
  logDebug('Generating mock analysis as fallback');
  
  const timeOfDay = new Date().getHours();
  const consumedCalories = dailyLog.totalCalories || 0;
  const remainingCalories = userProfile.dailyCalorieTarget - consumedCalories;
  
  // Mock food items
  const foods = [
    { name: '炸鸡', category: '油炸食品', healthScore: 20, calories: 450 },
    { name: '炸酱面', category: '面食', healthScore: 50, calories: 550 },
    { name: '汉堡', category: '快餐', healthScore: 30, calories: 650 },
    { name: '薯条', category: '油炸食品', healthScore: 25, calories: 400 },
    { name: '沙拉', category: '蔬菜', healthScore: 90, calories: 250 },
    { name: '奶茶', category: '饮料', healthScore: 40, calories: 350 },
    { name: '蛋糕', category: '甜点', healthScore: 35, calories: 420 }
  ];
  
  const randomIndex = Math.floor(Math.random() * foods.length);
  const selectedFood = foods[randomIndex];
  
  // Generate feedback based on context
  let feedback = '';
  let tips = [] as string[];
  
  if (selectedFood.healthScore < 30) {
    if (remainingCalories < 300) {
      feedback = `${selectedFood.name}。今天已超标。`;
      tips = ["只吃四分之一", "先喝两杯水", "立即打包剩余"];
    } else {
      feedback = `${selectedFood.name}。这就是你的选择？`;
      tips = ["去除所有看得见的油", "慢嚼每一口", "吃一半扔一半"];
    }
  } else if (selectedFood.healthScore < 60) {
    feedback = `${selectedFood.name}。将就。`;
    tips = ["减半主食", "先吃蔬菜", "间隔5分钟再继续"];
  } else {
    feedback = `${selectedFood.name}。有进步。`;
    tips = ["保持这种选择", "适量即可", "记录满足感"];
  }
  
  return {
    foodItems: [{
      name: selectedFood.name,
      calories: selectedFood.calories,
      healthScore: selectedFood.healthScore
    }],
    totalCalories: selectedFood.calories,
    feedback: feedback,
    tacticalTips: tips
  };
}

// Helper function to convert wx.chooseImage result to base64
function imageToBase64(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    getFileSystemManager().readFile({
      filePath: filePath,
      encoding: 'base64',
      success: res => {
        resolve(res.data as string);
      },
      fail: err => {
        console.error('Failed to convert image to base64:', err);
        reject(err);
      }
    });
  });
} 