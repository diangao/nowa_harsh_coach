// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

// 云函数入口函数
exports.main = async (event, context) => {
  console.log('Food recognition function triggered with params:', event);
  
  const { imageUrl } = event;
  
  // 这里将来会集成实际的 AI 图像识别 API（如 Gemini 或 GPT-4）
  // 目前返回模拟数据
  
  // 模拟食物库
  const foods = [
    {
      category: 'fried',
      name: '炸鸡',
      confidence: 0.92,
      healthScore: 3,
      sarcasticComment: '你这是在喝油，不是在吃饭。',
      advice: [
        '把皮去掉再吃，至少少摄入30%的油脂。',
        '吃之前喝一大杯水，填饱肚子少吃点。',
        '下次点烤鸡，而不是炸鸡。'
      ]
    },
    {
      category: 'beverage',
      name: '奶茶',
      confidence: 0.89,
      healthScore: 2,
      sarcasticComment: '糖 + 奶 + 卡路里炸弹 = 体重飙升套餐。',
      advice: [
        '奶茶换成黑咖啡，少摄入300大卡。',
        '如果非要喝，只喝三分之一，其他倒掉。',
        '自己在家用茶叶和无糖牛奶冲泡，控制糖分。'
      ]
    },
    {
      category: 'carbs',
      name: '白米饭',
      confidence: 0.95,
      healthScore: 5,
      sarcasticComment: '吃一碗等于吃三勺糖，你确定要这样？',
      advice: [
        '只吃半碗，另一半换成蔬菜。',
        '饭前喝汤，再吃菜，最后才吃饭。',
        '试试糙米或藜麦饭，升糖指数更低。'
      ]
    }
  ];
  
  // 随机选择一个食物（实际项目中会由 AI 识别）
  const randomIndex = Math.floor(Math.random() * foods.length);
  const selectedFood = foods[randomIndex];
  
  // 检查是否晚上8点后
  const currentHour = new Date().getHours();
  let lateNightWarning = '';
  
  if (currentHour >= 20) {
    lateNightWarning = '晚上8点后吃东西？那你体重只会涨，不会掉。';
  }
  
  return {
    success: true,
    data: {
      foodItem: {
        name: selectedFood.name,
        confidence: selectedFood.confidence,
        category: selectedFood.category,
        healthScore: selectedFood.healthScore
      },
      feedback: {
        sarcasticComment: lateNightWarning || selectedFood.sarcasticComment,
        advice: selectedFood.advice
      }
    }
  };
}; 